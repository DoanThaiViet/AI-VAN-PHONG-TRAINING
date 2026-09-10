#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   make-excel-template.js - xuất bộ dữ liệu hiện tại ra một tệp Excel mẫu

   Để Văn phòng có sẵn một tệp đúng cấu trúc mà điền, thay vì tự dựng sheet và
   gõ tên cột. Tệp xuất ra nạp ngược lại được bằng tools/excel-to-json.js hoặc
   bằng nút "Nạp dữ liệu từ tệp" trong ứng dụng.

   Chạy:  node tools/make-excel-template.js
   Kết quả: tools/office_data_template.xlsx
   --------------------------------------------------------------------------- */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const XLSX = require(path.join(__dirname, "xlsx.full.min.js"));

const win = {};
new Function("window", fs.readFileSync(path.join(root, "src", "office_data.js"), "utf8"))(win);
const D = win.OFFICE_DATA;

/* Ngày giờ ghi ra dạng CHỮ để Excel không tự đảo ngày với tháng */
function d(iso) {
  if (!iso) return "";
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[3] + "/" + m[2] + "/" + m[1] : "";
}
function t(iso) {
  const m = String(iso || "").match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "";
}
const yn = (b) => (b ? "x" : "");

const sheets = {
  META: [{
    app_title: D.meta.app_title,
    app_subtitle: D.meta.app_subtitle,
    simulated_now: d(D.meta.simulated_now),
    simulated_time: t(D.meta.simulated_now),
    data_notice: D.meta.data_notice
  }],

  AGENDA: D.agenda.map((a) => ({
    id: a.id, date: d(a.date), time: a.time, duration: a.duration, title: a.title,
    location: a.location, type: a.type, leader: a.leader, owner: a.owner,
    important: yn(a.important), event_id: a.event_id || "",
    prep: (a.prep || []).map((p) => p.label + ":" + (p.done ? "x" : "")).join(" | ")
  })),

  EVENTS: D.events.map((e) => ({
    id: e.id, title: e.title, subtitle: e.subtitle, date: d(e.date), time: e.time,
    location: e.location, owner: e.owner, type: e.type, scale: e.scale
  })),

  EVENT_CHECKLIST: D.event_checklist.map((c) => ({
    id: c.id, event_id: c.event_id, cat: c.cat, label: c.label, status: c.status,
    owner: c.owner, deadline: d(c.deadline), deadline_time: t(c.deadline),
    critical: yn(c.critical), weight: c.weight, note: c.note
  })),

  ACTIONS: D.actions.map((a) => ({
    id: a.id, title: a.title, source_type: a.source_type, ref: a.ref || "",
    ref_label: a.ref_label, owner: a.owner, assigned_date: d(a.assigned_date),
    deadline: d(a.deadline), deadline_time: t(a.deadline),
    status: a.status, priority: a.priority, note: a.note
  })),

  COMMUNICATION: D.communications.map((c) => ({
    id: c.id, title: c.title, channel: c.channel, stage: c.stage, owner: c.owner,
    due: d(c.due), due_time: t(c.due), source_approved: yn(c.source_approved),
    event_id: c.event_id || "", next_action: c.next_action, note: c.note
  })),

  HUONG_DAN: [
    { muc: "Nguyên tắc", noi_dung: "Chỉ sửa nội dung trong các sheet có tên viết hoa. Không đổi tên sheet, không đổi tên cột ở dòng 1." },
    { muc: "Ngày", noi_dung: "Nhập dạng chữ dd/mm/yyyy, ví dụ 05/09/2026. Không để Excel tự nhận là ngày tháng." },
    { muc: "Giờ", noi_dung: "Cột time / deadline_time / due_time nhập HH:MM, ví dụ 15:00. Bỏ trống thì hiểu là 17:00." },
    { muc: "Ô đánh dấu", noi_dung: "Các cột important, critical, source_approved: gõ x nếu đúng, để trống nếu không." },
    { muc: "status hạng mục", noi_dung: "EVENT_CHECKLIST.status nhận: DONE, PENDING, BLOCKED, NOT_APPLICABLE." },
    { muc: "status đầu việc", noi_dung: "ACTIONS.status nhận: OPEN, IN_PROGRESS, DONE, OVERDUE." },
    { muc: "stage truyền thông", noi_dung: "COMMUNICATION.stage nhận: IDEA, DRAFT, REVIEW, APPROVED, PUBLISHED." },
    { muc: "weight", noi_dung: "Trọng số hạng mục khi tính mức sẵn sàng. Việc quan trọng để 3, việc nhẹ để 1." },
    { muc: "critical", noi_dung: "Hạng mục then chốt. Nếu đang vướng thì sự kiện không được coi là sẵn sàng dù phần trăm cao." },
    { muc: "prep", noi_dung: "Cột prep của AGENDA viết liền: Chương trình:x | Thành phần:x | Briefing note:" },
    { muc: "Nạp lại", noi_dung: "node tools/excel-to-json.js <tệp>.xlsx --write  hoặc dùng nút Nạp dữ liệu từ tệp trong ứng dụng." }
  ]
};

const wb = XLSX.utils.book_new();
Object.keys(sheets).forEach((name) => {
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sheets[name]), name);
});

const out = path.join(__dirname, "office_data_template.xlsx");
/* Ghi bằng fs thay cho XLSX.writeFile: trên thư mục OneDrive của máy này,
   trình ghi tệp của SheetJS bị chặn ("cannot save file"). */
fs.writeFileSync(out, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));

console.log("Đã ghi " + path.relative(root, out));
console.log("Sheet: " + Object.keys(sheets).join(", "));
