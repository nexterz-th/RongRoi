<div align="center">

<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="72" height="72" rx="16" fill="#0a0e14"/>
  <polyline points="12,60 12,36 36,36 36,12 60,12" stroke="#2dd4bf" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="60" r="3.5" fill="#2dd4bf"/>
  <circle cx="36" cy="36" r="3.5" fill="#2dd4bf"/>
  <circle cx="60" cy="12" r="3.5" fill="#2dd4bf"/>
  <circle cx="36" cy="36" r="8" stroke="#2dd4bf" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
</svg>

# RongRoi · ร่องรอย

**เครื่องมือสาธิตการเก็บลายนิ้วมือเบราว์เซอร์ เพื่อการเรียนรู้ด้านความเป็นส่วนตัว**


[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![No Build Step](https://img.shields.io/badge/build-none%20required-blue.svg?style=flat-square)](#getting-started)
[![Zero Backend](https://img.shields.io/badge/backend-none-orange.svg?style=flat-square)](#privacy-guarantee)
[![Pure JS](https://img.shields.io/badge/stack-vanilla%20JS-yellow.svg?style=flat-square)](#project-structure)

*เปิดหน้าเว็บ กดปุ่มเดียว แล้วดูว่าเบราว์เซอร์ของคุณแอบปล่อยข้อมูลอะไรออกไปบ้าง — แบบเรียลไทม์*

</div>

---

## สารบัญ

- [RongRoi คืออะไร](#-rongroi-คืออะไร)
- [ฟีเจอร์หลัก](#-ฟีเจอร์หลัก)
- [การรับประกันความเป็นส่วนตัว](#-การรับประกันความเป็นส่วนตัว)
- [เริ่มต้นใช้งาน](#-เริ่มต้นใช้งาน)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [สถาปัตยกรรม](#-สถาปัตยกรรม)
- [ระบบให้คะแนนความเป็นส่วนตัว](#-ระบบให้คะแนนความเป็นส่วนตัว)
- [เทคนิคที่สาธิต](#-เทคนิคที่สาธิต)
- [ความเข้ากันได้กับเบราว์เซอร์](#-ความเข้ากันได้กับเบราว์เซอร์)
- [วิธีป้องกันตัวเอง](#-วิธีป้องกันตัวเอง)
- [ร่วมพัฒนา](#-ร่วมพัฒนา)
- [สัญญาอนุญาต](#-สัญญาอนุญาต)

---

## 🔍 RongRoi คืออะไร

**RongRoi (ร่องรอย)** คือเว็บสาธิตการเก็บลายนิ้วมือเบราว์เซอร์ (browser fingerprinting) ที่ทำงาน **ฝั่งไคลเอนต์ 100%**

- ❌ ไม่มีเซิร์ฟเวอร์
- ❌ ไม่เก็บข้อมูล
- ❌ ไม่ส่งข้อมูลออกไปที่ไหน

หน้าที่เดียวของมันคือ **แสดงให้คุณเห็นว่าเว็บไซต์ใด ๆ ดึงข้อมูลอะไรจากคุณได้บ้างแบบเงียบ ๆ** ผ่าน API มาตรฐานของเบราว์เซอร์ ตั้งแต่วินาทีที่หน้าเว็บโหลดเสร็จ

### ทำไมต้องมีโปรเจกต์นี้

ทุกวันนี้เครือข่ายโฆษณาและนายหน้าค้าข้อมูลเลิกพึ่งคุกกี้ไปแล้ว หันมา **เก็บลายนิ้วมือ** แทน โดยใช้การผสมกันที่ไม่ซ้ำใครของฮาร์ดแวร์ ซอฟต์แวร์ และการตั้งค่าเครือข่ายของคุณ ซึ่งแทบไม่มีเบราว์เซอร์สองเครื่องไหนเหมือนกันเป๊ะ

RongRoi รันทุกเทคนิคที่พวกเขาใช้ แล้วบอกคุณตรง ๆ ว่ามันเจออะไร และคุณจะป้องกันตัวเองได้อย่างไร — เป้าหมายคือ **ทำสิ่งที่มองไม่เห็นให้มองเห็นได้**

> 💡 **"ร่องรอย"** หมายถึงรอยเท้าหรือร่องรอยดิจิทัลที่เราทิ้งไว้ทุกครั้งที่ท่องเว็บ ซึ่งเป็นแก่นของสิ่งที่โปรเจกต์นี้ต้องการเปิดโปง

---

## ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---|---|
| 🌐 **เครือข่าย & IP** | IP สาธารณะ, ค้นหา ISP/ASN, ตำแหน่งโดยประมาณ, เทียบโซนเวลาจาก IP กับระบบเพื่อตรวจ VPN และแยก datacenter กับเครือข่ายบ้าน |
| 🛡️ **คะแนนความเป็นส่วนตัว** | ให้คะแนน 0–10 แบบถ่วงน้ำหนัก ประเมินการป้องกันที่คุณเปิดใช้ (ad blocker, กัน canvas/audio, ปิดบัง WebGL, VPN, DNT/GPC, คุกกี้, WebRTC leak) |
| 🎨 **Canvas Fingerprint** | เรนเดอร์ภาพ canvas ที่ซ่อนไว้แล้วดึง hash ที่ขึ้นกับฮาร์ดแวร์ พร้อมตรวจการแทรก noise ของ Brave และ Tor |
| 🔊 **Audio Fingerprint** | สร้างสัญญาณเสียงเงียบผ่าน oscillator + compressor ความคลาดเคลื่อน floating-point ของฮาร์ดแวร์เสียงกลายเป็น hash เฉพาะตัว |
| 🖥️ **GPU & WebGL** | อ่านผู้ผลิต/รุ่น GPU ผ่าน `WEBGL_debug_renderer_info`, ตรวจ hardware acceleration และสร้าง hash จากการเรนเดอร์ที่ต่างตามไดรเวอร์ |
| 🔧 **ฮาร์ดแวร์ระบบ** | จำนวนคอร์ CPU, RAM, ความละเอียดจอ & DPR, color depth, จุดสัมผัส, การวางแนวจอ, CSS media query และ UA Client Hints |
| 👁️ **สัญญาณความเป็นส่วนตัว** | เฮดเดอร์ DNT/GPC, นโยบายคุกกี้, สถานะ localStorage/IndexedDB, Service Worker, ตัวอ่าน PDF และการรั่วของ WebRTC |
| 📷 **อุปกรณ์สื่อ** | นับจำนวน audio input/output และกล้อง (นับอย่างเดียว ไม่เห็นชื่อถ้าไม่ขอสิทธิ์) และวัด refresh rate จอผ่าน `requestAnimationFrame` 60 เฟรม |
| 🔤 **ฟอนต์ & เสียงพูด** | ตรวจฟอนต์ที่ติดตั้งด้วยการวัดขนาด glyph บน canvas และนับจำนวนเสียงสังเคราะห์คำพูดที่ต่างกันตาม OS/เบราว์เซอร์ |
| 🔋 **การรั่วของแบตเตอรี่** | ใช้ Battery API แยกค่าจริงกับค่าปลอม จับสถานะ `100% กำลังชาร์จ 0 วินาที` ที่ Brave/Firefox ใช้เป็นค่าปลอมมาตรฐาน |
| 🧅 **ตรวจจับ Tor** | ตรวจ letterbox 1000×900, ภาษาเดี่ยว `en-US`, ปิดบัง CPU เหลือ 1 คอร์ และซ่อน `deviceMemory` |
| ⏱️ **เบนช์มาร์ก CPU** | รันลูป floating-point 5 รอบด้วย `performance.now()` แล้วเอาค่ามัธยฐานมาจัดระดับ ตรวจสภาพแวดล้อมที่ถูก throttle หรือรันบน VM |

---

## 🔒 การรับประกันความเป็นส่วนตัว

> **ไม่มีเซิร์ฟเวอร์ · ไม่มีฐานข้อมูล · ไม่มีการติดตาม**
>
> การคำนวณทุกอย่างรันในแท็บเบราว์เซอร์ของคุณเอง ไม่มีอะไรถูกส่งออกไปที่ไหนทั้งสิ้น เมื่อปิดแท็บ ข้อมูลที่เก็บมาทั้งหมดจะหายไป และซอร์สโค้ดตรวจสอบได้ทุกบรรทัด — ไม่มีไฟล์ build ที่จะซ่อนอะไรไว้

---

## 🚀 เริ่มต้นใช้งาน

ไม่ต้องใช้ npm ไม่ต้องใช้ webpack ไม่มีขั้นตอน build

**วิธีที่ 1 — เปิดไฟล์ตรง ๆ**

```bash
git clone https://github.com/NEXTERZ/rongroi.git
cd rongroi

start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

**วิธีที่ 2 — เปิดผ่าน local server** (แนะนำ เพื่อรองรับฟีเจอร์ที่ต้องใช้ secure context)

```bash
npx serve .                    # ใช้ Node
python3 -m http.server 8080    # ใช้ Python → เปิด http://localhost:8080
```

> ⚠️ **หมายเหตุ:** API บางตัว เช่น `enumerateDevices` ต้องการ secure context (`https://` หรือ `localhost`) การเสิร์ฟผ่าน local server จะครอบคลุมเงื่อนไขนี้สำหรับการทดสอบในเครื่อง

---

## 📁 โครงสร้างโปรเจกต์

```
RongRoi/
├── index.html                จุดเริ่มต้น ไม่มี framework ไม่มี bundler
│
├── css/
│   ├── base.css              ตัวแปร CSS, reset, layout, ธีมสี, footer
│   ├── components.css        nav, hero, ปุ่ม, การ์ดคะแนน, ส่วนเอกสาร
│   └── terminal.css          กรอบเทอร์มินัล + แอนิเมชันพิมพ์ดีด
│
├── js/
│   ├── core/
│   │   ├── theme.js          สลับโหมดมืด/สว่าง (จำค่าใน localStorage)
│   │   └── tl.js             namespace กลาง TL: ยูทิลิตี้, hashing, ตรวจเบราว์เซอร์
│   │
│   ├── engine/
│   │   ├── collect.js        สั่งเก็บข้อมูลจากทุก collector พร้อมกันผ่าน Promise.all
│   │   ├── system.js         CPU, RAM, จอ, ภาษา, โซนเวลา, timing, ตรรกะ Tor
│   │   ├── gpu.js            WebGL renderer, hash ฉาก WebGL, hardware acceleration
│   │   ├── canvas.js         hash ลายนิ้วมือ Canvas 2D
│   │   ├── audio.js          hash ลายนิ้วมือ AudioContext
│   │   ├── media.js          นับอุปกรณ์, refresh rate, ฟอนต์, เสียงพูด
│   │   ├── geo.js            ค้นหาตำแหน่งจาก IP + ตรรกะตรวจ VPN/datacenter
│   │   └── privacy.js        localStorage, IndexedDB, WebRTC, คุกกี้, DNT, GPC, ad blocker, แบตเตอรี่
│   │
│   └── ui/
│       ├── terminal.js       เอนจินเรนเดอร์แบบพิมพ์ดีด
│       ├── score.js          อัลกอริทึมให้คะแนน + เรนเดอร์การ์ดคะแนน
│       └── app.js            ตัวควบคุมหลัก: เชื่อมอีเวนต์ UI, รันการตรวจสอบ, แสดงผล
│
├── assets/icons/favicon.png
└── LICENSE                   MIT
```

---

## 🏗️ สถาปัตยกรรม

ทุกโมดูลผูกตัวเองเข้ากับ namespace เดียวคือ `window.TL` สคริปต์ถูกโหลดที่ท้าย `<body>` เรียงตามลำดับ dependency — ไม่มี module bundler ไม่มี import map และไม่รกพื้นที่ global เกินกว่า namespace เดียว

```
theme.js → tl.js → engine/* → ui/terminal.js → ui/score.js → ui/app.js
```

`collect.js` กระจายงานไปยังทุกโมดูล engine พร้อมกันด้วย `Promise.all` ดังนั้นเวลารวมของการตรวจสอบจึงถูกจำกัดด้วย **probe ที่ช้าที่สุดเพียงตัวเดียว** (โดยทั่วไปคือ IP geolocation หรือตัวสุ่ม refresh rate 60 เฟรม) ไม่ใช่ผลรวมของทุกตัว

---

## 📊 ระบบให้คะแนนความเป็นส่วนตัว

คะแนนมีช่วง **0 ถึง 10** การป้องกันแต่ละอย่างได้แต้มถ่วงน้ำหนักดังนี้

| การป้องกัน | น้ำหนัก | วิธีตรวจจับ |
|---|:---:|---|
| Ad / Tracker Blocker | +1.5 | element กับดักที่ซ่อนไว้ + ยิงคำขอไปยัง ad network จริง |
| ป้องกัน Canvas Fingerprint | +1.5 | ตรวจ noise/บล็อก จากผลลัพธ์ hash ของ canvas |
| ป้องกัน Audio Fingerprint | +1.0 | ตรวจค่า protected/zeroed/shift จาก hash ของเสียง |
| VPN / Private Network | +1.0 | เทียบ ISP กับ datacenter ASN + โซนเวลาไม่ตรงกัน |
| ปิดบัง WebGL / GPU | +1.0 | ธง `masked: true` หรือชื่อผู้ผลิตที่ถูกล็อก |
| ปิดบังฮาร์ดแวร์ (CPU + RAM) | +1.0 | `hardwareConcurrency` และ `deviceMemory` ไม่ถูกเปิดเผย (บางส่วน +0.5) |
| Do Not Track | +0.5 | `navigator.doNotTrack === '1'` |
| Global Privacy Control | +0.5 | `navigator.globalPrivacyControl === true` |
| การปฏิเสธคุกกี้ | +0.5 | `navigator.cookieEnabled === false` |
| บล็อก Local Storage | +0.5 | การทดสอบเขียน/อ่านโยน error |
| ความเป็นส่วนตัว Media Devices | +0.5 | การนับอุปกรณ์ถูกจำกัด หรือได้ 0 ทั้งหมด |
| ป้องกัน WebRTC Leak | +0.5 | ตรวจการมีอยู่ของ `RTCPeerConnection` |
| ความเป็นส่วนตัว Battery API | +0.5 | ตรวจค่าปลอมจาก `getBattery()` |
| การเชื่อมต่อที่ปลอดภัย | +0.5 | `location.protocol === 'https:'` |

จากนั้นแปลงเป็นเกรดตัวอักษร

| คะแนน | เกรด | ความหมาย |
|:---:|:---:|---|
| 8.5 – 10 | **A+** | ยอดเยี่ยม แทบมองไม่เห็นโดย tracker |
| 7.0 – 8.4 | **A** | แข็งแกร่ง เบราว์เซอร์ป้องกันดีมาก |
| 5.5 – 6.9 | **B** | ปานกลาง มองเห็นได้แต่ถูกป้องกันบางส่วน |
| 4.0 – 5.4 | **C** | อ่อน มีความเสี่ยงต่อการเก็บลายนิ้วมือชัดเจน |
| 2.5 – 3.9 | **D** | แย่ โปรไฟล์ถูกติดตามได้ง่ายมาก |
| 0 – 2.4 | **F** | วิกฤต คุณเปิดเผยตัวเองทั้งหมด |

---

## 🧪 เทคนิคที่สาธิต

### 🎨 Canvas Fingerprinting
Canvas API เรนเดอร์ข้อความด้วยฟอนต์ต่าง ๆ รูปทรงเรขาคณิต และการไล่เฉดสี ความต่างเล็ก ๆ ของการลบรอยหยักระดับ sub-pixel, การ hint ฟอนต์ และการ composite ของ GPU ทำให้ได้ bitmap ที่แปลงเป็น hash ซึ่งไม่ซ้ำกันในแต่ละชุด OS/GPU/ไดรเวอร์

### 🔊 Audio Fingerprinting
`OfflineAudioContext` ส่ง oscillator ผ่าน dynamics compressor ความต่างของการคำนวณ floating-point ในสาย DSP ทำให้ได้ลายนิ้วมือเชิงตัวเลขที่คงที่ โดยไม่มีเสียงเล่นออกลำโพงเลย

### 🌐 การตรวจจับ VPN / Proxy
เปรียบเทียบสัญญาณอิสระสองอย่าง

1. **เทียบโซนเวลา** — `Intl.DateTimeFormat().resolvedOptions().timeZone` (นาฬิกา OS) เทียบกับโซนเวลาจาก IP geolocation ถ้าไม่ตรงกัน แปลว่าเซิร์ฟเวอร์ VPN อยู่คนละภูมิภาคกับที่นาฬิกาเครื่องอ้าง
2. **จัดหมวด ASN** — นำ ASN ของ ISP ไปเทียบกับผู้ให้บริการ datacenter ที่รู้จัก (AWS, DigitalOcean, Hetzner ฯลฯ) เพราะ ISP บ้านเรือนไม่ใช้บล็อก ASN ร่วมกับฟาร์มเซิร์ฟเวอร์

### 🔤 การตรวจหาฟอนต์
เรนเดอร์ฟอนต์ผู้สมัครแต่ละตัวลงบน canvas แล้วเทียบขนาด glyph กับฟอนต์ monospace พื้นฐาน ถ้าขนาดต่างกันแสดงว่าฟอนต์นั้นติดตั้งอยู่ — โดยไม่ต้องใช้ Font Access API

---

## 🌍 ความเข้ากันได้กับเบราว์เซอร์

| เบราว์เซอร์ | หมายเหตุ |
|---|---|
| **Chrome / Edge 90+** | รองรับเต็มรวมถึง UA Client Hints |
| **Firefox 100+** | Battery API และบางฟิลด์ของ UA-CH ถูกจำกัด |
| **Safari 16+** | การมีอยู่ของ WebRTC แตกต่างกัน, ไม่เปิดเผย Battery API |
| **Brave** | ตรวจจับและตั้งธงการแทรก noise ของ canvas/audio ได้ |
| **Tor Browser** | ตรวจจับ letterboxing และมาตรการกันลายนิ้วมือได้ |

---

## 🛡️ วิธีป้องกันตัวเอง

| สัญญาณ | วิธีลดความเสี่ยง |
|---|---|
| Canvas fingerprint | Brave Shield หรือ Firefox `privacy.resistFingerprinting = true` |
| Audio fingerprint | เหมือนข้างบน |
| WebGL renderer leak | Brave Shields, `privacy.resistFingerprinting` หรือ uBlock Origin |
| IP / geolocation | VPN ที่มี exit node แบบ residential + ส่วนขยายปลอมโซนเวลา |
| โซนเวลา VPN ไม่ตรง | ตั้งโซนเวลาระบบให้ตรงกับภูมิภาคของเซิร์ฟเวอร์ VPN |
| ฟอนต์ | `privacy.resistFingerprinting` ทำให้การเรนเดอร์ฟอนต์เป็นมาตรฐานเดียวกัน |
| RAM / จำนวนคอร์ CPU | Brave สุ่มค่า ส่วน Firefox จำกัดทั้งคู่ |
| WebRTC IP leak | ปิดใน `about:config` → `media.peerconnection.enabled = false` |
| สถานะแบตเตอรี่ | Firefox และ Brave คืนค่าปลอมให้อยู่แล้ว |
| Refresh rate | ยังไม่มีวิธีป้องกันมาตรฐาน และไม่ค่อยถูกใช้ในการเก็บลายนิ้วมือจริง |

---

## 🤝 ร่วมพัฒนา

ยินดีรับ issue และ pull request เนื่องจากไม่มีขั้นตอน build การมีส่วนร่วมจึงใช้แค่ vanilla JS, CSS ธรรมดา และโปรแกรมแก้ HTML เท่านั้น

**กติกาเดียวที่ต้องยึด** คือ pattern ของ namespace `TL` — โมดูล engine ใหม่แต่ละตัวควร export ฟังก์ชัน `get()` (จะ sync หรือ async ก็ได้) และผูกเข้ากับ `window.TL`

---

## 📄 สัญญาอนุญาต

เผยแพร่ภายใต้สัญญาอนุญาต **MIT** — ดูรายละเอียดทั้งหมดใน [`LICENSE`](LICENSE)

Copyright © 2026 [NEXTERZ](https://nexterz.com/)

---

<div align="center">

*สร้างขึ้นเพื่อให้ความรู้ ไม่ใช่เพื่อติดตาม*

</div>
