var TL = window.TL || {};

(function () {
    var trapBtn   = document.getElementById('trap-button');
    var backBtn   = document.getElementById('back-btn');
    var heroEl    = document.getElementById('hero-container');
    var resultsEl = document.getElementById('results-container');
    var docsEl    = document.getElementById('documentation-section');
    var scoreEl   = document.getElementById('score-section');
    var termEl    = document.getElementById('terminal-output');
    var titlebar  = document.getElementById('terminal-titlebar');
    var term      = TL.terminal;

    term.init(termEl);

    function showCopyBtn() {
        var old = document.getElementById('copy-log-btn');
        if (old) old.remove();
        var btn = document.createElement('button');
        btn.id        = 'copy-log-btn';
        btn.textContent = '\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01';
        btn.className = 'copy-log-btn';
        btn.addEventListener('click', function () {
            var raw = termEl.textContent.replace(/\u2588/g, '').trimEnd();
            var ok  = function () { btn.textContent = '\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e41\u0e25\u0e49\u0e27'; setTimeout(function () { btn.textContent = '\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01'; }, 2000); };
            var err = function () { btn.textContent = '\u0e25\u0e49\u0e21\u0e40\u0e2b\u0e25\u0e27';  setTimeout(function () { btn.textContent = '\u0e04\u0e31\u0e14\u0e25\u0e2d\u0e01\u0e1a\u0e31\u0e19\u0e17\u0e36\u0e01'; }, 2000); };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(raw).then(ok).catch(function () { fallbackCopy(raw, ok, err); });
            } else { fallbackCopy(raw, ok, err); }
        });
        titlebar.appendChild(btn);
    }

    function fallbackCopy(text, ok, err) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
            document.body.appendChild(ta);
            ta.focus(); ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            ok();
        } catch (_) { err(); }
    }

    function resetView() {
        term.abort();
        resultsEl.style.display = 'none';
        scoreEl.style.display   = 'none';
        scoreEl.innerHTML       = '';
        docsEl.style.display    = 'none';
        heroEl.style.display    = 'flex';
        trapBtn.textContent     = 'เริ่มตรวจสอบความปลอดภัย';
        trapBtn.disabled        = false;
        var old = document.getElementById('copy-log-btn');
        if (old) old.remove();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    backBtn.addEventListener('click', resetView);

    trapBtn.addEventListener('click', async function () {
        if (term.isRunning()) return;

        term.reset();
        scoreEl.style.display      = 'none';
        scoreEl.innerHTML          = '';
        docsEl.style.display       = 'none';
        trapBtn.textContent        = 'กำลังทำงาน...';
        trapBtn.disabled           = true;
        heroEl.style.display       = 'none';
        resultsEl.style.display    = 'block';
        term.setTyping(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        var dataPromise = TL.collect();

        if (!await term.header()) return;
        if (!await term.blank(160)) return;
        if (!await term.typeLine('เริ่มสแกน กำลังดึงทุกอย่างที่ดึงได้จากเบราว์เซอร์ของคุณ', 140)) return;
        if (!await term.typeLine('บางการตรวจสอบต้องใช้เวลาสักครู่ กรุณารอสักหน่อย', 120)) return;
        if (!await term.blank(320)) return;

        if (!await term.typeLine('[NET] กำลังติดต่อบริการระบุพิกัดจาก IP (geolocation)...', 110)) return;
        if (!await term.typeLine('[NET] กำลังเทียบ ISP ของคุณกับช่วง IP ของ VPN และ datacenter ที่รู้จัก...', 100)) return;

        var data = await dataPromise;
        if (term.wasAborted()) return;

        var net = data.network;
        if (!await term.blank(160)) return;
        if (!await term.typeLine('[NET] ได้รับการตอบกลับ นี่คือสิ่งที่เราพบ:', 90)) return;
        if (!await term.blank(80)) return;

        if (!await term.typeLine('[+] เครือข่าย (NETWORK)', 60)) return;
        if (!await term.field('IP',          net.ip,                       80))  return;
        if (!await term.field('ตำแหน่ง',      net.loc,                      150)) return;
        if (!await term.field('ISP',         net.org,                      130)) return;
        if (!await term.field('โซนเวลาระบบ',  net.systemTimezone,           100)) return;
        if (!await term.field('โซนเวลา IP',   net.ipTimezone || 'ไม่ทราบ',  100)) return;
        if (!await term.field('VPN / Proxy', net.vpn,                      180)) return;
        if (!await term.blank(260)) return;

        if (!await term.typeLine('[FP] เริ่มดึงลายนิ้วมือฮาร์ดแวร์ (hardware fingerprint)', 90)) return;
        if (!await term.blank(70)) return;

        if (!await term.typeLine('[FP] กำลังวาด canvas ที่มองไม่เห็นแล้วอ่านค่าพิกเซลดิบ...', 150)) return;
        if (!await term.field('Canvas',       data.canvas,      460)) return;
        if (!await term.blank(90)) return;

        if (!await term.typeLine('[FP] กำลังส่งสัญญาณเสียงผ่าน compressor แล้วเก็บตัวอย่างผลลัพธ์...', 150)) return;
        if (!await term.field('Audio',        data.audio,       660)) return;
        if (!await term.blank(90)) return;

        if (!await term.typeLine('[FP] กำลังสอบถาม WebGL renderer เพื่อหาตัวตน GPU ของคุณ...', 130)) return;
        if (!await term.field('GPU Vendor',   data.gpu.vendor,  280)) return;
        if (!await term.field('GPU Model',    data.gpu.renderer,150)) return;
        if (!await term.field('WebGL FP',     data.webglFP,     160)) return;
        if (!await term.field('HW Accel',     data.hwAccel,     160)) return;
        if (!await term.blank(90)) return;

        if (!await term.typeLine('[FP] กำลังขอให้เบราว์เซอร์แสดงรายการอุปกรณ์สื่อ (media devices) ที่เชื่อมต่อ...', 110)) return;
        if (!await term.field('อุปกรณ์',      data.devices,     380)) return;
        if (!await term.blank(90)) return;

        if (!await term.typeLine('[FP] กำลังวัด refresh rate ของจอผ่านจังหวะ animation frame...', 150)) return;
        if (!await term.field('Refresh Rate', data.refreshRate, 420)) return;
        if (!await term.blank(90)) return;

        if (!await term.typeLine('[FP] กำลังตรวจหาฟอนต์จากรายการทดสอบทั้งหมด...', 160)) return;
        if (!await term.field('ฟอนต์',        data.fonts,       500)) return;

        if (data.voices) {
            if (!await term.blank(50)) return;
            if (!await term.typeLine('[FP] กำลังอ่านรายชื่อเสียงสังเคราะห์ (speech synthesis)...', 110)) return;
            if (!await term.field('เสียงพูด',  data.voices,      260)) return;
        }

        if (!await term.blank(240)) return;
        if (!await term.typeLine('[+] ดึงลายนิ้วมือฮาร์ดแวร์เสร็จสมบูรณ์', 70)) return;
        if (!await term.blank(260)) return;

        if (!await term.typeLine('[SYS] กำลังดึงข้อมูลระบบ (telemetry) จาก navigator API...', 110)) return;
        if (!await term.blank(120)) return;

        if (!await term.typeLine('[+] ระบบ (SYSTEM)', 60)) return;
        if (!await term.field('เบราว์เซอร์',  data.sys.browser,    90))  return;
        if (!await term.field('แพลตฟอร์ม',    data.sys.platform,   130)) return;
        if (!await term.field('คอร์ CPU',    data.sys.cpu,        160)) return;
        if (!await term.field('RAM',          data.sys.ram,        140)) return;
        if (!await term.field('หน้าจอ',       data.sys.display,    120)) return;
        if (!await term.field('การวางแนว',    data.sys.orientation,90))  return;
        if (!await term.field('Pixel Ratio',  data.sys.dpr,        90))  return;
        if (!await term.field('ความลึกสี',    data.sys.colorDepth, 90))  return;
        if (!await term.field('สัมผัส',       data.sys.touch,      120)) return;
        if (!await term.field('ภาษา',         data.sys.language,   100)) return;
        if (!await term.field('รายการภาษา',   data.sys.languages,  140)) return;
        if (!await term.field('โซนเวลา',      data.sys.timezone,   90))  return;
        if (!await term.field('การเชื่อมต่อ', data.sys.connection, 110)) return;
        if (!await term.field('CSS Media',    data.sys.css,        150)) return;
        if (!await term.field('JS Timing',    data.sys.timing,     130)) return;

        if (data.sys.tor) {
            if (!await term.blank(70)) return;
            if (!await term.typeLine('[!] ' + data.sys.tor, 160)) return;
        }

        if (data.sys.hints) {
            if (!await term.blank(110)) return;
            if (!await term.typeLine('[SYS] User-Agent Client Hints ถูกเปิดเผยบนเบราว์เซอร์นี้:', 110)) return;
            if (!await term.field('CH Brands',   data.sys.hints.brands,   110)) return;
            if (!await term.field('CH Mobile',   data.sys.hints.mobile,   70))  return;
            if (!await term.field('CH Platform', data.sys.hints.platform, 70))  return;
        }

        if (!await term.blank(240)) return;

        if (data.battery) {
            if (!await term.typeLine('[SYS] Battery API ตอบกลับ:', 90)) return;
            if (!await term.field('แบตเตอรี่',    data.battery,    160)) return;
            if (!await term.blank(160)) return;
        }

        if (!await term.typeLine('[PRIV] กำลังตรวจสัญญาณความเป็นส่วนตัวและความสามารถของเบราว์เซอร์...', 110)) return;
        if (!await term.typeLine('[PRIV] กำลังทดสอบการเชื่อมต่อไปยัง ad network ที่รู้จัก...', 150)) return;
        if (!await term.blank(160)) return;

        if (!await term.typeLine('[+] ความเป็นส่วนตัว (PRIVACY)', 60)) return;
        if (!await term.field('ตัวอ่าน PDF',   data.priv.pdf,     130)) return;
        if (!await term.field('คุกกี้',        data.priv.cookies, 100)) return;
        if (!await term.field('LocalStorage',  data.priv.storage, 100)) return;
        if (!await term.field('IndexedDB',     data.priv.idb,     100)) return;
        if (!await term.field('WebRTC',        data.priv.webrtc,  100)) return;
        if (!await term.field('ServiceWorker', data.priv.sw,      100)) return;
        if (!await term.field('Do Not Track',  data.priv.dnt,     140)) return;
        if (!await term.field('GPC Header',    data.priv.gpc,     140)) return;
        if (!await term.field('ตัวบล็อกโฆษณา', data.adblock,      480)) return;
        if (!await term.blank(140)) return;

        if (!await term.divider('สแกนเสร็จสมบูรณ์')) return;

        term.markComplete();

        if (!term.wasAborted()) {
            showCopyBtn();
            TL.score.render(scoreEl, TL.score.calculate(data));
            docsEl.style.display = 'block';
            window.scrollBy({ top: 150, behavior: 'smooth' });
        }
    });
})();
