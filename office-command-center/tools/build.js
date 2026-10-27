#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   build.js - gộp toàn bộ nguồn trong src/ thành MỘT tệp index.html duy nhất

   Kết quả là một tệp tự chứa: CSS, dữ liệu, phần tính toán, phần hiển thị,
   logo và ảnh nền giàn khoan đều nằm trong đó. Gửi đi một tệp là chạy được,
   không cần thư mục kèm theo, không cần mạng.

   Chạy:  node tools/build.js
   --------------------------------------------------------------------------- */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src");
const out = path.join(root, "index.html");

function read(p) { return fs.readFileSync(path.join(src, p), "utf8"); }

const shell = read("shell.html");
const css = read("app.css");
const data = read("office_data.js");
const engine = read("engine.js");
const app = read("app.js");
const logo = read("brand/logo.txt").trim();
const rig = read("brand/rig.txt").trim();

/* Thay bằng hàm để chuỗi thay thế không bị hiểu là ký hiệu đặc biệt của
   String.replace (dấu $ trong base64 chẳng hạn). */
function put(text, mark, value) {
  if (text.indexOf(mark) < 0) {
    console.error("Không tìm thấy chỗ chèn: " + mark);
    process.exit(1);
  }
  return text.split(mark).join(value);
}

let html = shell;
html = put(html, "__RIG__", rig);
html = put(html, "__LOGO__", logo);
html = put(html, "/*__CSS__*/", css);
html = put(html, "/*__DATA__*/", data);
html = put(html, "/*__ENGINE__*/", engine);
html = put(html, "/*__APP__*/", app);

/* Không được để sót thẻ đóng script bên trong chuỗi JS, sẽ cắt đứt trang */
if (/<\/script>/i.test(data + engine + app)) {
  console.error("Nguồn JS có chứa </script>, phải tách chuỗi đó ra trước khi gộp.");
  process.exit(1);
}

fs.writeFileSync(out, html, "utf8");

const kb = (n) => (n / 1024).toFixed(0) + " KB";
console.log("Đã ghi " + path.relative(root, out) + "  (" + kb(Buffer.byteLength(html, "utf8")) + ")");
console.log("  css " + kb(css.length) + " · dữ liệu " + kb(data.length) +
  " · engine " + kb(engine.length) + " · app " + kb(app.length) +
  " · logo " + kb(logo.length) + " · ảnh nền " + kb(rig.length));
console.log("Tệp này chạy độc lập: mở trực tiếp bằng trình duyệt, không cần thư mục kèm.");
