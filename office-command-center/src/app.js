/* ============================================================================
   app.js - lớp hiển thị của Trung tâm Điều hành Văn phòng PVEP

   Toàn bộ phép tính nằm ở engine.js. File này chỉ dựng DOM, bắt sự kiện và vẽ
   lại khi trạng thái đổi. Không gọi mạng, không gửi dữ liệu ra ngoài máy.
   ============================================================================ */
(function () {
  "use strict";

  var E = window.OCC;
  var RAW = null;     // dữ liệu gốc đang dùng
  var S = null;       // trạng thái đang hiển thị (đã áp kịch bản + thao tác trực tiếp)

  var ui = {
    tab: "today",
    scenario: "normal",
    actFilter: "all",
    actPrio: null,      // mức ưu tiên đang lọc, đặt khi bấm ô ma trận
    actSort: "deadline",
    drawer: null,       // {kind:'event'|'agenda'|'comm'|'brief'|'ask', id}
    askLog: [],
    present: false,
    flashCk: null,      // id hạng mục đang được làm nổi
    lastFocus: null,
    firstPaint: true
  };

  /* ------------------------------------------------------------- tiện ích */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function setHTML(node, html) { node.innerHTML = html; return node; }

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>';

  function toast(msg, kind) {
    var wrap = $("#toasts");
    var t = el('<div class="toast ' + (kind || "") + '">' + esc(msg) + "</div>");
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s"; t.style.opacity = "0";
      setTimeout(function () { t.remove(); }, 320);
    }, 2600);
  }

  /* Vòng tròn tiến độ dạng SVG. Vẽ luôn ở giá trị cuối rồi mới cho chạy từ 0
     để trường hợp tab ẩn / rAF bị chặn vẫn hiện đúng số. */
  function ring(score, status, size) {
    var r = 20, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(100, score)) / 100);
    return '<div class="ring" style="' + (size ? "width:" + size + "px;height:" + size + "px" : "") + '">'
      + '<svg viewBox="0 0 48 48" width="100%" height="100%">'
      + '<circle class="track" cx="24" cy="24" r="' + r + '" fill="none" stroke-width="5"/>'
      + '<circle class="bar stroke-' + status + '" cx="24" cy="24" r="' + r + '" fill="none" stroke-width="5"'
      + ' stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"'
      + ' data-off="' + off.toFixed(1) + '" data-c="' + c.toFixed(1) + '"/>'
      + "</svg>"
      + '<div class="lbl c-' + status + '">' + Math.round(score) + "%</div></div>";
  }

  function animateRings(root) {
    $$(".ring .bar", root).forEach(function (b) {
      var c = b.getAttribute("data-c"), off = b.getAttribute("data-off");
      b.setAttribute("stroke-dashoffset", c);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { b.setAttribute("stroke-dashoffset", off); });
      });
      setTimeout(function () { b.setAttribute("stroke-dashoffset", off); }, 1200);
    });
  }

  function countUp(node, to) {
    var from = parseInt(node.getAttribute("data-v") || "0", 10);
    node.setAttribute("data-v", to);
    if (from === to) { node.textContent = E.n2(to); return; }
    var start = null, dur = 620;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      node.textContent = E.n2(v);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(function () { node.textContent = E.n2(to); }, dur + 120);
  }

  /* Làm nổi một dòng hạng mục.
     Đánh dấu trong trạng thái chứ không gắn class thẳng vào DOM: ngăn kéo có
     thể vẽ lại giữa chừng (khi tick xong thì cả màn hình tính lại), gắn thẳng
     vào DOM sẽ bị mất ngay khi vẽ lại. */
  var flashTimer = null;
  function flashRow(ckId) {
    clearTimeout(flashTimer);
    ui.flashCk = ckId;
    if (ui.drawer) renderDrawer();
    flashTimer = setTimeout(function () {
      ui.flashCk = null;
      if (ui.drawer) renderDrawer();
    }, 1500);
  }

  function pill(status, text) {
    return '<span class="pill p-' + status + '"><i></i><span>'
      + esc(text || E.readinessLabel(status)) + "</span></span>";
  }

  function dueText(iso) {
    var rm = E.remaining(S, iso);
    return '<span class="' + (rm.overdue ? "c-RED" : (rm.hours !== null && rm.hours <= 24 ? "c-AMBER" : "c-GREY"))
      + '">' + esc(rm.text) + "</span>";
  }

  /* ================================================================= TABS */

  function goTab(tab) {
    ui.tab = tab;
    $$("nav.tabs button").forEach(function (b) {
      var on = b.getAttribute("data-tab") === tab;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$("section.view").forEach(function (p) { p.classList.toggle("active", p.id === "view-" + tab); });
    var sc = $("#view-" + tab + " .view-scroll");
    if (sc) sc.scrollTop = 0;
    animateRings($("#view-" + tab));
  }

  /* ============================================================ 01 HÔM NAY */

  function renderKPI() {
    var k = E.kpi(S);
    var b = E.actionBuckets(S);
    var cards = [
      { cls: "", key: "HÔM NAY", v: k.today, d: "lịch quan trọng của Lãnh đạo", go: { tab: "agenda" } },
      { cls: "", key: "72 GIỜ TỚI", v: k.soon, d: "hạng mục chuẩn bị đến hạn · " + E.n2(k.soonActions) + " đầu việc", go: { tab: "events" } },
      { cls: k.attention ? "a" : "g", key: "CẦN CHÚ Ý", v: k.attention, d: "việc cần chú ý", go: { tab: "today" } },
      { cls: k.critical ? "r" : "g", key: "XỬ LÝ NGAY", v: k.critical, d: k.critical ? "cảnh báo đỏ, xử lý ngay" : "không có cảnh báo đỏ", go: { tab: "today" } }
    ];

    var row = $("#kpi-row");
    if (row.children.length !== 4) {
      setHTML(row, cards.map(function () {
        return '<button class="kpi go"><span class="v" data-v="0">00</span>'
          + '<span class="m"><span class="l"></span><span class="d"></span></span></button>';
      }).join(""));
    }
    Array.prototype.forEach.call(row.children, function (node, i) {
      var c = cards[i];
      node.className = "kpi go " + c.cls;
      $(".l", node).textContent = c.key;
      $(".d", node).textContent = c.d;
      countUp($(".v", node), c.v);
      node.onclick = function () { goTab(c.go.tab); };
    });

    $("#bdg-events").hidden = !k.critical;
    $("#bdg-events").textContent = k.critical;
    $("#bdg-actions").hidden = !b.overdue.length;
    $("#bdg-actions").textContent = b.overdue.length;
    $("#bdg-today").hidden = !(k.critical + k.attention);
    $("#bdg-today").textContent = k.critical + k.attention;
  }

  function agendaRow(a) {
    var r = E.agendaReadiness(S, a);
    return '<button class="ag-item s-' + r.status + '" data-agenda="' + a.id + '">'
      + '<span class="ag-time">' + esc(a.time) + "<small>" + esc(a.duration) + "</small></span>"
      + '<span class="ag-main"><span class="t">' + esc(a.title) + "</span>"
      + '<span class="m">' + esc(a.location) + " · " + esc(a.type) + "</span></span>"
      + '<span class="ag-side">' + pill(r.status)
      + '<span class="pp">Chuẩn bị ' + E.n2(r.done) + "/" + E.n2(r.total) + "</span></span>"
      + "</button>";
  }

  function renderTodayAgenda() {
    var today = E.todayKey(S);
    var list = S.agenda.filter(function (a) { return a.date === today; });
    $("#ag-count").textContent = E.n2(list.length) + " mục";
    if (!list.length) {
      setHTML($("#today-agenda"), '<div class="empty-ok"><div class="big">Không có lịch</div>'
        + '<div class="sm">Hôm nay Lãnh đạo không có lịch nào trong hệ thống mô phỏng.</div></div>');
      return;
    }
    setHTML($("#today-agenda"), list.map(agendaRow).join(""));
  }

  function alertRow(a) {
    return '<button class="alert sev-' + a.severity + '" data-alert="' + esc(a.id) + '">'
      + '<span class="alert-dot"></span>'
      + '<span class="alert-main">'
      + '<span class="e">' + esc(a.entity) + "</span>"
      + '<span class="i">' + esc(a.issue) + "</span>"
      + '<span class="m"><span>Đầu mối: <b>' + esc(a.owner) + "</b></span>"
      + "<span>Hạn: <b>" + esc(E.fmtDeadline(S, a.deadline)) + "</b></span>"
      + "<span>" + E.remaining(S, a.deadline).text + "</span></span>"
      + (a.detail ? '<span class="m" style="color:var(--ink-2)">' + esc(a.detail) + "</span>" : "")
      + "</span>"
      + '<span class="alert-cta">' + esc(a.action_label || "Xem") + "</span>"
      + "</button>";
  }

  function renderAlerts() {
    var list = E.kpi(S).alerts;
    var box = $("#today-alerts");
    if (!list.length) {
      setHTML(box, '<div class="empty-ok"><div class="big">Không còn ngoại lệ</div>'
        + '<div class="sm">Mọi hạng mục chuẩn bị và đầu việc đều trong hạn. Văn phòng không cần can thiệp lúc này.</div></div>');
      return;
    }
    setHTML(box, list.map(alertRow).join(""));
  }

  function renderReadiness() {
    var rows = S.events.map(function (ev) {
      var r = E.eventReadiness(S, ev.id);
      return { ev: ev, r: r };
    }).sort(function (a, b) { return a.r.score - b.r.score; });

    setHTML($("#today-readiness"), rows.map(function (x) {
      var open = x.r.blocked.length + x.r.pending.length;
      return '<button class="rd-item" data-event="' + x.ev.id + '">'
        + ring(x.r.score, x.r.status)
        + '<span class="rd-meta"><span class="rd-name">' + esc(x.ev.title) + "</span>"
        + '<span class="rd-sub">' + esc(E.fmtDate(x.ev.date)) + " · "
        + (open ? "còn " + E.n2(open) + " hạng mục" : "đã đủ hạng mục")
        + (x.r.blocked.length ? " · " + E.n2(x.r.blocked.length) + " đang vướng" : "") + "</span>"
        + '<span class="rd-bar"><i class="bgc-' + x.r.status + '" style="width:' + x.r.score + '%"></i></span>'
        + "</span></button>";
    }).join(""));
  }

  function renderRadar() {
    var b = E.actionBuckets(S);
    var tot = b.open.length || 1;
    var seg = [
      { n: b.overdue.length, cls: "bgc-RED", c: "c-RED", l: "quá hạn", f: "overdue" },
      { n: b.soon.length, cls: "bgc-AMBER", c: "c-AMBER", l: "đến hạn trong 03 ngày", f: "soon" },
      { n: b.ontrack.length, cls: "bgc-GREEN", c: "c-GREEN", l: "đúng tiến độ", f: "ontrack" }
    ];
    setHTML($("#today-radar"),
      '<div class="radar-top"><span class="n">' + E.n2(b.open.length) + '</span>'
      + '<span class="l">việc đang mở · ' + E.n2(b.done.length) + " đã xong</span></div>"
      + '<div class="stack">' + seg.map(function (s) {
          return '<i class="' + s.cls + '" style="width:' + (s.n / tot * 100) + '%"></i>';
        }).join("") + "</div>"
      + '<div class="radar-legend">' + seg.map(function (s) {
          return '<button class="radar-lg" data-actfilter="' + s.f + '">'
            + '<span class="sw ' + s.cls + '"></span>'
            + '<span class="n ' + s.c + '">' + E.n2(s.n) + "</span>"
            + '<span class="x">' + s.l + "</span></button>";
        }).join("") + "</div>");
  }

  /* =================================================== 02 LỊCH LÃNH ĐẠO */

  /* ---- Lịch dựng thành lưới tuần: trục giờ dọc, 07 ngày ngang ---- */

  var CAL_FROM = 7;    // giờ đầu trục
  var CAL_TO = 18;     // giờ cuối trục
  var WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  /* Chiều cao một giờ. Hàm này là nguồn duy nhất: vị trí khối tính bằng JS,
     còn vạch giờ do CSS kẻ theo --pxh gán ngay trên thẻ .cal. */
  function calPxh() { return window.innerWidth <= 720 ? 40 : 46; }

  function minuteOfDay(hhmm) {
    var p = String(hhmm || "").split(":");
    return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
  }

  /* "90 phút" -> 90 ; "Cả ngày" -> null (xếp vào hàng việc cả ngày) */
  function durMinutes(d) {
    var m = /(\d+)\s*phút/.exec(String(d || ""));
    return m ? parseInt(m[1], 10) : null;
  }

  /* Xếp chỗ cho các mục trùng giờ: chia đôi, chia ba theo số mục chồng nhau */
  function layoutOverlap(items) {
    items.sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    var group = [], groupEnd = -1;
    function close() {
      if (!group.length) return;
      var lanes = [];
      group.forEach(function (it) {
        var put = -1;
        for (var i = 0; i < lanes.length; i++) {
          if (lanes[i] <= it.start) { put = i; break; }
        }
        if (put < 0) { put = lanes.length; lanes.push(0); }
        lanes[put] = it.end; it.lane = put;
      });
      group.forEach(function (it) { it.lanes = lanes.length; });
      group = []; groupEnd = -1;
    }
    items.forEach(function (it) {
      if (group.length && it.start >= groupEnd) close();
      group.push(it);
      groupEnd = Math.max(groupEnd, it.end);
    });
    close();
    return items;
  }

  function renderAgendaTab() {
    var todayK = E.todayKey(S);
    var base = E.parseTime(S.meta.simulated_now);
    var nowMin = base.getHours() * 60 + base.getMinutes();
    var pxh = calPxh();
    var bodyH = (CAL_TO - CAL_FROM) * pxh;

    /* 07 ngày kể từ hôm nay */
    var days = [], i;
    for (i = 0; i < 7; i++) {
      days.push(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
    }

    var bucket = {};
    days.forEach(function (d) { bucket[E.dateKey(d)] = { timed: [], allday: [] }; });

    var inRange = 0;
    S.agenda.forEach(function (a) {
      var b = bucket[a.date];
      if (!b) return;
      inRange++;
      var dm = durMinutes(a.duration);
      var r = E.agendaReadiness(S, a);
      if (dm === null) { b.allday.push({ ag: a, r: r }); return; }
      var st = minuteOfDay(a.time);
      b.timed.push({ ag: a, r: r, start: st, end: st + Math.max(dm, 30) });
    });

    /* Hàng việc cả ngày phải cao bằng nhau ở mọi cột, nếu không các cột lệch
       hàng giờ. Tính một lần theo cột nhiều việc nhất rồi ép cứng chiều cao. */
    var maxAd = 0;
    days.forEach(function (d) {
      var n = bucket[E.dateKey(d)].allday.length;
      if (n > maxAd) maxAd = n;
    });
    var hasAllday = maxAd > 0;
    var adH = 8 + Math.max(maxAd, 1) * 19 + (Math.max(maxAd, 1) - 1) * 3;
    var adStyle = ' style="height:' + adH + 'px"';

    /* Cột giờ bên trái */
    var hours = "";
    for (i = CAL_FROM; i <= CAL_TO; i++) {
      /* Nhãn giờ đầu tiên không đẩy lên, nếu không sẽ đè vào hàng việc cả ngày. */
      hours += '<div class="cal-hr" style="top:' + ((i - CAL_FROM) * pxh) + "px"
        + (i === CAL_FROM ? ";transform:none" : "") + '">'
        + (i < 10 ? "0" + i : i) + ":00</div>";
    }

    var rail = '<div class="cal-rail"><div class="cal-hd"></div>'
      + (hasAllday ? '<div class="cal-ad"' + adStyle + '><span class="cal-ad-l">Cả ngày</span></div>' : "")
      + '<div class="cal-body" style="height:' + bodyH + 'px">' + hours + "</div></div>";

    var cols = days.map(function (d) {
      var k = E.dateKey(d);
      var b = bucket[k];
      var isToday = k === todayK;
      var isOff = d.getDay() === 0 || d.getDay() === 6;
      var all = b.timed.concat(b.allday);

      /* Thanh trạng thái trong đầu cột: tỷ lệ xanh / vàng / đỏ của ngày đó */
      var cnt = { GREEN: 0, AMBER: 0, RED: 0 };
      all.forEach(function (x) { cnt[x.r.status] = (cnt[x.r.status] || 0) + 1; });
      var stk = all.length
        ? ["RED", "AMBER", "GREEN"].map(function (s) {
            return cnt[s] ? '<i class="bgc-' + s + '" style="width:' + (cnt[s] / all.length * 100) + '%"></i>' : "";
          }).join("")
        : "";

      var head = '<div class="cal-hd"><span class="wd">' + WD[d.getDay()] + (isToday ? " · HÔM NAY" : "") + "</span>"
        + '<span class="dd">' + pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1) + "</span>"
        + '<span class="nn">' + (all.length ? E.n2(all.length) + " mục" : "trống") + "</span>"
        + '<span class="stk">' + stk + "</span></div>";

      var adRow = hasAllday
        ? '<div class="cal-ad"' + adStyle + ">" + b.allday.map(function (x) {
            return '<button class="cal-adc s-' + x.r.status + '" data-agenda="' + x.ag.id + '" '
              + 'title="' + esc(x.ag.title) + '">' + esc(x.ag.title) + "</button>";
          }).join("") + "</div>"
        : "";

      var blocks = layoutOverlap(b.timed).map(function (x) {
        var top = (x.start - CAL_FROM * 60) / 60 * pxh;
        var h = Math.max((x.end - x.start) / 60 * pxh, 34);
        var w = 100 / (x.lanes || 1);
        var left = w * (x.lane || 0);
        var pct = x.r.total ? Math.round(x.r.done / x.r.total * 100) : 100;
        /* Ô càng thấp thì càng bớt dòng, tránh chữ bị cắt ngang thân chữ */
        var tight = h < 56;
        return '<button class="cal-ev s-' + x.r.status + (tight ? " one" : "") + '" data-agenda="' + x.ag.id + '"'
          + ' title="' + esc(x.ag.time + " · " + x.ag.duration + " · " + x.ag.title + " · " + x.ag.location) + '"'
          + ' style="top:' + Math.max(top, 0).toFixed(1) + "px;height:" + h.toFixed(1)
          + "px;left:calc(" + left + '% + 3px);width:calc(' + w + '% - 6px)">'
          + (x.ag.important ? '<span class="star">★</span>' : "")
          + '<span class="hh">' + esc(x.ag.time) + (tight ? "" : " · " + esc(x.ag.duration)) + "</span>"
          + '<span class="tt">' + esc(x.ag.title) + "</span>"
          + (h >= 84 ? '<span class="mm">' + esc(x.ag.location) + "</span>" : "")
          + '<span class="pb"><i class="bgc-' + x.r.status + '" style="width:' + pct + '%"></i></span>'
          + "</button>";
      }).join("");

      var now = isToday && nowMin >= CAL_FROM * 60 && nowMin <= CAL_TO * 60
        ? '<div class="cal-now" style="top:' + ((nowMin - CAL_FROM * 60) / 60 * pxh).toFixed(1) + 'px"></div>'
        : "";

      return '<div class="cal-col' + (isToday ? " today" : "") + (isOff ? " off" : "") + '">'
        + head + adRow
        + '<div class="cal-body" style="height:' + bodyH + 'px">' + blocks + now + "</div></div>";
    }).join("");

    var legend = '<div class="cal-legend">'
      + '<span><i class="bgc-GREEN"></i>Sẵn sàng</span>'
      + '<span><i class="bgc-AMBER"></i>Cần chú ý</span>'
      + '<span><i class="bgc-RED"></i>Cần xử lý ngay</span>'
      + '<span><i class="line"></i>Mốc mô phỏng ' + esc(E.fmtTime(S.meta.simulated_now)) + "</span>"
      + "<span>★ lịch quan trọng</span>"
      + '<span>Vạch dưới mỗi mục là <b>phần chuẩn bị đã xong</b>. Bấm một mục để xem chi tiết.</span>'
      + "</div>";

    setHTML($("#agenda-body"),
      section("LỊCH 07 NGÀY · " + E.fmtDate(S.meta.simulated_now) + " - "
        + E.fmtDate(E.dateKey(days[6])), inRange,
        '<div class="cal-swipe">Vuốt ngang để xem đủ 07 ngày.</div>'
        + '<div class="cal-scroll"><div class="cal" style="--pxh:' + pxh + 'px">' + rail + cols + "</div></div>"
        + legend)
      + footNote());
  }

  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function section(title, count, body) {
    return '<h2 class="sec">' + esc(title)
      + '<span class="tag">' + E.n2(count) + " mục</span>"
      + '<span class="rule"></span></h2>' + body;
  }

  function emptyBox(msg) {
    return '<div class="box" style="text-align:center;color:var(--muted)">' + esc(msg) + "</div>";
  }

  function footNote() {
    return '<div class="note-foot">' + esc(S.meta.data_notice)
      + '<br>Ứng dụng do <b>Đoàn Thái Việt</b> xây dựng.</div>';
  }

  /* ==================================================== 03 ĐOÀN KHÁCH VÀ SỰ KIỆN */

  function renderEventsTab() {
    var rows = S.events.map(function (ev) {
      return { ev: ev, r: E.eventReadiness(S, ev.id) };
    }).sort(function (a, b) {
      return (a.ev.date + a.ev.time).localeCompare(b.ev.date + b.ev.time);
    });

    setHTML($("#events-body"),
      section("ĐOÀN KHÁCH · SỰ KIỆN · CHƯƠNG TRÌNH CÔNG TÁC", rows.length,
        '<div class="grid-auto">' + rows.map(function (x, i) {
          var open = x.r.blocked.concat(x.r.pending);
          return '<button class="ev-card s-' + x.r.status + '" data-event="' + x.ev.id + '">'
            + '<span class="ev-head">' + ring(x.r.score, x.r.status, 74)
            + '<span style="min-width:0"><span class="ev-idn">' + E.n2(i + 1) + " · " + esc(x.ev.type) + "</span>"
            + '<div class="ev-title">' + esc(x.ev.title) + "</div>"
            + '<div class="ev-sub">' + esc(x.ev.subtitle) + "</div></span></span>"
            + '<span class="ev-body">'
            + evLine("Thời gian", E.fmtDate(x.ev.date) + " · " + x.ev.time)
            + evLine("Địa điểm", x.ev.location)
            + evLine("Đầu mối", x.ev.owner)
            + evLine("Quy mô", x.ev.scale)
            + '<span class="ev-line"><span class="k">Trạng thái</span>' + pill(x.r.status) + "</span>"
            + "</span>"
            + '<span class="ev-foot"><span>'
            + (open.length
                ? "Còn <b>" + E.n2(open.length) + "</b> hạng mục"
                  + (x.r.blocked.length ? ' · <b class="c-RED">' + E.n2(x.r.blocked.length) + " đang vướng</b>" : "")
                : "Đã đủ hạng mục")
            + "</span>"
            + '<span class="open">Mở chi tiết →</span></span>'
            + "</button>";
        }).join("") + "</div>")
      + footNote());
  }

  function evLine(k, v) {
    return '<span class="ev-line"><span class="k">' + esc(k) + '</span><span class="x">' + esc(v) + "</span></span>";
  }

  /* ====================================================== 04 ĐẦU VIỆC CẦN ĐÔN ĐỐC */

  var ACT_FILTERS = [
    { id: "all", label: "Tất cả" },
    { id: "overdue", label: "Quá hạn" },
    { id: "soon", label: "Đến hạn 03 ngày" },
    { id: "week", label: "Trong tuần" },
    { id: "done", label: "Đã xong" }
  ];

  var PRIOS = ["Cao", "Trung bình", "Thấp"];
  var BANDS = [
    { id: "overdue", label: "Quá hạn", col: "RED" },
    { id: "soon", label: "Trong 72 giờ", col: "AMBER" },
    { id: "ontrack", label: "Còn thời gian", col: "GREEN" }
  ];
  var RGB = { RED: "216, 88, 78", AMBER: "224, 152, 42", GREEN: "0, 166, 81" };

  /* Việc đang mở rơi vào dải nào của trục thời hạn */
  function bandOf(a) {
    if (a.status === "DONE") return null;
    if (E.isOverdue(S, a)) return "overdue";
    var h = E.hoursFromNow(S, a.deadline);
    return (h !== null && h <= S.meta.thresholds.soon_hours) ? "soon" : "ontrack";
  }

  function filteredActions() {
    var b = E.actionBuckets(S);
    var list;
    if (ui.actFilter === "overdue") list = b.overdue;
    else if (ui.actFilter === "soon") list = b.soon;
    else if (ui.actFilter === "ontrack") list = b.ontrack;
    else if (ui.actFilter === "done") list = b.done;
    else if (ui.actFilter === "week") {
      list = b.open.filter(function (a) {
        var h = E.hoursFromNow(S, a.deadline);
        return h !== null && h <= 168;
      });
    } else list = b.open;

    if (ui.actPrio) {
      list = list.filter(function (a) { return a.priority === ui.actPrio; });
    }

    var prio = { "Cao": 0, "Trung bình": 1, "Thấp": 2 };
    var copy = list.slice();
    if (ui.actSort === "priority") {
      copy.sort(function (a, b2) {
        return (prio[a.priority] - prio[b2.priority])
          || String(a.deadline).localeCompare(String(b2.deadline));
      });
    } else if (ui.actSort === "owner") {
      copy.sort(function (a, b2) {
        return a.owner.localeCompare(b2.owner, "vi")
          || String(a.deadline).localeCompare(String(b2.deadline));
      });
    } else {
      copy.sort(function (a, b2) { return String(a.deadline).localeCompare(String(b2.deadline)); });
    }
    return copy;
  }

  function actionStatusColor(a) {
    if (a.status === "DONE") return "GREY";
    if (E.isOverdue(S, a)) return "RED";
    var h = E.hoursFromNow(S, a.deadline);
    return (h !== null && h <= S.meta.thresholds.soon_hours) ? "AMBER" : "GREEN";
  }

  /* Ma trận Ưu tiên × Thời hạn: đếm việc đang mở trong từng ô */
  function actionMatrix() {
    var m = {}, max = 0;
    PRIOS.forEach(function (p) { m[p] = { overdue: 0, soon: 0, ontrack: 0 }; });
    E.actionBuckets(S).open.forEach(function (a) {
      var bd = bandOf(a);
      if (!bd) return;
      if (!m[a.priority]) m[a.priority] = { overdue: 0, soon: 0, ontrack: 0 };
      m[a.priority][bd]++;
      if (m[a.priority][bd] > max) max = m[a.priority][bd];
    });
    return { m: m, max: max };
  }

  /* Tải của từng đầu mối: đầu việc theo dải + hạng mục chuẩn bị đang chờ */
  function ownerChart() {
    var m = {};
    function row(o) {
      if (!m[o]) m[o] = { owner: o, overdue: 0, soon: 0, ontrack: 0, prep: 0, blocked: 0 };
      return m[o];
    }
    S.actions.forEach(function (a) {
      var bd = bandOf(a);
      if (!bd || !a.owner || a.owner === "-") return;
      row(a.owner)[bd]++;
    });
    S.event_checklist.forEach(function (c) {
      if (!c.owner || c.owner === "-") return;
      if (c.status === "PENDING") row(c.owner).prep++;
      if (c.status === "BLOCKED") { row(c.owner).prep++; row(c.owner).blocked++; }
    });
    return Object.keys(m).map(function (k) {
      var o = m[k];
      o.total = o.overdue + o.soon + o.ontrack + o.prep;
      return o;
    }).sort(function (a, b) {
      return (b.blocked - a.blocked) || (b.overdue - a.overdue) || (b.total - a.total);
    });
  }

  /* Trục thời hạn: mỗi ngày một cột, mỗi việc một ô xếp chồng từ dưới lên */
  function deadlinePlot() {
    var open = E.actionBuckets(S).open.filter(function (a) { return a.deadline; });
    if (!open.length) return null;
    var keys = open.map(function (a) { return String(a.deadline).slice(0, 10); }).sort();
    var cur = E.parseTime(keys[0] + "T00:00:00");
    var last = E.parseTime(keys[keys.length - 1] + "T00:00:00");
    var days = [], by = {}, max = 0;
    while (cur <= last && days.length < 45) {
      days.push(cur);
      by[E.dateKey(cur)] = [];
      cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    }
    open.forEach(function (a) {
      var k = String(a.deadline).slice(0, 10);
      if (by[k]) by[k].push(a);
    });
    days.forEach(function (d) {
      var arr = by[E.dateKey(d)];
      arr.sort(function (x, y) { return PRIOS.indexOf(x.priority) - PRIOS.indexOf(y.priority); });
      if (arr.length > max) max = arr.length;
    });
    return { days: days, by: by, max: max };
  }

  function renderActionsViz() {
    var mx = actionMatrix();
    var owners = ownerChart();
    var plot = deadlinePlot();
    var todayK = E.todayKey(S);

    /* --- Ma trận --- */
    var mHtml = '<div class="mx"><span></span>'
      + BANDS.map(function (bd) {
          return '<span class="mx-h c-' + bd.col + '">' + esc(bd.label.toUpperCase()) + "</span>";
        }).join("");
    PRIOS.forEach(function (p) {
      mHtml += '<span class="mx-r">' + esc(p) + "</span>";
      BANDS.forEach(function (bd) {
        var n = (mx.m[p] || {})[bd.id] || 0;
        /* Nền đậm dần theo số việc, nhưng có sàn để ô đỏ 01 việc vẫn ra màu đỏ rõ */
        var a = mx.max ? (0.24 + 0.44 * (n / mx.max)) : 0.24;
        var on = ui.actFilter === bd.id && ui.actPrio === p;
        mHtml += '<button class="mx-c' + (n ? "" : " zero") + (on ? " on" : "") + '"'
          + ' data-mx="' + bd.id + "|" + esc(p) + '"'
          + (n ? ' style="background:rgba(' + RGB[bd.col] + "," + a.toFixed(2)
                 + ");border-color:rgba(" + RGB[bd.col] + ',.35)"' : "")
          + ' title="' + esc(p + " · " + bd.label) + '">'
          + '<span class="n c-' + bd.col + '">' + E.n2(n) + "</span>"
          + '<span class="u">việc</span></button>';
      });
    });
    mHtml += "</div><div class=\"mx-foot\">Bấm một ô để lọc danh sách bên dưới. "
      + "Ô càng đậm càng dồn nhiều việc.</div>";

    /* --- Tải theo đầu mối --- */
    var oMax = owners.length ? owners[0].total : 1;
    owners.forEach(function (o) { if (o.total > oMax) oMax = o.total; });
    var oHtml = '<div class="olist">' + owners.map(function (o) {
      var segs = [
        { n: o.overdue, c: "bgc-RED" }, { n: o.soon, c: "bgc-AMBER" },
        { n: o.ontrack, c: "bgc-GREEN" }, { n: o.prep, c: "bgc-PREP" }
      ];
      var bits = [];
      if (o.overdue) bits.push(E.n2(o.overdue) + " quá hạn");
      if (o.soon) bits.push(E.n2(o.soon) + " cận hạn");
      if (o.ontrack) bits.push(E.n2(o.ontrack) + " đúng tiến độ");
      if (o.prep) bits.push(E.n2(o.prep) + " hạng mục chuẩn bị");
      return '<div class="orow"><div class="oh"><span class="nm">' + esc(o.owner) + "</span>"
        + '<span class="ct">' + esc(bits.join(" · ") || "không còn việc") + "</span></div>"
        + '<div class="obar">' + segs.map(function (s) {
            return s.n ? '<i class="' + s.c + '" style="width:' + (s.n / oMax * 100).toFixed(1) + '%"></i>' : "";
          }).join("") + "</div></div>";
    }).join("") + "</div>";

    /* --- Trục thời hạn --- */
    var tHtml;
    if (!plot) {
      tHtml = emptyBox("Không còn đầu việc nào đang mở.");
    } else {
      var step = plot.days.length > 18 ? 2 : 1;
      tHtml = '<div class="tl-plot">' + plot.days.map(function (d) {
        var k = E.dateKey(d);
        var isToday = k === todayK;
        return '<div class="tl-day' + (isToday ? " today" : "") + '">'
          + plot.by[k].map(function (a) {
              var col = actionStatusColor(a);
              return '<button class="tl-dot bgc-' + col + (a.priority === "Cao" ? " hi" : "") + '"'
                + ' data-action="' + a.id + '"'
                + ' title="' + esc(a.title + " · " + a.owner + " · ưu tiên " + a.priority) + '"></button>';
            }).join("")
          + "</div>";
      }).join("") + "</div>"
        + '<div class="tl-base"></div>'
        + '<div class="tl-axis">' + plot.days.map(function (d, i) {
            var isToday = E.dateKey(d) === todayK;
            var show = isToday || i % step === 0;
            return '<span class="' + (isToday ? "today" : "") + '">'
              + (show ? (isToday ? "HÔM NAY" : pad2(d.getDate()) + "/" + pad2(d.getMonth() + 1)) : "")
              + "</span>";
          }).join("") + "</div>";
    }

    setHTML($("#actions-viz"),
      '<div class="act-viz">'
      + '<div class="box"><h4>Ma trận đôn đốc · ưu tiên và thời hạn</h4>' + mHtml + "</div>"
      + '<div class="box"><h4>Tải theo đầu mối</h4>' + oHtml + "</div>"
      + "</div>"
      + '<div class="box"><h4>Trục thời hạn · mỗi ô là một đầu việc</h4>' + tHtml + "</div>");
  }

  function renderActionsTab() {
    var b = E.actionBuckets(S);
    var counts = { all: b.open.length, overdue: b.overdue.length, soon: b.soon.length, done: b.done.length,
      week: b.open.filter(function (a) {
        var h = E.hoursFromNow(S, a.deadline); return h !== null && h <= 168;
      }).length };

    renderActionsViz();

    setHTML($("#act-filter"), ACT_FILTERS.map(function (f) {
      return '<button data-f="' + f.id + '" class="' + (ui.actFilter === f.id && !ui.actPrio ? "on" : "") + '">'
        + esc(f.label) + '<span class="c">' + E.n2(counts[f.id] || 0) + "</span></button>";
    }).join(""));
    $("#act-sort").value = ui.actSort;

    var list = filteredActions();

    setHTML($("#actions-body"),
      (ui.actPrio
        ? '<div class="act-note">Đang lọc theo ô ma trận: <b>' + esc(ui.actPrio) + " · "
          + esc((BANDS.filter(function (x) { return x.id === ui.actFilter; })[0] || {}).label || "tất cả")
          + '</b><button class="btn" data-mxclear>Bỏ lọc</button></div>'
        : "")
      +
      (list.length
        ? list.map(function (a) {
            var col = actionStatusColor(a);
            return '<button class="act s-' + col + '" data-action="' + a.id + '">'
              + '<span class="act-id">' + esc(a.id) + "</span>"
              + '<span class="act-main"><span class="t">' + esc(a.title) + "</span>"
              + '<span class="m"><span>Đầu mối: <b>' + esc(a.owner) + "</b></span>"
              + "<span>Nguồn: <b>" + esc(a.source_type) + "</b></span>"
              + (a.ref_label ? "<span>Gắn với: <b>" + esc(a.ref_label) + "</b></span>" : "")
              + "<span>Ưu tiên: <b>" + esc(a.priority) + "</b></span></span></span>"
              + '<span class="act-due"><span class="d">' + esc(E.fmtDeadline(S, a.deadline)) + "</span>"
              + '<span class="r">' + dueText(a.deadline) + "</span></span>"
              + pill(col, E.actionStatusLabel(E.isOverdue(S, a) ? "OVERDUE" : a.status))
              + "</button>";
          }).join("")
        : emptyBox("Không có đầu việc nào trong bộ lọc này."))
      + footNote());
  }

  /* ===================================================== 05 TRUYỀN THÔNG */

  var STAGES = ["IDEA", "DRAFT", "REVIEW", "APPROVED", "PUBLISHED"];

  function commColor(c) {
    if (c.stage === "PUBLISHED") return "GREEN";
    var h = E.hoursFromNow(S, c.due);
    if (h === null) return "GREY";
    if (h < 0) return "RED";
    if (h <= 24) return "AMBER";
    return "GREEN";
  }

  function renderCommsTab() {
    setHTML($("#comms-body"),
      section("QUY TRÌNH NỘI DUNG TRUYỀN THÔNG", S.communications.length,
        '<div class="pipe">' + STAGES.map(function (st) {
          var items = S.communications.filter(function (c) { return c.stage === st; });
          return '<div class="pipe-col"><div class="pipe-h">'
            + '<span class="t">' + esc(E.stageLabel(st)) + "</span>"
            + '<span class="n">' + E.n2(items.length) + "</span></div>"
            + (items.length ? items.map(function (c) {
                var col = commColor(c);
                return '<button class="cm-card s-' + col + '" data-comm="' + c.id + '">'
                  + '<span class="t">' + esc(c.title) + "</span>"
                  + '<span class="ch">' + esc(c.channel) + " · " + esc(c.owner) + "</span>"
                  + '<span class="dl">' + dueText(c.due) + "</span></button>";
              }).join("") : '<div class="pipe-empty">Chưa có nội dung</div>')
            + "</div>";
        }).join("") + "</div>")
      + '<h2 class="sec">Chờ xử lý<span class="rule"></span></h2>'
      + '<div class="box"><div class="owner-grid">'
      + S.communications.filter(function (c) { return c.stage !== "PUBLISHED"; })
          .sort(function (a, b) { return String(a.due).localeCompare(String(b.due)); })
          .map(function (c) {
            return '<div class="owner-row"><span><span class="nm">' + esc(c.title) + "</span>"
              + '<span class="sm">' + esc(c.next_action) + "</span></span>"
              + '<span class="bits">' + pill(commColor(c), E.fmtDeadline(S, c.due))
              + (c.source_approved ? "" : pill("AMBER", "Nguồn chưa duyệt")) + "</span></div>";
          }).join("")
      + "</div></div>" + footNote());
  }

  /* =============================================================== DRAWER */

  function openDrawer(desc) {
    ui.lastFocus = document.activeElement;
    ui.drawer = desc;
    renderDrawer();
    $("#scrim").hidden = false;
    $("#drawer").hidden = false;
    requestAnimationFrame(function () {
      $("#scrim").classList.add("in");
      $("#drawer").classList.add("in");
      var f = $("#drawer-body button, #drawer-body input") || $("#drawer [data-close]");
      if (f) f.focus();
    });
  }

  function closeDrawer() {
    ui.drawer = null;
    $("#scrim").classList.remove("in");
    $("#drawer").classList.remove("in");
    setTimeout(function () {
      $("#scrim").hidden = true;
      $("#drawer").hidden = true;
    }, 240);
    if (ui.lastFocus && ui.lastFocus.focus) ui.lastFocus.focus();
  }

  function renderDrawer() {
    if (!ui.drawer) return;
    var d = ui.drawer;
    var dr = $("#drawer");
    dr.classList.toggle("wide", d.kind === "brief" || d.kind === "ask");
    if (d.kind === "event") drawEvent(d.id);
    else if (d.kind === "agenda") drawAgenda(d.id);
    else if (d.kind === "comm") drawComm(d.id);
    else if (d.kind === "action") drawAction(d.id);
    else if (d.kind === "brief") drawBrief();
    else if (d.kind === "ask") drawAsk();
    animateRings($("#drawer"));
  }

  function drawerHead(kicker, title, sub) {
    $("#drawer-kicker").textContent = kicker;
    $("#drawer-title").textContent = title;
    $("#drawer-sub").textContent = sub || "";
  }

  /* ------------------------------------------- CHI TIẾT MỨC ĐỘ SẴN SÀNG */

  function drawEvent(id) {
    var ev = S.events.filter(function (e) { return e.id === id; })[0];
    if (!ev) return;
    var r = E.eventReadiness(S, id);

    drawerHead(ev.type + " · " + E.fmtDate(ev.date) + " · " + ev.time, ev.title, ev.subtitle);

    var warn = "";
    if (r.blocked.some(function (c) { return c.critical; })) {
      warn = '<div class="warn-line">Có hạng mục then chốt đang vướng. Sự kiện không được coi là sẵn sàng dù phần trăm hoàn thành cao.</div>';
    } else if (r.blocked.length) {
      warn = '<div class="warn-line amber">Có ' + E.n2(r.blocked.length) + ' hạng mục đang vướng, cần Văn phòng can thiệp.</div>';
    } else if (r.capped) {
      warn = '<div class="warn-line amber">Còn hạng mục then chốt chưa xong nên chưa chuyển sang mức sẵn sàng.</div>';
    }

    var body =
      '<div class="box"><div class="score-head">' + ring(r.score, r.status, 92)
      + '<div class="score-note"><div class="big">' + esc(E.readinessLabel(r.status))
      + ' · <span class="c-' + r.status + '">' + r.score + "%</span></div>"
      + '<div class="sm">Điểm sẵn sàng mô phỏng, tính theo trọng số: đã xong ' + E.n2(r.doneCount) + "/" + E.n2(r.applicable)
      + " hạng mục có áp dụng" + (r.na ? ", " + E.n2(r.na) + " hạng mục không áp dụng" : "") + ".</div>"
      + warn + "</div></div></div>"

      + '<div class="box"><h4>Thông tin sự kiện</h4><dl class="kv">'
      + kv("Thời gian", E.fmtDate(ev.date) + " · " + ev.time)
      + kv("Địa điểm", ev.location) + kv("Đầu mối", ev.owner)
      + kv("Loại", ev.type) + kv("Quy mô", ev.scale) + "</dl></div>"

      + '<div class="box"><h4>Hạng mục chuẩn bị · bấm để đổi trạng thái</h4>'
      + '<div id="ck-list">' + r.items.map(ckRow).join("") + "</div></div>";

    setHTML($("#drawer-body"), body);
    setHTML($("#drawer-foot"),
      '<span style="color:var(--muted)">Bấm một hạng mục để chuyển Đang chờ → Đã xong. Toàn bộ màn hình cập nhật ngay.</span>'
      + '<button class="btn btn-primary" data-close>Đóng</button>');
  }

  function ckRow(c) {
    var cls = c.status === "DONE" ? "done" : c.status === "BLOCKED" ? "blocked"
            : c.status === "NOT_APPLICABLE" ? "na" : "";
    if (c.id === ui.flashCk) cls += " ck-flash";
    var mark = c.status === "BLOCKED" ? "!" : CHECK_SVG;
    var rm = c.deadline ? E.remaining(S, c.deadline) : null;
    return '<button class="ck ' + cls + '" data-ck="' + c.id + '"'
      + (c.status === "NOT_APPLICABLE" ? " disabled" : "") + ">"
      + '<span class="ck-cat">' + esc(c.cat) + "</span>"
      + '<span class="ck-box">' + mark + "</span>"
      + '<span class="ck-main"><span class="t">' + esc(c.label)
      + (c.critical ? '<span class="ck-crit">THEN CHỐT</span>' : "") + "</span>"
      + '<span class="m"><span>Đầu mối: ' + esc(c.owner) + "</span>"
      + (c.deadline ? "<span>Hạn: " + esc(E.fmtDeadline(S, c.deadline)) + "</span>" : "")
      + (c.deadline && c.status !== "DONE"
          ? '<span class="' + (rm.overdue ? "c-RED" : "") + '">' + esc(rm.text) + "</span>" : "")
      + "<span>Trọng số " + c.weight + "</span></span>"
      + (c.note ? '<span class="note">' + esc(c.note) + "</span>" : "")
      + "</span>"
      + pill(c.status === "DONE" ? "GREEN" : c.status === "BLOCKED" ? "RED"
             : c.status === "NOT_APPLICABLE" ? "GREY" : "AMBER", E.statusLabel(c.status))
      + "</button>";
  }

  function kv(k, v) { return "<dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd>"; }

  /* ------------------------------------------------- KIỂM TRA TRƯỚC CUỘC HỌP */

  function drawAgenda(id) {
    var a = S.agenda.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    var r = E.agendaReadiness(S, a);
    var startIso = a.date + "T" + a.time + ":00";
    var rm = E.remaining(S, startIso);

    drawerHead(a.type + " · " + E.fmtDate(a.date), a.title, a.location + " · " + a.duration);

    var evBlock = "";
    if (a.event_id) {
      var ev = S.events.filter(function (e) { return e.id === a.event_id; })[0];
      if (ev) {
        var er = E.eventReadiness(S, ev.id);
        evBlock = '<div class="box"><h4>Sự kiện liên quan</h4>'
          + '<button class="rd-item" data-event="' + ev.id + '">' + ring(er.score, er.status)
          + '<span class="rd-meta"><span class="rd-name">' + esc(ev.title) + "</span>"
          + '<span class="rd-sub">' + esc(E.readinessLabel(er.status)) + " · "
          + esc(E.fmtDate(ev.date)) + " · mở mức độ sẵn sàng →</span></span></button></div>";
      }
    }

    setHTML($("#drawer-body"),
      '<div class="box"><h4>Thông tin cuộc họp</h4><dl class="kv">'
      + kv("Thời gian", E.fmtDate(a.date) + " · " + a.time + " · " + a.duration)
      + kv("Chủ trì", a.leader) + kv("Địa điểm", a.location)
      + kv("Đầu mối", a.owner) + kv("Trạng thái", E.readinessLabel(r.status)) + "</dl>"
      + '<div class="countdown"><span class="v ' + (rm.overdue ? "c-GREY" : "c-AMBER") + '">'
      + esc(rm.text) + '</span><span class="l">' + (rm.overdue ? "so với giờ bắt đầu" : "trước giờ bắt đầu") + "</span></div></div>"

      + '<div class="box"><h4>Kiểm tra trước cuộc họp</h4><div class="pre-check">'
      + (a.prep || []).map(function (p) {
          return '<div class="pc ' + (p.done ? "on" : "off") + '"><span class="bx">'
            + (p.done ? CHECK_SVG : "") + '</span><span class="t">' + esc(p.label) + "</span></div>";
        }).join("") + "</div>"
      + (r.missing.length
          ? '<div class="warn-line amber" style="margin-top:12px">Cần hoàn thành trước cuộc họp: '
            + r.missing.map(function (m) { return esc(m.label); }).join(", ") + ".</div>"
          : '<div class="warn-line ok" style="margin-top:12px">Đã hoàn tất phần chuẩn bị.</div>')
      + "</div>" + evBlock);

    setHTML($("#drawer-foot"),
      '<span style="color:var(--muted)">Chuẩn bị ' + E.n2(r.done) + "/" + E.n2(r.total) + " hạng mục.</span>"
      + '<button class="btn btn-primary" data-close>Đóng</button>');
  }

  /* ------------------------------------------------------------ ACTION */

  function drawAction(id) {
    var a = S.actions.filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    var col = actionStatusColor(a);
    var rm = E.remaining(S, a.deadline);
    drawerHead(a.source_type + " · " + a.id, a.title, a.ref_label || "");

    setHTML($("#drawer-body"),
      '<div class="box"><h4>Chi tiết đầu việc</h4><dl class="kv">'
      + kv("Đầu mối", a.owner) + kv("Giao ngày", E.fmtDate(a.assigned_date))
      + kv("Hạn", E.fmtDeadline(S, a.deadline)) + kv("Còn lại", rm.text)
      + kv("Mức ưu tiên", a.priority)
      + kv("Trạng thái", E.actionStatusLabel(E.isOverdue(S, a) ? "OVERDUE" : a.status)) + "</dl>"
      + (a.note ? '<div class="warn-line ' + (col === "RED" ? "" : "amber") + '" style="margin-top:12px">'
          + esc(a.note) + "</div>" : "") + "</div>"
      + '<div class="box"><h4>Việc tiếp theo của Văn phòng</h4>'
      + '<div style="font-size:var(--fs-body);line-height:1.6">'
      + (E.isOverdue(S, a)
          ? "Đôn đốc " + esc(a.owner) + " báo cáo tiến độ và ấn định lại thời hạn hoàn thành."
          : "Theo dõi tiến độ, nhắc " + esc(a.owner) + " trước hạn " + esc(E.fmtDeadline(S, a.deadline)) + ".")
      + "</div></div>");

    setHTML($("#drawer-foot"),
      '<span style="color:var(--muted)">Bản mô phỏng không sửa trạng thái đầu việc. Thao tác trực tiếp nằm ở phần hạng mục chuẩn bị của sự kiện.</span>'
      + '<button class="btn btn-primary" data-close>Đóng</button>');
  }

  /* -------------------------------------------------------------- COMM */

  function drawComm(id) {
    var c = S.communications.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    var col = commColor(c);
    drawerHead("Truyền thông · " + E.stageLabel(c.stage), c.title, c.channel);

    setHTML($("#drawer-body"),
      '<div class="box"><h4>Trạng thái</h4><dl class="kv">'
      + kv("Bước hiện tại", E.stageLabel(c.stage))
      + kv("Đầu mối", c.owner)
      + kv("Hạn", E.fmtDeadline(S, c.due))
      + kv("Còn lại", E.remaining(S, c.due).text)
      + kv("Nguồn tin đã duyệt", c.source_approved ? "Đã duyệt" : "Chưa duyệt")
      + kv("Kênh phát hành", c.channel) + "</dl>"
      + (c.note ? '<div style="margin-top:11px;font-size:var(--fs-sm);color:var(--ink-2);line-height:1.55">'
          + esc(c.note) + "</div>" : "") + "</div>"
      + '<div class="box"><h4>Việc tiếp theo</h4>'
      + '<div style="font-size:var(--fs-body);line-height:1.6">' + esc(c.next_action) + "</div>"
      + (c.source_approved ? "" : '<div class="warn-line amber" style="margin-top:12px">Nguồn tin chưa được duyệt. Không phát hành trước khi có ý kiến của đầu mối phụ trách nội dung.</div>')
      + "</div>"
      + '<div class="box"><h4>Quy trình</h4><div class="pre-check">'
      + STAGES.map(function (st) {
          var passed = STAGES.indexOf(st) <= STAGES.indexOf(c.stage);
          return '<div class="pc ' + (passed ? "on" : "off") + '"><span class="bx">'
            + (passed ? CHECK_SVG : "") + '</span><span class="t">' + esc(E.stageLabel(st)) + "</span></div>";
        }).join("") + "</div></div>");

    setHTML($("#drawer-foot"),
      pill(col, E.fmtDeadline(S, c.due)) + '<button class="btn btn-primary" data-close>Đóng</button>');
  }

  /* ---------------------------------------------------- TÓM TẮT BUỔI SÁNG */

  function drawBrief() {
    var b = E.brief(S);
    drawerHead("✦ Tóm tắt buổi sáng · dựng từ trạng thái hiện tại", b.title, b.date + " · " + b.time + " · Kịch bản: " + b.scenario);

    setHTML($("#drawer-body"),
      '<div class="brief-cap">BẢN TÓM TẮT ĐIỀU HÀNH BUỔI SÁNG</div>'
      + b.sections.map(function (sec, i) {
          return '<div class="box brief-sec reveal" style="animation-delay:' + (i * 90) + 'ms">'
            + "<h4>" + esc(sec.title) + "</h4><ol>"
            + sec.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("")
            + "</ol></div>";
        }).join("")
      + '<div class="brief-foot">' + esc(b.footer)
      + " Bản mô phỏng dựng nội dung theo quy tắc trên dữ liệu, không gọi dịch vụ bên ngoài.</div>");

    setHTML($("#drawer-foot"),
      '<button class="btn" id="brief-copy">Sao chép nội dung</button>'
      + '<button class="btn btn-primary" data-close>Đóng</button>');

    $("#brief-copy").onclick = function () {
      var txt = b.title + " - " + b.date + " " + b.time + "\n\n"
        + b.sections.map(function (s) {
            return s.title + "\n" + s.lines.map(function (l, i) { return (i + 1) + ". " + l; }).join("\n");
          }).join("\n\n") + "\n\n" + b.footer;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(
          function () { toast("Đã sao chép bản tóm tắt", "ok"); },
          function () { toast("Trình duyệt không cho sao chép", "warn"); });
      } else toast("Trình duyệt không hỗ trợ sao chép", "warn");
    };
  }

  /* -------------------------------------------------------- HỎI NHANH */

  function drawAsk() {
    drawerHead("✦ Hỏi nhanh · đối chiếu từ khoá trên dữ liệu đang hiển thị",
      "Hỏi nhanh về tình hình Văn phòng",
      "Bản mô phỏng không gọi dịch vụ bên ngoài.");

    setHTML($("#drawer-body"),
      '<div class="box"><h4>Câu hỏi gợi ý</h4><div class="quick-wrap">'
      + E.quickPrompts.map(function (p) {
          return '<button class="quick" data-q="' + esc(p) + '">' + esc(p) + "</button>";
        }).join("") + "</div></div>"
      + '<div class="ask-log" id="ask-log">'
      + (ui.askLog.length ? ui.askLog.map(askBubble).join("")
          : '<div class="box" style="color:var(--muted);font-size:var(--fs-sm);line-height:1.6">'
            + "Chọn một câu gợi ý ở trên, hoặc gõ câu hỏi vào ô bên dưới. "
            + "Câu trả lời được dựng từ đúng dữ liệu đang hiển thị, nên đánh dấu xong một hạng mục là câu trả lời đổi theo.</div>")
      + "</div>");

    setHTML($("#drawer-foot"),
      '<div class="ask-input" style="flex:1 1 auto">'
      + '<input id="ask-q" placeholder="Nhập câu hỏi, ví dụ: việc gì quá hạn?" autocomplete="off">'
      + '<button class="btn btn-primary" id="ask-go">Hỏi</button></div>');

    var input = $("#ask-q");
    $("#ask-go").onclick = function () { doAsk(input.value); input.value = ""; };
    input.onkeydown = function (e) {
      if (e.key === "Enter") { doAsk(input.value); input.value = ""; }
    };
    var log = $("#ask-log");
    if (log) log.scrollIntoView({ block: "end" });
  }

  function askBubble(entry) {
    return '<div class="ask-q">' + esc(entry.q) + "</div>"
      + '<div class="ask-a reveal"><div class="t">' + esc(entry.a.title) + "</div>"
      + "<ul>" + entry.a.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>"
      + (entry.a.jump
          ? '<div class="jump"><button class="btn" data-jump=\'' + esc(JSON.stringify(entry.a.jump))
            + "'>" + esc(entry.a.jump_label || "Mở") + " →</button></div>"
          : "") + "</div>";
  }

  function doAsk(q) {
    q = (q || "").trim();
    if (!q) return;
    ui.askLog.push({ q: q, a: E.ask(S, q) });
    if (ui.askLog.length > 12) ui.askLog.shift();
    drawAsk();
    var log = $("#ask-log");
    if (log) log.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  /* ================================================== THAO TÁC TRỰC TIẾP */

  /* Vòng trạng thái khi bấm: Đang chờ -> Đã xong -> Đang vướng -> Đang chờ.
     Đây là điểm chính của bản mô phỏng: mọi con số trên màn hình tính lại ngay. */
  function cycleChecklist(ckId) {
    var c = S.event_checklist.filter(function (x) { return x.id === ckId; })[0];
    if (!c || c.status === E.ST.NA) return;
    var before = E.eventReadiness(S, c.event_id).score;
    var beforeCrit = E.kpi(S).critical;

    c.status = c.status === "PENDING" ? "DONE" : c.status === "DONE" ? "BLOCKED" : "PENDING";

    clearTimeout(flashTimer);
    ui.flashCk = ckId;
    flashTimer = setTimeout(function () {
      ui.flashCk = null;
      if (ui.drawer) renderDrawer();
    }, 1500);

    renderAll();
    var after = E.eventReadiness(S, c.event_id).score;
    var afterCrit = E.kpi(S).critical;


    var msg = c.label + ": " + E.statusLabel(c.status)
      + " · mức sẵn sàng " + before + "% → " + after + "%";
    toast(msg, after >= before ? "ok" : "warn");
    if (beforeCrit > afterCrit) {
      setTimeout(function () { toast("Đã gỡ " + E.n2(beforeCrit - afterCrit) + " cảnh báo đỏ", "ok"); }, 380);
    }
  }

  /* ------------------------------------------------------------ KỊCH BẢN */

  function renderScenarioMenu() {
    setHTML($("#scenario-list"), RAW.scenarios.map(function (s) {
      return '<button class="menu-item ' + (s.id === ui.scenario ? "on" : "") + '" data-sc="' + s.id + '">'
        + '<div class="t"><b>' + esc(s.code) + ".</b>" + esc(s.name) + "</div>"
        + '<div class="s">' + esc(s.desc) + "</div></button>";
    }).join(""));
    var cur = RAW.scenarios.filter(function (s) { return s.id === ui.scenario; })[0];
    $("#scenario-code").textContent = cur ? cur.code : "A";
  }

  function setScenario(id, silent) {
    ui.scenario = id;
    S = E.buildState(RAW, id);
    ui.askLog = [];
    renderScenarioMenu();
    renderAll();
    var sc = RAW.scenarios.filter(function (s) { return s.id === id; })[0];
    if (!silent && sc) toast("Kịch bản " + sc.code + " · " + sc.name, "");
  }

  /* ================================================================ RENDER */

  function renderAll() {
    $("#hdr-date").textContent = E.fmtDate(S.meta.simulated_now);
    $("#hdr-time").textContent = "Mốc mô phỏng " + E.fmtTime(S.meta.simulated_now);

    renderKPI();
    renderTodayAgenda();
    renderAlerts();
    renderReadiness();
    renderRadar();
    renderAgendaTab();
    renderEventsTab();
    renderActionsTab();
    renderCommsTab();
    if (ui.drawer) renderDrawer();
    animateRings($("#view-" + ui.tab));
    if (ui.firstPaint) { ui.firstPaint = false; }
  }

  /* ================================================================ SỰ KIỆN */

  function closeMenus(except) {
    ["#menu-scenario", "#menu-more"].forEach(function (sel) {
      if (sel !== except) {
        $(sel).hidden = true;
        var btn = sel === "#menu-scenario" ? $("#btn-scenario") : $("#btn-more");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function toggleMenu(sel, btn) {
    var open = $(sel).hidden;
    closeMenus(open ? sel : null);
    $(sel).hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function wire() {
    /* tab */
    $$("nav.tabs button[data-tab]").forEach(function (b) {
      b.onclick = function () { goTab(b.getAttribute("data-tab")); };
    });

    /* menu */
    $("#btn-scenario").onclick = function (e) { e.stopPropagation(); toggleMenu("#menu-scenario", this); };
    $("#btn-more").onclick = function (e) { e.stopPropagation(); toggleMenu("#menu-more", this); };
    document.addEventListener("click", function () { closeMenus(null); });
    $("#menu-scenario").onclick = function (e) { e.stopPropagation(); };
    $("#menu-more").onclick = function (e) { e.stopPropagation(); };

    $("#scenario-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-sc]");
      if (!b) return;
      closeMenus(null);
      setScenario(b.getAttribute("data-sc"));
    });

    /* brief + ask */
    $("#btn-brief").onclick = function () { openDrawer({ kind: "brief" }); };
    $("#btn-ask").onclick = function () { openDrawer({ kind: "ask" }); };

    /* tuỳ chọn */
    $("#btn-present").onclick = function () {
      ui.present = !ui.present;
      document.body.classList.toggle("present", ui.present);
      closeMenus(null);
      toast(ui.present ? "Đã bật chế độ trình chiếu" : "Đã tắt chế độ trình chiếu", "");
    };
    $("#btn-reset").onclick = function () {
      closeMenus(null);
      ui.actFilter = "all"; ui.actPrio = null; ui.actSort = "deadline"; ui.askLog = [];
      if (ui.drawer) closeDrawer();
      setScenario("normal", true);
      goTab("today");
      toast("Đã đưa bản mô phỏng về trạng thái ban đầu", "ok");
    };
    $("#btn-load").onclick = function () { closeMenus(null); $("#file-input").click(); };
    $("#file-input").onchange = function () {
      if (this.files && this.files[0]) loadFile(this.files[0]);
      this.value = "";
    };

    /* đóng drawer */
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeDrawer();
    });
    $("#scrim").onclick = closeDrawer;
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!$("#drawer").hidden) closeDrawer();
        else closeMenus(null);
      }
    });

    /* uỷ quyền click cho toàn bộ nội dung động */
    document.addEventListener("click", function (e) {
      var t;

      if ((t = e.target.closest("[data-ck]"))) { cycleChecklist(t.getAttribute("data-ck")); return; }
      if ((t = e.target.closest("[data-event]"))) { openDrawer({ kind: "event", id: t.getAttribute("data-event") }); return; }
      if ((t = e.target.closest("[data-agenda]"))) { openDrawer({ kind: "agenda", id: t.getAttribute("data-agenda") }); return; }
      if ((t = e.target.closest("[data-comm]"))) { openDrawer({ kind: "comm", id: t.getAttribute("data-comm") }); return; }
      if ((t = e.target.closest("[data-action]"))) { openDrawer({ kind: "action", id: t.getAttribute("data-action") }); return; }

      if ((t = e.target.closest("[data-alert]"))) {
        var al = E.kpi(S).alerts.filter(function (x) { return x.id === t.getAttribute("data-alert"); })[0];
        if (al) jump(al.action);
        return;
      }
      if ((t = e.target.closest("[data-actfilter]"))) {
        ui.actFilter = t.getAttribute("data-actfilter"); ui.actPrio = null;
        renderActionsTab(); goTab("actions"); return;
      }
      if ((t = e.target.closest("[data-f]"))) {
        ui.actFilter = t.getAttribute("data-f"); ui.actPrio = null;
        renderActionsTab(); return;
      }
      /* một ô ma trận = lọc theo cả mức ưu tiên lẫn dải thời hạn */
      if ((t = e.target.closest("[data-mx]"))) {
        var mxv = t.getAttribute("data-mx").split("|");
        if (ui.actFilter === mxv[0] && ui.actPrio === mxv[1]) {
          ui.actFilter = "all"; ui.actPrio = null;
        } else {
          ui.actFilter = mxv[0]; ui.actPrio = mxv[1];
        }
        renderActionsTab(); return;
      }
      if (e.target.closest("[data-mxclear]")) {
        ui.actFilter = "all"; ui.actPrio = null; renderActionsTab(); return;
      }
      if ((t = e.target.closest("[data-q]"))) { doAsk(t.getAttribute("data-q")); return; }
      if ((t = e.target.closest("[data-jump]"))) {
        try { jump(JSON.parse(t.getAttribute("data-jump"))); } catch (err) { /* bỏ qua */ }
        return;
      }
    });

    $("#act-sort").onchange = function () { ui.actSort = this.value; renderActionsTab(); };

    window.addEventListener("resize", debounce(function () {
      /* Lịch tính chiều cao một giờ theo bề rộng màn hình nên phải vẽ lại */
      renderAgendaTab();
      animateRings($("#view-" + ui.tab));
    }, 260));
  }

  /* Điều hướng từ một cảnh báo tới đúng nơi xử lý được nó */
  function jump(action) {
    if (!action) return;
    if (ui.drawer && (ui.drawer.kind === "ask" || ui.drawer.kind === "brief")) closeDrawer();
    if (action.filter) { ui.actFilter = action.filter; ui.actPrio = null; }
    if (action.tab) { renderActionsTab(); goTab(action.tab); }
    setTimeout(function () {
      /* Đánh dấu hạng mục cần soi TRƯỚC khi mở ngăn kéo, để nó được vẽ ngay
         trong lần dựng đầu tiên thay vì gắn thêm vào sau. */
      if (action.focus) flashRow(action.focus);
      if (action.event_id) openDrawer({ kind: "event", id: action.event_id });
      else if (action.comm_id) openDrawer({ kind: "comm", id: action.comm_id });
      if (action.focus) {
        setTimeout(function () {
          var row = $('[data-ck="' + action.focus + '"]');
          if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);
      }
    }, action.tab ? 180 : 0);
  }

  function debounce(fn, ms) {
    var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* ======================================================= NẠP DỮ LIỆU TỆP */

  function adoptData(data, label) {
    if (!data || !data.meta || !data.events) {
      toast("Tệp không đúng cấu trúc dữ liệu", "warn"); return;
    }
    if (!data.scenarios || !data.scenarios.length) {
      data.scenarios = [{ id: "normal", code: "A", name: "Ngày bình thường", desc: "Dữ liệu nạp từ tệp.", patch: {} }];
    }
    RAW = data;
    ui.scenario = data.scenarios[0].id;
    renderScenarioMenu();
    setScenario(ui.scenario, true);
    goTab("today");
    toast("Đã nạp dữ liệu từ " + label, "ok");
  }

  function loadFile(file) {
    var name = (file.name || "").toLowerCase();
    if (/\.json$/.test(name)) {
      var fr = new FileReader();
      fr.onload = function () {
        try { adoptData(JSON.parse(fr.result), file.name); }
        catch (err) { toast("Không đọc được JSON: " + err.message, "warn"); }
      };
      fr.readAsText(file, "utf-8");
      return;
    }
    if (/\.xlsx?$/.test(name)) {
      /* Trang này là một tệp duy nhất, không mang theo thư viện đọc Excel.
         Chuyển Excel bằng công cụ dòng lệnh rồi dựng lại trang. */
      toast("Tệp Excel: chạy lệnh node tools/excel-to-json.js <tệp>.xlsx --write", "warn");
      return;
    }
    toast("Trang chỉ nhận tệp .json", "warn");
  }

  /* ================================================================== BOOT */

  function boot(data) {
    RAW = data;
    S = E.buildState(RAW, ui.scenario);
    renderScenarioMenu();
    wire();
    renderAll();
    goTab("today");
  }

  function start() {
    /* Trang là một tệp duy nhất: dữ liệu nằm ngay trong tệp, không tải gì thêm,
       nên mở bằng file:// hay qua máy chủ đều chạy như nhau. */
    var embedded = window.OFFICE_DATA;
    if (!embedded) {
      document.body.innerHTML =
        '<div style="padding:40px;font:15px system-ui">Không nạp được dữ liệu. '
        + "Tệp index.html có thể đã bị cắt mất phần dữ liệu khi sao chép.</div>";
      return;
    }
    boot(embedded);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

})();
