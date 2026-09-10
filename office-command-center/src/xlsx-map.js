/* ============================================================================
   xlsx-map.js - quy tắc chuyển workbook Excel thành cấu trúc office_data

   Dùng chung cho hai nơi, để chỉ có một bộ quy tắc duy nhất:
     - trình duyệt: nút "Nạp dữ liệu từ tệp" trong ứng dụng;
     - dòng lệnh:  node tools/excel-to-json.js <file.xlsx>

   Tên sheet và tên cột xem README.md, mục "Cấu trúc Excel".
   Ngày giờ nên nhập dạng CHỮ (dd/mm/yyyy và HH:MM) để tránh việc Excel tự đảo
   ngày với tháng theo ngôn ngữ máy - lỗi hay gặp với file lập trên máy Việt.
   ============================================================================ */
(function (root) {
  "use strict";

  var M = {};

  function z(n) { n = String(n); return n.length < 2 ? "0" + n : n; }

  /* "5/9/2026" | "05-09-2026" | "2026-09-05" -> "2026-09-05" */
  function toDate(v) {
    v = String(v === null || v === undefined ? "" : v).trim();
    if (!v) return null;
    var m = v.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (m) return m[3] + "-" + z(m[2]) + "-" + z(m[1]);
    m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) return m[1] + "-" + z(m[2]) + "-" + z(m[3]);
    return v;
  }

  /* ngày + giờ -> "2026-09-05T15:00" ; thiếu giờ thì lấy 17:00 */
  function toDateTime(dv, tv) {
    var d = toDate(dv);
    if (!d) return null;
    var t = String(tv === null || tv === undefined ? "" : tv).trim().match(/^(\d{1,2})[:h](\d{2})/);
    return d + "T" + (t ? z(t[1]) + ":" + t[2] : "17:00");
  }

  function bool(v) { return /^(x|c[oó]|yes|y|true|1|đúng|dung)$/i.test(String(v).trim()); }
  function num(v, dflt) { var n = parseFloat(v); return isNaN(n) ? dflt : n; }
  function str(v) { return String(v === null || v === undefined ? "" : v).trim(); }

  M.toDate = toDate;
  M.toDateTime = toDateTime;

  /* XLSX: đối tượng thư viện SheetJS; wb: workbook đã đọc;
     baseMeta: phần meta mặc định (ngưỡng, danh mục hạng mục…) để giữ lại. */
  M.workbookToData = function (XLSX, wb, baseMeta) {
    function sheet(name) {
      var key = Object.keys(wb.Sheets).filter(function (k) {
        return k.trim().toUpperCase() === name;
      })[0];
      return key ? XLSX.utils.sheet_to_json(wb.Sheets[key], { defval: "", raw: false }) : [];
    }

    var data = {
      meta: JSON.parse(JSON.stringify(baseMeta || {})),
      owners: [], agenda: [], events: [], event_checklist: [],
      actions: [], communications: [], scenarios: []
    };

    sheet("META").slice(0, 1).forEach(function (r) {
      if (r.simulated_now) data.meta.simulated_now = toDateTime(r.simulated_now, r.simulated_time);
      if (r.data_notice) data.meta.data_notice = str(r.data_notice);
      if (r.app_title) data.meta.app_title = str(r.app_title);
      if (r.app_subtitle) data.meta.app_subtitle = str(r.app_subtitle);
    });

    sheet("AGENDA").forEach(function (r, i) {
      if (!str(r.title)) return;
      data.agenda.push({
        id: str(r.id) || "AG" + z(i + 1),
        date: toDate(r.date), time: str(r.time) || "08:00",
        duration: str(r.duration), title: str(r.title), location: str(r.location),
        type: str(r.type), leader: str(r.leader), owner: str(r.owner),
        important: str(r.important) === "" ? true : bool(r.important),
        event_id: str(r.event_id) || null,
        /* cột prep: "Chương trình:x | Thành phần:x | Briefing note:" */
        prep: str(r.prep).split("|").filter(function (p) { return p.trim(); })
          .map(function (p) {
            var bits = p.split(":");
            return { label: bits[0].trim(), done: bool(bits[1]) };
          })
      });
    });

    sheet("EVENTS").forEach(function (r, i) {
      if (!str(r.title)) return;
      data.events.push({
        id: str(r.id) || "EV" + z(i + 1), title: str(r.title), subtitle: str(r.subtitle),
        date: toDate(r.date), time: str(r.time) || "08:00", location: str(r.location),
        owner: str(r.owner), type: str(r.type), scale: str(r.scale)
      });
    });

    sheet("EVENT_CHECKLIST").forEach(function (r, i) {
      if (!str(r.label)) return;
      data.event_checklist.push({
        id: str(r.id) || "CK" + z(i + 1), event_id: str(r.event_id),
        cat: z(str(r.cat) || i + 1), label: str(r.label),
        status: (str(r.status) || "PENDING").toUpperCase().replace(/[\s-]+/g, "_"),
        owner: str(r.owner) || "-",
        deadline: str(r.deadline) ? toDateTime(r.deadline, r.deadline_time) : null,
        critical: bool(r.critical), weight: num(r.weight, 1), note: str(r.note)
      });
    });

    sheet("ACTIONS").forEach(function (r, i) {
      if (!str(r.title)) return;
      data.actions.push({
        id: str(r.id) || "ACT-" + z(i + 1), title: str(r.title),
        source_type: str(r.source_type), ref: str(r.ref) || null, ref_label: str(r.ref_label),
        owner: str(r.owner), assigned_date: toDate(r.assigned_date),
        deadline: toDateTime(r.deadline, r.deadline_time),
        status: (str(r.status) || "OPEN").toUpperCase().replace(/[\s-]+/g, "_"),
        priority: str(r.priority) || "Trung bình", note: str(r.note)
      });
    });

    sheet("COMMUNICATION").forEach(function (r, i) {
      if (!str(r.title)) return;
      data.communications.push({
        id: str(r.id) || "CM" + z(i + 1), title: str(r.title), channel: str(r.channel),
        stage: (str(r.stage) || "IDEA").toUpperCase(), owner: str(r.owner),
        due: toDateTime(r.due, r.due_time), source_approved: bool(r.source_approved),
        event_id: str(r.event_id) || null, next_action: str(r.next_action), note: str(r.note)
      });
    });

    /* Đầu mối lấy từ chính dữ liệu, không cần sheet riêng */
    var seen = {};
    [].concat(data.agenda, data.events, data.event_checklist, data.actions, data.communications)
      .forEach(function (x) {
        var o = x.owner;
        if (o && o !== "-" && !seen[o]) { seen[o] = true; data.owners.push({ id: "OW" + data.owners.length, name: o }); }
      });

    /* Không có sheet kịch bản: dựng một kịch bản mặc định để ứng dụng chạy */
    data.scenarios = [{
      id: "normal", code: "A", name: "Dữ liệu từ Excel",
      desc: "Bộ dữ liệu nạp từ tệp Excel. Chưa cấu hình kịch bản thay thế.",
      patch: {}
    }];

    return data;
  };

  root.OCC_XLSX = M;
  if (typeof module !== "undefined" && module.exports) module.exports = M;

})(typeof window !== "undefined" ? window : globalThis);
