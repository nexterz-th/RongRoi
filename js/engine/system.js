var TL = window.TL || {};

TL.system = (function () {

    function orientation() {
        try {
            var o = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
            if (o && o.type) return o.type + (o.angle !== undefined ? ' (' + o.angle + '\u00b0)' : '');
            if (window.matchMedia('(orientation: portrait)').matches)  return 'แนวตั้ง';
            if (window.matchMedia('(orientation: landscape)').matches) return 'แนวนอน';
            return 'ไม่ทราบ';
        } catch (_) { return 'ไม่ทราบ'; }
    }

    function cssMedia() {
        var checks = [
            ['prefers-color-scheme','dark'],
            ['prefers-color-scheme','light'],
            ['prefers-reduced-motion','reduce'],
            ['prefers-contrast','more'],
            ['pointer','coarse'],
            ['pointer','fine'],
            ['hover','hover'],
            ['hover','none'],
            ['any-pointer','coarse'],
            ['inverted-colors','inverted'],
            ['forced-colors','active'],
            ['display-mode','browser']
        ];
        var matched = [];
        checks.forEach(function (pair) {
            try {
                if (window.matchMedia('(' + pair[0] + ': ' + pair[1] + ')').matches) {
                    matched.push(pair[0] + ': ' + pair[1]);
                }
            } catch (_) {}
        });
        return matched.length ? matched.join(', ') : 'ไม่มีสัญญาณเด่นชัด';
    }

    function timing() {
        try {
            var N   = 60000;
            var times = [];
            for (var t = 0; t < 5; t++) {
                var s = performance.now(), x = 0;
                for (var i = 0; i < N; i++) x += Math.sqrt(i) * Math.sin(i);
                times.push(performance.now() - s);
                void x;
            }
            times.sort(function (a, b) { return a - b; });
            var med = times[2];
            if (med < 3)  return 'เร็วมาก (' + med.toFixed(2) + 'ms) น่าจะเป็นฮาร์ดแวร์จริง';
            if (med < 10) return 'เร็ว (' + med.toFixed(2) + 'ms)';
            if (med < 25) return 'ปานกลาง (' + med.toFixed(2) + 'ms) อาจถูก throttle';
            return 'ช้า (' + med.toFixed(2) + 'ms) ความละเอียดของ timer อาจถูกจำกัด';
        } catch (_) { return 'วัดไม่ได้'; }
    }

    function torSignals() {
        var signals = [];
        if (window.screen.width === 1000 && window.screen.height === 900) signals.push('ความละเอียดมาตรฐานของ Tor');
        if (window.innerWidth === 1000) signals.push('letterbox ที่ 1000px');
        if (navigator.languages && navigator.languages.length === 1 && navigator.languages[0] === 'en-US') {
            signals.push('บังคับภาษาเป็น en-US');
        }
        if (navigator.hardwareConcurrency === 1) signals.push('ปิดบัง CPU เหลือ 1 คอร์');
        if (!navigator.deviceMemory)             signals.push('ซ่อน RAM');
        return signals.length ? 'น่าจะเป็น Tor Browser ' + signals.join(', ') : null;
    }

    function connection() {
        var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (!conn) return 'เบราว์เซอร์นี้ไม่เปิดเผย';
        var parts = [];
        if (conn.effectiveType) parts.push(conn.effectiveType.toUpperCase());
        if (conn.type && conn.type !== 'unknown') parts.push(conn.type);
        if (conn.downlink)      parts.push(conn.downlink + ' Mbps');
        if (conn.downlinkMax && conn.downlinkMax !== Infinity) parts.push(conn.downlinkMax + ' Mbps max');
        if (conn.rtt !== undefined && conn.rtt !== null) parts.push('RTT ' + conn.rtt + 'ms');
        if (conn.saveData)      parts.push('เปิดโหมดประหยัดข้อมูล');
        return parts.length ? parts.join(' | ') : 'เชื่อมต่ออยู่';
    }

    function clientHints() {
        if (!navigator.userAgentData) return null;
        var uad    = navigator.userAgentData;
        var brands = (uad.brands || [])
            .filter(function (b) { return b.brand.indexOf('Not') === -1 && b.brand !== 'Chromium'; })
            .map(function (b) { return b.brand + ' ' + b.version; })
            .join(', ');
        if (!brands) {
            brands = (uad.brands || []).map(function (b) { return b.brand + ' ' + b.version; }).join(', ') || 'ไม่ทราบ';
        }
        return { brands: brands, mobile: uad.mobile ? 'ใช่' : 'ไม่ใช่', platform: uad.platform || 'ไม่ทราบ' };
    }

    function get() {
        var sc = window.screen;
        var display = sc.width + 'x' + sc.height;
        if (sc.availWidth && (sc.availWidth !== sc.width || sc.availHeight !== sc.height)) {
            display += ' (ใช้ได้: ' + sc.availWidth + 'x' + sc.availHeight + ')';
        }

        var ram = navigator.deviceMemory
            ? '~' + navigator.deviceMemory + ' GB (API จำกัดที่ 8)'
            : 'ไม่เปิดเผย';

        var cpu = navigator.hardwareConcurrency
            ? navigator.hardwareConcurrency + ' logical cores'
            : 'ไม่เปิดเผย';

        var langs = navigator.languages
            ? Array.prototype.slice.call(navigator.languages, 0, 5).join(', ')
            : navigator.language || 'ไม่ทราบ';

        return {
            browser:     TL.browser(),
            platform:    TL.platform(),
            cpu:         cpu,
            ram:         ram,
            display:     display,
            orientation: orientation(),
            dpr:         window.devicePixelRatio ? window.devicePixelRatio + 'x' : 'ไม่ทราบ',
            colorDepth:  sc.colorDepth + '-bit',
            touch:       navigator.maxTouchPoints > 0 ? navigator.maxTouchPoints + ' จุดสัมผัส' : 'ไม่มี',
            language:    navigator.language || 'ไม่ทราบ',
            languages:   langs,
            timezone:    Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection:  connection(),
            timing:      timing(),
            css:         cssMedia(),
            tor:         torSignals(),
            hints:       clientHints()
        };
    }

    return { get: get };
})();

window.TL = TL;
