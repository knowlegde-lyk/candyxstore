import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';

const APP_NAME = "CANDYXOFFICIAL";

// ── Encrypted Text Effect Component ──
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
function EncryptedText({ text, delay = 0, speed = 40, className = '' }) {
  const [display, setDisplay] = useState('');
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  useEffect(() => {
    if (!started) return;
    let revealed = 0;
    const len = text.length;
    // Initial scramble
    setDisplay(Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
    const interval = setInterval(() => {
      revealed++;
      if (revealed >= len) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      setDisplay(
        text.slice(0, revealed) +
        Array.from({ length: len - revealed }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
      );
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);
  if (!started) return <span className={`encrypted-text scrambled ${className}`}>{Array.from({ length: text.length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}</span>;
  return <span className={`encrypted-text ${display === text ? 'revealed' : 'scrambled'} ${className}`}>{display}</span>;
}

// ── Text Hover Effect Component ──
function TextHoverEffect({ text, secondLine }) {
  const svgRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const handleMouseMove = useCallback((e) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);
  return (
    <svg
      ref={svgRef}
      className="text-hover-svg"
      viewBox="0 0 400 120"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <defs>
        <radialGradient id="hoverGrad" cx={`${mousePos.x}%`} cy={`${mousePos.y}%`} r="30%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </radialGradient>
        <radialGradient id="hoverGlow" cx={`${mousePos.x}%`} cy={`${mousePos.y}%`} r="25%">
          <stop offset="0%" stopColor="rgba(96,165,250,0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {/* Stroke outline */}
      <text x="50%" y={secondLine ? "38%" : "55%"} textAnchor="middle" dominantBaseline="middle"
        className="text-hover-stroke">{text}</text>
      {secondLine && <text x="50%" y="72%" textAnchor="middle" dominantBaseline="middle"
        className="text-hover-stroke">{secondLine}</text>}
      {/* Gradient fill on hover */}
      <text x="50%" y={secondLine ? "38%" : "55%"} textAnchor="middle" dominantBaseline="middle"
        className="text-hover-fill" fill={hovered ? 'url(#hoverGrad)' : 'transparent'}>{text}</text>
      {secondLine && <text x="50%" y="72%" textAnchor="middle" dominantBaseline="middle"
        className="text-hover-fill" fill={hovered ? 'url(#hoverGrad)' : 'transparent'}>{secondLine}</text>}
    </svg>
  );
}

// ── 3D Marquee Component ──
const MARQUEE_IMGS = [
  'https://assets.aceternity.com/cloudinary_bkp/3d-card.png',
  'https://assets.aceternity.com/animated-modal.png',
  'https://assets.aceternity.com/github-globe.png',
  'https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png',
  'https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png',
  'https://assets.aceternity.com/glowing-effect.webp',
  'https://assets.aceternity.com/hover-border-gradient.png',
  'https://assets.aceternity.com/macbook-scroll.png',
  'https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png',
  'https://assets.aceternity.com/multi-step-loader.png',
  'https://assets.aceternity.com/vortex.png',
  'https://assets.aceternity.com/wobble-card.png',
  'https://assets.aceternity.com/world-map.webp',
  'https://assets.aceternity.com/flip-text.png',
  'https://assets.aceternity.com/animated-testimonials.webp',
  'https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png',
  'https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png',
  'https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png',
  'https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png',
  'https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png',
  'https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png',
  'https://assets.aceternity.com/placeholders-and-vanish-input.png',
  'https://assets.aceternity.com/shooting-stars-and-stars-background.png',
];

function ThreeDMarquee({ cols = 3 }) {
  const columns = React.useMemo(() => {
    const perCol = Math.ceil(MARQUEE_IMGS.length / cols);
    return Array.from({ length: cols }, (_, ci) => {
      const colImgs = MARQUEE_IMGS.slice(ci * perCol, (ci + 1) * perCol);
      // Duplicate 3x for seamless loop
      return [...colImgs, ...colImgs, ...colImgs];
    });
  }, [cols]);
  return (
    <div className="marquee-3d-wrapper">
      <div className="marquee-3d-perspective">
        <div className="marquee-3d-grid">
          {columns.map((col, ci) => (
            <div
              key={ci}
              className={`marquee-3d-col ${ci % 2 === 0 ? 'scroll-up' : 'scroll-down'}`}
            >
              {col.map((src, i) => (
                <img key={i} className="marquee-3d-img" src={src} alt="" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const installersList = [
  { id: "2", label: "7-Zip" },
  { id: "3", label: "Battle.net" },
  { id: "4", label: "Discord" },
  { id: "5", label: "Electronic Arts" },
  { id: "6", label: "Epic Games" },
  { id: "7", label: "Escape From Tarkov" },
  { id: "8", label: "GOG launcher" },
  { id: "9", label: "Google Chrome" },
  { id: "10", label: "League Of Legends" },
  { id: "11", label: "Notepad ++" },
  { id: "12", label: "OBS Studio" },
  { id: "13", label: "Roblox" },
  { id: "14", label: "Rockstar Games" },
  { id: "15", label: "Steam" },
  { id: "16", label: "Ubisoft Connect" },
  { id: "17", label: "Valorant" }
];

const gameImages = {
  "ARC Raiders": "https://image.api.playstation.com/vulcan/ap/rnd/202410/2405/21a16b9d6ca3fa4e1eb3089d7132efbcce0b48db42187b8d.png",
  "Battlefield": "https://image.api.playstation.com/vulcan/ap/rnd/202106/0115/1r2dlsxM6OosLpxWb6N53wRj.png",
  "Call of Duty": "https://image.api.playstation.com/vulcan/ap/rnd/202306/2400/98ef2e53ccfa8004fce5112ea1bc7f0adca6ce2d56aefe77.png",
  "Counter Strike 2": "https://cdn.akamai.steamstatic.com/steam/apps/730/capsule_616x353.jpg",
  "Delta Force": "https://cdn.akamai.steamstatic.com/steam/apps/2507950/capsule_616x353.jpg",
  "Frag Punk": "https://cdn.akamai.steamstatic.com/steam/apps/2943650/capsule_616x353.jpg",
  "Marvel Rivals": "https://cdn.akamai.steamstatic.com/steam/apps/2767030/capsule_616x353.jpg",
  "PUBG BATTLEGROUNDS": "https://cdn.akamai.steamstatic.com/steam/apps/578080/capsule_616x353.jpg",
  "STAR WARS Battlefront": "https://image.api.playstation.com/vulcan/img/rnd/202011/0403/yE6ZkE3D0GAT42r6fXjHlP0O.png",
  "Splitgate": "https://cdn.akamai.steamstatic.com/steam/apps/677620/capsule_616x353.jpg",
  "The Finals": "https://cdn.akamai.steamstatic.com/steam/apps/2073850/capsule_616x353.jpg"
};

// SVG Logo component
const CandyXLogo = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="45" stroke="url(#logoGrad)" strokeWidth="3" fill="rgba(59,130,246,0.08)" />
    <circle cx="50" cy="50" r="38" stroke="rgba(59,130,246,0.15)" strokeWidth="1" fill="none" />
    <polygon points="52,18 30,55 45,55 42,82 68,42 53,42" fill="url(#logoGrad)" filter="url(#logoGlow)" />
  </svg>
);

// Small logo for sidebar
const CandyXLogoSmall = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="logoGradS" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="44" stroke="url(#logoGradS)" strokeWidth="5" fill="rgba(59,130,246,0.1)" />
    <polygon points="52,18 30,55 45,55 42,82 68,42 53,42" fill="url(#logoGradS)" />
  </svg>
);

const Icons = {
  check: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  refresh: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
  setup: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
  download: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  monitor: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  windows: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="8" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /><rect x="13" y="13" width="8" height="8" rx="1" /></svg>,
  cpu: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  settings: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  gamepad: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 12h4" /><path d="M8 10v4" /><circle cx="15" cy="13" r="1" /><circle cx="18" cy="11" r="1" /></svg>,
  zap: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  key: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zM15.5 8.5L19 12" /></svg>,
  lock: <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  wifi: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" /></svg>,
  trash: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  clock: <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
};

const sidebarItemsData = [
  { id: 'boostfps', icon: Icons.zap },
  { id: 'internet', icon: Icons.wifi },
  { id: 'cleaning', icon: Icons.trash },
  { id: 'history', icon: Icons.clock },
];

// ── Translations ──
const translations = {
  en: {
    login: 'Login',
    loginDesc: 'Enter your license key to continue.',
    licenseLabel: 'License Key',
    placeholder: 'XXXX-XXXX-XXXX-XXXX',
    continue: 'Continue',
    verifying: 'Verifying...',
    errEmpty: 'Please enter your license key',
    errInvalid: 'Invalid license key. Please try again.',
    version: 'v1.0.0',
    copyright: '© 2025 candyxofficial',
    boostText: 'Boost your Windows performance',
    initializing: 'Initializing system...',
    // Sidebar
    sideBoostfps: 'Boost FPS',
    sideInternet: 'Optimize Internet',
    sideCleaning: 'Cleaning',
    sideHistory: 'Clean History',
    // Header
    headerSub: 'Select a script to optimize your system',
    // Cards - Boost FPS
    boostFpsTitle: 'Boost FPS Performance',
    boostFpsDesc: 'Optimize system for maximum gaming performance',
    boostFpsUltracoreTitle: 'Boost FPS Ultracore',
    boostFpsUltracoreDesc: 'Advanced ultracore optimization for extreme FPS boost',
    cpuTitle: 'CPU Optimization',
    cpuDesc: 'Optimize CPU priority and power settings',
    gpuTitle: 'GPU Optimization',
    gpuDesc: 'Optimize GPU and display rendering',
    // Cards - Internet
    netTitle: 'Optimize Network Settings',
    netDesc: 'Optimize TCP/IP and DNS settings for faster internet',
    dnsTitle: 'Flush DNS Cache',
    dnsDesc: 'Clear DNS resolver cache for fresh lookups',
    // Cards - Cleaning
    cleanTempTitle: 'Clean Temp Files',
    cleanTempDesc: 'Remove temporary files and free up disk space',
    diskTitle: 'Disk Cleanup',
    diskDesc: 'Run Windows disk cleanup utility',
    // Cards - History
    browserTitle: 'Clear Browser History',
    browserDesc: 'Remove browsing history from all browsers',
    winHistTitle: 'Clear Windows History',
    winHistDesc: 'Remove recent files, run history, and search history',
    // Buttons
    runBoost: 'Run Boost',
    runAgain: 'Run Again',
    running: 'Running...',
    // Terminal
    terminal: 'Terminal',
    clear: 'Clear',
    close: 'Close',
    waiting: 'Waiting for instructions...',
    // Sidebar bottom
    settings: 'Settings',
    logout: 'Logout',
    // Settings modal
    settingsTitle: 'Settings',
    saveKeyLabel: 'Save License Key',
    saveKeyDesc: 'Remember your key so it auto-fills on login',
    savedKeyLabel: 'Saved Key',
    noKeySaved: 'No key saved',
    clearKey: 'Clear',
    settingsClose: 'Close',
  },
  th: {
    login: 'เข้าสู่ระบบ',
    loginDesc: 'กรอกรหัสลิขสิทธิ์ของคุณเพื่อดำเนินการต่อ',
    licenseLabel: 'รหัสลิขสิทธิ์',
    placeholder: 'XXXX-XXXX-XXXX-XXXX',
    continue: 'ดำเนินการต่อ',
    verifying: 'กำลังตรวจสอบ...',
    errEmpty: 'กรุณากรอกรหัสลิขสิทธิ์',
    errInvalid: 'รหัสลิขสิทธิ์ไม่ถูกต้อง กรุณาลองอีกครั้ง',
    version: 'v1.0.0',
    copyright: '© 2025 demoxofficial',
    boostText: 'เพิ่มประสิทธิภาพ Windows ของคุณ',
    initializing: 'กำลังเริ่มต้นระบบ...',
    // Sidebar
    sideBoostfps: 'เพิ่มประสิทธิภาพ FPS',
    sideInternet: 'ปรับแต่งอินเทอร์เน็ต',
    sideCleaning: 'ทำความสะอาด',
    sideHistory: 'ล้างประวัติ',
    // Header
    headerSub: 'เลือกสคริปต์เพื่อปรับแต่งระบบของคุณ',
    // Cards - Boost FPS
    boostFpsTitle: 'เพิ่มประสิทธิภาพ FPS',
    boostFpsDesc: 'ปรับแต่งระบบเพื่อประสิทธิภาพเกมสูงสุด',
    boostFpsUltracoreTitle: 'Boost FPS Ultracore',
    boostFpsUltracoreDesc: 'ปรับแต่งระดับสูงสุดเพื่อ FPS สูงสุดขั้นเทพ',
    cpuTitle: 'ปรับแต่ง CPU',
    cpuDesc: 'ปรับแต่งลำดับความสำคัญ CPU และการตั้งค่าพลังงาน',
    gpuTitle: 'ปรับแต่ง GPU',
    gpuDesc: 'ปรับแต่ง GPU และการแสดงผลหน้าจอ',
    // Cards - Internet
    netTitle: 'ปรับแต่งเครือข่าย',
    netDesc: 'ปรับแต่ง TCP/IP และ DNS เพื่ออินเทอร์เน็ตเร็วขึ้น',
    dnsTitle: 'ล้างแคช DNS',
    dnsDesc: 'ล้างแคช DNS resolver เพื่อค้นหาใหม่',
    // Cards - Cleaning
    cleanTempTitle: 'ล้างไฟล์ชั่วคราว',
    cleanTempDesc: 'ลบไฟล์ชั่วคราวเพื่อเพิ่มพื้นที่ดิสก์',
    diskTitle: 'ล้างดิสก์',
    diskDesc: 'เรียกใช้เครื่องมือล้างดิสก์ของ Windows',
    // Cards - History
    browserTitle: 'ล้างประวัติเบราว์เซอร์',
    browserDesc: 'ลบประวัติการเรียกดูจากทุกเบราว์เซอร์',
    winHistTitle: 'ล้างประวัติ Windows',
    winHistDesc: 'ลบไฟล์ล่าสุด ประวัติการรัน และประวัติการค้นหา',
    // Buttons
    runBoost: 'รันเพิ่มประสิทธิภาพ',
    runAgain: 'รันอีกครั้ง',
    running: 'กำลังทำงาน...',
    // Terminal
    terminal: 'เทอร์มินัล',
    clear: 'ล้าง',
    close: 'ปิด',
    waiting: 'รอรับคำสั่ง...',
    // Sidebar bottom
    settings: 'ตั้งค่า',
    logout: 'ออกจากระบบ',
    // Settings modal
    settingsTitle: 'ตั้งค่า',
    saveKeyLabel: 'บันทึกรหัสลิขสิทธิ์',
    saveKeyDesc: 'จดจำรหัสของคุณเพื่อกรอกอัตโนมัติเมื่อเข้าสู่ระบบ',
    savedKeyLabel: 'รหัสที่บันทึก',
    noKeySaved: 'ยังไม่ได้บันทึกรหัส',
    clearKey: 'ล้าง',
    settingsClose: 'ปิด',
  },
};

const sidebarLabelKeys = {
  boostfps: 'sideBoostfps',
  internet: 'sideInternet',
  cleaning: 'sideCleaning',
  history: 'sideHistory',
};

// ═══════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════
const LoginPage = ({ onLogin, lang, onToggleLang }) => {
  const [key, setKey] = useState(() => {
    try {
      const saveEnabled = localStorage.getItem('candy_savekey') === 'true';
      if (saveEnabled) return localStorage.getItem('candy_license') || '';
    } catch (e) { }
    return '';
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!key.trim()) { setError(t.errEmpty); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://candyxstore.com/api/web/loader/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: key.trim() })
      });
      const data = await res.json();

      if (data.success) {
        try { await window.electronAPI.saveLicenseKey(key.trim()); } catch (e) { }
        onLogin(key.trim());
      } else {
        const errMap = {
          invalid_key: lang === 'th' ? 'License Key ไม่ถูกต้อง' : 'Invalid license key',
          banned: lang === 'th' ? 'License Key ถูกแบน' : 'This key has been banned',
          expired: lang === 'th' ? 'License Key หมดอายุ' : 'License key expired',
          missing_key: t.errEmpty,
          cheat_not_web_enabled: lang === 'th' ? 'Key นี้ไม่รองรับ' : 'This key is not supported',
          server_error: lang === 'th' ? 'เซิร์ฟเวอร์ผิดพลาด' : 'Server error',
        };
        setError(errMap[data.error] || t.errInvalid);
        setLoading(false);
      }
    } catch (err) {
      setError(lang === 'th' ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' : 'Cannot connect to server');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Titlebar for window dragging */}
      <div className="titlebar-drag" style={{ background: 'transparent', borderBottom: 'none', zIndex: 10 }}>
        {APP_NAME}
      </div>

      {/* Left side — Form */}
      <div className="login-left">
        {/* Interactive Ripple Grid Background */}
        {(() => {
          const ROWS = 12, COLS = 10;
          const [rippleCell, setRippleCell] = React.useState(null);
          const handleCellClick = React.useCallback((r, c) => {
            setRippleCell({ row: r, col: c, id: Date.now() });
          }, []);
          return (
            <div className="ripple-grid">
              {Array.from({ length: ROWS * COLS }).map((_, idx) => {
                const row = Math.floor(idx / COLS);
                const col = idx % COLS;
                let delay = 0, active = false;
                if (rippleCell) {
                  const dist = Math.abs(row - rippleCell.row) + Math.abs(col - rippleCell.col);
                  delay = dist * 60;
                  active = true;
                }
                return (
                  <div
                    key={idx}
                    className={`ripple-cell${active ? ' ripple-active' : ''}`}
                    style={active ? { animationDelay: `${delay}ms` } : undefined}
                    onClick={() => handleCellClick(row, col)}
                    onMouseEnter={() => handleCellClick(row, col)}
                  />
                );
              })}
            </div>
          );
        })()}
        {/* Spotlight — bright cone from top-left */}
        <div className="spotlight-container">
          <div className="spotlight-beam" />
          <div className="spotlight-glow" />
        </div>
        <div className="login-form-wrapper">

          <h1 className="login-heading"><EncryptedText text={t.login} delay={300} speed={60} key={`h-${lang}`} /></h1>
          <p className="login-desc"><EncryptedText text={t.loginDesc} delay={500} speed={25} key={`d-${lang}`} /></p>

          <form onSubmit={handleLogin} className="login-form">
            <label className="login-label"><EncryptedText text={t.licenseLabel} delay={700} speed={40} key={`l-${lang}`} /></label>
            <div className="cyber-input-wrap silver">
              <div className="login-input-group">
                <div className="login-input-icon">{Icons.key}</div>
                <input
                  type="text"
                  className="login-input"
                  placeholder={t.placeholder}
                  value={key}
                  onChange={e => { setKey(e.target.value); setError(''); }}
                  spellCheck={false}
                  autoFocus
                />
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="cyber-btn-wrap cyber-cyan">
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff', borderRightColor: '#fff' }} />
                    {t.verifying}
                  </>
                ) : (
                  <>
                    <EncryptedText text={t.continue} delay={900} speed={50} key={`b-${lang}`} />
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="login-footer">
            <span><EncryptedText text={t.version} delay={1100} speed={50} key={`vr-${lang}`} /></span>
            <span>•</span>
            <span><EncryptedText text={t.copyright} delay={1200} speed={35} key={`cr-${lang}`} /></span>
          </div>
        </div>
        {/* Language Toggle */}
        <button className="lang-toggle" onClick={onToggleLang} title={lang === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}>
          <span className="lang-flag">{lang === 'en' ? '🇹🇭' : '🇺🇸'}</span>
          <span className="lang-label">{lang === 'en' ? 'TH' : 'EN'}</span>
        </button>
      </div>

      {/* Right side — Candy Showcase */}
      <div className="login-right" style={{ overflow: 'hidden', position: 'relative' }}>
        <ThreeDMarquee />
        <div className="marquee-overlay">
          <h2 className="marquee-title">CANDY<span>STORE</span></h2>
          <p className="login-right-sub">{t.boostText}</p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════
//  UPDATE BANNER
// ═══════════════════════════════════
const UpdateBanner = () => {
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    if (window.electronAPI?.onUpdateStatus) {
      window.electronAPI.onUpdateStatus((data) => {
        if (data.status === 'up-to-date' || data.status === 'checking') {
          // Don't show banner for these
          return;
        }
        setUpdateInfo(data);
      });
    }
  }, []);

  if (!updateInfo) return null;

  const handleInstall = () => {
    if (window.electronAPI?.installUpdate) {
      window.electronAPI.installUpdate();
    }
  };

  const handleDismiss = () => setUpdateInfo(null);

  return (
    <div className="update-banner">
      <div className="update-banner-content">
        {updateInfo.status === 'available' && (
          <>
            <span className="update-icon">🔄</span>
            <span>Update v{updateInfo.version} available — downloading...</span>
          </>
        )}
        {updateInfo.status === 'downloading' && (
          <>
            <span className="update-icon">⬇️</span>
            <span>Downloading update... {updateInfo.percent}%</span>
            <div className="update-progress">
              <div className="update-progress-fill" style={{ width: `${updateInfo.percent}%` }} />
            </div>
          </>
        )}
        {updateInfo.status === 'downloaded' && (
          <>
            <span className="update-icon">✅</span>
            <span>Update v{updateInfo.version} ready!</span>
            <button className="update-install-btn" onClick={handleInstall}>
              Restart & Update
            </button>
          </>
        )}
        {updateInfo.status === 'error' && (
          <>
            <span className="update-icon">⚠️</span>
            <span>Update failed</span>
          </>
        )}
        <button className="update-dismiss-btn" onClick={handleDismiss}>✕</button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════
const Dashboard = ({ onLogout, lang }) => {
  const t = translations[lang];
  const sidebarItems = sidebarItemsData.map(item => ({ ...item, label: t[sidebarLabelKeys[item.id]] }));
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('boostfps');
  const [showSettings, setShowSettings] = useState(false);
  const [saveKeyEnabled, setSaveKeyEnabled] = useState(() => {
    try { return localStorage.getItem('candy_savekey') === 'true'; } catch (e) { return false; }
  });
  const [savedKey, setSavedKey] = useState(() => {
    try { return localStorage.getItem('candy_license') || ''; } catch (e) { return ''; }
  });

  const toggleSaveKey = () => {
    const next = !saveKeyEnabled;
    setSaveKeyEnabled(next);
    try {
      localStorage.setItem('candy_savekey', String(next));
      if (!next) {
        localStorage.removeItem('candy_license');
        setSavedKey('');
      }
    } catch (e) { }
  };

  const clearSavedKey = () => {
    try {
      localStorage.removeItem('candy_license');
      setSavedKey('');
    } catch (e) { }
  };
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [runningScript, setRunningScript] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedScripts, setCompletedScripts] = useState(new Set());
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [logs, terminalOpen]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (window.electronAPI) {
          const data = await window.electronAPI.getScripts();
          setCategories(data);
          if (data.length > 0) setActiveCategory(data[0]);
        }
      } catch (err) { console.error("Failed to load scripts:", err); }
      finally { setLoading(false); }
    };
    loadData();

    if (window.electronAPI) {
      window.electronAPI.onScriptOutput((output) => {
        const match = output.match(/(\d{1,3}(?:\.\d+)?)\s*%/);
        if (match) setProgress(Math.round(parseFloat(match[1])));
        if (!match && !output.includes('\r')) setLogs(prev => [...prev, output]);
      });
    }
    return () => { if (window.electronAPI) window.electronAPI.offScriptOutput(); };
  }, []);

  const [selectedInstaller, setSelectedInstaller] = useState("2");

  const runScript = async (scriptPath, scriptName, injectedInput) => {
    if (activeCategory?.category !== '4 Installers') setTerminalOpen(true);
    setLogs([`▸ Starting: ${scriptName}...\n`]);
    setRunningScript(scriptName);
    setProgress(0);
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.runScript(scriptPath, injectedInput || "1");
        setLogs(prev => [...prev, result]);
        setCompletedScripts(prev => new Set([...prev, scriptName]));
      } else {
        setTimeout(() => {
          setLogs(prev => [...prev, "\n✓ [Mock] Simulated success for " + scriptName]);
          setCompletedScripts(prev => new Set([...prev, scriptName]));
        }, 800);
      }
    } catch (err) {
      setLogs(prev => [...prev, `\n✗ [ERROR]: ${err}`]);
    } finally { setRunningScript(null); }
  };

  const getLogClass = (line) => {
    const l = line.toLowerCase();
    if (l.includes('error') || l.includes('failed') || l.includes('✗')) return 'error';
    if (l.includes('success') || l.includes('done') || l.includes('✓')) return 'success';
    if (line.startsWith('▸')) return 'info';
    return '';
  };

  const catName = (c) => c?.replace(/^\d+\s/, '');

  return (
    <>
      <div className="titlebar-drag">
        <span>{APP_NAME}</span>
      </div>
      <UpdateBanner />

      <div className="app-container">
        {/* ═══ Sidebar ═══ */}
        <aside className="sidebar">
          <div className="app-logo">
            <span className="logo-text">CANDY<span>STORE</span></span>
          </div>

          <nav className="nav-menu">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeCategory === item.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(item.id)}
              >
                {item.icon}
                <span className="nav-item-label">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="nav-item" onClick={() => setShowSettings(true)}>
              {Icons.settings}
              <span className="nav-item-label">{t.settings}</span>
            </div>
            <div className="nav-item" onClick={onLogout}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              <span className="nav-item-label">{t.logout}</span>
            </div>
          </div>
        </aside>

        {/* ═══ Main ═══ */}
        <main className="main-content">
          {/* ── Background Effects ── */}
          <div className="bg-effects">
            <div className="bg-spotlight" />
            <div className="bg-spotlight bg-spotlight-2" />
            <div className="bg-grid" />
            <div className="bg-beam bg-beam-1" />
            <div className="bg-beam bg-beam-2" />
            <div className="bg-beam bg-beam-3" />
            <div className="bg-beam bg-beam-4" />
            <div className="bg-beam bg-beam-5" />
            <div className="bg-beam bg-beam-6" />
            <div className="bg-fade" />
          </div>

          <header className="header">
            <h1>{sidebarItems.find(i => i.id === activeCategory)?.label || 'Dashboard'}</h1>
            <p>{t.headerSub}</p>
          </header>

          <div className="content-area">
            {activeCategory === 'boostfps' && (
              <>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.zap}</div>
                    <div>
                      <div className="card-title">{t.boostFpsTitle}</div>
                      <div className="card-desc">{t.boostFpsDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/inject_fps.ps1', 'Boost FPS')} disabled={runningScript === 'Boost FPS'}>
                    {runningScript === 'Boost FPS' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Boost FPS') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.zap}</div>
                    <div>
                      <div className="card-title">{t.boostFpsUltracoreTitle}</div>
                      <div className="card-desc">{t.boostFpsUltracoreDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/inject_fps_ultracore.ps1', 'Boost FPS Ultracore')} disabled={runningScript === 'Boost FPS Ultracore'}>
                    {runningScript === 'Boost FPS Ultracore' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Boost FPS Ultracore') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.cpu}</div>
                    <div>
                      <div className="card-title">{t.cpuTitle}</div>
                      <div className="card-desc">{t.cpuDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/cpu_optimize.ps1', 'CPU Optimization')} disabled={runningScript === 'CPU Optimization'}>
                    {runningScript === 'CPU Optimization' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('CPU Optimization') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.monitor}</div>
                    <div>
                      <div className="card-title">{t.gpuTitle}</div>
                      <div className="card-desc">{t.gpuDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/gpu_optimize.ps1', 'GPU Optimization')} disabled={runningScript === 'GPU Optimization'}>
                    {runningScript === 'GPU Optimization' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('GPU Optimization') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
              </>
            )}

            {activeCategory === 'internet' && (
              <>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.wifi}</div>
                    <div>
                      <div className="card-title">{t.netTitle}</div>
                      <div className="card-desc">{t.netDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/network_optimize.ps1', 'Network Optimize')} disabled={runningScript === 'Network Optimize'}>
                    {runningScript === 'Network Optimize' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Network Optimize') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.refresh}</div>
                    <div>
                      <div className="card-title">{t.dnsTitle}</div>
                      <div className="card-desc">{t.dnsDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/flush_dns.ps1', 'Flush DNS')} disabled={runningScript === 'Flush DNS'}>
                    {runningScript === 'Flush DNS' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Flush DNS') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
              </>
            )}

            {activeCategory === 'cleaning' && (
              <>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.trash}</div>
                    <div>
                      <div className="card-title">{t.cleanTempTitle}</div>
                      <div className="card-desc">{t.cleanTempDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/clear_tempfiles.ps1', 'Clean Temp')} disabled={runningScript === 'Clean Temp'}>
                    {runningScript === 'Clean Temp' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Clean Temp') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.windows}</div>
                    <div>
                      <div className="card-title">{t.diskTitle}</div>
                      <div className="card-desc">{t.diskDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/disk_cleanup.ps1', 'Disk Cleanup')} disabled={runningScript === 'Disk Cleanup'}>
                    {runningScript === 'Disk Cleanup' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Disk Cleanup') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
              </>
            )}

            {activeCategory === 'history' && (
              <>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.clock}</div>
                    <div>
                      <div className="card-title">{t.browserTitle}</div>
                      <div className="card-desc">{t.browserDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/clear_browser.ps1', 'Clear Browser')} disabled={runningScript === 'Clear Browser'}>
                    {runningScript === 'Clear Browser' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Clear Browser') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
                <div className="script-card">
                  <div className="card-header">
                    <div className="card-icon">{Icons.refresh}</div>
                    <div>
                      <div className="card-title">{t.winHistTitle}</div>
                      <div className="card-desc">{t.winHistDesc}</div>
                    </div>
                  </div>
                  <button className="run-btn" onClick={() => runScript('scripts/clear_winhistory.ps1', 'Clear Win History')} disabled={runningScript === 'Clear Win History'}>
                    {runningScript === 'Clear Win History' ? (
                      <div className="progress-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
                        <div className="spinner" style={{ width: 14, height: 14, color: 'var(--accent-light)' }} />
                        <div className="progress-text" style={{ marginLeft: 8 }}>{t.running}</div>
                      </div>
                    ) : <>{Icons.zap}{completedScripts.has('Clear Win History') ? t.runAgain : t.runBoost}</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </main>

        {/* ═══ Terminal ═══ */}
        <div className={`terminal-panel ${terminalOpen ? 'open' : ''}`}>
          <div className="terminal-header">
            <div className="terminal-title">{runningScript || t.terminal}</div>
            <div className="terminal-actions">
              <button onClick={() => setLogs([])}>{t.clear}</button>
              <button onClick={() => setTerminalOpen(false)} style={{ marginLeft: 6 }}>{t.close}</button>
            </div>
          </div>
          <div className="terminal-output" ref={outputRef}>
            {logs.length === 0 && <div className="log-line info">{t.waiting}</div>}
            {logs.map((log, i) => <span key={i} className={`log-line ${getLogClass(log)}`}>{log}</span>)}
          </div>
        </div>
      </div>

      {/* ═══ Settings Modal ═══ */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>{t.settingsTitle}</h2>
              <button className="settings-close-btn" onClick={() => setShowSettings(false)}>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="settings-modal-body">
              <div className="settings-item">
                <div className="settings-item-info">
                  <div className="settings-item-label">{t.saveKeyLabel}</div>
                  <div className="settings-item-desc">{t.saveKeyDesc}</div>
                </div>
                <button className={`toggle-switch ${saveKeyEnabled ? 'active' : ''}`} onClick={toggleSaveKey}>
                  <div className="toggle-knob" />
                </button>
              </div>
              {saveKeyEnabled && (
                <div className="settings-item">
                  <div className="settings-item-info">
                    <div className="settings-item-label">{t.savedKeyLabel}</div>
                    <div className="settings-item-desc" style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>
                      {savedKey ? savedKey.slice(0, 4) + '••••' + savedKey.slice(-4) : t.noKeySaved}
                    </div>
                  </div>
                  {savedKey && (
                    <button className="settings-clear-btn" onClick={clearSavedKey}>{t.clearKey}</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Loader Component ──
function LoaderOne() {
  return (
    <div className="loader-one">
      <div className="loader-ring" />
      <div className="loader-dot loader-dot-1" />
      <div className="loader-dot loader-dot-2" />
      <div className="loader-dot loader-dot-3" />
      <div className="loader-dot loader-dot-4" />
    </div>
  );
}

// ── Loading Screen ──
const LoadingScreen = ({ lang }) => {
  const t = translations[lang];
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <CandyXLogo size={64} />
        <LoaderOne />
        <div className="loading-text">
          <EncryptedText text={t.initializing} delay={200} speed={35} />
        </div>
        <p className="loading-sub">{APP_NAME}</p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════
//  APP ROOT — Login → Loading → Dashboard
// ═══════════════════════════════════
const App = () => {
  const [appState, setAppState] = useState('login'); // 'login' | 'loading' | 'dashboard'
  const [licenseKey, setLicenseKey] = useState('');
  const [lang, setLang] = useState('en');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'th' : 'en');

  const handleLogin = (key) => {
    setLicenseKey(key);
    // Save key if enabled
    try {
      if (localStorage.getItem('candy_savekey') === 'true') {
        localStorage.setItem('candy_license', key);
      }
    } catch (e) { }
    setAppState('loading');
    setTimeout(() => setAppState('dashboard'), 3000);
  };

  const handleLogout = () => {
    setAppState('login');
    setLicenseKey('');
  };

  if (appState === 'login') {
    return <LoginPage onLogin={handleLogin} lang={lang} onToggleLang={toggleLang} />;
  }

  if (appState === 'loading') {
    return <LoadingScreen lang={lang} />;
  }

  return <Dashboard onLogout={handleLogout} lang={lang} />;
};

export default App;
