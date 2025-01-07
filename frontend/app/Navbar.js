"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터
import "./globals.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter(); // Next.js 라우터 초기화

  const goBack = () => {
    router.back(); // 이전 페이지로 이동
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <button onClick={goBack} className="backButton" aria-label="뒤로가기">
          ←
        </button>
        <img src="/imcare.png" alt="IM Care Logo" className="logo" />
      </div>
    </header>
  );
}
