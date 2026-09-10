# PVEP OFFICE COMMAND CENTER

Điều hành hôm nay · Cảnh báo sớm · Theo dõi mức độ sẵn sàng

Bản demo phục vụ khoá đào tạo "AI Copilot cho Văn phòng PVEP". Đây là một ứng dụng chạy được, bấm được, đổi trạng thái được ngay trong lúc trình bày - không phải một trang infographic tĩnh.

> **TÌNH HUỐNG MÔ PHỎNG.** Toàn bộ lịch, đoàn khách, sự kiện, đầu việc và nội dung truyền thông trong bản demo do nhóm đào tạo dựng để minh hoạ. Đây không phải dữ liệu vận hành thật của PVEP. Không dùng tên cá nhân thật, chỉ dùng tên đầu mối theo chức năng (Đầu mối Hành chính, Đầu mối Truyền thông, Ban A, Ban B...).

---

## 1. Mở ứng dụng

Bấm đúp vào `index.html`. Xong.

**`index.html` là một tệp duy nhất, tự chứa mọi thứ**: giao diện, dữ liệu, phần tính toán, logo và ảnh nền đều nằm trong đó dưới dạng nhúng. Tệp nặng khoảng 524 KB. Chép riêng một mình tệp này sang máy khác, gửi qua thư điện tử, hay bỏ vào USB đều chạy nguyên vẹn - không cần thư mục kèm theo, không cần cài đặt, không cần máy chủ, không cần mạng.

Kiểm chứng: trong tệp chỉ có đúng 02 tham chiếu `src`/`href` và cả hai đều là dữ liệu nhúng (`data:`); không có `fetch`, không có địa chỉ `http://` nào.

Chạy trên Chrome và Edge. Hai thư mục `src/` và `tools/` chỉ dùng khi cần sửa rồi dựng lại (mục 5); muốn gọn thì xoá đi, `index.html` vẫn chạy.

---

## 2. Phạm vi - cái này KHÔNG phải hệ thống quản lý văn bản

Ứng dụng không có và sẽ không có: số công văn, văn bản đến, văn bản đi, luồng trình ký, hồ sơ văn bản. Văn phòng đã có hệ thống riêng cho việc đó.

Đây là lớp điều hành đặt bên trên: nhìn một màn hình để biết hôm nay việc gì đáng chú ý, việc nào sắp đến hạn, đoàn nào chưa sẵn sàng, đầu mối nào còn việc, và nên xử lý gì trước.

Nguyên tắc dựng màn hình: **chỉ hiện ngoại lệ, không hiện tất cả**. Mỗi cảnh báo đều có một nút dẫn thẳng tới chỗ xử lý được nó.

---

## 3. Năm khu vực

| | Khu vực | Trả lời câu hỏi |
|---|---|---|
| 01 | TODAY | Hôm nay có gì đáng chú ý? Việc gì phải xử lý trước? |
| 02 | LEADERSHIP AGENDA | Lịch Lãnh đạo hôm nay và 7 ngày tới, cuộc họp nào chưa chuẩn bị xong? |
| 03 | VISITS & EVENTS | Đoàn khách, hội nghị, chương trình công tác đã sẵn sàng tới đâu? |
| 04 | ACTION RADAR | Việc sau họp và việc cần đôn đốc: cái nào quá hạn, ai còn việc? |
| 05 | COMMUNICATION | Nội dung truyền thông đang ở bước nào, cái nào chờ duyệt? |

Màn hình TODAY vừa trong một khung nhìn ở 1366×768, không phải cuộn dọc khi trình chiếu. Các khu vực còn lại cuộn bình thường.

---

## 4. Thao tác trong lúc trình bày

**Tick hạng mục chuẩn bị.** Mở một sự kiện ở khu vực 03 (hoặc bấm thẳng vào một cảnh báo ở TODAY), rồi bấm vào một dòng hạng mục. Mỗi lần bấm chuyển trạng thái theo vòng: Đang chờ → Đã xong → Đang vướng → Đang chờ. Điểm sẵn sàng, các ô KPI, danh sách cảnh báo, Brief buổi sáng và câu trả lời của Ask Office AI đều tính lại ngay, không nạp lại trang.

**Đổi kịch bản.** Nút `Kịch bản: A` trên thanh tiêu đề:

- **A. Ngày bình thường** - công việc theo kế hoạch, 01 việc gấp và vài hạng mục chưa xong.
- **B. Ngày cao điểm** - thêm một lễ ký chen vào tuần, lịch Lãnh đạo dày hơn, nhiều đầu việc dồn hạn.
- **C. Sự cố sẵn sàng** - thủ tục nhập cảnh của đoàn bị vướng, phương tiện chưa xác nhận, thêm việc quá hạn. Dùng để cho thấy quy tắc "hạng mục then chốt bị vướng thì không được báo xanh".

**Reset demo** (menu `⋯`) đưa mọi thứ về đúng như lúc mở lần đầu: kịch bản A, mọi hạng mục về trạng thái gốc, xoá lịch sử hỏi đáp, bộ lọc về mặc định.

**Presentation mode** (menu `⋯`) ẩn bớt nút Reset và Nạp dữ liệu, giữ lại thanh khu vực, AI Brief, kịch bản, checklist và Ask Office AI, đồng thời tăng nhẹ cỡ chữ.

**Bàn phím.** `Esc` đóng ngăn kéo hoặc menu đang mở.

---

## 5. Sửa dữ liệu mẫu

`index.html` là tệp đã dựng, **không sửa trực tiếp vào đó**. Nguồn nằm trong `src/`:

| Tệp | Nội dung |
|---|---|
| `src/office_data.js` | dữ liệu mô phỏng |
| `src/app.css` | giao diện |
| `src/app.js` | phần hiển thị |
| `src/engine.js` | phần tính toán |
| `src/shell.html` | khung trang |
| `src/brand/` | logo và ảnh nền, dạng chuỗi nhúng |

Sửa xong thì dựng lại tệp một file:

```bash
node tools/build.js
```

Kiểm tra lại các con số mà kịch bản demo dựa vào:

```bash
node tools/check-engine.js
```

Lệnh in ra điểm sẵn sàng từng sự kiện, 4 ô KPI, danh sách cảnh báo, kết quả sau khi tick "Briefing note → Đã xong", cùng nội dung Brief và Ask. Nếu sửa dữ liệu làm lệch các mốc demo, lệnh báo `SAI` và thoát với mã lỗi.

Muốn thay cả bộ dữ liệu mà không dựng lại: menu `⋯` → **Nạp dữ liệu từ tệp**, chọn một tệp `.json` đúng cấu trúc. Tệp được đọc ngay trong trình duyệt, không tải lên đâu cả.

### Cấu trúc dữ liệu

| Khối | Nội dung | Khoá liên kết |
|---|---|---|
| `meta` | Tên ứng dụng, mốc thời gian mô phỏng, ngưỡng chấm điểm, danh mục 12 hạng mục | |
| `agenda[]` | Lịch Lãnh đạo, kèm `prep[]` là phần chuẩn bị trước cuộc họp | `event_id` → `events` |
| `events[]` | Đoàn khách, hội nghị, chương trình công tác | |
| `event_checklist[]` | Hạng mục chuẩn bị của từng sự kiện | `event_id` → `events` |
| `actions[]` | Việc sau họp và việc cần đôn đốc | `ref` → `events` hoặc `agenda` |
| `communications[]` | Nội dung truyền thông theo 5 bước | `event_id` → `events` |
| `scenarios[]` | Ba kịch bản demo, mỗi kịch bản là một bộ thay đổi đắp lên dữ liệu gốc | |

Kịch bản không chép lại toàn bộ dữ liệu. Mỗi kịch bản chỉ ghi phần khác biệt:

```js
patch: {
  checklist:   { "CK-EV001-05": { status: "BLOCKED", note: "..." } },  // sửa bản ghi có sẵn
  actions:     { "ACT-003": { status: "OVERDUE" } },
  events_add:  [ ... ],   // thêm bản ghi mới
  agenda_add:  [ ... ],
  actions_add: [ ... ],
  comms_add:   [ ... ],
  checklist_add: [ ... ]
}
```

Mốc thời gian mô phỏng là `meta.simulated_now` (`2026-09-04T08:15:00`). Mọi phép tính hạn, quá hạn, "trong 72 giờ" đều so với mốc này, nên bản demo cho ra cùng một kết quả bất kể chạy ngày nào.

---

## 5b. Nhận diện thương hiệu

Bộ màu, phông chữ, kiểu header và kiểu thẻ lấy nguyên từ dashboard **KSV Sông Hồng (PVEP SH)** để hai bản nhìn như cùng một bộ:

| | Giá trị |
|---|---|
| Header | nền chuyển sắc `#00843d → #006838 → #0a5a52 → #262d7a`, viền dưới `#00a651`, ảnh giàn khoan mờ bên phải |
| Xanh lá | `--green #006838` · `--teal #00843d` · nhấn `#00a651` |
| Xanh tím than | `--navy #23286b` · `--blue #2e3192` · nền nhạt `#e9e6f7` |
| Đèn trạng thái | đỏ `#d8584e` · vàng `#E0982A` · xám `#94a3b8` |
| Nền và chữ | nền `#eef3f1` · chữ `#16203a` · chữ phụ `#5b6577` · viền `#e4e8ef` |
| Phông | Segoe UI |
| Thẻ | trắng, bo 14px, viền mảnh, đổ bóng nhẹ; thẻ KPI bo 16px, có vạch chuyển sắc trên đỉnh và số cũng đổ màu chuyển sắc |

Logo PVEP dùng đúng tệp của bản Sông Hồng. Khác một điểm: ở đây logo được bọc trong khối trắng bo góc. Logo PVEP là chữ màu sẫm trên nền trong suốt, đặt thẳng lên header xanh đậm thì bị chìm.

---

## 6. Điểm sẵn sàng tính thế nào

Gọi là **demo readiness score** - chỉ số dựng cho bản demo, không phải chỉ số chính thức của Văn phòng.

```
điểm = tổng trọng số hạng mục đã xong / tổng trọng số hạng mục có áp dụng
```

Hạng mục `NOT_APPLICABLE` bị loại khỏi cả tử số và mẫu số. Hạng mục `BLOCKED` và `PENDING` tính 0.

Mỗi hạng mục có `weight` (1 đến 3) và cờ `critical`. Quy tắc màu, xét theo thứ tự:

1. Có hạng mục **then chốt đang vướng** → **ĐỎ**, bất kể phần trăm là bao nhiêu.
2. Có hạng mục then chốt đã quá hạn mà chưa xong → **ĐỎ**.
3. Còn hạng mục đang vướng (không then chốt) → **VÀNG**.
4. Từ 95% trở lên: **XANH**, trừ khi vẫn còn hạng mục then chốt chưa xong thì trần là **VÀNG**.
5. Từ 70% đến 94% → **VÀNG**. Dưới 70% → **ĐỎ**.

Đây chính là điều kiện đề bài đặt ra: 92% mà Visa đang vướng thì vẫn không được báo xanh. Kịch bản C dựng ra đúng tình huống đó.

Cảnh báo ở khối "Cần chú ý" sinh theo ngưỡng trong `meta.thresholds`: hạng mục then chốt còn dưới 4 giờ là đỏ, dưới 48 giờ là vàng; hạng mục thường dưới 24 giờ là vàng; hạng mục đang vướng theo cờ then chốt; các đầu việc quá hạn gộp thành một dòng dẫn sang khu vực 04.

---

## 7. Phần AI trong bản demo

**Hiện tại là quy tắc, không phải mô hình ngôn ngữ.** Không gọi OpenAI, Claude, Gemini hay bất kỳ dịch vụ nào. Không gửi dữ liệu ra khỏi máy. Không telemetry, không analytics.

**AI Brief buổi sáng** đọc trạng thái đang hiển thị rồi ghép thành 4 phần: hôm nay, cần chú ý, ưu tiên trước mốc giờ gần nhất, đầu mối còn việc. Tick một hạng mục xong rồi mở lại Brief thì nội dung đổi theo - không có đoạn chữ nào viết cứng.

**Ask Office AI** đối chiếu từ khoá trên câu hỏi rồi dựng câu trả lời từ dữ liệu. Câu hỏi không chạm tới khái niệm nào trong phạm vi (agenda, sự kiện, đầu việc, truyền thông) sẽ nhận câu trả lời "ngoài phạm vi bản demo" thay vì bịa.

**Nối API thật sau này.** Hai hàm cần thay nằm trong `src/engine.js`:

- `OCC.briefContext(state)` đã gom sẵn toàn bộ ngữ cảnh (KPI, sự kiện, đầu việc, cảnh báo, đầu mối) thành một đối tượng. Giữ nguyên hàm này, gửi đối tượng đó sang mô hình thay cho phần ghép chuỗi ở `OCC.brief(state)`.
- `OCC.ask(state, query)` thay bằng lời gọi mô hình, truyền cùng ngữ cảnh của `briefContext` làm dữ liệu nền.

Phần hiển thị ở `src/app.js` nhận vào cùng một hình dạng dữ liệu (`{title, lines[], jump}`), nên không phải sửa gì thêm.

---

## 8. Đưa dữ liệu từ Excel

Bước này không bắt buộc. Ứng dụng chạy đầy đủ mà không cần Excel.

Lấy tệp mẫu đúng cấu trúc, dựng từ chính bộ dữ liệu đang có:

```bash
node tools/make-excel-template.js
```

Kết quả: `tools/office_data_template.xlsx`, gồm các sheet `META`, `AGENDA`, `EVENTS`, `EVENT_CHECKLIST`, `ACTIONS`, `COMMUNICATION` và một sheet `HUONG_DAN`.

Điền xong thì chuyển ngược lại:

```bash
node tools/excel-to-json.js duong-dan-tep.xlsx           # chỉ đọc thử và soát lỗi
node tools/excel-to-json.js duong-dan-tep.xlsx --write   # ghi vào data/
```

Không có `--write` thì lệnh chỉ đọc, đếm số dòng, soát lỗi nhập liệu (trạng thái lạ, thiếu hạn, hạng mục trỏ tới sự kiện không tồn tại) và in thử, không đụng vào dữ liệu.

Lệnh `--write` ghi vào `src/office_data.js` rồi tự chạy `tools/build.js`, nên `index.html` cập nhật luôn.

Thư viện đọc Excel (SheetJS) nằm ở `tools/xlsx.full.min.js`, **chỉ dùng lúc dựng**, không đi kèm vào `index.html` - nhờ vậy tệp gửi đi vẫn gọn. Trong trình duyệt, nút "Nạp dữ liệu từ tệp" chỉ nhận `.json`; muốn nạp Excel thì dùng lệnh trên.

### Cấu trúc Excel

Không đổi tên sheet, không đổi tên cột ở dòng 1.

| Sheet | Cột |
|---|---|
| `META` | `app_title`, `app_subtitle`, `simulated_now`, `simulated_time`, `data_notice` |
| `AGENDA` | `id`, `date`, `time`, `duration`, `title`, `location`, `type`, `leader`, `owner`, `important`, `event_id`, `prep` |
| `EVENTS` | `id`, `title`, `subtitle`, `date`, `time`, `location`, `owner`, `type`, `scale` |
| `EVENT_CHECKLIST` | `id`, `event_id`, `cat`, `label`, `status`, `owner`, `deadline`, `deadline_time`, `critical`, `weight`, `note` |
| `ACTIONS` | `id`, `title`, `source_type`, `ref`, `ref_label`, `owner`, `assigned_date`, `deadline`, `deadline_time`, `status`, `priority`, `note` |
| `COMMUNICATION` | `id`, `title`, `channel`, `stage`, `owner`, `due`, `due_time`, `source_approved`, `event_id`, `next_action`, `note` |

Quy ước nhập liệu:

- **Ngày** nhập dạng chữ `dd/mm/yyyy`, ví dụ `05/09/2026`. Đừng để Excel tự nhận là kiểu ngày tháng - tệp lập trên máy cài tiếng Việt hay bị Excel lưu tráo ngày với tháng, và lỗi đó chỉ lộ ra khi ngày nhỏ hơn 13.
- **Giờ** nhập `HH:MM`, ví dụ `15:00`. Bỏ trống thì hiểu là `17:00`.
- **Ô đánh dấu** (`important`, `critical`, `source_approved`): gõ `x` nếu đúng, để trống nếu không.
- `EVENT_CHECKLIST.status`: `DONE`, `PENDING`, `BLOCKED`, `NOT_APPLICABLE`.
- `ACTIONS.status`: `OPEN`, `IN_PROGRESS`, `DONE`, `OVERDUE`.
- `COMMUNICATION.stage`: `IDEA`, `DRAFT`, `REVIEW`, `APPROVED`, `PUBLISHED`.
- Cột `prep` của `AGENDA` viết liền trong một ô: `Chương trình:x | Thành phần:x | Briefing note:`
- Tệp Excel không có sheet kịch bản. Nạp từ Excel thì ứng dụng chỉ có một kịch bản duy nhất; muốn giữ cả ba thì sửa trực tiếp trong `src/office_data.js`.

---

## 9. Cấu trúc thư mục

```
office-command-center/
├─ index.html                     ⭐ TỆP CHẠY - tự chứa, gửi riêng tệp này là đủ
├─ README.md
├─ src/                           nguồn để sửa rồi dựng lại
│  ├─ shell.html                  khung trang
│  ├─ app.css                     toàn bộ giao diện
│  ├─ app.js                      lớp hiển thị: dựng DOM, bắt sự kiện, vẽ lại
│  ├─ engine.js                   lớp tính toán: điểm sẵn sàng, cảnh báo, KPI, Brief, Ask
│  ├─ office_data.js              dữ liệu mô phỏng
│  ├─ xlsx-map.js                 quy tắc Excel → dữ liệu
│  └─ brand/                      logo.txt và rig.txt, ảnh dạng chuỗi nhúng
└─ tools/
   ├─ build.js                    gộp src/ → index.html
   ├─ check-engine.js             kiểm tra các mốc số liệu của kịch bản demo
   ├─ excel-to-json.js            Excel → dữ liệu, rồi dựng lại
   ├─ make-excel-template.js      dữ liệu hiện tại → tệp Excel mẫu
   └─ xlsx.full.min.js            SheetJS, chỉ dùng lúc dựng
```

`engine.js` và `xlsx-map.js` chạy được ở cả trình duyệt lẫn Node, nên phần tính toán kiểm tra được bằng dòng lệnh mà không cần mở trình duyệt.

---

## 10. Kịch bản demo 90 giây

| | Thao tác | Nói gì |
|---|---|---|
| 1 | Mở **TODAY** | "Văn phòng không cần nhìn toàn bộ dữ liệu. Chỉ cần biết cái gì đang cần chú ý." Bốn ô trên cùng: 03 lịch quan trọng, 05 hạng mục đến hạn trong 72 giờ, 04 việc cần chú ý, 01 cảnh báo đỏ. |
| 2 | Bấm **Đoàn đối tác quốc tế - 72%** ở khối Mức độ sẵn sàng | Ngăn kéo mở ra toàn bộ 12 nhóm hạng mục chuẩn bị. |
| 3 | Chỉ vào ba dòng chưa xong | Phương tiện đưa đón, Briefing note, Đưa tin và hình ảnh. Briefing note gắn nhãn THEN CHỐT, hạn 11:00 sáng nay. |
| 4 | Bấm dòng **Briefing note cho Lãnh đạo** | Chuyển sang Đã xong. |
| 5 | Chỉ vào các con số | 72% lên 84%. Cảnh báo đỏ biến mất khỏi khối Cần chú ý. Ô CRITICAL về 00, ô NEXT 72H từ 05 xuống 04. Không nạp lại trang. |
| 6 | Bấm **✦ AI BRIEF BUỔI SÁNG** | Brief đã viết theo trạng thái mới: không còn việc đỏ, sự kiện thấp nhất giờ là 84%. |
| 7 | Bấm **✦ Ask Office AI** → "Việc gì cần xử lý hôm nay?" | Câu trả lời cũng dựng từ trạng thái vừa đổi. |

Muốn diễn tình huống căng hơn: đổi sang **Kịch bản C** ở bước 1. Thủ tục nhập cảnh chuyển sang Đang vướng, sự kiện tụt xuống 60% và chuyển đỏ - minh hoạ cho quy tắc hạng mục then chốt.

Chạy xong nhớ bấm **Reset demo** trước lượt trình bày kế tiếp.

---

## 11. Đã kiểm tra những gì

- Chrome và Edge, ở 1920×1080, 1600×900, 1440×900, 1366×768 và 375×812.
- Không có lỗi trong console, không cuộn ngang ở bất kỳ độ phân giải nào.
- Màn hình TODAY vừa một khung nhìn ở 1366×768, khung nội dung trải hết chiều ngang màn hình.
- Trên điện thoại: thanh điều hướng chuyển xuống đáy màn hình, các bảng xếp thành thẻ dọc, vùng chạm đủ lớn, không đè vào tai thỏ.
- Chuyển khu vực, ngăn kéo, bộ lọc, sắp xếp, tick hạng mục, đổi kịch bản, reset, chế độ trình chiếu, `Esc`.
- Không còn chữ nào tràn khỏi khung: quét từng phần tử ở cả 05 khu vực và cả 03 loại ngăn kéo (chi tiết sự kiện, AI Brief, Ask Office AI), ở 1920×1080, 1366×768 và 375×812.
- Vòng Excel: xuất tệp mẫu rồi nạp ngược lại cho ra đúng các con số ban đầu (`node tools/check-engine.js`).
- `index.html` không tham chiếu ra ngoài: chỉ 02 `src`/`href` và cả hai đều là dữ liệu nhúng.

---

## 12. Nếu triển khai thật thì còn thiếu gì

Bản demo cố ý dừng ở mức trình diễn. Muốn dùng thật cần thêm:

1. **Nguồn dữ liệu sống.** Lịch Lãnh đạo nên lấy từ Exchange/Outlook thay vì gõ tay. Đầu việc và hạng mục chuẩn bị cần một nơi lưu chung để nhiều người cùng cập nhật - hiện mọi thao tác chỉ nằm trong bộ nhớ trình duyệt và mất khi đóng trang.
2. **Ghi nhận người thao tác.** Cần biết ai tick hạng mục nào, lúc nào, để phần đôn đốc có căn cứ. Kèm theo đó là đăng nhập và phân quyền theo Ban.
3. **Nhắc việc.** Cảnh báo hiện chỉ hiện trên màn hình. Thực tế cần đẩy ra thư điện tử hoặc tin nhắn cho đúng đầu mối trước hạn.
4. **Chốt lại bộ chỉ số.** Trọng số và ngưỡng màu trong bản demo do nhóm đào tạo đặt để minh hoạ. Muốn dùng thật thì Văn phòng phải tự thống nhất: hạng mục nào là then chốt, bao nhiêu phần trăm thì coi là sẵn sàng.
5. **Nối AI thật.** Xem mục 7. Kèm theo là quyết định về dữ liệu: gửi gì ra ngoài, hay chạy mô hình trong mạng nội bộ.
6. **Đối chiếu với hệ thống hiện có.** Rà lại để không trùng lặp với hệ thống quản lý văn bản và các công cụ Văn phòng đang dùng.
7. **Lưu vết và sao lưu.** Nhật ký thay đổi, khôi phục khi nhập nhầm.
