#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   excel-to-json.js - chuyển tệp Excel của Văn phòng thành dữ liệu của ứng dụng

   Dùng thư viện SheetJS để sẵn trong tools/, không phải cài npm. Thư viện này
   chỉ dùng lúc dựng, không đi kèm vào tệp index.html gửi cho người khác.
   Quy tắc ánh xạ nằm ở src/xlsx-map.js.

   Chạy:
     node tools/excel-to-json.js <duong-dan.xlsx>
     node tools/excel-to-json.js <duong-dan.xlsx> --write

   Không có --write thì chỉ in thử ra màn hình, không đụng vào tệp dữ liệu.
   Có --write thì ghi đè src/office_data.js rồi dựng lại index.html.

   Cấu trúc sheet và tên cột: xem README.md, mục "Cấu trúc Excel".
   --------------------------------------------------------------------------- */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const src = args.filter((a) => !a.startsWith("--"))[0];
const write = args.includes("--write");

if (!src) {
  console.error("Thiếu đường dẫn tệp Excel.");
  console.error("  node tools/excel-to-json.js <duong-dan.xlsx> [--write]");
  process.exit(1);
}
if (!fs.existsSync(src)) {
  console.error("Không tìm thấy tệp: " + src);
  process.exit(1);
}

const XLSX = require(path.join(__dirname, "xlsx.full.min.js"));
const map = require(path.join(root, "src", "xlsx-map.js"));

/* Giữ lại phần meta hiện có (ngưỡng chấm điểm, danh mục 12 hạng mục) */
const win = {};
new Function("window", fs.readFileSync(path.join(root, "src", "office_data.js"), "utf8"))(win);
const baseMeta = win.OFFICE_DATA.meta;

/* Đọc qua fs rồi mới parse: trên thư mục OneDrive của máy này, trình đọc tệp
   của SheetJS có lúc không mở được đường dẫn. */
const wb = XLSX.read(fs.readFileSync(src), { type: "buffer" });
console.log("Sheet đọc được: " + wb.SheetNames.join(", "));

const data = map.workbookToData(XLSX, wb, baseMeta);

const counts = {
  agenda: data.agenda.length,
  events: data.events.length,
  event_checklist: data.event_checklist.length,
  actions: data.actions.length,
  communications: data.communications.length
};
console.log("Đã đọc: " + Object.keys(counts).map((k) => k + " " + counts[k]).join(" · "));

/* Vài kiểm tra để bắt lỗi nhập liệu trước khi ghi đè */
const problems = [];
const evIds = new Set(data.events.map((e) => e.id));
data.event_checklist.forEach((c) => {
  if (!evIds.has(c.event_id)) problems.push("Hạng mục " + c.id + " trỏ tới event_id không có: " + c.event_id);
  if (!["DONE", "PENDING", "BLOCKED", "NOT_APPLICABLE"].includes(c.status)) {
    problems.push("Hạng mục " + c.id + " có status lạ: " + c.status);
  }
});
data.actions.forEach((a) => {
  if (!["OPEN", "IN_PROGRESS", "DONE", "OVERDUE"].includes(a.status)) {
    problems.push("Đầu việc " + a.id + " có status lạ: " + a.status);
  }
  if (!a.deadline) problems.push("Đầu việc " + a.id + " thiếu hạn.");
});
data.communications.forEach((c) => {
  if (!["IDEA", "DRAFT", "REVIEW", "APPROVED", "PUBLISHED"].includes(c.stage)) {
    problems.push("Nội dung " + c.id + " có stage lạ: " + c.stage);
  }
});
if (!data.events.length) problems.push("Không đọc được sự kiện nào từ sheet EVENTS.");

if (problems.length) {
  console.log("\nCần xem lại " + problems.length + " điểm:");
  problems.slice(0, 20).forEach((p) => console.log("  - " + p));
  if (problems.length > 20) console.log("  … và " + (problems.length - 20) + " điểm nữa.");
}

if (!write) {
  console.log("\nMới chỉ đọc thử, chưa ghi gì. Thêm --write để ghi vào src/.");
  console.log(JSON.stringify(data, null, 2).slice(0, 1200) + "\n…");
  process.exit(problems.length ? 1 : 0);
}

const header =
  "/* Sinh tự động từ " + path.basename(src) + " bằng tools/excel-to-json.js.\n" +
  "   Sửa tay ở đây sẽ mất khi chạy lại lệnh đó. Sửa trong Excel rồi chuyển lại. */\n";

fs.writeFileSync(path.join(root, "src", "office_data.js"),
  header + "window.OFFICE_DATA = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
console.log("\nĐã ghi src/office_data.js.");

/* Dựng lại tệp một file luôn, để không quên bước này */
require("child_process").execFileSync(process.execPath,
  [path.join(__dirname, "build.js")], { stdio: "inherit" });
