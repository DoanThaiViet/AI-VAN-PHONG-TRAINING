# -*- coding: utf-8 -*-
"""Nguon du lieu 06 prompt Van phong - dung chung cho slide, to gap A4 va file Word."""

PROMPTS = [
    {
        "n": "01",
        "title": "Tóm tắt công văn đến",
        "tag": "Trình Lãnh đạo",
        "run": "Copilot trong Word hoặc Outlook, tài khoản cơ quan. Số, ngày, hạn xử lý đã có trong 1Office, không cần AI trích lại.",
        "fields": [
            ("Vai trò", "trợ lý Văn phòng."),
            ("Nguồn", "công văn đính kèm, chỉ dùng thông tin trong tài liệu này."),
            ("Nhiệm vụ", "tóm tắt công văn cho Lãnh đạo."),
            ("Người nhận", "Lãnh đạo đọc trong 02 phút."),
            ("Đầu ra", "03 phần ngắn, gạch đầu dòng."),
        ],
        "rules": [
            "Phần 1 tóm tắt tối đa 05 dòng: ai gửi, đề nghị gì, liên quan đến việc nào của PVEP",
            "Phần 2 điểm cần Lãnh đạo quyết hoặc cho ý kiến, mỗi điểm 01 dòng, dẫn mục trong văn bản",
            "Phần 3 điểm chưa rõ hoặc cần hỏi lại nơi gửi",
            "Chép nguyên văn con số và mốc thời gian",
            "Không đề xuất phương án xử lý, không kết luận thay Lãnh đạo",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
    {
        "n": "02",
        "title": "Dự thảo văn bản trả lời",
        "tag": "Bản nháp để trình ký",
        "run": "Copilot trong Word, tài khoản cơ quan. Xong bản nháp mới đưa vào luồng trình ký trên 1Office.",
        "fields": [
            ("Vai trò", "chuyên viên soạn thảo văn bản hành chính."),
            ("Nguồn", "văn bản đến và ý kiến chỉ đạo đính kèm."),
            ("Nhiệm vụ", "soạn dự thảo văn bản trả lời."),
            ("Người nhận", "[đơn vị nhận], văn phong hành chính, trung tính."),
            ("Đầu ra", "bản nháp theo thể thức văn bản hành chính, có chỗ trống cho số và ngày."),
        ],
        "rules": [
            "Cấu trúc: căn cứ · nội dung trả lời từng ý theo đúng thứ tự văn bản đến · đề nghị phối hợp · nơi nhận",
            "Mỗi ý trả lời phải dẫn lại mục tương ứng trong văn bản đến",
            "Không cam kết mốc thời gian hoặc nguồn lực nếu tài liệu không nêu",
            "Không dùng từ hoa mỹ, không mở bài dài dòng",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
    {
        "n": "03",
        "title": "Bản chuẩn bị trước họp",
        "tag": "01 trang cho người chủ trì",
        "run": "Copilot với hồ sơ nội bộ. NotebookLM chỉ khi tài liệu đã công khai hoặc đã làm sạch tên, số.",
        "fields": [
            ("Vai trò", "trợ lý chuẩn bị tài liệu cho người chủ trì."),
            ("Nguồn", "hồ sơ họp đính kèm (giấy mời, tài liệu các đơn vị gửi)."),
            ("Nhiệm vụ", "lập bản chuẩn bị trước họp 01 trang."),
            ("Người nhận", "người chủ trì, đọc trong 05 phút."),
            ("Đầu ra", "văn bản 01 trang, gạch đầu dòng."),
        ],
        "rules": [
            "Thứ tự: mục đích và kết quả cần đạt · thành phần dự · từng nội dung (bối cảnh 02 câu, số liệu nêu trong hồ sơ, điểm cần quyết) · việc kỳ trước còn treo · câu hỏi gợi ý",
            "Số liệu chép nguyên văn kèm tên tài liệu nguồn",
            "Không đề xuất chọn phương án, không kết luận thay người chủ trì",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
    {
        "n": "04",
        "title": "Biên bản họp + việc nhập 1Office",
        "tag": "Từ ghi chú hoặc bản ghi Teams",
        "run": "Copilot trong Teams (cuộc họp đã ghi) hoặc trong Word với ghi chú họp. Danh sách việc nhập vào 1Office, không lập bảng theo dõi riêng.",
        "fields": [
            ("Vai trò", "thư ký cuộc họp."),
            ("Nguồn", "ghi chú họp hoặc bản gỡ băng đính kèm, không dùng thông tin ngoài."),
            ("Nhiệm vụ", "soạn biên bản nháp và danh sách việc."),
            ("Người nhận", "người chủ trì soát trước, sau đó gửi các đơn vị dự họp."),
            ("Đầu ra", "phần 1 biên bản theo thể thức; phần 2 danh sách việc để nhập 1Office."),
        ],
        "rules": [
            "Biên bản gồm: thời gian, địa điểm, thành phần, nội dung, ý kiến các đơn vị, kết luận của người chủ trì",
            "Phân biệt rõ ý kiến, đề nghị, giao nhiệm vụ và kết luận; giữ đúng động từ trong ghi chú, không nâng ý kiến thành kết luận",
            "Danh sách việc: mỗi dòng gồm việc · đơn vị hoặc người thực hiện · hạn · tài liệu kèm theo",
            "Chép nguyên văn mốc thời hạn, không đổi cách diễn đạt (trước ngày, trong ngày, chậm nhất)",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
    {
        "n": "05",
        "title": "Checklist đoàn khách, sự kiện",
        "tag": "Kèm kịch bản theo giờ",
        "run": "Dữ liệu mô phỏng thì công cụ nào cũng được. Có tên khách, hộ chiếu, số điện thoại thì chỉ Copilot tài khoản cơ quan.",
        "fields": [
            ("Vai trò", "chuyên viên tổ chức sự kiện và lễ tân."),
            ("Nguồn", "thông tin đoàn và yêu cầu đính kèm; dùng dữ liệu mô phỏng nếu chưa có bản chính thức."),
            ("Nhiệm vụ", "lập checklist chuẩn bị và kịch bản theo giờ."),
            ("Người nhận", "người trực tại hiện trường, in 01 trang."),
            ("Đầu ra", "phần 1 checklist theo nhóm; phần 2 bảng giờ · việc · người phụ trách."),
        ],
        "rules": [
            "Nhóm checklist: phòng họp và thiết bị · tài liệu · lễ tân và khánh tiết · phiên dịch · phương tiện đi lại · quà tặng · ăn uống · truyền thông · an ninh và bảo mật",
            "Mỗi dòng ghi rõ điều kiện coi là đã xong và mốc phải xong trước",
            "Bổ sung mục phương án dự phòng cho ít nhất 03 tình huống",
            "Không tự chốt nhà cung cấp, không ước tính chi phí",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
    {
        "n": "06",
        "title": "Truyền thông: tin + hỏi đáp",
        "tag": "01 nguồn, nhiều đầu ra",
        "run": "Nội dung đã phê duyệt và công khai thì ChatGPT hoặc Claude, đính kèm mẫu thương hiệu PVEP. Chưa công bố thì Copilot.",
        "fields": [
            ("Vai trò", "chuyên viên truyền thông nội bộ."),
            ("Nguồn", "nội dung đã được phê duyệt đính kèm, đây là nguồn duy nhất."),
            ("Nhiệm vụ", "chuyển thành 05 đầu ra."),
            ("Người nhận", "mỗi đầu ra một nhóm người đọc khác nhau."),
            ("Đầu ra", "tin đăng trang thông tin · email nội bộ · chú thích ảnh mạng xã hội · ý phát biểu cho lãnh đạo · hỏi đáp dự kiến cho báo chí."),
        ],
        "rules": [
            "Cả 05 bản chỉ dùng dữ kiện có trong nguồn, không thêm số liệu, phát ngôn, cam kết hay đánh giá",
            "Độ dài từng bản: tin 250-350 từ, email 120 từ, chú thích ảnh 60 từ, ý phát biểu 05-07 gạch đầu dòng",
            "Phần hỏi đáp chỉ nêu câu hỏi dự kiến và phạm vi trả lời, không tự trả lời thay người phát ngôn",
            "Nếu nguồn không có thông tin thì ghi Chưa xác định, không tự suy đoán",
        ],
    },
]

# Khuon prompt 06 phan (dung cho mat 1 to gap)
SIX_PARTS = [
    ("Vai trò", "Cho AI đóng vai ai để trả lời đúng tầm.", "“Bạn là trợ lý Văn phòng…”"),
    ("Bối cảnh / nguồn", "Tài liệu nào, bản ngày nào, việc gì đang xử lý.", "“Công văn đến đính kèm, 06 trang”"),
    ("Nhiệm vụ", "Việc cụ thể cần AI làm, 01 câu rõ ràng.", "“Tóm tắt cho Lãnh đạo”"),
    ("Đối tượng nhận", "Ai đọc bản này, quyết định độ dài và văn phong.", "“Lãnh đạo đọc trong 02 phút”"),
    ("Đầu ra / định dạng", "Muốn nhận thứ gì: bảng, email, biên bản, checklist.", "“03 phần, gạch đầu dòng”"),
    ("Ràng buộc", "Điều AI không được tự suy diễn.", "“Chỉ dùng thông tin trong tài liệu; chỗ không rõ ghi Chưa xác định”"),
]

CHECKLIST = [
    ("Nguồn", "Mọi dữ kiện truy được về tài liệu gốc, đúng bản"),
    ("Tên · số · hạn", "Không gán sai chủ thể, không đổi mốc thời gian, cộng lại đúng"),
    ("Thể thức", "Đúng mẫu văn bản, văn phong hành chính"),
    ("Dữ liệu được phép", "Tài liệu nội bộ chỉ qua Copilot cơ quan; công cụ ngoài chỉ bản đã làm sạch"),
    ("Ai kiểm · ai duyệt", "Ghi rõ người soát, người duyệt trước khi phát hành"),
]

TOOL_ROUTE = [
    ("Tài liệu nội bộ: công văn, dự thảo, hồ sơ họp, hộp thư", "Copilot", "Tài khoản cơ quan, ngay trong Word · Outlook · Teams"),
    ("Hồ sơ dày, nhiều file, cần dẫn nguồn (đã công khai hoặc đã làm sạch)", "NotebookLM", "Nạp tài liệu trước, chỉ trả lời trong hồ sơ"),
    ("Soạn nhanh, nghĩ ý tưởng, ảnh minh hoạ, infographic", "ChatGPT", "Đính kèm mẫu thương hiệu PVEP khi làm ảnh, slide"),
    ("Tài liệu rất dài, soát văn bản, dựng bảng điều hành, ứng dụng nhỏ", "Claude", "Mô tả bằng lời, không cần biết lập trình"),
]

# Harvey ball 4 cong cu x 5 tieu chi (0-4), dung theo slide bang tra
MATRIX_HEAD = ["Đọc tài liệu dài", "Bám nguồn, ít bịa", "Soạn văn bản hành chính", "Dựng công cụ, tự động hoá", "Nằm sẵn trong Office"]
MATRIX = [
    ("ChatGPT", [3, 2, 4, 2, 1]),
    ("Copilot", [2, 3, 3, 1, 4]),
    ("NotebookLM", [4, 4, 2, 0, 0]),
    ("Claude", [4, 3, 4, 4, 1]),
]
HARVEY = {0: "○", 1: "◔", 2: "◑", 3: "◕", 4: "●"}

ZONES = [
    ("ĐỎ", "Không đưa", "#DC2626", [
        "Văn bản có dấu độ mật", "Dự thảo chưa ký, chưa phát hành", "Hộ chiếu · visa · số điện thoại",
        "Hồ sơ nhân sự · lương · sức khoẻ", "Hợp đồng · đơn giá · hồ sơ nhà thầu", "Số liệu sản xuất kinh doanh chưa công bố",
    ], "Không đưa lên AI công cộng. Copilot cơ quan cũng chỉ trong phạm vi được giao, chưa rõ thì hỏi người phụ trách."),
    ("VÀNG", "Làm sạch rồi mới đưa", "#D97706", [
        "Danh sách nội bộ → bỏ tên, số điện thoại", "Lịch họp, lịch công tác → bỏ tên người", "Kế hoạch chưa duyệt → thay số bằng dữ liệu mẫu",
        "Email trao đổi → cắt chữ ký, cắt phần trích dẫn", "Ảnh chụp màn hình → che tên, che đường dẫn",
    ], "Copilot cơ quan: dùng bản gốc. AI công cộng: chỉ bản đã thay tên và số."),
    ("XANH", "Dùng bình thường", "#059669", [
        "Thông cáo, tin đã đăng công khai", "Văn bản pháp quy đã ban hành", "Brochure, bộ nhận diện đã phát hành",
        "Tình huống mô phỏng, dữ liệu mẫu", "Kiến thức chung, cách viết, cách trình bày",
    ], "Công cụ nào cũng được. Vẫn phải kiểm lại nội dung trước khi trình và phát hành."),
]

LEAKS = ["Dán cả file vào AI công cộng", "Gửi qua email hoặc Zalo cá nhân", "Chụp màn hình rồi chia sẻ ra ngoài", "Chép vào USB hoặc đám mây cá nhân"]


def prompt_plain(p):
    """Van ban prompt thuan de dan vao AI (khong co dong 'chay o dau')."""
    lines = [f"{k}: {v}" for k, v in p["fields"]]
    lines.append("Yêu cầu:")
    lines += [f"- {r}" for r in p["rules"]]
    return "\n".join(lines)
