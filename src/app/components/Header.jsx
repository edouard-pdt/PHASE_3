import React, { useState } from "react";
import { motion } from "motion/react";
import { Logo } from "./Logo"; // 👈 On importe le nouveau logo 100% propre qu'on a créé

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

const BTN = 42; // Un peu plus grand que ton ancien 38, mais plus petit que 49 pour que tout rentre !

// Le composant de base qui gère les clics et le hover coloré
function HoverCircleBtn({ children, hoverBg, title, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      title={title}
      whileTap={{ scale: 0.93 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative shrink-0 flex items-center justify-center rounded-full focus:outline-none border-none cursor-pointer"
      style={{
        width: BTN,
        height: BTN,
        backgroundColor: hovered ? hoverBg : colors.black,
        transition: "background-color 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

// 📸 BOUTON SCAN (NOUVEAU)
function ScanBtn({ onClick }) {
  return (
    <HoverCircleBtn hoverBg={colors.yellow} title="Scan" onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
        <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </HoverCircleBtn>
  );
}

// 🗺️ BOUTON MONDE / CARTE (Corrigé avec SVG natif)
function WorldBtn({ onClick }) {
  return (
    <HoverCircleBtn hoverBg={colors.purple} title="World" onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
    </HoverCircleBtn>
  );
}

// ℹ️ BOUTON INFO (Corrigé avec SVG natif)
function InfoBtn({ onClick }) {
  return (
    <HoverCircleBtn hoverBg={colors.pink} title="Info" onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    </HoverCircleBtn>
  );
}

// 🎒 BOUTON COLLECTION (Ton design original)
function CollectionBtn({ count, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      title="Collection"
      onClick={onClick} 
      whileTap={{ scale: 0.93 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 flex items-center justify-center rounded-[30px] focus:outline-none border-none cursor-pointer"
      style={{
        width: 62, 
        height: BTN, 
        backgroundColor: hovered ? colors.orange : colors.black, 
        transition: "background-color 0.2s",
      }}
    >
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 17, color: colors.cream, letterSpacing: "-0.05em", lineHeight: 1 }}>
        {count}/10
      </span>
    </motion.button>
  );
}

// ☰ BOUTON MENU (Ton design original)
function MenuBtn({ onClick }) {
  return (
    <HoverCircleBtn hoverBg={colors.blue} title="Menu" onClick={onClick}>
      <div className="flex flex-col gap-[4px]">
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
      </div>
    </HoverCircleBtn>
  );
}

// 👑 LE COMPOSANT FINAL EXPORTÉ 👑
export default function Header({ scanCount, onGoToMap, onGoToHome, onGoToCollection, onGoToInfo }) {
  return (
    <div 
      className="flex items-center justify-between shrink-0 z-10 w-fit max-w-[95vw] overflow-x-auto shadow-md select-none" 
      style={{ 
        backgroundColor: colors.cream, 
        padding: "4px 6px", 
        borderRadius: 30,
        border: `2px solid ${colors.black}`,
        scrollbarWidth: "none", 
        msOverflowStyle: "none"
      }}
    >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>
      
      {/* 1️⃣ LOGO */}
      <button onClick={onGoToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="shrink-0 scale-75 origin-left">
        <Logo />
      </button>
      
      {/* 2️⃣ LES BOUTONS */}
      <div className="flex items-center ml-[-15px]" style={{ gap: 5 }}>
        <ScanBtn onClick={onGoToHome} />     {/* 👈 Nouveau bouton ! */}
        <WorldBtn onClick={onGoToMap} />
        <InfoBtn onClick={onGoToInfo} />
        <CollectionBtn count={scanCount} onClick={onGoToCollection} /> 
        <MenuBtn onClick={onGoToCollection} /> {/* Par défaut, renvoie à la collection si on clique */}
      </div>
    </div>
  );
}
