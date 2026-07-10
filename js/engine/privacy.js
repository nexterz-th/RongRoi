var TL = window.TL || {};

TL.privacy = (function () {

    function storage() {
        try {
            localStorage.setItem('_tl', '1');
            localStorage.removeItem('_tl');
            return 'อนุญาต';
        } catch (_) { return 'ถูกบล็อก'; }
    }

    function idb() {
        try {
            return (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB) ? 'ใช้งานได้' : 'ถูกบล็อก';
        } catch (_) { return 'ถูกบล็อก'; }
    }

    function webrtc() {
        try {
            var RTC = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
            return RTC ? 'ใช้งานได้ (อาจรั่ว IP)' : 'ถูกบล็อก';
        } catch (_) { return 'ถูกบล็อก'; }
    }

    function serviceWorker() {
        try { return 'serviceWorker' in navigator ? 'รองรับ' : 'ไม่รองรับ'; } catch (_) { return 'ไม่รองรับ'; }
    }

    async function adblock() {
        var el = document.getElementById('ad-trap');
        if (el) {
            var s = window.getComputedStyle(el);
            if (el.offsetHeight === 0 || el.offsetWidth === 0 ||
                s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') {
                return '✓ element โฆษณาถูกซ่อนโดยส่วนขยาย (extension)';
            }
        }

        var baits = [
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?cb=' + Date.now(),
            'https://static.doubleclick.net/instream/ad_status.js?cb=' + Date.now(),
            'https://ads.pubmatic.com/AdServer/js/gshowad.js?cb=' + Date.now()
        ];

        var check = function (url) {
            return new Promise(function (resolve) {
                var img   = new Image();
                var timer = setTimeout(function () { img.src = ''; resolve(true); }, 1200);
                img.onload  = function () { clearTimeout(timer); resolve(false); };
                img.onerror = function () { clearTimeout(timer); resolve(true); };
                img.src = url;
            });
        };

        for (var i = 0; i < baits.length; i++) {
            if (await check(baits[i])) return '✓ คำขอไปยัง ad network ถูกบล็อก';
        }
        return '✗ คำขอโฆษณาผ่านไปได้โดยไม่ถูกบล็อก';
    }

    async function battery() {
        if (!('getBattery' in navigator)) return null;
        try {
            var b = await navigator.getBattery();

            if (b.level === 1.0 && b.charging === true &&
                b.chargingTime === 0 && !isFinite(b.dischargingTime)) {
                return 'กำลังส่งค่าปลอม สถานะ 100% ชาร์จอยู่ คือการปลอมความเป็นส่วนตัวที่รู้จักของ Brave/Firefox';
            }
            if (b.level === 1.0 && b.charging === true) {
                return 'อาจเป็นค่าปลอม สถานะ 100% ชาร์จอยู่คือค่าปลอมเริ่มต้นที่เบราว์เซอร์ความเป็นส่วนตัวใช้';
            }
            if (b.dischargingTime && isFinite(b.dischargingTime) && b.dischargingTime > 259200) {
                return 'อาจเป็นค่าปลอม เวลาคายประจุที่รายงานยาวผิดปกติ';
            }

            var level = Math.round(b.level * 100);
            var state = b.charging ? 'กำลังชาร์จ' : 'กำลังคายประจุ';
            var extra = '';

            if (!b.charging && b.dischargingTime && isFinite(b.dischargingTime)) {
                var dm = Math.round(b.dischargingTime / 60);
                if (dm < 1440) extra = ', เหลือประมาณ ' + Math.floor(dm/60) + ' ชม. ' + (dm%60) + ' นาที';
            }
            if (b.charging && b.chargingTime && isFinite(b.chargingTime) && b.chargingTime > 0) {
                var cm = Math.round(b.chargingTime / 60);
                if (cm < 600) extra = ', เต็มในอีกประมาณ ' + Math.floor(cm/60) + ' ชม. ' + (cm%60) + ' นาที';
            }

            return level + '% (' + state + ')' + extra;
        } catch (_) { return null; }
    }

    function get() {
        return {
            pdf:     navigator.pdfViewerEnabled ? 'มีตัวอ่านในตัว' : 'ไม่มีตัวอ่าน PDF ในตัว',
            cookies: navigator.cookieEnabled ? 'ยอมรับ' : 'ปฏิเสธ',
            dnt:     navigator.doNotTrack === '1' || window.doNotTrack === '1' ? 'ส่งแล้ว' : 'ไม่ส่ง',
            gpc:     navigator.globalPrivacyControl ? 'เปิดใช้งาน' : 'ไม่ได้ตั้งค่า',
            storage: storage(),
            idb:     idb(),
            webrtc:  webrtc(),
            sw:      serviceWorker()
        };
    }

    return { get: get, adblock: adblock, battery: battery };
})();

window.TL = TL;
