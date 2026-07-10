var TL = window.TL || {};

TL.score = (function () {

    function row(label, status, pts, good) {
        return { label: label, status: status, pts: pts, good: good };
    }

    function calculate(d) {
        var pts = 0;
        var bd  = [];

        var adBlocked = d.adblock && d.adblock.indexOf('✓') !== -1;
        if (adBlocked) { pts += 1.5; bd.push(row('Ad / Tracker Blocker',   'ทำงานอยู่',   '+1.5', true));  }
        else           {             bd.push(row('Ad / Tracker Blocker',   'ไม่พบ',       '+0.0', false)); }

        var dnt = d.priv && d.priv.dnt === 'ส่งแล้ว';
        if (dnt) { pts += 0.5; bd.push(row('Do Not Track',           'เปิดใช้งาน',  '+0.5', true));  }
        else     {             bd.push(row('Do Not Track',           'ปิดอยู่',     '+0.0', false)); }

        var gpc = d.priv && d.priv.gpc === 'เปิดใช้งาน';
        if (gpc) { pts += 0.5; bd.push(row('Global Privacy Control', 'เปิดใช้งาน',  '+0.5', true));  }
        else     {             bd.push(row('Global Privacy Control', 'ปิดอยู่',     '+0.0', false)); }

        var canvasOk = d.canvas && (
            d.canvas.indexOf('ป้องกัน') !== -1 ||
            d.canvas.indexOf('บล็อก')   !== -1
        );
        if (canvasOk) { pts += 1.5; bd.push(row('ป้องกัน Canvas Fingerprint', 'ทำงานอยู่',   '+1.5', true));  }
        else          {             bd.push(row('ป้องกัน Canvas Fingerprint', 'ถูกเปิดเผย',  '+0.0', false)); }

        var audioOk = d.audio && (
            d.audio.indexOf('ป้องกัน') !== -1 ||
            d.audio.indexOf('บล็อก')   !== -1 ||
            d.audio.indexOf('จำกัด')   !== -1
        );
        if (audioOk) { pts += 1.0; bd.push(row('ป้องกัน Audio Fingerprint', 'ทำงานอยู่',   '+1.0', true));  }
        else         {             bd.push(row('ป้องกัน Audio Fingerprint', 'ถูกเปิดเผย',  '+0.0', false)); }

        var vpnOn = d.network && d.network.vpn && d.network.vpn !== 'ไม่พบ';
        if (vpnOn) { pts += 1.0; bd.push(row('VPN / Private Network',   'ทำงานอยู่',   '+1.0', true));  }
        else       {             bd.push(row('VPN / Private Network',   'ไม่ได้ใช้',   '+0.0', false)); }

        var cookiesOff = d.priv && d.priv.cookies === 'ปฏิเสธ';
        if (cookiesOff) { pts += 0.5; bd.push(row('การปฏิเสธคุกกี้',       'บล็อกอยู่',   '+0.5', true));  }
        else            {             bd.push(row('การปฏิเสธคุกกี้',       'ยอมรับอยู่',  '+0.0', false)); }

        var storageBlocked = d.priv && d.priv.storage === 'ถูกบล็อก';
        if (storageBlocked) { pts += 0.5; bd.push(row('บล็อก Local Storage',   'ถูกบล็อก',    '+0.5', true));  }
        else                {             bd.push(row('บล็อก Local Storage',   'เข้าถึงได้',  '+0.0', false)); }

        var gpuMasked = d.gpu && (d.gpu.masked === true || (d.gpu.vendor && d.gpu.vendor.indexOf('locked') !== -1));
        if (gpuMasked) { pts += 1.0; bd.push(row('ปิดบัง WebGL / GPU',    'ปิดบังแล้ว',  '+1.0', true));  }
        else           {             bd.push(row('ปิดบัง WebGL / GPU',    'ถูกเปิดเผย',  '+0.0', false)); }

        var mediaOk = d.devices && (
            d.devices.indexOf('บล็อก') !== -1 ||
            d.devices.indexOf('จำกัด') !== -1 ||
            /กล้อง: 0 \| ไมค์: 0 \| ลำโพง: 0/.test(d.devices)
        );
        if (mediaOk) { pts += 0.5; bd.push(row('ความเป็นส่วนตัว Media Devices', 'ป้องกันแล้ว', '+0.5', true));  }
        else         {             bd.push(row('ความเป็นส่วนตัว Media Devices', 'นับจำนวนได้', '+0.0', false)); }

        var rtcBlocked = d.priv && d.priv.webrtc === 'ถูกบล็อก';
        if (rtcBlocked) { pts += 0.5; bd.push(row('ป้องกัน WebRTC Leak',   'ถูกบล็อก',    '+0.5', true));  }
        else            {             bd.push(row('ป้องกัน WebRTC Leak',   'ใช้งานได้',   '+0.0', false)); }

        var cpuMasked = d.sys && d.sys.cpu === 'ไม่เปิดเผย';
        var ramMasked = d.sys && d.sys.ram === 'ไม่เปิดเผย';
        if      (cpuMasked && ramMasked) { pts += 1.0; bd.push(row('ปิดบังข้อมูลฮาร์ดแวร์', 'ปิดบังทั้งคู่', '+1.0', true));  }
        else if (cpuMasked || ramMasked) { pts += 0.5; bd.push(row('ปิดบังข้อมูลฮาร์ดแวร์', 'ปิดบังบางส่วน','+0.5', true));  }
        else                             {             bd.push(row('ปิดบังข้อมูลฮาร์ดแวร์', 'ถูกเปิดเผย',  '+0.0', false)); }

        var battSpoofed = d.battery && d.battery.indexOf('ปลอม') !== -1;
        if (battSpoofed) { pts += 0.5; bd.push(row('ความเป็นส่วนตัว Battery API', 'ป้องกันแล้ว', '+0.5', true));  }
        else             {             bd.push(row('ความเป็นส่วนตัว Battery API', 'ถูกเปิดเผย',  '+0.0', false)); }

        var https = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        if (https) { pts += 0.5; bd.push(row('การเชื่อมต่อที่ปลอดภัย',  'HTTPS',       '+0.5', true));  }
        else       {             bd.push(row('การเชื่อมต่อที่ปลอดภัย',  'HTTP ธรรมดา', '+0.0', false)); }

        var score = Math.min(10, Math.round(pts * 10) / 10);
        var grade, verdict;
        if      (score >= 8.5) { grade = 'A+'; verdict = 'ยอดเยี่ยม แทบมองไม่เห็นโดย tracker'; }
        else if (score >= 7.0) { grade = 'A';  verdict = 'แข็งแกร่ง เบราว์เซอร์ป้องกันดีมาก'; }
        else if (score >= 5.5) { grade = 'B';  verdict = 'ปานกลาง มองเห็นได้แต่ถูกป้องกันบางส่วน'; }
        else if (score >= 4.0) { grade = 'C';  verdict = 'อ่อน มีความเสี่ยงต่อการเก็บลายนิ้วมืออย่างชัดเจน'; }
        else if (score >= 2.5) { grade = 'D';  verdict = 'แย่ โปรไฟล์ถูกติดตามได้ง่ายมาก'; }
        else                   { grade = 'F';  verdict = 'วิกฤต คุณเปิดเผยตัวเองทั้งหมด'; }

        return { score: score, max: 10, grade: grade, verdict: verdict, breakdown: bd };
    }

    function render(section, result) {
        var pct   = (result.score / result.max) * 100;
        var color = pct >= 85 ? '#4CAF50'
                  : pct >= 70 ? '#8bc34a'
                  : pct >= 55 ? '#ffc107'
                  : pct >= 40 ? '#ff9800'
                  : '#f44336';

        section.innerHTML    = '';
        section.style.display = 'block';

        var hdr = document.createElement('div');
        hdr.className   = 'score-header';
        hdr.innerHTML   =
            '<div class="score-label">คะแนนความปลอดภัยของเบราว์เซอร์</div>' +
            '<div class="score-subtitle">อ้างอิงจากการตรวจสัญญาณความเป็นส่วนตัว ' + result.breakdown.length + ' รายการ</div>';
        section.appendChild(hdr);

        var hero = document.createElement('div');
        hero.className  = 'score-hero';
        hero.innerHTML  =
            '<div class="score-number" style="color:' + color + '">' +
                result.score.toFixed(1) + '<span class="score-denom"> / 10</span>' +
            '</div>' +
            '<div class="score-grade" style="color:' + color + ';border-color:' + color + '">' + result.grade + '</div>';
        section.appendChild(hero);

        var bar = document.createElement('div');
        bar.className   = 'score-bar-wrap';
        bar.innerHTML   =
            '<div class="score-bar-track">' +
                '<div class="score-bar-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
            '</div>' +
            '<div class="score-verdict">' + result.verdict + '</div>';
        section.appendChild(bar);

        var grid = document.createElement('div');
        grid.className  = 'score-grid';
        result.breakdown.forEach(function (item) {
            var r = document.createElement('div');
            r.className = 'score-row ' + (item.good ? 'score-row-good' : 'score-row-bad');
            r.innerHTML =
                '<span class="score-row-icon">' + (item.good ? '\u2713' : '\u2717') + '</span>' +
                '<span class="score-row-label">' + item.label + '</span>' +
                '<span class="score-row-status">' + item.status + '</span>' +
                '<span class="score-row-pts">' + item.pts + '</span>';
            grid.appendChild(r);
        });
        section.appendChild(grid);
    }

    return { calculate: calculate, render: render };
})();

window.TL = TL;
