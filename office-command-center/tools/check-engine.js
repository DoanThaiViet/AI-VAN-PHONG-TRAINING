#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   check-engine.js - kiểm tra phần tính toán mà không cần mở trình duyệt.

   In ra các con số mà kịch bản demo dựa vào: điểm sẵn sàng từng sự kiện, 4 ô
   KPI, danh sách cảnh báo, và kết quả sau khi tick "Briefing note -> đã xong".
   Chạy lại mỗi khi sửa src/office_data.js để biết demo có còn khớp không.

   Chạy:  node tools/check-engine.js
   --------------------------------------------------------------------------- */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const win = {};
new Function("window", fs.readFileSync(path.join(root, "src", "office_data.js"), "utf8"))(win);
const OCC = require(path.join(root, "src", "engine.js"));

const RAW = win.OFFICE_DATA;
let failures = 0;

function expect(label, got, want) {
  const ok = String(got) === String(want);
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  SAI  ") + label + ": " + got + (ok ? "" : "  (mong đợi " + want + ")"));
}

function report(state, tag) {
  console.log("\n--- " + tag + " ---");
  state.events.forEach((e) => {
    const r = OCC.eventReadiness(state, e.id);
    console.log("  " + e.id + " " + e.title + " -> " + r.score + "% " + r.status +
      "  (xong " + r.doneCount + "/" + r.applicable + ", vướng " + r.blocked.length + ")");
  });
  const k = OCC.kpi(state);
  console.log("  KPI: hôm nay " + k.today + " · 72h " + k.soon + " hạng mục / " + k.soonActions +
    " đầu việc · chú ý " + k.attention + " · đỏ " + k.critical);
  k.alerts.forEach((a) => {
    console.log("    [" + a.severity + "] " + a.entity + " - " + a.issue + " (" + a.owner + ")");
  });
  const b = OCC.actionBuckets(state);
  console.log("  Đầu việc: đang mở " + b.open.length + " · quá hạn " + b.overdue.length +
    " · đến hạn <=72h " + b.soon.length + " · đúng tiến độ " + b.ontrack.length +
    " · đã xong " + b.done.length);
  return k;
}

/* ---- Kịch bản A: ngày bình thường ---- */
const s = OCC.buildState(RAW, "normal");
report(s, "Kịch bản A - Ngày bình thường");

console.log("\nKiểm tra các mốc mà kịch bản demo 90 giây dựa vào:");
expect("EV001 điểm sẵn sàng", OCC.eventReadiness(s, "EV001").score, 72);
expect("EV002 điểm sẵn sàng", OCC.eventReadiness(s, "EV002").score, 88);
expect("EV003 điểm sẵn sàng", OCC.eventReadiness(s, "EV003").score, 96);
expect("EV003 màu", OCC.eventReadiness(s, "EV003").status, "GREEN");
let k = OCC.kpi(s);
expect("KPI hôm nay", k.today, 3);
expect("KPI 72 giờ", k.soon, 5);
expect("KPI cần chú ý", k.attention, 4);
expect("KPI cảnh báo đỏ", k.critical, 1);
const bk = OCC.actionBuckets(s);
expect("Đầu việc đang mở", bk.open.length, 14);
expect("Đầu việc quá hạn", bk.overdue.length, 2);
expect("Đầu việc đến hạn <=72h", bk.soon.length, 4);
expect("Đầu việc đúng tiến độ", bk.ontrack.length, 8);

/* ---- Tick Briefing note -> DONE (bước 4 của kịch bản demo) ---- */
const item = s.event_checklist.find((c) => c.id === "CK-EV001-07");
item.status = "DONE";
console.log("\nSau khi tick \"" + item.label + "\" -> Đã xong:");
k = report(s, "Kịch bản A sau khi tick");
expect("EV001 điểm sẵn sàng mới", OCC.eventReadiness(s, "EV001").score, 84);
expect("Cảnh báo đỏ còn lại", k.critical, 0);
expect("KPI 72 giờ còn lại", k.soon, 4);

/* ---- Kịch bản B và C ---- */
const sb = OCC.buildState(RAW, "busy");
report(sb, "Kịch bản B - Ngày cao điểm");
const sc = OCC.buildState(RAW, "critical");
report(sc, "Kịch bản C - Sự cố sẵn sàng");
console.log("\nKiểm tra kịch bản C:");
expect("EV001 màu khi hạng mục then chốt bị vướng", OCC.eventReadiness(sc, "EV001").status, "RED");

/* ---- Brief và Ask ---- */
console.log("\n--- Brief buổi sáng (kịch bản A gốc) ---");
const s2 = OCC.buildState(RAW, "normal");
const brief = OCC.brief(s2);
console.log(brief.title + " · " + brief.date);
brief.sections.forEach((sec) => {
  console.log("\n" + sec.title);
  sec.lines.forEach((l) => console.log("  - " + l));
});

console.log("\n--- Ask Office AI ---");
OCC.quickPrompts.forEach((p) => {
  const a = OCC.ask(s2, p);
  console.log("\nHỏi: " + p);
  console.log("  " + a.title);
  a.lines.slice(0, 3).forEach((l) => console.log("    - " + l));
});
const outOfScope = OCC.ask(s2, "giá dầu brent hôm nay bao nhiêu");
console.log("\nHỏi ngoài phạm vi -> " + outOfScope.lines[0]);

console.log("\n" + (failures ? failures + " mục KHÔNG khớp." : "Tất cả các mốc đều khớp."));
process.exit(failures ? 1 : 0);
