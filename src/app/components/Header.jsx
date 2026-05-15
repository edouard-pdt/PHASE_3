import React, { useState } from "react";
import { motion } from "motion/react";
// ⚠️ Vérifie que ce chemin est toujours bon depuis ce nouveau fichier :
import svgPaths from "../../imports/PageDepart-1/svg-cf8msoxdol";

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

const BTN = 38;
const LOGO_H = BTN;
const LOGO_W = Math.round((200 / 83) * LOGO_H);

function LogoSvg() {
  return (
    <svg width={LOGO_W} height={LOGO_H} viewBox="0 0 200 83" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      {/* ⚠️ REMET TOUT TON CODE SVG ICI ⚠️ */}
      <rect width="200" height="83" rx="41.5" fill="#131313" />
      <path d="M65.3366 19.7532L91.1666 19.7532L91.1666 45.5833L65.3366 19.7532Z" fill="#6559A1" />
    </svg>
  );
}

// Le composant de base qui gère les clics
function HoverCircleBtn({ children, hoverBg, title, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      title={title}
      whileTap={{ scale: 0.93 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="relative shrink-0 flex items-center justify-center rounded-full focus:outline-none"
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

// Le bouton World branché avec onClick
function WorldBtn({ onClick }) {
  return (
    <HoverCircleBtn hoverBg={colors.purple} title="World" onClick={onClick}>
      <svg width="22" height="22" viewBox="0 0 25 25" fill="none">
        <path d={svgPaths?.p39fc4580 || ""} fill={colors.cream} />
      </svg>
    </HoverCircleBtn>
  );
}

function InfoBtn() {
  return (
    <HoverCircleBtn hoverBg={colors.pink} title="Info">
      <svg width={BTN} height={BTN} viewBox="0 0 49 49" fill="none">
        <path d={svgPaths?.p24a25200 || ""} fill={colors.cream} />
      </svg>
    </HoverCircleBtn>
  );
}

function CollectionBtn({ count }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      title="Collection"
      whileTap={{ scale: 0.93 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 flex items-center justify-center rounded-[30px] focus:outline-none"
      style={{
        width: 62, height: BTN, backgroundColor: hovered ? colors.orange : colors.black, transition: "background-color 0.2s",
      }}
    >
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 17, color: colors.cream, letterSpacing: "-0.05em", lineHeight: 1 }}>
        {count}/10
      </span>
    </motion.button>
  );
}

function MenuBtn() {
  return (
    <HoverCircleBtn hoverBg={colors.blue} title="Menu">
      <div className="flex flex-col gap-[4px]">
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
        <div style={{ width: 17, height: 2, backgroundColor: colors.cream, borderRadius: 2 }} />
      </div>
    </HoverCircleBtn>
  );
}

// 👑 LE COMPOSANT FINAL EXPORTÉ 👑
export default function Header({ scanCount, onGoToMap, onGoToHome }) {
  return (
    <div className="flex items-center justify-between w-full shrink-0 z-10" style={{ backgroundColor: colors.cream, padding: 3, borderRadius: 30 }}>
      <button onClick={onGoToHome} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <LogoSvg />
      </button>
      
      <div className="flex items-center" style={{ gap: 4 }}>
        <WorldBtn onClick={onGoToMap} />
        <InfoBtn />
        <CollectionBtn count={scanCount} />
        <MenuBtn />
      </div>
    </div>
  );
}
