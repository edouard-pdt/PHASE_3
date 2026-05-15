import React, { useState } from "react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import svgPaths from "../../imports/PageDepart-1/svg-cf8msoxdol"; // Assure-toi que ce chemin est correct

// --- RÉPARATION DES ICÔNES LEAFLET ---
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------

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

// --- TES COMPOSANTS HEADER (Copiés à l'identique) ---
function LogoSvg() {
  return (
    <svg width={LOGO_W} height={LOGO_H} viewBox="0 0 200 83" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <rect width="200" height="83" rx="41.5" fill="#131313" />
      <path d="M65.3366 19.7532L91.1666 19.7532L91.1666 45.5833L65.3366 19.7532Z" fill="#6559A1" />
      <path d="M116.997 19.7532L142.827 19.7532L142.827 45.5833L116.997 19.7532Z" fill="#DE5C44" />
      <circle cx="52.4216" cy="32.6683" r="12.915" fill="#F6C453" />
      <rect x="91.1666" y="19.7533" width="25.83" height="25.83" fill="#EBA7BE" />
      <circle cx="155.742" cy="32.6683" r="12.915" fill="#4595D0" />
      {/* J'ai raccourci le SVG ici pour la lisibilité, GARDE LE TIEN EN ENTIER dans ton vrai fichier */}
      <path d="M51.3701 66.0899L56.208 50.5216H59.5783L64.3727 66.0899H60.5024L58.4041 57.1099L57.8605 54.6311H57.7844L57.3061 57.1099L55.1643 66.0899H51.3701Z" fill="#FFEFEC" />
    </svg>
  );
}

function HoverCircleBtn({ children, hoverBg, title }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button title={title} whileTap={{ scale: 0.93 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 flex items-center justify-center rounded-full focus:outline-none"
      style={{ width: BTN, height: BTN, backgroundColor: hovered ? hoverBg : colors.black, transition: "background-color 0.2s" }}>
      {children}
    </motion.button>
  );
}

function WorldBtn() {
  return (
    <HoverCircleBtn hoverBg={colors.purple} title="World">
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
    <motion.button title="Collection" whileTap={{ scale: 0.93 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="relative shrink-0 flex items-center justify-center rounded-[30px] focus:outline-none"
      style={{ width: 62, height: BTN, backgroundColor: hovered ? colors.orange : colors.black, transition: "background-color 0.2s" }}>
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

// --- DONNÉES DE DÉMO (Golden Path) ---
const mockData = {
  objet_principal: {
    nom: "Vase Zoomorphe Chimú",
    description: "Vase rituel précolombien à goulot en forme de tête de canard.",
    pays: "Pérou",
    lat: -9.19,
    lng: -75.01,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moche_portrait_vessel.jpg/300px-Moche_portrait_vessel.jpg" 
  },
  cousins: [
    { nom: "Vase Canope", pays: "Égypte", lat: 26.82, lng: 30.80, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Canopic_jars_of_Neskhons.jpg/300px-Canopic_jars_of_Neskhons.jpg" },
    { nom: "Cratère à volutes", pays: "Grèce", lat: 37.98, lng: 23.72, image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Volute_krater_BM_Vase_F277.jpg/300px-Volute_krater_BM_Vase_F277.jpg" }
  ]
};

// --- LA PAGE DE LA CARTE ---
export default function MapPage({ scanCount = 1 }) {
  const [activeObject, setActiveObject] = useState(null);
  const [showCousins, setShowCousins] = useState(false);

  // Gère le clic sur le marqueur principal
  const handleMainObjectClick = () => {
    setActiveObject(mockData.objet_principal);
    setShowCousins(true); // Fait apparaître les cousins !
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden py-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      {/* 1. TON HEADER INTACT */}
      <div className="flex items-center justify-between w-full shrink-0 z-10"
        style={{ backgroundColor: colors.cream, padding: 3, borderRadius: 30 }}>
        <LogoSvg />
        <div className="flex items-center" style={{ gap: 4 }}>
          <WorldBtn />
          <InfoBtn />
          <CollectionBtn count={scanCount} />
          <MenuBtn />
        </div>
      </div>

      {/* 2. LA ZONE DE LA CARTE (Remplace le scanner) */}
      <div className="flex-1 w-full relative z-0" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
           }}>
        
        <MapContainer center={[20, -20]} zoom={2.5} style={{ height: "100%", width: "100%", minHeight: "60vh" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Marqueur de l'objet principal (Toujours visible sur cette page) */}
          <Marker 
            position={[mockData.objet_principal.lat, mockData.objet_principal.lng]} 
            eventHandlers={{ click: handleMainObjectClick }}
          />

          {/* Marqueurs des cousins (Apparaissent APRES le clic) */}
          {showCousins && mockData.cousins.map((cousin, index) => (
            <Marker 
              key={index} 
              position={[cousin.lat, cousin.lng]}
              eventHandlers={{ click: () => setActiveObject(cousin) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 3. LA FICHE INFO EN BAS (Stylisée avec tes couleurs) */}
      {activeObject && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-10 left-4 right-4 z-20 flex p-4"
          style={{ 
            backgroundColor: colors.cream, 
            borderRadius: 24,
            border: `3px solid ${colors.black}`,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}
        >
          <img 
            src={activeObject.image} 
            alt={activeObject.nom} 
            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 16, border: `2px solid ${colors.black}` }} 
          />
          <div className="ml-4 flex-1">
            <h3 style={{ margin: "0 0 4px 0", color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: 18, fontWeight: 700 }}>
              {activeObject.nom}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#555", fontFamily: "sans-serif", lineHeight: 1.3 }}>
              {activeObject.description || `Un objet fascinant lié au pays : ${activeObject.pays}.`}
            </p>
          </div>
          <button 
            onClick={() => setActiveObject(null)}
            style={{ position: "absolute", top: 12, right: 16, border: "none", background: "none", fontSize: 20, cursor: "pointer", color: colors.black, fontWeight: "bold" }}
          >
            ✕
          </button>
        </motion.div>
      )}

    </div>
  );
}