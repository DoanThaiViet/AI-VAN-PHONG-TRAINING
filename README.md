# AI Copilot cho Văn phòng PVEP

Bộ slide HTML cho buổi chia sẻ nội bộ với Văn phòng PVEP.
Đọc nhanh · Soạn đúng · Điều phối gọn · Truyền thông nhất quán.
Chạy offline: mở `index.html` bằng trình duyệt.

## Khung thời lượng

**01 ngày** - sáng 08:30-11:00, chiều 13:30-16:00.
Tỷ lệ: ~40% hướng dẫn · ~60% demo, trò chơi, thực hành.

43 slide, 04 chương. Điều hướng: `←` `→` chuyển slide, `Home`/`End` về đầu/cuối,
thanh mục lục bên trái để nhảy nhanh tới từng phần.

## Nội dung theo chương

| Chương | Nội dung |
|---|---|
| I - Mở đầu | Học gì · 06 nhóm nghiệp vụ Văn phòng · 07 món cầm về · kiểm tra 04 thứ · agenda |
| II - Nguyên tắc | 02 câu Mentimeter · **05 công cụ AI: bản đồ định vị, ma trận mạnh-yếu, việc nào gọi con nào** · luồng Nguồn → AI → Người kiểm → Phát hành · 04 việc AI làm tốt · 07 việc AI không được làm thay · **bảo mật: công cụ do cơ quan cấp vs AI công cộng + 03 vùng dữ liệu đỏ - vàng - xanh** · prompt 06 phần · trò chơi "Sếp giao gì vậy?" |
| III - Nghiệp vụ | Văn thư - thư ký (công văn → brief + tracker, briefing note, biên bản, metadata) · trò chơi "Săn lỗi biên bản" · rubric 05 tiêu chí · hành chính - hậu cần · truyền thông - đối ngoại · brandkit · cheat sheet (ma trận Harvey ball 07 nghiệp vụ) · LAB |
| IV - Cầm về | Thư viện 08 prompt · 06 sự cố hay gặp · 05 thói quen cần đổi · ước lượng thời gian · trò chơi "Được đưa AI hay không?" · KIT · Q&A · tổng kết |

## Khối tương tác (bấm được khi trình chiếu)

| Slide | Linh kiện | Thao tác |
|---|---|---|
| Kiểm tra 04 thứ | Thẻ preflight | Bấm từng thẻ để tích ✓, bộ đếm `n/4` chạy |
| Sếp giao gì vậy? | 06 thẻ lật | Bấm để lật, bộ đếm `n/6` chạy |
| Săn lỗi biên bản | Hotspot | Bấm dòng nghi ngờ → lộ lỗi, bộ đếm `n/3`, đủ 03 lỗi thì hiện thông điệp chốt |
| Bảng 05 tiêu chí | Rubric chấm điểm | Bấm chấm tròn để cho điểm → tổng và vòng gauge đổi màu, đổi kết luận |
| LAB tổng kết | Đồng hồ đếm ngược 35 phút | Bắt đầu / Tạm dừng / Đặt lại - vòng tròn đổi cam rồi đỏ khi sắp hết giờ |
| Thư viện prompt | Tab dọc | Bấm 01 trong 08 việc → prompt hiện ra; nút **Sao chép prompt** copy vào clipboard |
| 06 sự cố | Accordion | Bấm tiêu đề để mở/đóng |
| Ước lượng thời gian | Biểu đồ cột | Nút **Làm tay / Có AI** đổi số liệu; rê chuột lên thanh xem tooltip |
| Được đưa AI hay không? | 05 thẻ lật | Bấm từng thẻ để lật đáp án ĐƯỢC / KHÔNG |

Bàn phím: các hotspot và chấm rubric nhận `Tab` + `Enter`/`Space`.

## Cần chuẩn bị trước buổi

- Gửi email trước 03 ngày: học viên **mang theo 01 tài liệu thật** (công văn đến,
  ghi chú họp, kế hoạch đón đoàn) và đăng ký sẵn tài khoản trên nền tảng AI được
  PVEP cho phép.
- **Cập nhật câu hỏi trong Mentimeter backend** (deck chỉ nhúng khung trình chiếu):
  câu 1 "Anh/chị đang dùng AI cho việc gì?", câu 2 word cloud "Việc nào của Văn
  phòng đang làm anh/chị tốn thời gian nhất?", slide cuối bật chế độ Q&A ẩn danh.
- In **KIT** phát cuối buổi: thẻ Prompt 06 phần, 08 prompt Văn phòng, template
  Executive Brief, template Meeting Action Tracker, checklist đoàn khách/sự kiện,
  checklist AI Safety.
- Dựng thư mục chung để học viên nộp bài LAB.
- Slide "Săn lỗi biên bản" đã cài sẵn 03 lỗi; đáp án nằm ở cột phải, chỉ lộ khi bấm.

## Infographic chính trong deck

Không dùng bảng chữ. Mọi phần so sánh, phân loại đều dựng bằng SVG hoặc CSS:

| Slide | Đồ hoạ |
|---|---|
| 06 nhóm nghiệp vụ | Bánh xe 06 nan quanh hub "VĂN PHÒNG PVEP" (SVG) |
| 05 công cụ AI | Bản đồ định vị 2 trục: dài/ngắn × bám nguồn/tự do (SVG) |
| Mạnh - yếu công cụ | Ma trận Harvey ball 5 công cụ × 5 tiêu chí |
| Việc nào gọi con nào | Sơ đồ nối 07 việc Văn phòng với 05 công cụ, nét liền = chọn trước, nét đứt = dự phòng (SVG) |
| Ranh giới | Vạch đỏ "DỪNG": vùng AI bên trái, 07 việc của người bên phải |
| Mức tin cậy công cụ | 02 thẻ loại công cụ + ma trận 03 loại dữ liệu × 02 loại công cụ (✓ / ⚠ / ✕) |
| Dữ liệu ra ngoài | 03 vùng đỏ - vàng - xanh + 04 đường rò rỉ |
| Việc nào dùng AI thế nào | Ma trận Harvey ball 07 nghiệp vụ × 04 giai đoạn, cột cuối luôn khoá đỏ |
| AI tham gia đến đâu | Thanh mức độ + gauge 0 quyền quyết định |
| 05 đề LAB | Luồng nguồn → đầu ra |

## Điểm phải nói đúng khi trình bày phần bảo mật

Deck dạy ranh giới theo **công cụ**, không phải theo "AI hay không AI":

- **Công cụ do cơ quan cấp** (tài khoản công việc, gói doanh nghiệp đã ký điều khoản bảo mật - ví dụ Copilot trong Microsoft 365 của cơ quan): được đưa dữ liệu nội bộ trong phạm vi công việc được giao.
- **AI công cộng, tài khoản cá nhân**: coi như đưa ra ngoài, chỉ dùng dữ liệu công khai, đã ẩn danh hoặc dữ liệu mẫu.
- **Nói thẳng trên slide:** PVEP chưa ban hành hướng dẫn riêng về công cụ AI. Trong khi chờ, mặc định coi mọi công cụ là công cộng trừ khi tài khoản do đơn vị cấp và được xác nhận phạm vi sử dụng.

Nếu PVEP ban hành hướng dẫn chính thức, sửa lại 02 slide này trước khi trình bày.

## Nguyên tắc nội dung

Mọi tình huống trong deck là **mô phỏng**, không dùng hồ sơ thật và không nêu tên
cá nhân. Thông điệp xuyên suốt: AI làm bản nháp và xử lý thông tin; con người chịu
trách nhiệm về quyết định, tính đúng đắn, bảo mật và việc phát hành. Dữ liệu đưa
vào AI thực hiện theo quy định và nền tảng AI được PVEP cho phép.

## Tài nguyên

`index.html` tham chiếu các file sau trong `assets/`:

| File | Trạng thái |
|---|---|
| `offshore-motion.mp4` | ✅ có sẵn - video nền slide bìa |
| `offshore-still.jpg` | ảnh nền mờ từ slide 2 trở đi, và ảnh thay video khi in PDF |
| `menti-qr.png` | mã QR Mentimeter (02 slide khởi động + slide Q&A) |
| — | 03 infographic mới dựng bằng SVG nội tuyến, không cần file ảnh |
| `brandkit-pvep.png` | mở từ nút trên slide Brandkit |

Các file `assets/moda/`, `assets/7_nhom_rui_ro.png` và thư mục `handout/` là tài
nguyên của bản deck trước, hiện không còn được `index.html` tham chiếu - giữ lại
để tra cứu, xóa được nếu không cần.

## Hiển thị trên mọi màn hình

Deck tự thích ứng, không cần bản riêng cho từng thiết bị:

| Nhóm thiết bị | Cách deck xử lý |
|---|---|
| TV / màn hình lớn (2K, 4K, 21:9) | Toàn bộ slide được **phóng đồng loạt** tối đa 1,7 lần khi màn lớn hơn khung thiết kế 1920×1080, nên không còn khoảng trắng thừa; mọi slide phóng cùng một tỷ lệ để chuyển trang không nhảy cỡ chữ |
| Desktop · laptop (1366×768 → 4K) | Cỡ chữ tính theo `--su` = 1% bề rộng khung 16:9 lớn nhất lọt vào màn hình, nên co theo **cả chiều ngang lẫn chiều dọc**; slide nào nội dung dày thì tự thu vừa khung, không cắt chữ |
| Máy tính bảng nằm ngang · màn 4:3 | Như desktop, bộ auto-fit lo phần nội dung tràn |
| Điện thoại **nằm ngang** | Trang được dựng ở **khung ảo 1180px** rồi thu cả trang vừa bề ngang máy → giữ nguyên bố cục trình chiếu 2 cột thay vì bẻ thành một cột dài |
| Điện thoại · máy tính bảng **dựng đứng** | Chuyển sang **chế độ cuộn dọc**: slide cao tự nhiên, vuốt để chuyển, ẩn thanh mục lục bên trái |
| Máy có tai thỏ | Nội dung chừa `safe-area`, không bị khuyết góc khi xoay ngang |

Cơ chế: `--su` (thang chữ hai chiều) + bộ **auto-fit** trong JS đo từng slide rồi
áp `transform: scale()` — thu nhỏ khi tràn, phóng to khi dư chỗ. Thêm/sửa slide
không cần chỉnh gì thêm, bộ auto-fit tự đo lại khi đổi kích thước cửa sổ, xoay
máy, mở accordion hoặc ảnh tải xong.

## In PDF

Ctrl/Cmd + P → khổ **A4 ngang**, lề 0, bật *Background graphics*. Mỗi slide
xuống 01 trang. Bản in tự động: mở hết accordion, lộ sẵn đáp án các trò chơi
(dùng làm bản cho giảng viên), ẩn các nút bấm và tooltip.
