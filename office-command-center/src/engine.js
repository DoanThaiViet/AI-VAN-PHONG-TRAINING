/* ============================================================================
   engine.js - phần tính toán thuần của Trung tâm Điều hành Văn phòng PVEP

   Không đụng tới DOM. Nhận dữ liệu, trả ra: điểm sẵn sàng, danh sách cảnh báo,
   số liệu chỉ tiêu, nội dung tóm tắt buổi sáng và câu trả lời của phần Hỏi nhanh.

   Tách riêng để: (1) app.js chỉ lo hiển thị; (2) chạy kiểm tra bằng Node
   (xem tools/check-engine.js) mà không cần trình duyệt.
   ============================================================================ */
(function (root) {
  "use strict";

  var OCC = {};

  /* ---------------------------------------------------------------- thời gian */

  OCC.parseTime = function (s) {
    if (!s) return null;
    var d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  OCC.now = function (state) {
    return OCC.parseTime(state.meta.simulated_now);
  };

  OCC.hoursFromNow = function (state, iso) {
    var d = OCC.parseTime(iso);
    if (!d) return null;
    return (d.getTime() - OCC.now(state).getTime()) / 36e5;
  };

  OCC.dateKey = function (d) {
    if (typeof d === "string") d = OCC.parseTime(d.length === 10 ? d + "T00:00:00" : d);
    if (!d) return "";
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  };

  OCC.todayKey = function (state) {
    return OCC.dateKey(OCC.now(state));
  };

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  /* Đếm kiểu văn bản hành chính: 01, 02 … 09, 10 */
  OCC.n2 = function (n) { return n < 10 ? "0" + n : String(n); };

  OCC.fmtDate = function (iso) {
    var d = OCC.parseTime(iso.length === 10 ? iso + "T00:00:00" : iso);
    if (!d) return "";
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  };

  OCC.fmtTime = function (iso) {
    var d = OCC.parseTime(iso);
    if (!d) return "";
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  };

  OCC.fmtDeadline = function (state, iso) {
    if (!iso) return "Không đặt hạn";
    var d = OCC.parseTime(iso);
    if (!d) return "";
    if (OCC.dateKey(d) === OCC.todayKey(state)) return "Hôm nay " + OCC.fmtTime(iso);
    return OCC.fmtDate(iso) + " " + OCC.fmtTime(iso);
  };

  /* "Còn 2 giờ 45 phút" / "Quá hạn 1 ngày 8 giờ" */
  OCC.remaining = function (state, iso) {
    var h = OCC.hoursFromNow(state, iso);
    if (h === null) return { text: "-", overdue: false, hours: null };
    var over = h < 0;
    var abs = Math.abs(h);
    var days = Math.floor(abs / 24);
    var hours = Math.floor(abs % 24);
    var mins = Math.round((abs % 1) * 60);
    var parts = [];
    if (days) parts.push(days + " ngày");
    if (hours) parts.push(hours + " giờ");
    if (!days && !hours) parts.push(mins + " phút");
    var body = parts.slice(0, 2).join(" ");
    return { text: (over ? "Quá hạn " : "Còn ") + body, overdue: over, hours: h };
  };

  /* ------------------------------------------------------------------- state */

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  OCC.clone = clone;

  function indexById(arr) {
    var m = {};
    for (var i = 0; i < arr.length; i++) m[arr[i].id] = arr[i];
    return m;
  }

  function applyMap(arr, map) {
    if (!map) return;
    var idx = indexById(arr);
    Object.keys(map).forEach(function (id) {
      if (idx[id]) Object.assign(idx[id], map[id]);
    });
  }

  /* Dựng state từ dữ liệu gốc + patch của kịch bản đang chọn */
  OCC.buildState = function (raw, scenarioId) {
    var st = clone(raw);
    var sc = (st.scenarios || []).filter(function (s) { return s.id === scenarioId; })[0]
          || (st.scenarios || [])[0];
    st.scenario_id = sc ? sc.id : "normal";
    var p = (sc && sc.patch) || {};

    if (p.events_add)    st.events = st.events.concat(clone(p.events_add));
    if (p.checklist_add) st.event_checklist = st.event_checklist.concat(clone(p.checklist_add));
    if (p.agenda_add)    st.agenda = st.agenda.concat(clone(p.agenda_add));
    if (p.actions_add)   st.actions = st.actions.concat(clone(p.actions_add));
    if (p.comms_add)     st.communications = st.communications.concat(clone(p.comms_add));

    applyMap(st.event_checklist, p.checklist);
    applyMap(st.actions,         p.actions);
    applyMap(st.communications,  p.communications);
    applyMap(st.agenda,          p.agenda);
    applyMap(st.events,          p.events);

    st.agenda.sort(function (a, b) {
      return (a.date + a.time).localeCompare(b.date + b.time);
    });
    return st;
  };

  /* -------------------------------------------------------------- sẵn sàng */

  var ST = { DONE: "DONE", PENDING: "PENDING", BLOCKED: "BLOCKED", NA: "NOT_APPLICABLE" };
  OCC.ST = ST;

  OCC.statusLabel = function (s) {
    return { DONE: "Đã xong", PENDING: "Đang chờ", BLOCKED: "Đang vướng",
             NOT_APPLICABLE: "Không áp dụng" }[s] || s;
  };

  OCC.checklistOf = function (state, eventId) {
    return state.event_checklist.filter(function (c) { return c.event_id === eventId; })
      .sort(function (a, b) { return a.cat.localeCompare(b.cat); });
  };

  /*  Điểm sẵn sàng mô phỏng = tổng trọng số hạng mục đã xong / tổng trọng số
      hạng mục có áp dụng. Hạng mục "Không áp dụng" bị loại khỏi cả tử và mẫu.

      Quy tắc màu, theo thứ tự ưu tiên:
        - có hạng mục then chốt đang vướng            -> ĐỎ, bất kể phần trăm
        - có hạng mục then chốt quá hạn mà chưa xong  -> ĐỎ
        - còn hạng mục then chốt chưa xong            -> nhiều nhất là VÀNG
        - >= 95%  -> XANH ; >= 70% -> VÀNG ; còn lại -> ĐỎ                    */
  OCC.eventReadiness = function (state, eventId) {
    var items = OCC.checklistOf(state, eventId);
    var th = state.meta.thresholds;
    var totalW = 0, doneW = 0;
    var pending = [], blocked = [], na = 0, criticalOpen = 0, criticalLate = 0;

    items.forEach(function (c) {
      if (c.status === ST.NA) { na++; return; }
      var w = c.weight || 1;
      totalW += w;
      if (c.status === ST.DONE) { doneW += w; return; }
      if (c.status === ST.BLOCKED) blocked.push(c); else pending.push(c);
      if (c.critical) {
        criticalOpen++;
        var h = OCC.hoursFromNow(state, c.deadline);
        if (h !== null && h < 0) criticalLate++;
      }
    });

    var score = totalW ? Math.round((doneW / totalW) * 100) : 0;
    var hasCriticalBlocked = blocked.some(function (c) { return c.critical; });

    var status;
    if (hasCriticalBlocked || criticalLate > 0) status = "RED";
    else if (blocked.length) status = "AMBER";
    else if (score >= th.green_min) status = criticalOpen ? "AMBER" : "GREEN";
    else if (score >= th.amber_min) status = "AMBER";
    else status = "RED";

    return {
      score: score, status: status, items: items,
      pending: pending, blocked: blocked,
      na: na, criticalOpen: criticalOpen,
      doneCount: items.filter(function (c) { return c.status === ST.DONE; }).length,
      applicable: items.length - na,
      capped: (score >= th.green_min && criticalOpen > 0)
    };
  };

  /* Mức sẵn sàng của một mục lịch: dựa trên phần chuẩn bị trước cuộc họp,
     có tính thêm tình trạng sự kiện liên quan nếu có. */
  OCC.agendaReadiness = function (state, ag) {
    var prep = ag.prep || [];
    var done = prep.filter(function (p) { return p.done; }).length;
    var missing = prep.filter(function (p) { return !p.done; });
    var status = missing.length ? "AMBER" : "GREEN";
    if (ag.event_id) {
      var ev = OCC.eventReadiness(state, ag.event_id);
      if (ev.status === "RED") status = "RED";
      else if (ev.status === "AMBER" && status === "GREEN") status = "AMBER";
    }
    return { done: done, total: prep.length, missing: missing, status: status };
  };

  OCC.readinessLabel = function (s) {
    return { GREEN: "Sẵn sàng", AMBER: "Cần chú ý", RED: "Cần xử lý ngay", GREY: "Chưa đến kỳ" }[s] || s;
  };

  /* -------------------------------------------------------------- đầu việc */

  OCC.isOverdue = function (state, a) {
    if (a.status === "DONE") return false;
    if (a.status === "OVERDUE") return true;
    var h = OCC.hoursFromNow(state, a.deadline);
    return h !== null && h < 0;
  };

  OCC.actionBuckets = function (state) {
    var th = state.meta.thresholds;
    var out = { all: state.actions, open: [], overdue: [], soon: [], ontrack: [], done: [] };
    state.actions.forEach(function (a) {
      if (a.status === "DONE") { out.done.push(a); return; }
      out.open.push(a);
      var h = OCC.hoursFromNow(state, a.deadline);
      if (OCC.isOverdue(state, a)) out.overdue.push(a);
      else if (h !== null && h <= th.soon_hours) out.soon.push(a);
      else out.ontrack.push(a);
    });
    return out;
  };

  /* Đầu mối nào còn việc - gộp cả đầu việc và hạng mục chuẩn bị */
  OCC.ownerLoad = function (state) {
    var m = {};
    function bump(owner, key) {
      if (!owner || owner === "-") return;
      if (!m[owner]) m[owner] = { owner: owner, open: 0, overdue: 0, prep: 0, blocked: 0 };
      m[owner][key]++;
    }
    state.actions.forEach(function (a) {
      if (a.status === "DONE") return;
      bump(a.owner, "open");
      if (OCC.isOverdue(state, a)) bump(a.owner, "overdue");
    });
    state.event_checklist.forEach(function (c) {
      if (c.status === ST.PENDING) bump(c.owner, "prep");
      if (c.status === ST.BLOCKED) { bump(c.owner, "prep"); bump(c.owner, "blocked"); }
    });
    return Object.keys(m).map(function (k) { return m[k]; })
      .sort(function (a, b) {
        return (b.blocked - a.blocked) || (b.overdue - a.overdue)
            || ((b.open + b.prep) - (a.open + a.prep));
      });
  };

  /* -------------------------------------------------------------- cảnh báo */

  /* Mỗi cảnh báo bắt buộc có `action`: bấm vào là tới đúng chỗ để xử lý. */
  OCC.alerts = function (state) {
    var th = state.meta.thresholds;
    var list = [];
    var evIndex = indexById(state.events);

    state.event_checklist.forEach(function (c) {
      if (c.status === ST.DONE || c.status === ST.NA) return;
      var ev = evIndex[c.event_id];
      if (!ev) return;
      var h = OCC.hoursFromNow(state, c.deadline);
      var sev = null;

      if (c.status === ST.BLOCKED) {
        sev = c.critical ? "RED" : "AMBER";
      } else if (h === null) {
        sev = null;
      } else if (h < 0) {
        sev = c.critical ? "RED" : "AMBER";
      } else if (c.critical && h <= th.critical_red_hours) {
        sev = "RED";
      } else if (c.critical && h <= th.critical_amber_hours) {
        sev = "AMBER";
      } else if (!c.critical && h <= th.normal_amber_hours) {
        sev = "AMBER";
      }
      if (!sev) return;

      list.push({
        id: "AL-" + c.id,
        severity: sev,
        entity: ev.title,
        issue: c.label + (c.status === ST.BLOCKED ? " đang vướng" : " chưa hoàn tất"),
        detail: c.note || "",
        owner: c.owner,
        deadline: c.deadline,
        action: { tab: "events", event_id: ev.id, focus: c.id },
        action_label: "Xem hạng mục"
      });
    });

    state.communications.forEach(function (cm) {
      if (cm.stage === "PUBLISHED") return;
      var h = OCC.hoursFromNow(state, cm.due);
      if (h === null) return;
      var sev = null;
      if (h < -24) sev = "RED";
      else if (h <= th.normal_amber_hours) sev = "AMBER";
      if (!sev) return;
      list.push({
        id: "AL-" + cm.id,
        severity: sev,
        entity: cm.title,
        issue: cm.stage === "REVIEW" ? "Đang chờ duyệt nội dung" : "Chưa tới bước duyệt, đã cận hạn",
        detail: cm.next_action || "",
        owner: cm.owner,
        deadline: cm.due,
        action: { tab: "comms", comm_id: cm.id },
        action_label: "Xem nội dung"
      });
    });

    var over = OCC.actionBuckets(state).overdue;
    if (over.length) {
      var worst = Math.min.apply(null, over.map(function (a) {
        return OCC.hoursFromNow(state, a.deadline) || 0;
      }));
      list.push({
        id: "AL-ACTIONS-OVERDUE",
        severity: worst < -72 ? "RED" : "AMBER",
        entity: "Đầu việc đang theo dõi",
        issue: OCC.n2(over.length) + " việc đã quá hạn",
        detail: over.map(function (a) { return a.owner; })
          .filter(function (v, i, s) { return s.indexOf(v) === i; }).join(" · "),
        owner: over.length === 1 ? over[0].owner : "Nhiều đầu mối",
        deadline: over[0].deadline,
        action: { tab: "actions", filter: "overdue" },
        action_label: "Mở danh sách"
      });
    }

    var rank = { RED: 0, AMBER: 1, GREEN: 2 };
    list.sort(function (a, b) {
      if (rank[a.severity] !== rank[b.severity]) return rank[a.severity] - rank[b.severity];
      var ha = OCC.hoursFromNow(state, a.deadline);
      var hb = OCC.hoursFromNow(state, b.deadline);
      return (ha === null ? 1e9 : ha) - (hb === null ? 1e9 : hb);
    });
    return list;
  };

  /* ------------------------------------------------------------------- KPI */

  OCC.kpi = function (state) {
    var th = state.meta.thresholds;
    var today = OCC.todayKey(state);

    var todayItems = state.agenda.filter(function (a) {
      return a.date === today && a.important;
    });

    var soonPrep = state.event_checklist.filter(function (c) {
      if (c.status === ST.DONE || c.status === ST.NA) return false;
      var h = OCC.hoursFromNow(state, c.deadline);
      return h !== null && h > 0 && h <= th.soon_hours;
    });

    var soonActions = OCC.actionBuckets(state).soon;
    var al = OCC.alerts(state);

    return {
      today: todayItems.length,
      todayItems: todayItems,
      soon: soonPrep.length,
      soonPrep: soonPrep,
      soonActions: soonActions.length,
      attention: al.filter(function (a) { return a.severity === "AMBER"; }).length,
      critical: al.filter(function (a) { return a.severity === "RED"; }).length,
      alerts: al
    };
  };

  /* ------------------------------------------------------ Tóm tắt buổi sáng */

  /* Sinh từ trạng thái hiện tại. Đánh dấu xong một hạng mục là nội dung đổi theo.
     Muốn nối mô hình ngôn ngữ thật: giữ nguyên hàm này để dựng "ngữ cảnh",
     rồi gửi đối tượng trả về sang mô hình thay vì ghép chuỗi ở đây. Xem README. */
  OCC.briefContext = function (state) {
    var k = OCC.kpi(state);
    var buckets = OCC.actionBuckets(state);
    var evs = state.events.map(function (e) {
      var r = OCC.eventReadiness(state, e.id);
      return { id: e.id, title: e.title, date: e.date, score: r.score, status: r.status,
               pending: r.pending, blocked: r.blocked };
    }).sort(function (a, b) { return a.score - b.score; });

    var commsDue = state.communications.filter(function (c) {
      if (c.stage === "PUBLISHED") return false;
      var h = OCC.hoursFromNow(state, c.due);
      return h !== null && h <= 24;
    });

    return {
      date: OCC.fmtDate(state.meta.simulated_now),
      time: OCC.fmtTime(state.meta.simulated_now),
      kpi: k, events: evs, buckets: buckets, commsDue: commsDue,
      alerts: k.alerts, owners: OCC.ownerLoad(state),
      scenario: (state.scenarios.filter(function (s) { return s.id === state.scenario_id; })[0] || {}).name
    };
  };

  OCC.brief = function (state) {
    var c = OCC.briefContext(state);
    var todayList = c.kpi.todayItems;
    var sections = [];

    /* HÔM NAY */
    var l1 = [];
    l1.push(OCC.n2(todayList.length) + " lịch quan trọng của Lãnh đạo"
      + (todayList.length ? ", sớm nhất lúc " + todayList[0].time + " - " + todayList[0].title : "") + ".");
    var evSoon = c.events.filter(function (e) {
      var h = OCC.hoursFromNow(state, e.date + "T08:00");
      return h !== null && h <= 96;
    });
    if (evSoon.length) {
      l1.push(OCC.n2(evSoon.length) + " sự kiện trong 04 ngày tới, thấp nhất là "
        + evSoon[0].title + " ở mức " + evSoon[0].score + "%.");
    }
    l1.push(OCC.n2(c.kpi.soon) + " hạng mục chuẩn bị đến hạn trong 72 giờ, "
      + OCC.n2(c.kpi.soonActions) + " đầu việc theo dõi đến hạn cùng kỳ.");
    if (c.commsDue.length) {
      l1.push(OCC.n2(c.commsDue.length) + " nội dung truyền thông đến hạn trong hôm nay.");
    }
    sections.push({ title: "HÔM NAY", lines: l1 });

    /* CẦN CHÚ Ý */
    var l2 = [];
    if (!c.alerts.length) {
      l2.push("Không có ngoại lệ nào đang mở. Các hạng mục đều trong hạn.");
    } else {
      c.alerts.slice(0, 5).forEach(function (a) {
        l2.push((a.severity === "RED" ? "Cần xử lý ngay: " : "Cần chú ý: ")
          + a.entity + " - " + a.issue.toLowerCase()
          + " (" + a.owner + ", " + OCC.fmtDeadline(state, a.deadline).toLowerCase() + ").");
      });
    }
    var blockedAll = state.event_checklist.filter(function (x) { return x.status === ST.BLOCKED; });
    if (blockedAll.length) {
      l2.push("Có " + OCC.n2(blockedAll.length) + " hạng mục đang vướng, chưa tự giải quyết được ở cấp đầu mối.");
    }
    sections.push({ title: "CẦN CHÚ Ý", lines: l2 });

    /* ƯU TIÊN */
    var prio = [];
    var reds = c.alerts.filter(function (a) { return a.severity === "RED"; });
    var ambers = c.alerts.filter(function (a) { return a.severity === "AMBER"; });
    reds.concat(ambers).slice(0, 4).forEach(function (a) {
      var verb = a.action && a.action.tab === "actions" ? "Đôn đốc: " : "Chốt: ";
      prio.push(verb + a.issue + " - " + a.entity
        + " (" + a.owner + ", hạn " + OCC.fmtDeadline(state, a.deadline).toLowerCase() + ").");
    });
    if (!prio.length) prio.push("Không có việc nào phải can thiệp trước buổi trưa.");
    var cutoff = reds.length && reds[0].deadline ? OCC.fmtTime(reds[0].deadline) : "12:00";
    sections.push({ title: "ƯU TIÊN TRƯỚC " + cutoff, lines: prio });

    /* ĐẦU MỐI */
    var l4 = c.owners.slice(0, 4).map(function (o) {
      var bits = [];
      if (o.blocked) bits.push(OCC.n2(o.blocked) + " việc đang vướng");
      if (o.overdue) bits.push(OCC.n2(o.overdue) + " việc quá hạn");
      if (o.prep) bits.push(OCC.n2(o.prep) + " hạng mục chuẩn bị");
      if (o.open) bits.push(OCC.n2(o.open) + " đầu việc đang mở");
      return o.owner + ": " + bits.join(", ") + ".";
    });
    if (!l4.length) l4.push("Không có đầu mối nào tồn việc.");
    sections.push({ title: "ĐẦU MỐI CÒN VIỆC", lines: l4 });

    return {
      title: "TÓM TẮT ĐIỀU HÀNH VĂN PHÒNG",
      date: c.date, time: c.time, scenario: c.scenario,
      sections: sections,
      footer: "Bản tóm tắt sinh từ trạng thái đang hiển thị trên màn hình, tại thời điểm "
        + c.time + " ngày " + c.date + ". Dữ liệu mô phỏng phục vụ đào tạo."
    };
  };

  /* ------------------------------------------------------------- Hỏi nhanh */

  OCC.quickPrompts = [
    "Việc gì cần xử lý hôm nay?",
    "Đoàn nào chưa sẵn sàng?",
    "Việc gì quá hạn?",
    "Trong 72 giờ tới cần chú ý gì?",
    "Nội dung truyền thông nào đang chờ duyệt?"
  ];

  function has(q, words) {
    for (var i = 0; i < words.length; i++) if (q.indexOf(words[i]) >= 0) return true;
    return false;
  }

  /* Đối chiếu từ khoá, không dùng mô hình ngôn ngữ. Trả về {title, lines[], jump} */
  OCC.ask = function (state, query) {
    var q = (query || "").toLowerCase().trim();
    var k = OCC.kpi(state);
    var buckets = OCC.actionBuckets(state);

    if (!q) {
      return { title: "Chưa có câu hỏi", lines: ["Chọn một câu gợi ý bên dưới hoặc gõ câu hỏi của bạn."] };
    }

    /* Chặn trước: câu hỏi phải chạm ít nhất một khái niệm trong phạm vi bản mô phỏng.
       Không có thì trả lời ngoài phạm vi luôn, tránh việc một từ chung như
       "hôm nay" kéo câu hỏi lạc đề vào nhánh tóm tắt trong ngày. */
    var inScope = ["việc", "lịch", "họp", "đoàn", "sự kiện", "event", "truyền thông",
      "trang tin", "bản tin", "bài", "đăng", "duyệt", "hạn", "deadline", "chuẩn bị",
      "sẵn sàng", "readiness", "đầu mối", "ưu tiên", "agenda", "action", "khách",
      "hội nghị", "công tác", "72", "tồn", "phụ trách", "ban nào", "brief",
      "cần xử lý", "cần làm", "ai còn", "cảnh báo", "quá hạn"];
    if (!has(q, inScope)) return outOfScope();

    /* quá hạn */
    if (has(q, ["quá hạn", "trễ", "chậm", "overdue"])) {
      if (!buckets.overdue.length) {
        return { title: "Việc quá hạn", lines: ["Hiện không có đầu việc nào quá hạn."] };
      }
      return {
        title: "Có " + OCC.n2(buckets.overdue.length) + " việc quá hạn",
        lines: buckets.overdue.map(function (a) {
          return a.title + " - " + a.owner + ", " + OCC.remaining(state, a.deadline).text.toLowerCase()
            + " (hạn " + OCC.fmtDeadline(state, a.deadline).toLowerCase() + ").";
        }),
        jump: { tab: "actions", filter: "overdue" }, jump_label: "Mở Đầu việc quá hạn"
      };
    }

    /* đoàn / sự kiện chưa sẵn sàng */
    if (has(q, ["đoàn", "sự kiện", "event", "sẵn sàng", "readiness", "chuẩn bị"])) {
      var evs = state.events.map(function (e) {
        var r = OCC.eventReadiness(state, e.id);
        return { e: e, r: r };
      }).sort(function (a, b) { return a.r.score - b.r.score; });
      var notReady = evs.filter(function (x) { return x.r.status !== "GREEN"; });
      var target = notReady.length ? notReady : evs;
      return {
        title: notReady.length
          ? OCC.n2(notReady.length) + " sự kiện chưa đạt mức sẵn sàng"
          : "Tất cả sự kiện đã sẵn sàng",
        lines: target.map(function (x) {
          var open = x.r.blocked.concat(x.r.pending);
          return x.e.title + " (" + OCC.fmtDate(x.e.date) + "): " + x.r.score + "%, "
            + OCC.readinessLabel(x.r.status).toLowerCase()
            + (open.length ? ". Còn " + OCC.n2(open.length) + " hạng mục: "
                + open.map(function (c) { return c.label; }).join(", ") + "." : ".");
        }),
        jump: { tab: "events", event_id: target[0].e.id }, jump_label: "Mở mức độ sẵn sàng"
      };
    }

    /* truyền thông */
    if (has(q, ["truyền thông", "bài", "tin", "duyệt nội dung", "trang tin", "đăng"])) {
      var pend = state.communications.filter(function (c) {
        return c.stage === "REVIEW" || c.stage === "DRAFT" || c.stage === "IDEA";
      });
      return {
        title: OCC.n2(pend.length) + " nội dung truyền thông chưa phát hành",
        lines: pend.map(function (c) {
          return c.title + " - " + c.channel + ", trạng thái " + OCC.stageLabel(c.stage).toLowerCase()
            + ", hạn " + OCC.fmtDeadline(state, c.due).toLowerCase()
            + (c.source_approved ? "." : ". Nguồn tin chưa được duyệt.");
        }),
        jump: { tab: "comms" }, jump_label: "Mở Truyền thông"
      };
    }

    /* 72 giờ */
    if (has(q, ["72", "ba ngày", "3 ngày", "sắp tới", "tuần"])) {
      var lines = k.soonPrep.map(function (c) {
        var ev = state.events.filter(function (e) { return e.id === c.event_id; })[0] || {};
        return ev.title + " - " + c.label + ", " + c.owner + ", hạn "
          + OCC.fmtDeadline(state, c.deadline).toLowerCase() + ".";
      });
      buckets.soon.forEach(function (a) {
        lines.push(a.title + " - " + a.owner + ", hạn " + OCC.fmtDeadline(state, a.deadline).toLowerCase() + ".");
      });
      return {
        title: "Trong 72 giờ tới: " + OCC.n2(k.soon) + " hạng mục chuẩn bị và "
          + OCC.n2(buckets.soon.length) + " đầu việc đến hạn",
        lines: lines.length ? lines : ["Không có hạng mục nào đến hạn trong 72 giờ tới."],
        jump: { tab: "actions", filter: "soon" }, jump_label: "Mở danh sách đến hạn"
      };
    }

    /* hôm nay / ưu tiên / cần xử lý */
    if (has(q, ["hôm nay", "hiện tại", "bây giờ", "ưu tiên", "cần xử lý", "cần làm", "trước tiên", "đầu tiên"])) {
      var lines2 = [];
      lines2.push("Lịch: " + OCC.n2(k.today) + " việc quan trọng - "
        + k.todayItems.map(function (a) { return a.time + " " + a.title; }).join("; ") + ".");
      if (k.alerts.length) {
        k.alerts.slice(0, 4).forEach(function (a) {
          lines2.push((a.severity === "RED" ? "Xử lý ngay: " : "Chú ý: ") + a.entity + " - "
            + a.issue.toLowerCase() + " (" + a.owner + ", "
            + OCC.fmtDeadline(state, a.deadline).toLowerCase() + ").");
        });
      } else {
        lines2.push("Không có ngoại lệ nào đang mở.");
      }
      return {
        title: "Hôm nay: " + OCC.n2(k.critical) + " việc đỏ, " + OCC.n2(k.attention) + " việc cần chú ý",
        lines: lines2,
        jump: { tab: "today" }, jump_label: "Về màn hình Hôm nay"
      };
    }

    /* đầu mối */
    if (has(q, ["đầu mối", "ai ", "ai còn", "phụ trách", "owner", "ban nào"])) {
      var ow = OCC.ownerLoad(state);
      return {
        title: "Đầu mối còn việc",
        lines: ow.map(function (o) {
          var bits = [];
          if (o.blocked) bits.push(OCC.n2(o.blocked) + " việc đang vướng");
          if (o.overdue) bits.push(OCC.n2(o.overdue) + " việc quá hạn");
          if (o.prep) bits.push(OCC.n2(o.prep) + " hạng mục chuẩn bị");
          if (o.open) bits.push(OCC.n2(o.open) + " đầu việc đang mở");
          return o.owner + ": " + bits.join(", ") + ".";
        }),
        jump: { tab: "actions" }, jump_label: "Mở Đầu việc"
      };
    }

    /* lịch / họp */
    if (has(q, ["lịch", "họp", "cuộc họp", "agenda", "lãnh đạo"])) {
      var today = OCC.todayKey(state);
      var ags = state.agenda.filter(function (a) { return a.date >= today; }).slice(0, 6);
      return {
        title: "Lịch sắp tới",
        lines: ags.map(function (a) {
          var r = OCC.agendaReadiness(state, a);
          return OCC.fmtDate(a.date) + " " + a.time + " - " + a.title + " (" + a.location + "), "
            + OCC.readinessLabel(r.status).toLowerCase()
            + (r.missing.length ? ", còn thiếu: " + r.missing.map(function (m) { return m.label; }).join(", ") + "." : ".");
        }),
        jump: { tab: "agenda" }, jump_label: "Mở Lịch Lãnh đạo"
      };
    }

    return outOfScope();
  };

  function outOfScope() {
    return {
      title: "Ngoài phạm vi bản mô phỏng",
      lines: ["Bản mô phỏng trả lời được câu hỏi về lịch Lãnh đạo, mức độ sẵn sàng của sự kiện, đầu việc cần đôn đốc và truyền thông."],
      quick: true
    };
  }

  OCC.stageLabel = function (s) {
    return { IDEA: "Ý tưởng", DRAFT: "Đang soạn", REVIEW: "Chờ duyệt",
             APPROVED: "Đã duyệt", PUBLISHED: "Đã đăng" }[s] || s;
  };

  OCC.actionStatusLabel = function (s) {
    return { OPEN: "Chưa bắt đầu", IN_PROGRESS: "Đang làm",
             DONE: "Đã xong", OVERDUE: "Quá hạn" }[s] || s;
  };

  /* export cho cả trình duyệt lẫn Node */
  root.OCC = OCC;
  if (typeof module !== "undefined" && module.exports) module.exports = OCC;

})(typeof window !== "undefined" ? window : globalThis);
