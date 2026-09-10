/* ============================================================================
   TRUNG TÂM ĐIỀU HÀNH VĂN PHÒNG PVEP - DỮ LIỆU MÔ PHỎNG
   ----------------------------------------------------------------------------
   TÌNH HUỐNG MÔ PHỎNG. Toàn bộ số liệu, tên đoàn, tên sự kiện và đầu mối trong
   file này do nhóm đào tạo dựng để minh hoạ. Đây KHÔNG phải dữ liệu vận hành
   thật của PVEP và không dùng tên cá nhân thật.

   File này là NGUỒN DỮ LIỆU CHÍNH của ứng dụng (chạy được khi mở trực tiếp
   index.html bằng trình duyệt, không cần server). Bản `office_data.json` cạnh
   bên là bản sao dạng JSON thuần, sinh ra bằng `node tools/build-data.js`.
   Sửa file .js này trước, rồi chạy lệnh đó để đồng bộ bản .json.
   ============================================================================ */
window.OFFICE_DATA = {

  meta: {
    app_title: "TRUNG TÂM ĐIỀU HÀNH VĂN PHÒNG PVEP",
    app_subtitle: "Điều hành Văn phòng · Tình huống mô phỏng · Đoàn Thái Việt xây dựng",
    /* Mốc thời gian mô phỏng. Mọi phép tính hạn, quá hạn, 72 giờ đều so với mốc
       này để bản mô phỏng luôn ra cùng một kết quả, không phụ thuộc ngày chạy thật. */
    simulated_now: "2026-09-04T08:15:00",
    data_notice: "Dữ liệu mô phỏng phục vụ đào tạo. Không phải dữ liệu vận hành thật.",
    version: "1.0",

    /* Ngưỡng chấm mức độ sẵn sàng của bản mô phỏng */
    thresholds: {
      green_min: 95,          // >= 95% và không vướng hạng mục then chốt -> XANH
      amber_min: 70,          // 70-94% -> VÀNG
      critical_red_hours: 4,  // hạng mục then chốt còn <= 4 giờ mà chưa xong -> ĐỎ
      critical_amber_hours: 48,
      normal_amber_hours: 24,
      soon_hours: 72
    },

    /* 12 nhóm hạng mục chuẩn bị. Không phải sự kiện nào cũng dùng đủ 12. */
    checklist_catalog: [
      { cat: "01", label: "Chương trình" },
      { cat: "02", label: "Thành phần" },
      { cat: "03", label: "Phòng họp / Hội trường" },
      { cat: "04", label: "Phương tiện" },
      { cat: "05", label: "Thủ tục nhập cảnh" },
      { cat: "06", label: "Phiên dịch" },
      { cat: "07", label: "Tài liệu tóm tắt" },
      { cat: "08", label: "Tài liệu" },
      { cat: "09", label: "Quà tặng" },
      { cat: "10", label: "Truyền thông" },
      { cat: "11", label: "Ăn uống" },
      { cat: "12", label: "Phương án dự phòng" }
    ]
  },

  /* Đầu mối - dùng chức danh công việc, không dùng tên cá nhân */
  owners: [
    { id: "OW1", name: "Đầu mối Hành chính" },
    { id: "OW2", name: "Đầu mối Lễ tân - Đối ngoại" },
    { id: "OW3", name: "Đầu mối Truyền thông" },
    { id: "OW4", name: "Đầu mối Hậu cần - Xe" },
    { id: "OW5", name: "Đầu mối Thư ký Lãnh đạo" },
    { id: "OW6", name: "Ban A" },
    { id: "OW7", name: "Ban B" }
  ],

  /* ------------------------------------------------------------------ AGENDA */
  agenda: [
    {
      id: "AG001", date: "2026-09-04", time: "09:00", duration: "90 phút",
      title: "Họp giao ban Ban Tổng Giám đốc",
      location: "Phòng họp A, tầng 12", type: "Giao ban",
      leader: "Ban Tổng Giám đốc", owner: "Đầu mối Thư ký Lãnh đạo",
      important: true, event_id: null,
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu tóm tắt", done: true },
        { label: "Tài liệu họp", done: true },
        { label: "Nội dung phát biểu", done: true }
      ]
    },
    {
      id: "AG002", date: "2026-09-04", time: "10:30", duration: "60 phút",
      title: "Rà soát công tác chuẩn bị tiếp đoàn đối tác quốc tế",
      location: "Phòng họp B, tầng 12", type: "Chuẩn bị sự kiện",
      leader: "Lãnh đạo Văn phòng", owner: "Đầu mối Lễ tân - Đối ngoại",
      important: true, event_id: "EV001",
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu tóm tắt", done: false },
        { label: "Tài liệu họp", done: true },
        { label: "Nội dung phát biểu", done: false }
      ]
    },
    {
      id: "AG003", date: "2026-09-04", time: "14:00", duration: "90 phút",
      title: "Họp chuẩn bị Hội nghị sơ kết 9 tháng",
      location: "Hội trường tầng 3", type: "Chuẩn bị sự kiện",
      leader: "Lãnh đạo Văn phòng", owner: "Đầu mối Hành chính",
      important: true, event_id: "EV002",
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu tóm tắt", done: true },
        { label: "Tài liệu họp", done: true },
        { label: "Nội dung phát biểu", done: true }
      ]
    },
    {
      id: "AG004", date: "2026-09-05", time: "10:30", duration: "120 phút",
      title: "Tiếp đoàn đối tác quốc tế",
      location: "Phòng khánh tiết, tầng 12", type: "Tiếp khách",
      leader: "Ban Tổng Giám đốc", owner: "Đầu mối Lễ tân - Đối ngoại",
      important: true, event_id: "EV001",
      prep: [
        { label: "Chương trình tiếp đoàn", done: true },
        { label: "Thành phần dự", done: true },
        { label: "Phòng khánh tiết", done: true },
        { label: "Tài liệu tóm tắt", done: false },
        { label: "Tài liệu làm việc", done: true },
        { label: "Nội dung phát biểu", done: false }
      ]
    },
    {
      id: "AG005", date: "2026-09-05", time: "15:00", duration: "60 phút",
      title: "Họp Hội đồng Thi đua - Khen thưởng",
      location: "Phòng họp A, tầng 12", type: "Họp Hội đồng",
      leader: "Lãnh đạo Tổng công ty", owner: "Đầu mối Hành chính",
      important: false, event_id: null,
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu họp", done: true }
      ]
    },
    {
      id: "AG006", date: "2026-09-07", time: "08:30", duration: "60 phút",
      title: "Giao ban đầu tuần",
      location: "Phòng họp A, tầng 12", type: "Giao ban",
      leader: "Ban Tổng Giám đốc", owner: "Đầu mối Thư ký Lãnh đạo",
      important: true, event_id: null,
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu họp", done: false }
      ]
    },
    {
      id: "AG007", date: "2026-09-08", time: "08:00", duration: "240 phút",
      title: "Hội nghị sơ kết 9 tháng",
      location: "Hội trường tầng 3", type: "Hội nghị",
      leader: "Ban Tổng Giám đốc", owner: "Đầu mối Hành chính",
      important: true, event_id: "EV002",
      prep: [
        { label: "Chương trình hội nghị", done: true },
        { label: "Danh sách đại biểu", done: false },
        { label: "Hội trường và khánh tiết", done: true },
        { label: "Kịch bản điều hành", done: true },
        { label: "Tài liệu hội nghị", done: true },
        { label: "Nội dung phát biểu", done: true }
      ]
    },
    {
      id: "AG008", date: "2026-09-09", time: "14:00", duration: "90 phút",
      title: "Họp rà soát tiến độ sửa chữa trụ sở",
      location: "Phòng họp B, tầng 12", type: "Họp chuyên đề",
      leader: "Lãnh đạo Văn phòng", owner: "Ban B",
      important: false, event_id: null,
      prep: [
        { label: "Chương trình họp", done: true },
        { label: "Thành phần dự họp", done: true },
        { label: "Phòng họp và thiết bị", done: true },
        { label: "Tài liệu họp", done: true }
      ]
    },
    {
      id: "AG009", date: "2026-09-10", time: "07:00", duration: "Cả ngày",
      title: "Khởi hành chương trình công tác Hạ Long",
      location: "Sảnh tầng 1", type: "Công tác",
      leader: "Ban Tổng Giám đốc", owner: "Đầu mối Hậu cần - Xe",
      important: true, event_id: "EV003",
      prep: [
        { label: "Chương trình công tác", done: true },
        { label: "Thành phần đoàn", done: true },
        { label: "Phương tiện", done: true },
        { label: "Tài liệu tóm tắt", done: true },
        { label: "Tài liệu", done: true },
        { label: "Lưu trú", done: true }
      ]
    }
  ],

  /* ------------------------------------------------------------------ EVENTS */
  events: [
    {
      id: "EV001",
      title: "Đoàn đối tác quốc tế",
      subtitle: "Tiếp và làm việc với đoàn đối tác nước ngoài",
      date: "2026-09-05", time: "10:30",
      location: "Phòng khánh tiết, tầng 12",
      owner: "Đầu mối Lễ tân - Đối ngoại",
      type: "Đoàn khách quốc tế",
      scale: "12 khách · 08 thành phần dự"
    },
    {
      id: "EV002",
      title: "Hội nghị sơ kết 9 tháng",
      subtitle: "Hội nghị sơ kết công tác 9 tháng đầu năm 2026",
      date: "2026-09-08", time: "08:00",
      location: "Hội trường tầng 3",
      owner: "Đầu mối Hành chính",
      type: "Hội nghị nội bộ",
      scale: "180 đại biểu · 14 đơn vị"
    },
    {
      id: "EV003",
      title: "Chương trình công tác Hạ Long",
      subtitle: "Chương trình công tác của Lãnh đạo tại đơn vị khu vực phía Bắc",
      date: "2026-09-10", time: "07:00",
      location: "Hạ Long, Quảng Ninh",
      owner: "Đầu mối Hậu cần - Xe",
      type: "Đoàn công tác",
      scale: "09 thành viên · 02 ngày"
    }
  ],

  /* -------------------------------------------------------- EVENT_CHECKLIST */
  /* status: DONE | PENDING | BLOCKED | NOT_APPLICABLE
     critical: hạng mục then chốt - nếu BLOCKED thì sự kiện không được XANH
     weight:  trọng số khi tính điểm sẵn sàng                                  */
  event_checklist: [
    /* --- EV001 - Đoàn đối tác quốc tế: 18/25 = 72% --- */
    { id: "CK-EV001-01", event_id: "EV001", cat: "01", label: "Chương trình tiếp đoàn", status: "DONE", owner: "Đầu mối Lễ tân - Đối ngoại", deadline: "2026-09-03T17:00", critical: true, weight: 3, note: "Đã thống nhất với đoàn qua thư điện tử." },
    { id: "CK-EV001-02", event_id: "EV001", cat: "02", label: "Thành phần dự tiếp", status: "DONE", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-03T17:00", critical: true, weight: 3, note: "08 thành phần, đã xác nhận đủ." },
    { id: "CK-EV001-03", event_id: "EV001", cat: "03", label: "Phòng khánh tiết và thiết bị", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-04T17:00", critical: false, weight: 2, note: "Đã đặt phòng, kiểm tra âm thanh chiều 04/9." },
    { id: "CK-EV001-04", event_id: "EV001", cat: "04", label: "Phương tiện đưa đón", status: "PENDING", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-04T15:00", critical: false, weight: 2, note: "Chờ đơn vị vận tải xác nhận 02 xe đưa đón từ khách sạn." },
    { id: "CK-EV001-05", event_id: "EV001", cat: "05", label: "Thủ tục nhập cảnh cho đoàn", status: "DONE", owner: "Đầu mối Lễ tân - Đối ngoại", deadline: "2026-09-02T17:00", critical: true, weight: 3, note: "Đã nhận đủ xác nhận cho 12 thành viên." },
    { id: "CK-EV001-06", event_id: "EV001", cat: "06", label: "Phiên dịch", status: "DONE", owner: "Đầu mối Lễ tân - Đối ngoại", deadline: "2026-09-03T12:00", critical: true, weight: 2, note: "01 phiên dịch cabin, đã ký hợp đồng." },
    { id: "CK-EV001-07", event_id: "EV001", cat: "07", label: "Tài liệu tóm tắt cho Lãnh đạo", status: "PENDING", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-04T11:00", critical: true, weight: 3, note: "Bản thảo đã có, chờ Lãnh đạo Văn phòng duyệt trước 11:00." },
    { id: "CK-EV001-08", event_id: "EV001", cat: "08", label: "Tài liệu làm việc", status: "DONE", owner: "Ban A", deadline: "2026-09-03T17:00", critical: false, weight: 2, note: "Bản song ngữ đã in 15 bộ." },
    { id: "CK-EV001-09", event_id: "EV001", cat: "09", label: "Quà tặng lưu niệm", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-03T17:00", critical: false, weight: 1, note: "" },
    { id: "CK-EV001-10", event_id: "EV001", cat: "10", label: "Đưa tin và hình ảnh", status: "PENDING", owner: "Đầu mối Truyền thông", deadline: "2026-09-05T09:00", critical: false, weight: 2, note: "Chờ chốt phạm vi nội dung được phép đăng." },
    { id: "CK-EV001-11", event_id: "EV001", cat: "11", label: "Tiệc trà và tiếp khách", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-03T17:00", critical: false, weight: 2, note: "" },
    { id: "CK-EV001-12", event_id: "EV001", cat: "12", label: "Phương án dự phòng", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Chương trình trong trụ sở, không đặt phương án dự phòng riêng." },

    /* --- EV002 - Hội nghị sơ kết 9 tháng: 22/25 = 88% --- */
    { id: "CK-EV002-01", event_id: "EV002", cat: "01", label: "Chương trình hội nghị", status: "DONE", owner: "Ban A", deadline: "2026-09-03T17:00", critical: true, weight: 3, note: "Đã trình Lãnh đạo phê duyệt." },
    { id: "CK-EV002-02", event_id: "EV002", cat: "02", label: "Danh sách khách mời", status: "PENDING", owner: "Đầu mối Hành chính", deadline: "2026-09-04T15:00", critical: true, weight: 2, note: "Còn 02 đơn vị chưa phản hồi xác nhận đại biểu." },
    { id: "CK-EV002-03", event_id: "EV002", cat: "03", label: "Hội trường và khánh tiết", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-07T17:00", critical: false, weight: 3, note: "Đã đặt hội trường, phông nền đang in." },
    { id: "CK-EV002-04", event_id: "EV002", cat: "04", label: "Phương tiện đưa đón đại biểu", status: "DONE", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-05T17:00", critical: false, weight: 2, note: "03 xe cho đại biểu đơn vị ngoài Hà Nội." },
    { id: "CK-EV002-05", event_id: "EV002", cat: "05", label: "Thủ tục nhập cảnh", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Hội nghị nội bộ." },
    { id: "CK-EV002-06", event_id: "EV002", cat: "06", label: "Phiên dịch", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Hội nghị nội bộ." },
    { id: "CK-EV002-07", event_id: "EV002", cat: "07", label: "Kịch bản điều hành", status: "DONE", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-05T17:00", critical: true, weight: 3, note: "" },
    { id: "CK-EV002-08", event_id: "EV002", cat: "08", label: "Tài liệu hội nghị", status: "DONE", owner: "Ban A", deadline: "2026-09-05T17:00", critical: true, weight: 3, note: "180 bộ, đã hoàn tất in ấn." },
    { id: "CK-EV002-09", event_id: "EV002", cat: "09", label: "Kỷ niệm chương", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-05T17:00", critical: false, weight: 2, note: "" },
    { id: "CK-EV002-10", event_id: "EV002", cat: "10", label: "Đưa tin hội nghị", status: "PENDING", owner: "Đầu mối Truyền thông", deadline: "2026-09-06T17:00", critical: false, weight: 1, note: "Đề cương tin đã gửi, chờ duyệt." },
    { id: "CK-EV002-11", event_id: "EV002", cat: "11", label: "Tiệc trà giữa giờ", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-07T12:00", critical: false, weight: 3, note: "" },
    { id: "CK-EV002-12", event_id: "EV002", cat: "12", label: "Phương án dự phòng điện, âm thanh", status: "DONE", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-07T17:00", critical: false, weight: 3, note: "Đã bố trí máy phát và bộ âm thanh dự phòng." },

    /* --- EV003 - Chương trình công tác Hạ Long: 24/25 = 96% --- */
    { id: "CK-EV003-01", event_id: "EV003", cat: "01", label: "Chương trình công tác", status: "DONE", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-05T17:00", critical: true, weight: 3, note: "" },
    { id: "CK-EV003-02", event_id: "EV003", cat: "02", label: "Thành phần đoàn", status: "DONE", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-05T17:00", critical: true, weight: 3, note: "09 thành viên." },
    { id: "CK-EV003-03", event_id: "EV003", cat: "03", label: "Phòng họp tại đơn vị đến", status: "DONE", owner: "Ban B", deadline: "2026-09-08T17:00", critical: false, weight: 2, note: "" },
    { id: "CK-EV003-04", event_id: "EV003", cat: "04", label: "Phương tiện di chuyển", status: "DONE", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-08T17:00", critical: true, weight: 3, note: "02 xe, đã xác nhận lái xe và lịch trình." },
    { id: "CK-EV003-05", event_id: "EV003", cat: "05", label: "Thủ tục nhập cảnh", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Công tác trong nước." },
    { id: "CK-EV003-06", event_id: "EV003", cat: "06", label: "Phiên dịch", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Công tác trong nước." },
    { id: "CK-EV003-07", event_id: "EV003", cat: "07", label: "Tài liệu tóm tắt", status: "DONE", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-09T12:00", critical: true, weight: 3, note: "" },
    { id: "CK-EV003-08", event_id: "EV003", cat: "08", label: "Tài liệu làm việc", status: "DONE", owner: "Ban A", deadline: "2026-09-09T12:00", critical: false, weight: 3, note: "" },
    { id: "CK-EV003-09", event_id: "EV003", cat: "09", label: "Quà tặng đơn vị đến làm việc", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-09T17:00", critical: false, weight: 2, note: "" },
    { id: "CK-EV003-10", event_id: "EV003", cat: "10", label: "Đưa tin chương trình công tác", status: "PENDING", owner: "Đầu mối Truyền thông", deadline: "2026-09-09T08:00", critical: false, weight: 1, note: "Chờ phân công người đi cùng đoàn." },
    { id: "CK-EV003-11", event_id: "EV003", cat: "11", label: "Ăn uống và lưu trú", status: "DONE", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-08T17:00", critical: false, weight: 3, note: "Đã đặt 09 phòng." },
    { id: "CK-EV003-12", event_id: "EV003", cat: "12", label: "Phương án dự phòng thời tiết", status: "DONE", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-09T17:00", critical: false, weight: 2, note: "Có phương án đổi lịch di chuyển nếu mưa lớn." }
  ],

  /* ----------------------------------------------------------------- ACTIONS */
  /* Việc sau họp và việc cần đôn đốc. KHÔNG phải quản lý công văn.
     status: OPEN | IN_PROGRESS | DONE | OVERDUE                               */
  actions: [
    { id: "ACT-001", title: "Gửi biên bản kết luận họp giao ban tuần trước tới các Ban", source_type: "Kết luận họp", ref: "AG001", ref_label: "Họp giao ban Ban Tổng Giám đốc", owner: "Đầu mối Hành chính", assigned_date: "2026-08-31", deadline: "2026-09-03T16:00", status: "OVERDUE", priority: "Cao", note: "Đã soạn xong, còn chờ rà soát phần kết luận mục 3." },
    { id: "ACT-002", title: "Báo cáo tình hình sử dụng phòng họp tháng 8", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác hành chính", owner: "Đầu mối Hành chính", assigned_date: "2026-08-28", deadline: "2026-09-02T17:00", status: "OVERDUE", priority: "Trung bình", note: "Thiếu số liệu 02 phòng họp tầng 12." },
    { id: "ACT-003", title: "Rà soát phương án bảo đảm an ninh trụ sở dịp Hội nghị", source_type: "Chuẩn bị sự kiện", ref: "EV002", ref_label: "Hội nghị sơ kết 9 tháng", owner: "Ban B", assigned_date: "2026-09-01", deadline: "2026-09-05T17:00", status: "IN_PROGRESS", priority: "Cao", note: "" },
    { id: "ACT-004", title: "Tổng hợp đề xuất sửa chữa nhỏ khu vực sảnh tầng 1", source_type: "Chỉ đạo Lãnh đạo", ref: null, ref_label: "Chỉ đạo tại giao ban 31/8", owner: "Đầu mối Hậu cần - Xe", assigned_date: "2026-08-31", deadline: "2026-09-06T17:00", status: "IN_PROGRESS", priority: "Trung bình", note: "" },
    { id: "ACT-005", title: "Cập nhật quy trình đón tiếp khách quốc tế", source_type: "Kết luận họp", ref: "EV001", ref_label: "Đoàn đối tác quốc tế", owner: "Đầu mối Lễ tân - Đối ngoại", assigned_date: "2026-08-27", deadline: "2026-09-06T17:00", status: "OPEN", priority: "Trung bình", note: "" },
    { id: "ACT-006", title: "Chốt phương án bố trí chỗ ngồi Hội nghị", source_type: "Chuẩn bị sự kiện", ref: "EV002", ref_label: "Hội nghị sơ kết 9 tháng", owner: "Đầu mối Hành chính", assigned_date: "2026-09-02", deadline: "2026-09-07T08:00", status: "OPEN", priority: "Cao", note: "Phụ thuộc danh sách khách mời." },
    { id: "ACT-007", title: "Hoàn tất khánh tiết hội trường", source_type: "Chuẩn bị sự kiện", ref: "EV002", ref_label: "Hội nghị sơ kết 9 tháng", owner: "Đầu mối Hành chính", assigned_date: "2026-09-01", deadline: "2026-09-08T07:00", status: "IN_PROGRESS", priority: "Cao", note: "" },
    { id: "ACT-008", title: "Tổng hợp báo cáo hoạt động Văn phòng tháng 8", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác hành chính", owner: "Đầu mối Hành chính", assigned_date: "2026-09-01", deadline: "2026-09-09T17:00", status: "IN_PROGRESS", priority: "Trung bình", note: "" },
    { id: "ACT-009", title: "Chuẩn bị phương án hậu cần chương trình công tác Hạ Long", source_type: "Chuẩn bị sự kiện", ref: "EV003", ref_label: "Chương trình công tác Hạ Long", owner: "Đầu mối Hậu cần - Xe", assigned_date: "2026-08-30", deadline: "2026-09-09T16:00", status: "IN_PROGRESS", priority: "Cao", note: "" },
    { id: "ACT-010", title: "Biên tập bản tin nội bộ số tháng 9", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác truyền thông", owner: "Đầu mối Truyền thông", assigned_date: "2026-09-01", deadline: "2026-09-10T17:00", status: "OPEN", priority: "Trung bình", note: "" },
    { id: "ACT-011", title: "Cập nhật danh bạ đầu mối các Ban", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác hành chính", owner: "Đầu mối Hành chính", assigned_date: "2026-09-02", deadline: "2026-09-11T17:00", status: "OPEN", priority: "Thấp", note: "" },
    { id: "ACT-012", title: "Rà soát hợp đồng dịch vụ vệ sinh và an ninh trụ sở", source_type: "Chỉ đạo Lãnh đạo", ref: null, ref_label: "Chỉ đạo tại giao ban 24/8", owner: "Ban B", assigned_date: "2026-08-24", deadline: "2026-09-12T17:00", status: "IN_PROGRESS", priority: "Trung bình", note: "" },
    { id: "ACT-013", title: "Xây dựng lịch sử dụng phòng họp quý IV", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác hành chính", owner: "Đầu mối Hành chính", assigned_date: "2026-09-03", deadline: "2026-09-15T17:00", status: "OPEN", priority: "Thấp", note: "" },
    { id: "ACT-014", title: "Rà soát định mức văn phòng phẩm", source_type: "Công việc thường xuyên", ref: null, ref_label: "Công tác hành chính", owner: "Ban B", assigned_date: "2026-09-03", deadline: "2026-09-16T17:00", status: "OPEN", priority: "Thấp", note: "" },

    { id: "ACT-015", title: "Đặt phòng họp và thiết bị hội nghị truyền hình", source_type: "Chuẩn bị sự kiện", ref: "EV001", ref_label: "Đoàn đối tác quốc tế", owner: "Đầu mối Hành chính", assigned_date: "2026-08-28", deadline: "2026-09-02T17:00", status: "DONE", priority: "Trung bình", note: "" },
    { id: "ACT-016", title: "Xác nhận thành phần dự họp giao ban", source_type: "Kết luận họp", ref: "AG001", ref_label: "Họp giao ban Ban Tổng Giám đốc", owner: "Đầu mối Thư ký Lãnh đạo", assigned_date: "2026-09-01", deadline: "2026-09-03T17:00", status: "DONE", priority: "Trung bình", note: "" },
    { id: "ACT-017", title: "Hoàn tất thủ tục nhập cảnh cho thành viên đoàn", source_type: "Chuẩn bị sự kiện", ref: "EV001", ref_label: "Đoàn đối tác quốc tế", owner: "Đầu mối Lễ tân - Đối ngoại", assigned_date: "2026-08-20", deadline: "2026-09-02T17:00", status: "DONE", priority: "Cao", note: "" },
    { id: "ACT-018", title: "Gửi giấy mời Hội nghị tới các đơn vị", source_type: "Chuẩn bị sự kiện", ref: "EV002", ref_label: "Hội nghị sơ kết 9 tháng", owner: "Đầu mối Hành chính", assigned_date: "2026-08-25", deadline: "2026-09-01T17:00", status: "DONE", priority: "Cao", note: "" }
  ],

  /* ---------------------------------------------------------- COMMUNICATIONS */
  /* stage: IDEA | DRAFT | REVIEW | APPROVED | PUBLISHED */
  communications: [
    { id: "CM001", title: "Tin Hội nghị sơ kết 9 tháng", channel: "Trang tin điện tử", stage: "REVIEW", owner: "Đầu mối Truyền thông", due: "2026-09-04T17:00", source_approved: false, event_id: "EV002", next_action: "Trình Lãnh đạo Văn phòng duyệt nội dung trong chiều nay.", note: "Bản thảo đã có ảnh minh hoạ, chờ ý kiến về phần số liệu." },
    { id: "CM002", title: "Thông tin chương trình công tác Hạ Long", channel: "Bản tin nội bộ", stage: "APPROVED", owner: "Đầu mối Truyền thông", due: "2026-09-09T17:00", source_approved: true, event_id: "EV003", next_action: "Đăng sau khi đoàn kết thúc buổi làm việc đầu tiên.", note: "" },
    { id: "CM003", title: "Bài tổng hợp hoạt động Văn phòng tháng 9", channel: "Trang tin điện tử", stage: "DRAFT", owner: "Đầu mối Truyền thông", due: "2026-09-12T17:00", source_approved: true, event_id: null, next_action: "Hoàn thiện bản thảo và gửi rà soát.", note: "" },
    { id: "CM004", title: "Ảnh và tin tiếp đoàn đối tác quốc tế", channel: "Trang tin điện tử · Nội bộ", stage: "IDEA", owner: "Đầu mối Truyền thông", due: "2026-09-05T16:00", source_approved: false, event_id: "EV001", next_action: "Xác định phạm vi nội dung được phép đăng trước khi đoàn đến.", note: "Phụ thuộc ý kiến của đầu mối đối ngoại." },
    { id: "CM005", title: "Thông báo lịch làm việc dịp lễ", channel: "Bản tin nội bộ", stage: "PUBLISHED", owner: "Đầu mối Hành chính", due: "2026-09-01T09:00", source_approved: true, event_id: null, next_action: "Không còn việc phải làm.", note: "" },
    { id: "CM006", title: "Video ngắn giới thiệu hoạt động Văn phòng", channel: "Nội bộ", stage: "DRAFT", owner: "Đầu mối Truyền thông", due: "2026-09-20T17:00", source_approved: true, event_id: null, next_action: "Dựng bản nháp lần 1.", note: "" }
  ],

  /* --------------------------------------------------------------- SCENARIOS */
  /* Mỗi kịch bản là một bộ thay đổi (patch) áp lên dữ liệu gốc ở trên.
     Nhờ vậy không phải chép lại toàn bộ dữ liệu cho từng kịch bản.            */
  scenarios: [
    {
      id: "normal",
      code: "A",
      name: "Ngày bình thường",
      desc: "Công việc theo kế hoạch. Có 01 việc gấp và vài hạng mục chuẩn bị chưa xong.",
      patch: {}
    },
    {
      id: "busy",
      code: "B",
      name: "Ngày cao điểm",
      desc: "Thêm 01 lễ ký kết chen vào tuần, lịch Lãnh đạo dày hơn, nhiều đầu việc dồn hạn.",
      patch: {
        events_add: [
          {
            id: "EV004",
            title: "Lễ ký thoả thuận hợp tác",
            subtitle: "Lễ ký thoả thuận hợp tác với đơn vị trong nước",
            date: "2026-09-09", time: "14:00",
            location: "Phòng khánh tiết, tầng 12",
            owner: "Đầu mối Lễ tân - Đối ngoại",
            type: "Sự kiện đối ngoại",
            scale: "40 khách · 02 đơn vị"
          }
        ],
        checklist_add: [
          { id: "CK-EV004-01", event_id: "EV004", cat: "01", label: "Kịch bản buổi lễ", status: "PENDING", owner: "Đầu mối Lễ tân - Đối ngoại", deadline: "2026-09-05T17:00", critical: true, weight: 3, note: "Chưa thống nhất thứ tự phát biểu." },
          { id: "CK-EV004-02", event_id: "EV004", cat: "02", label: "Thành phần dự lễ", status: "PENDING", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-04T17:00", critical: true, weight: 3, note: "Chờ đơn vị đối tác gửi danh sách." },
          { id: "CK-EV004-03", event_id: "EV004", cat: "03", label: "Phòng khánh tiết và phông nền", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-06T17:00", critical: false, weight: 3, note: "Đã đặt phòng, phông nền đang in cùng đợt với hội nghị." },
          { id: "CK-EV004-04", event_id: "EV004", cat: "04", label: "Phương tiện đón khách", status: "PENDING", owner: "Đầu mối Hậu cần - Xe", deadline: "2026-09-07T17:00", critical: false, weight: 2, note: "" },
          { id: "CK-EV004-05", event_id: "EV004", cat: "05", label: "Thủ tục nhập cảnh", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Đối tác trong nước." },
          { id: "CK-EV004-06", event_id: "EV004", cat: "06", label: "Phiên dịch", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "Đối tác trong nước." },
          { id: "CK-EV004-07", event_id: "EV004", cat: "07", label: "Tài liệu tóm tắt", status: "PENDING", owner: "Đầu mối Thư ký Lãnh đạo", deadline: "2026-09-08T12:00", critical: true, weight: 3, note: "" },
          { id: "CK-EV004-08", event_id: "EV004", cat: "08", label: "Bản thoả thuận và hồ sơ ký", status: "DONE", owner: "Ban A", deadline: "2026-09-04T12:00", critical: true, weight: 3, note: "Đã hoàn tất bản in trình ký." },
          { id: "CK-EV004-09", event_id: "EV004", cat: "09", label: "Quà tặng", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-07T17:00", critical: false, weight: 2, note: "" },
          { id: "CK-EV004-10", event_id: "EV004", cat: "10", label: "Đưa tin lễ ký", status: "PENDING", owner: "Đầu mối Truyền thông", deadline: "2026-09-08T17:00", critical: false, weight: 2, note: "" },
          { id: "CK-EV004-11", event_id: "EV004", cat: "11", label: "Tiệc trà", status: "DONE", owner: "Đầu mối Hành chính", deadline: "2026-09-08T17:00", critical: false, weight: 2, note: "" },
          { id: "CK-EV004-12", event_id: "EV004", cat: "12", label: "Phương án dự phòng", status: "NOT_APPLICABLE", owner: "-", deadline: null, critical: false, weight: 1, note: "" }
        ],
        agenda_add: [
          {
            id: "AG010", date: "2026-09-04", time: "11:30", duration: "45 phút",
            title: "Trao đổi nhanh về lễ ký thoả thuận hợp tác",
            location: "Phòng họp B, tầng 12", type: "Chuẩn bị sự kiện",
            leader: "Lãnh đạo Văn phòng", owner: "Đầu mối Lễ tân - Đối ngoại",
            important: true, event_id: "EV004",
            prep: [
              { label: "Chương trình họp", done: true },
              { label: "Thành phần dự họp", done: false },
              { label: "Phòng họp và thiết bị", done: true },
              { label: "Kịch bản buổi lễ", done: false }
            ]
          },
          {
            id: "AG011", date: "2026-09-04", time: "16:00", duration: "60 phút",
            title: "Làm việc với đơn vị thành viên về kế hoạch quý IV",
            location: "Phòng họp A, tầng 12", type: "Họp chuyên đề",
            leader: "Ban Tổng Giám đốc", owner: "Đầu mối Thư ký Lãnh đạo",
            important: true, event_id: null,
            prep: [
              { label: "Chương trình họp", done: true },
              { label: "Thành phần dự họp", done: true },
              { label: "Phòng họp và thiết bị", done: true },
              { label: "Tài liệu họp", done: false }
            ]
          },
          {
            id: "AG012", date: "2026-09-09", time: "14:00", duration: "90 phút",
            title: "Lễ ký thoả thuận hợp tác",
            location: "Phòng khánh tiết, tầng 12", type: "Sự kiện đối ngoại",
            leader: "Ban Tổng Giám đốc", owner: "Đầu mối Lễ tân - Đối ngoại",
            important: true, event_id: "EV004",
            prep: [
              { label: "Kịch bản buổi lễ", done: false },
              { label: "Thành phần dự lễ", done: false },
              { label: "Phòng khánh tiết", done: false },
              { label: "Hồ sơ ký", done: true }
            ]
          }
        ],
        actions_add: [
          { id: "ACT-019", title: "Chuẩn bị bài phát biểu tại lễ ký thoả thuận", source_type: "Chỉ đạo Lãnh đạo", ref: "EV004", ref_label: "Lễ ký thoả thuận hợp tác", owner: "Đầu mối Thư ký Lãnh đạo", assigned_date: "2026-09-03", deadline: "2026-09-05T17:00", status: "OPEN", priority: "Cao", note: "" },
          { id: "ACT-020", title: "Đề xuất phương án bố trí nhân sự phục vụ 02 sự kiện liền nhau", source_type: "Kết luận họp", ref: null, ref_label: "Giao ban Văn phòng 03/9", owner: "Đầu mối Hành chính", assigned_date: "2026-09-03", deadline: "2026-09-04T17:00", status: "OPEN", priority: "Cao", note: "Hội nghị 08/9 và lễ ký 09/9 sát nhau." }
        ],
        actions: {
          "ACT-004": { deadline: "2026-09-04T17:00", priority: "Cao" },
          "ACT-010": { deadline: "2026-09-06T17:00" }
        },
        communications: {
          "CM003": { stage: "REVIEW", due: "2026-09-04T16:00", next_action: "Rà soát và trình duyệt trước khi tập trung cho lễ ký." }
        },
        comms_add: [
          { id: "CM007", title: "Tin lễ ký thoả thuận hợp tác", channel: "Trang tin điện tử", stage: "IDEA", owner: "Đầu mối Truyền thông", due: "2026-09-08T17:00", source_approved: false, event_id: "EV004", next_action: "Xin chủ trương nội dung và phạm vi đưa tin.", note: "" }
        ]
      }
    },
    {
      id: "critical",
      code: "C",
      name: "Sự cố sẵn sàng",
      desc: "Thủ tục nhập cảnh của đoàn bị vướng, phương tiện chưa xác nhận, thêm việc quá hạn.",
      patch: {
        checklist: {
          "CK-EV001-05": { status: "BLOCKED", note: "Chưa nhận được xác nhận thủ tục nhập cảnh cho 02 thành viên đoàn. Đầu mối đối ngoại đang liên hệ cơ quan cấp phép." },
          "CK-EV001-04": { status: "BLOCKED", note: "Đơn vị vận tải báo không bố trí đủ xe đúng khung giờ. Cần phương án thay thế trong sáng nay." },
          "CK-EV001-10": { deadline: "2026-09-04T16:00" }
        },
        actions: {
          "ACT-003": { status: "OVERDUE", deadline: "2026-09-03T17:00", note: "Chưa có phương án cho khu vực sảnh tầng 1." },
          "ACT-005": { status: "OVERDUE", deadline: "2026-09-03T12:00", priority: "Cao" }
        },
        actions_add: [
          { id: "ACT-021", title: "Lập phương án thay thế phương tiện đưa đón đoàn", source_type: "Chỉ đạo Lãnh đạo", ref: "EV001", ref_label: "Đoàn đối tác quốc tế", owner: "Đầu mối Hậu cần - Xe", assigned_date: "2026-09-04", deadline: "2026-09-04T10:30", status: "OPEN", priority: "Cao", note: "Báo cáo Lãnh đạo Văn phòng trước 10:30." }
        ],
        communications: {
          "CM004": { due: "2026-09-04T14:00", next_action: "Tạm dừng chuẩn bị tin cho đến khi chốt được thành phần đoàn." }
        }
      }
    }
  ]
};
