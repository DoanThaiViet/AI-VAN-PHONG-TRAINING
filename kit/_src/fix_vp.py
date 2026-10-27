# -*- coding: utf-8 -*-
"""Sua deck VP/index.html theo phuong an da chot (07/09/2026)."""
import re, sys, io, html
sys.path.insert(0, r"C:\Users\vietdt\AppData\Local\Temp\claude\C--Users-vietdt-OneDrive---PetroVietnam-Exploration-Production-Corporation--PVEP--Desktop-PVEP-Zix-CLAUDE\0bd8e559-eb9c-4719-9059-4f34c41ac51d\scratchpad")
from prompts_data import PROMPTS

PATH = r"C:\Users\vietdt\OneDrive - PetroVietnam Exploration Production Corporation (PVEP)\Desktop\PVEP\Zix\CLAUDE\HTML\SLIDE\AI-SLIDE-WORKSHOP\VP\index.html"
src = io.open(PATH, encoding="utf-8").read()
orig_len = len(src)
log = []

def rep(old, new, n=1):
    global src
    c = src.count(old)
    if c != n:
        raise SystemExit(f"[rep] expected {n} got {c}: {old[:90]!r}")
    src = src.replace(old, new)
    log.append(f"rep x{n}: {old[:60]!r}")

def rrep(pattern, new, n=1, flags=re.S):
    global src
    ms = re.findall(pattern, src, flags)
    if len(ms) != n:
        raise SystemExit(f"[rrep] expected {n} got {len(ms)}: {pattern[:90]!r}")
    src = re.sub(pattern, lambda m: new, src, flags=flags)
    log.append(f"rrep x{n}: {pattern[:60]!r}")

# ---------------------------------------------------------------- 1. AGENDA
rep('<div class="sess__h">Từng công cụ, live app &amp; sản phẩm mang về</div>',
    '<div class="sess__h">Từng công cụ, ứng dụng mẫu và sản phẩm mang về</div>')
rep('Hết chiều: 01 sản phẩm tự dựng + bộ KIT 07 món', 'Hết chiều: 01 sản phẩm tự dựng + bộ KIT 04 món')
rep('⚡ <b>Claude Code</b> + 02 live app chạy trực tiếp trên slide', '⚡ <b>Claude Code</b> + 02 ứng dụng mẫu chạy trực tiếp trên slide')
rep('🔍 <b>SĂN LỖI AI</b> · bảng 05 tiêu chí · cheat sheet', '🔍 <b>SĂN LỖI AI</b> · bảng 05 tiêu chí · bảng tra nhanh')
rep('Thư viện 08 prompt · <b>phát KIT</b> · hỏi đáp · tổng kết', 'Thư viện 06 prompt · mẫu thương hiệu · <b>phát KIT</b> · hỏi đáp · tổng kết')

# ---------------------------------------------------------------- 2. 02 DUONG CONG
rep('>Curve 1 · có trần<', '>Đường 1 · việc có trần<')
rep('>Curve 2 · không giới hạn<', '>Đường 2 · việc không giới hạn<')
rep('Curve 1 — <em>việc có trần</em>', 'Đường cong 1 - <em>việc có trần</em>')
rep('Curve 2 — <em>việc không giới hạn</em>', 'Đường cong 2 - <em>việc không giới hạn</em>')
rep('dồn cả buổi sáng cho việc Curve 1 rồi hết sức cho việc Curve 2', 'dồn cả buổi sáng cho việc có trần rồi hết sức cho việc không giới hạn')
rep('<b>Curve 1 · Giao AI</b>', '<b>Việc có trần · Giao AI</b>')
rep('<b>Curve 2 · Tự làm + AI</b>', '<b>Việc không giới hạn · Tự làm + AI</b>')
rep('aria-label="Thêm việc vào Curve 1"', 'aria-label="Thêm việc vào cột 1"', 2)
rep('aria-label="Thêm việc vào Curve 2"', 'aria-label="Thêm việc vào cột 2"', 2)
rep('Việc <b>Curve 1</b> — soạn nhanh, đúng khuôn, xong là chuyển', 'Việc <b>có trần</b>: soạn nhanh, đúng khuôn, xong là chuyển')

# ---------------------------------------------------------------- 3. BO CONG CU 04 NHOM
rep('<b>Copilot nằm sẵn trong Word, Outlook, Teams.</b>', '<b>Copilot nằm sẵn trong Word, Outlook, Teams, PVEP đã cấp bản quyền.</b>')

# ---------------------------------------------------------------- 4. BAO MAT
rep('Đăng nhập bằng tài khoản công việc, nằm trong gói bản quyền đơn vị đã ký điều khoản bảo mật — ví dụ Copilot đi kèm Microsoft 365 của cơ quan. Được đưa dữ liệu nội bộ trong phạm vi công việc được giao.',
    'Copilot theo tài khoản Microsoft 365 PVEP đã cấp. Được đưa dữ liệu nội bộ trong phạm vi công việc được giao.')
rep('Bản miễn phí, đăng nhập bằng email cá nhân, cơ quan không ký gì với nhà cung cấp. Kể cả khi công cụ ghi “không lưu dữ liệu” thì vẫn tính là đưa ra ngoài. Chỉ dùng dữ liệu công khai hoặc đã ẩn danh.',
    'ChatGPT, Claude, NotebookLM, Gemini bằng tài khoản cá nhân. Kể cả khi công cụ ghi “không lưu dữ liệu” vẫn tính là đưa ra ngoài. Chỉ dùng dữ liệu công khai hoặc đã làm sạch.')
rep('Ghép <b>công cụ</b> ở trên với <b>vùng tài liệu</b> ở dưới là ra quyết định. Mức độ mật do người có thẩm quyền xác định theo quy định.',
    'PVEP chưa ban hành hướng dẫn riêng về công cụ AI. Trong khi chờ: <b>tài liệu nội bộ đi qua Copilot tài khoản cơ quan</b>, mọi công cụ khác coi là công cộng. Mức độ mật do người có thẩm quyền xác định.')
rep('          <span class="zchip">Tài khoản · mật khẩu · đường dẫn nội bộ</span>\n', '')
rep('          <span class="zchip">Sơ đồ mặt bằng · phương án an ninh</span>\n', '')
rep('          <span class="zchip">File tải lên → xoá thông tin tác giả trong thuộc tính</span>\n', '')
rep('          <span class="zchip">Khuôn mẫu văn bản không có số liệu</span>\n', '')
rep('<span class="zchip">Case mô phỏng, dữ liệu mẫu</span>', '<span class="zchip">Tình huống mô phỏng, dữ liệu mẫu</span>')
rep('Tuyệt đối không đưa lên AI công cộng. Công cụ do cơ quan cấp cũng phải theo phạm vi được phép và hỏi người phụ trách trước.',
    'Không đưa lên AI công cộng. Copilot cơ quan cũng chỉ trong phạm vi được giao, chưa rõ thì hỏi người phụ trách.')
rep('Công cụ do cơ quan cấp: dùng được cho việc được giao. AI công cộng: chỉ bản đã thay tên và số.',
    'Copilot cơ quan: dùng bản gốc. AI công cộng: chỉ bản đã thay tên và số.')
rep('Bốn đường trên chiếm phần lớn các vụ lộ dữ liệu, và đều bắt đầu bằng một thao tác cho nhanh. <b>Lỡ đưa nhầm thì báo ngay người phụ trách</b> — báo sớm luôn dễ xử lý hơn giấu.',
    'Bốn đường trên đều bắt đầu bằng một thao tác cho nhanh. <b>Lỡ đưa nhầm thì báo ngay người phụ trách</b>, báo sớm dễ xử lý hơn giấu.')

# ---------------------------------------------------------------- 5. PROMPT 06 PHAN
rep('Đầu ra / format</div>', 'Đầu ra / định dạng</div>')
rep('“Lập executive brief cho Lãnh đạo”', '“Lập bản tóm tắt trình Lãnh đạo”')

# ---------------------------------------------------------------- 6. CHATGPT / COPILOT / CLAUDE
rep('<li>Checklist đoàn khách, run of show sự kiện</li>', '<li>Checklist đoàn khách, kịch bản sự kiện theo giờ</li>')
rep('<small>Đi kèm tài khoản Microsoft 365 của cơ quan</small>', '<small>PVEP đã cấp bản quyền theo tài khoản Microsoft 365 cơ quan</small>')
rep('Tài khoản cơ quan cấp → <b>được đưa dữ liệu nội bộ</b> trong phạm vi được giao', 'PVEP đã cấp theo tài khoản cơ quan → <b>được đưa dữ liệu nội bộ</b> trong phạm vi được giao')
rep('<li>Ranh giới bảo mật rõ ràng nhất trong 04 công cụ</li>', '<li>Công cụ mặc định cho tài liệu nội bộ, ranh giới bảo mật rõ nhất trong 04 công cụ</li>')
rep('<li>Phụ thuộc <b>gói bản quyền và cấu hình của đơn vị</b></li>', '<li>Tính năng theo <b>cấu hình gói PVEP đang dùng</b>, có thể khác bản giới thiệu trên mạng</li>')
rep('<li>Đơn vị chưa cấp bản quyền — bản miễn phí là AI công cộng</li>', '<li>Đăng nhập nhầm tài khoản cá nhân: bản miễn phí là AI công cộng</li>')
rep('<div class="tway"><em>Cowork</em><span>Không gian làm việc chung của Ban: <b>giao việc cho AI chạy nền</b>, dùng chung tài liệu và prompt, ai vào cũng ra một chuẩn</span></div>',
    '<div class="tway"><em>Cowork</em><span>Không gian làm việc chung của Ban: <b>giao việc cho AI tự chạy</b>, dùng chung tài liệu và prompt, ai vào cũng ra một chuẩn</span></div>')
rep('<div class="tway"><em>Code</em><span>Dựng <b>dashboard, mini app, bảng kiểm</b> — mô tả bằng lời, không cần biết lập trình</span></div>',
    '<div class="tway"><em>Code</em><span>Dựng <b>bảng điều hành, ứng dụng nhỏ, bảng kiểm</b>: mô tả bằng lời, không cần biết lập trình</span></div>')
rep('          <div class="tway"><em>Mở rộng</em><span>Cài <b>skill riêng</b> của Ban và <b>kết nối MCP</b> tới nguồn dữ liệu đang dùng</span></div>\n', '')
rep('<li><b>Dựng dashboard và mini app</b> từ mô tả bằng lời</li>', '<li><b>Dựng bảng điều hành và ứng dụng nhỏ</b> từ mô tả bằng lời</li>')
rep('<li>Skill và MCP cần người cài đặt lần đầu</li>', '<li>Phần mở rộng (skill, kết nối MCP) cần người cài đặt lần đầu</li>')
rep('<li>Kết nối MCP vào hệ thống cơ quan mà <b>chưa có ý kiến bộ phận công nghệ thông tin</b></li>', '<li>Kết nối vào hệ thống cơ quan khi <b>chưa có ý kiến bộ phận công nghệ thông tin</b></li>')
rep('<li><b>Dựng dashboard theo dõi việc</b> của Ban — như 02 app hôm nay</li>', '<li><b>Dựng bảng điều hành</b> cho việc của Ban, như 02 ứng dụng mẫu hôm nay</li>')

# ---------------------------------------------------------------- 7. BANG TRA: bo Gemini
rrep(r'\n\s*<div class="hmx__lbl"><b style="color:#4285F4">Gemini</b>.*?<div class="hmx__out">Tra cứu nhanh · dịch · gắn với hệ Google</div>', '')
rep('Bảng này có trong KIT mang về.', 'Bảng này in ở mặt sau tờ gập trong KIT.')
rep('data-goto="s-matrix"><span class="dot"></span>Bảng tra 05 công cụ', 'data-goto="s-matrix"><span class="dot"></span>Bảng tra 04 công cụ')

# ---------------------------------------------------------------- 8. CLAUDE CODE + 02 UNG DUNG MAU
rep('Dashboard · Mini app · Workflow · Công cụ kiểm tra · Prototype tương tác', 'Bảng điều hành · ứng dụng nhỏ · luồng việc · công cụ kiểm tra · bản mẫu tương tác')
rep('<div class="ccout"><b>Dashboard</b><span>theo dõi số liệu</span></div>', '<div class="ccout"><b>Bảng điều hành</b><span>theo dõi số liệu</span></div>')
rep('<div class="ccout"><b>Mini app</b><span>một việc, làm gọn</span></div>', '<div class="ccout"><b>Ứng dụng nhỏ</b><span>một việc, làm gọn</span></div>')
rep('<div class="ccout"><b>Workflow</b><span>nối các bước rời</span></div>', '<div class="ccout"><b>Luồng việc</b><span>nối các bước rời</span></div>')
rep('data-goto="s-claudecode"><span class="dot"></span>⚡ Claude Code · Live Apps', 'data-goto="s-claudecode"><span class="dot"></span>⚡ Claude Code · ứng dụng mẫu')
rep('Live App 01 · Văn thư — thư ký', 'Ứng dụng mẫu 01 · Văn thư - thư ký')
rep('Live App 02 · Hành chính — Đối ngoại — Thư ký', 'Ứng dụng mẫu 02 · Hành chính - Đối ngoại - Thư ký')
rep('✦ AI review', '✦ AI rà soát', 2)
rep('>Reset demo<', '>Làm lại<', 2)
rep('Bấm <b>AI review</b> ở cột bên trái.', 'Bấm <b>AI rà soát</b> ở cột bên trái.')
rep('<div class="qgpanel__h"><b>AI QUALITY GATE</b>', '<div class="qgpanel__h"><b>CỔNG KIỂM TRA CHẤT LƯỢNG</b>')
rep('<span>AI Quality Gate = <em>chất lượng nội dung</em></span>', '<span>Cổng kiểm tra AI = <em>chất lượng nội dung</em></span>')
rep('Deadline chưa nhất quán', 'Mốc thời gian chưa nhất quán')
rep('đổi một trạng thái thì <b>readiness, cảnh báo và AI Brief cập nhật ngay</b>', 'đổi một trạng thái thì <b>mức sẵn sàng, cảnh báo và bản tóm tắt AI cập nhật ngay</b>')
rep('<span>readiness</span>', '<span>sẵn sàng</span>')
rep('Demo readiness score — không phải chỉ số chính thức', 'Điểm sẵn sàng mô phỏng, không phải chỉ số chính thức')
c_brief = src.count('AI Brief')
src = src.replace('AI Brief', 'AI tóm tắt'); log.append(f"AI Brief x{c_brief}")
rep('thành micro app chạy ngay trong trình chiếu', 'thành ứng dụng nhỏ chạy ngay trong trình chiếu')
rep('Prototype mô phỏng · không thay thế quy trình nghiệp vụ chính thức.', 'Bản mẫu mô phỏng · không thay thế quy trình nghiệp vụ chính thức.')

# ---------------------------------------------------------------- 9. CHEAT SHEET
rep('<div class="eyebrow ac-reveal" style="--i:0">Phần III · Cheat sheet</div>', '<div class="eyebrow ac-reveal" style="--i:0">Phần III · Bảng tra nhanh</div>')
rep('<div class="hmx__hd">Đầu ra cầm tay</div>', '<div class="hmx__hd">Đầu ra nội dung</div>')
rep('<div class="hmx__out">Bảng 09 trường + phiếu trình nháp</div>', '<div class="hmx__out">Tóm tắt trình Lãnh đạo + dự thảo trả lời</div>')
rep('<div class="hmx__out">Briefing + biên bản + tracker</div>', '<div class="hmx__out">Bản chuẩn bị họp + biên bản, việc nhập 1Office</div>')
rep('<div class="hmx__out">Checklist + run of show</div>', '<div class="hmx__out">Checklist + kịch bản theo giờ</div>')
rep('<div class="hmx__out">Bảng metadata 08 trường</div>', '<div class="hmx__out">Bảng mô tả hồ sơ</div>')
rep('<div class="hmx__out">Tin · email · caption · Q&amp;A</div>', '<div class="hmx__out">Tin · email · chú thích ảnh · hỏi đáp</div>')

# ---------------------------------------------------------------- 10. LAB
rep('<em>Gợi ý công cụ: Gamma, Napkin, hoặc Claude Code xuất 01 trang HTML</em>', '<em>Gợi ý công cụ: ChatGPT tạo ảnh kèm mẫu thương hiệu PVEP, Gamma, Napkin</em>')
rrep(r'<span class="lpk__n">HƯỚNG B</span>.*?</em>',
     '<span class="lpk__n">HƯỚNG B</span>\n        <b>Hồ sơ 01 công văn đến</b>\n        <small>Từ 01 công văn (thật hoặc mô phỏng): bản tóm tắt trình Lãnh đạo, dự thảo văn bản trả lời, tự soát 05 tiêu chí trước khi đưa vào 1Office.</small>\n        <em>Gợi ý công cụ: Copilot trong Word, tài khoản cơ quan; prompt 01 và 02 trong thư viện</em>')
rep('Bí quá → mở <b>thư viện 08 prompt</b>, bấm sao chép rồi sửa.', 'Bí quá → mở <b>thư viện 06 prompt</b>, bấm sao chép rồi sửa.')

# ---------------------------------------------------------------- 11. THU VIEN 06 PROMPT (dung lai toan bo section)
def pane(p, on):
    fields = "<br>".join(f"<i>{k}:</i> {html.escape(v)}" for k, v in p["fields"])
    rules = "".join(f"<li>{html.escape(r)}</li>" for r in p["rules"])
    return (f'        <div class="plibpane{" on" if on else ""}"><div class="plibbody">\n'
            f'          <div class="plibbody__h" data-nocopy>Prompt {p["n"]} · {html.escape(p["title"])}<b>{html.escape(p["tag"])}</b></div>\n'
            f'          <p class="plibrun" data-nocopy><i>Chạy ở đâu:</i><span>{html.escape(p["run"])}</span></p>\n'
            f'          <p>{fields}</p>\n'
            f'          <ul>{rules}</ul>\n'
            f'          <button class="plibcopy">Sao chép prompt</button>\n'
            f'        </div></div>\n')

nav = "".join(f'        <button><span>{p["n"]}</span>{html.escape(p["title"])}</button>\n' for p in PROMPTS)
panes = "".join(pane(p, i == 0) for i, p in enumerate(PROMPTS))
thuvien = f'''<!-- ==================== SLIDE 30 — THƯ VIỆN 06 PROMPT ==================== -->
<section class="slide" data-chapter="3" id="s-thuvien">
  <div class="slide-content"><div class="wrap wrap--wide">
    <div class="head-center">
      <div class="eyebrow ac-reveal" style="--i:0">Phần IV · Cầm về dùng ngay</div>
      <h2 class="s-title ac-reveal" style="--i:1">Thư viện prompt — <span class="neo-g">06 việc Văn phòng làm hằng tuần</span></h2>
      <p class="lead-note ac-reveal" style="--i:2">Bấm từng việc để xem prompt, bấm <b>Sao chép prompt</b> là dán thẳng vào AI. Dòng xanh cho biết chạy ở công cụ nào. Cả 06 prompt in trong tờ gập cầm về, kèm file Word.</p>
    </div>
    <div class="plib ac-reveal" style="--i:3" id="promptLib">
      <div class="plibnav">
        <span class="plibnav__ind"></span>
{nav}      </div>
      <div>
{panes}      </div>
    </div>
  </div></div>
</section>
'''
rrep(r'<!-- ==================== SLIDE 30 — THƯ VIỆN 08 PROMPT ==================== -->.*?</section>\n', thuvien)
rep('data-goto="s-thuvien"><span class="dot"></span>Thư viện 8 prompt', 'data-goto="s-thuvien"><span class="dot"></span>Thư viện 06 prompt')

# copy prompt: bo qua dong tieu de va dong "chay o dau"
rep('var body=btn.closest(".plibbody"), txt=body?body.innerText.replace(/\\s*Sao chép prompt\\s*$/,"").trim():"";',
    'var body=btn.closest(".plibbody"), txt=body?[].filter.call(body.children,function(e){ return !e.hasAttribute("data-nocopy")&&!e.classList.contains("plibcopy"); }).map(function(e){ return e.innerText.trim(); }).join("\\n").trim():"";')

# ---------------------------------------------------------------- 12. SLIDE MAU THUONG HIEU (moi) + KIT (dung lai)
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
brandkit = f'''<!-- ==================== SLIDE 34 — MẪU THƯƠNG HIỆU PVEP ==================== -->
<section class="slide" data-chapter="3" id="s-brandkit">
  <div class="slide-content"><div class="wrap wrap--wide">
    <div class="head-center">
      <div class="eyebrow ac-reveal" style="--i:0">Phần IV · Mẫu thương hiệu</div>
      <h2 class="s-title s-title--sm ac-reveal" style="--i:1">Mẫu thương hiệu PVEP — <span class="neo-g">tự tạo trong 05 phút</span></h2>
      <p class="lead-note ac-reveal" style="--i:2">Bảng màu bên trái không phải dò từng mã. Đưa AI <b>logo + vài ấn phẩm đã được duyệt</b>, bảo nó rút mã màu ra thành <b>01 ảnh mẫu thương hiệu</b>. Từ đó tin bài, infographic, slide nào cũng đính kèm ảnh này để AI làm đúng nhận diện.</p>
    </div>
    <div class="bkwrap">
      <div class="ac-reveal ac-reveal--left" style="--i:3">
        <div class="bkgroup"><span class="bklab">Màu chính - xanh PVEP và navy</span>
          <div class="bkrow">
            <span class="sw" style="background:#006838">006838</span>
            <span class="sw" style="background:#00843D">00843D</span>
            <span class="sw" style="background:#00A651">00A651</span>
            <span class="sw" style="background:#2E3192">2E3192</span>
            <span class="sw" style="background:#23286B">23286B</span>
          </div>
        </div>
        <div class="bkgroup"><span class="bklab">Màu phụ - nền và chữ</span>
          <div class="bkrow">
            <span class="sw" style="background:#16203A">16203A</span>
            <span class="sw" style="background:#4B5563">4B5563</span>
            <span class="sw" style="background:#94A3B8">94A3B8</span>
            <span class="sw sw--light" style="background:#E9E6F7">E9E6F7</span>
            <span class="sw sw--light" style="background:#F3F6F9">F3F6F9</span>
          </div>
        </div>
        <div class="bkgroup"><span class="bklab">Màu nhấn - dùng không quá 10%</span>
          <div class="bkrow">
            <span class="sw" style="background:#E0982A">E0982A</span>
            <span class="sw" style="background:#DB584E">DB584E</span>
            <span class="sw" style="background:#00B29A">00B29A</span>
            <span class="sw" style="background:#2DB36A">2DB36A</span>
            <span class="sw" style="background:#7A5AF8">7A5AF8</span>
          </div>
        </div>
        <div class="bkgroup" style="margin-bottom:0"><span class="bklab">Font chữ</span>
          <div class="fontchips">
            <div class="fchip"><b style="font-family:var(--font-display)">Sora</b><small>tiêu đề và số liệu</small></div>
            <div class="fchip"><b>Be Vietnam Pro / Inter</b><small>thân bài, đủ dấu tiếng Việt</small></div>
          </div>
        </div>
      </div>
      <div class="ac-reveal ac-reveal--right" style="--i:4">
        <div class="flow3" style="justify-content:flex-start;margin-bottom:.7rem">
          <span class="fn"><b style="color:var(--pvep-blue)">1</b>Gom logo + 03 ấn phẩm cũ</span>
          <span class="fa">{ARROW}</span>
          <span class="fn"><b style="color:var(--pvep-blue)">2</b>AI rút mã màu</span>
          <span class="fa">{ARROW}</span>
          <span class="fn fn--out"><b>3</b>01 ảnh mẫu thương hiệu</span>
        </div>
        <div class="prompt">
          <div class="prompt__bar"><i></i><i></i><i></i><b>prompt - tạo mẫu thương hiệu</b></div>
          <div class="prompt__body">
            <span class="k">Vai trò:</span> chuyên gia nhận diện thương hiệu.<br>
            <span class="k">Đính kèm:</span> <span class="ph">logo PVEP + 02-03 ấn phẩm, slide đã được duyệt</span><br>
            <span class="k">Nhiệm vụ:</span> dựng <span class="k">01 ảnh mẫu thương hiệu 16:9</span> cho bộ nhận diện này.<br><br>
            <span class="k">Trong ảnh phải có:</span>
            <span class="li">Dải màu chính 03-05 ô, ghi <b>mã HEX ngay dưới mỗi ô</b></span>
            <span class="li">Dải màu phụ (nền, chữ) và màu nhấn, ghi rõ “dùng không quá 10% diện tích”</span>
            <span class="li">02 font: tiêu đề và thân bài, chọn font <b>đủ dấu tiếng Việt</b></span>
            <span class="li">01 ô ví dụ áp dụng: tiêu đề + đoạn văn + số liệu</span><br>
            <span class="k">Ràng buộc:</span>
            <span class="li">Rút mã màu <b>đúng từ ảnh đính kèm</b>, không tự chế màu mới</span>
            <span class="li">Ưu tiên màu logo làm màu chính; nền trắng, không hoạ tiết<span class="cur"></span></span>
          </div>
        </div>
        <a class="menti-btn" style="margin-top:.9rem" href="assets/brandkit-pvep.png" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>Mở ảnh mẫu thương hiệu PVEP (bản đầy đủ)</a>
      </div>
    </div>
  </div></div>
</section>

'''

IC_SHEET = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h10l6 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v6h6M8 13h8M8 17h5"/></svg>'
IC_DOC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h6M6 13h9"/></svg>'
IC_PAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="15.5" cy="10" r="1.2"/><path d="M12 21a2.5 2.5 0 0 0 0-5h-1a1.5 1.5 0 0 1 0-3h1"/></svg>'
IC_LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
IC_PRINT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg>'
IC_DL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M6 11l6 6 6-6M4 21h16"/></svg>'

kit = f'''<!-- ==================== SLIDE 35 — KIT VỀ NHÀ ==================== -->
<section class="slide" data-chapter="3" id="s-kit">
  <div class="slide-content"><div class="wrap wrap--wide">
    <div class="head-center">
      <div class="eyebrow ac-reveal" style="--i:0">Phần IV · Trước khi ra về</div>
      <h2 class="s-title s-title--sm ac-reveal" style="--i:1">Nhận KIT — <span class="neo-g">04 món, gặp việc gì cầm món đó</span></h2>
      <p class="lead-note ac-reveal" style="--i:2">1Office giữ quy trình, số, hạn và luồng ký. KIT chỉ lo phần <b>nội dung trước khi đưa vào 1Office</b>.</p>
    </div>
    <div class="kitwrap">
      <div class="ac-reveal ac-reveal--left" style="--i:3">
        <div class="growlist">
          <div class="grow">
            <span class="grow__ic">{IC_SHEET}</span>
            <span class="grow__tx"><b>01 · Tờ gập A4 cầm tay</b><small>In 2 mặt, gập đôi thành 04 mặt: khuôn prompt 06 phần + checklist 30 giây · 06 prompt · việc nào mở công cụ nào + 03 vùng dữ liệu.</small></span>
            <span class="grow__tag">IN SẴN</span>
          </div>
          <div class="grow grow--g">
            <span class="grow__ic">{IC_DOC}</span>
            <span class="grow__tx"><b>02 · File 06 prompt (Word)</b><small>Đúng 06 prompt trên tờ gập, mở ra bôi chép dán vào Copilot. Có chỗ trống để điền tên tài liệu.</small></span>
            <span class="grow__tag">FILE</span>
          </div>
          <div class="grow grow--p">
            <span class="grow__ic">{IC_PAL}</span>
            <span class="grow__tx"><b>03 · <span class="kithl">Mẫu thương hiệu PVEP</span></b><small>01 ảnh: màu chính, màu phụ, màu nhấn, font. Đính kèm khi nhờ AI dựng tin bài, infographic, slide.</small></span>
            <span class="grow__tag">FILE</span>
          </div>
          <div class="grow grow--n">
            <span class="grow__ic">{IC_LINK}</span>
            <span class="grow__tx"><b>04 · Bộ slide hôm nay + thư mục chung</b><small>Bản HTML chạy được 02 ứng dụng mẫu. Thư mục chung để nộp bài LAB và tải 03 món trên.</small></span>
            <span class="grow__tag">LINK</span>
          </div>
        </div>
        <div class="kitlinks">
          <a class="menti-btn" href="kit/to-gap-A4.html" target="_blank" rel="noopener">{IC_PRINT}Mở tờ gập để in</a>
          <a class="menti-btn" href="kit/06-prompt-Van-phong.docx" download>{IC_DL}Tải file 06 prompt</a>
        </div>
      </div>
      <div class="ac-reveal ac-reveal--right" style="--i:4">
        <div class="kitmap">
          <div class="kitmap__hd">Gặp việc gì</div><div class="kitmap__hd">Cầm món gì</div>
          <div class="kitmap__s">Nhận công văn đến</div><div class="kitmap__k"><span><b>Prompt 01</b> tóm tắt trình Lãnh đạo, rồi <b>Prompt 02</b> dự thảo trả lời. Xong mới đưa vào 1Office.</span></div>
          <div class="kitmap__s">Trước cuộc họp</div><div class="kitmap__k"><span><b>Prompt 03</b> bản chuẩn bị 01 trang cho người chủ trì.</span></div>
          <div class="kitmap__s">Sau cuộc họp</div><div class="kitmap__k"><span><b>Prompt 04</b> biên bản + danh sách việc, nhập vào 1Office.</span></div>
          <div class="kitmap__s">Đón đoàn, sự kiện</div><div class="kitmap__k"><span><b>Prompt 05</b> checklist + kịch bản theo giờ.</span></div>
          <div class="kitmap__s">Tin bài, ấn phẩm</div><div class="kitmap__k"><span><b>Prompt 06</b> + <b>mẫu thương hiệu PVEP</b> đính kèm.</span></div>
          <div class="kitmap__s">Trước khi gửi bất kỳ thứ gì</div><div class="kitmap__k"><span><b>Checklist 30 giây</b> (mặt 1) + <b>03 vùng dữ liệu</b> (mặt 4) trên tờ gập.</span></div>
        </div>
      </div>
    </div>
    <div class="note note--fun ac-reveal" style="--i:5">Một việc duy nhất tôi xin anh/chị: <b>trong 02 tuần tới, dùng AI làm 01 việc thật</b> rồi nhắn cho tôi kết quả, dù tốt hay chưa tốt. 🌿</div>
  </div></div>
</section>
'''
rrep(r'<!-- ==================== SLIDE 35 — KIT VỀ NHÀ ==================== -->.*?</section>\n', brandkit + kit)
rep('  <div class="rail__item rail__item--sub" data-chapter="3" data-goto="s-kit">',
    '  <div class="rail__item rail__item--sub" data-chapter="3" data-goto="s-brandkit"><span class="dot"></span>🎨 Mẫu thương hiệu</div>\n  <div class="rail__item rail__item--sub" data-chapter="3" data-goto="s-kit">')

# ---------------------------------------------------------------- 13. TONG KET: 07 viec cua con nguoi
rep('<h2 class="s-title s-title--sm ac-reveal" style="--i:1">AI giúp Văn phòng 04 việc — con người giữ 05 việc</h2>',
    '<h2 class="s-title s-title--sm ac-reveal" style="--i:1">AI giúp Văn phòng 04 việc — con người giữ 07 việc</h2>')
rrep(r'<!-- ==================== SLIDE 37 — TỔNG KẾT ==================== -->\n<section class="slide" data-chapter="3">',
     '<!-- ==================== SLIDE 37 — TỔNG KẾT ==================== -->\n<section class="slide" data-chapter="3" id="s-tongket">')
SV = lambda d: f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">{d}</svg>'
seven = [
    ("Phê duyệt", '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m17 11 2 2 4-4"/>'),
    ("Kết luận chính thức", '<path d="M4 4h16v16H4z"/><path d="M8 12l3 3 5-6"/>'),
    ("Xác định độ mật", '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    ("Cam kết với bên ngoài", '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    ("Chọn nhà cung cấp", '<path d="M3 6h18l-2 12H5z"/><path d="M8 10v4M12 10v4M16 10v4"/>'),
    ("Phát hành thông tin", '<path d="M4 11v2a1 1 0 0 0 1 1h3l5 4V6L8 10H5a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/>'),
    ("Gửi văn bản ra ngoài", '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>'),
]
tk = '<div class="takeaways ac-reveal ac-reveal--left" style="--i:3">\n' + "".join(
    f'        <div class="tka"><span class="tka__n">{i+1:02d}</span><span class="tka__ic">{SV(d)}</span><b>{t}</b></div>\n' for i, (t, d) in enumerate(seven)) + '      </div>'
rrep(r'<div class="takeaways ac-reveal ac-reveal--left" style="--i:3">.*?</div>\n      </div>', tk)

# ---------------------------------------------------------------- 14. CSS bo sung
css = '''
/* --- V8 (09/2026): KIT 04 mon + bang tinh huong, prompt "chay o dau", mau thuong hieu, tong ket 07 viec --- */
.plibrun{ display:flex; gap:.5rem; align-items:flex-start; background:rgba(0,176,80,.14); border:1px solid rgba(0,176,80,.38); border-radius:10px; padding:.42rem .7rem; margin:.1rem 0 .3rem; font-family:var(--font-body) !important; color:#d1fae5 !important; font-size:var(--wk-small); line-height:1.42; }
.plibrun i{ font-style:normal; font-weight:800; color:#6ee7b7 !important; white-space:nowrap; }
.kitwrap{ display:grid; grid-template-columns:1.05fr 1fr; gap:clamp(.8rem,2vw,1.6rem); align-items:start; margin-top:clamp(.6rem,1.8vh,1rem); }
.kitwrap>*{ min-width:0; }
.kitmap{ display:grid; grid-template-columns:minmax(8.5em,.9fr) 1.5fr; gap:.3rem .45rem; align-items:stretch; }
.kitmap__hd{ font-weight:800; font-size:clamp(.6rem,.85vw,.72rem); letter-spacing:.08em; text-transform:uppercase; color:var(--ink-500); padding:0 .4rem; }
.kitmap__s{ background:var(--white); border:1px solid var(--ac-line); border-left:5px solid var(--pvep-blue); border-radius:10px; padding:.4rem .6rem; font-weight:800; color:var(--ink-900); font-size:clamp(.72rem,1.1vw,.9rem); line-height:1.22; display:flex; align-items:center; }
.kitmap__k{ background:rgba(0,176,80,.08); border:1px solid rgba(0,176,80,.28); border-radius:10px; padding:.4rem .6rem; color:var(--ink-700); font-size:clamp(.68rem,1.02vw,.84rem); line-height:1.3; display:flex; align-items:center; }
.kitmap__k b{ color:var(--success); }
.kitlinks{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.55rem; }
.kitlinks .menti-btn{ font-size:clamp(.7rem,1vw,.84rem); padding:.45rem .85rem; }
#s-kit .grow__tag{ white-space:nowrap; }
#s-tongket .takeaways{ grid-template-columns:repeat(7,1fr); gap:clamp(.35rem,1vw,.7rem); }
#s-tongket .tka b{ font-size:clamp(.66rem,1vw,.84rem); line-height:1.2; }
@media (max-width:900px){ .kitwrap{ grid-template-columns:1fr; } #s-tongket .takeaways{ grid-template-columns:repeat(4,1fr); } }
@media print{
  .plibrun{ background:#e6f7ee !important; color:#064e3b !important; border-color:#86efac !important; }
  .plibrun i{ color:#047857 !important; }
  .kitlinks{ display:none !important; }
  #s-tongket .takeaways{ grid-template-columns:repeat(7,1fr) !important; }
  .kitmap__s,.kitmap__k{ font-size:7.4pt !important; padding:.25rem .45rem !important; }
}
</style>
</head>'''
rep('</style>\n</head>', css)

# ---------------------------------------------------------------- 15. Dau gach: em/en dash -> gach ngang (quy uoc van ban PVEP)
n_em = src.count('—'); n_en = src.count('–')
src = src.replace(' — ', ' - ').replace('—', '-').replace('–', '-')
log.append(f"dash: em x{n_em}, en x{n_en}")

# ---------------------------------------------------------------- 16. tieu de, dem slide tinh
rep('<span id="tot">43</span>', '<span id="tot">28</span>')

io.open(PATH, "w", encoding="utf-8", newline="\n").write(src)
print("\n".join(log))
print(f"len {orig_len} -> {len(src)}; slides: {src.count('<section class=\"slide\"')}")
