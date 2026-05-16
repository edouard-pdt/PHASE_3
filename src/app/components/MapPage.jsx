import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from './Header'; 

// --- CONFIGURATION DES COULEURS ---
const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
  green: "#63A375"
};

// Création d'une fonction pour générer les icônes (avec animation CSS intégrée)
const createCustomIcon = (color, isScanned) => {
  const size = isScanned ? 32 : 22; 
  const anchor = size / 2; 
  
  return L.divIcon({
    className: "custom-network-point",
    html: `<div style="
      width: ${size}px; 
      height: ${size}px; 
      background-color: ${colors[color]}; 
      border: 3px solid ${colors.black}; 
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transform: scale(0); 
      animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
};

// --- BASE DE DONNÉES COMPLÈTE (Les 10 objets) ---
const dataNetwork = [
  { id: "1", lat: -8.11, lng: -79.03, color: "yellow", nom: "Vase Chimú", pays: "Pérou", description: "Vase rituel précolombien.", image: "./image/1.png" },
  { id: "2", lat: 29.97, lng: 31.13, color: "purple", nom: "Vase Canope", pays: "Égypte", description: "Vase funéraire égyptien.", image: "./image/2.png" },
  { id: "3", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère", pays: "Grèce", description: "Vase pour mélanger le vin.", image: "./image/3.png" },
  { id: "4", lat: 26.82, lng: 30.80, color: "purple", nom: "Statuette Ibis", pays: "Égypte", description: "Offrande au dieu Thot.", image: "./image/4.png" },
  { id: "5", lat: 38.11, lng: 13.36, color: "blue", nom: "Hydrie", pays: "Grèce", description: "Vase à eau.", image: "./image/5.png" },
  { id: "6", lat: -12.04, lng: -77.03, color: "yellow", nom: "Urne Moche", pays: "Pérou", description: "Céramique funéraire.", image: "./image/6.png" },
  { id: "7", lat: 25.72, lng: 32.61, color: "purple", nom: "Masque", pays: "Égypte", description: "Masque funéraire.", image: "./image/7.png" },
  { id: "8", lat: 41.90, lng: 12.49, color: "pink", nom: "Fibule", pays: "Italie", description: "Broche antique.", image: "./image/8.png" },
  { id: "9", lat: 38.00, lng: 24.00, color: "blue", nom: "Coupe Satyre", pays: "Grèce", description: "Coupe à boire.", image: "./image/9.png" },
  { id: "10", lat: 37.10, lng: 25.37, color: "green", nom: "Idole", pays: "Grèce", description: "Figure cycladique.", image: "./image/10.png" },
];

export default function MapPage({ 
  scanCount = 1, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection,
  onGoToInfo 
}) {
  const [selectedObj, setSelectedObj] = useState(null); // La popup d'info
  
  // NOUVEAU : On stocke l'ID du bloc actuellement cliqué/animé
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [animationStep, setAnimationStep] = useState(0); // 0=Rien, 1=Point A, 2=Lignes, 3=Cousins
  
  // On filtre pour n'afficher que les objets débloqués dans les blocs du bas
  const unlockedObjects = dataNetwork.slice(0, Math.max(1, scanCount));
  
  // L'objet central (celui qui a été cliqué) et ses cousins
  const activeObj = dataNetwork.find(obj => obj.id === activeBlockId);
  const cousins = activeObj ? dataNetwork.filter(obj => obj.id !== activeBlockId) : [];

  // Fonction pour déclencher ou éteindre un réseau
  const toggleNetwork = (id) => {
    // Si on clique sur un bloc déjà actif, on éteint tout (la carte redevient vierge)
    if (activeBlockId === id) {
      setActiveBlockId(null);
      setAnimationStep(0);
      setSelectedObj(null);
    } else {
      // Si on clique sur un NOUVEAU bloc, on lance la séquence magique
      setActiveBlockId(id);
      setAnimationStep(1); // 1. Le point A pop
      
      setTimeout(() => {
        setAnimationStep(2); // 2. Les lignes se dessinent
        
        setTimeout(() => {
          setAnimationStep(3); // 3. Les cousins pop
        }, 1200); 
        
      }, 500);
    }
  };

  return (
    // ✅ FOND TRANSPARENT (plus de backgroundColor) pour voir les formes de App.tsx !
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ overflow: 'hidden' }}>
      
      <style>{`
        .growing-line path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawLine 1.2s ease-in-out forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* LA ZONE CARTE */}
      <div className="w-full relative flex flex-col" 
           style={{ 
             borderRadius: 30, 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             height: "55vh", 
             minHeight: "380px",
             backgroundColor: "#AADAFF" // Couleur de l'océan
           }}>
        
        <div className="flex-1 rounded-[26px] overflow-hidden relative z-0">
          <MapContainer 
            center={[15, -20]} 
            zoom={2.5}         
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap'
            />

            {/* ÉTAPE 2 : Les Lignes */}
            {activeObj && animationStep >= 2 && cousins.map((obj) => (
              <Polyline 
                key={`line-${activeBlockId}-${obj.id}`} // La clé force le replay de l'animation
                positions={[[activeObj.lat, activeObj.lng], [obj.lat, obj.lng]]}
                pathOptions={{ color: colors.black, weight: 2, opacity: 0.5, className: 'growing-line' }} 
              />
            ))}

            {/* ÉTAPE 1 : Le Point Principal */}
            {activeObj && animationStep >= 1 && (
              <Marker 
                key={`main-${activeBlockId}`}
                position={[activeObj.lat, activeObj.lng]} 
                icon={createCustomIcon(activeObj.color, true)}
                eventHandlers={{ click: () => setSelectedObj(activeObj) }}
                zIndexOffset={1000}
              >
                <Tooltip direction="right" offset={[15, 0]} opacity={1} permanent>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                    <span style={{ fontWeight: 'bold' }}>{activeObj.nom}</span><br/>
                    <span style={{ color: '#666' }}>{activeObj.pays}</span>
                  </div>
                </Tooltip>
              </Marker>
            )}

            {/* ÉTAPE 3 : Les Cousins */}
            {activeObj && animationStep >= 3 && cousins.map(obj => (
              <Marker 
                key={`cousin-${activeBlockId}-${obj.id}`}
                position={[obj.lat, obj.lng]} 
                icon={createCustomIcon(obj.color, false)}
                eventHandlers={{ click: () => setSelectedObj(obj) }}
              >
                {selectedObj?.id === obj.id && (
                  <Tooltip direction="right" offset={[15, 0]} opacity={1} permanent>
                    <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                      <span style={{ fontWeight: 'bold' }}>{obj.nom}</span><br/>
                      <span style={{ color: '#666' }}>{obj.pays}</span>
                    </div>
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* FICHE INFO INTERNE */}
        <AnimatePresence>
          {selectedObj && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 z-[9999] flex p-3 items-center"
              style={{ backgroundColor: colors.cream, borderRadius: 24, border: `3px solid ${colors.black}`, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
            >
              <img src={selectedObj.image} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 12, border: `2px solid ${colors.black}` }} alt="" />
              <div className="ml-4 flex-1">
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>{selectedObj.nom}</h3>
                <p style={{ margin: 0, fontSize: 11, color: "#555", fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>{selectedObj.description}</p>
              </div>
              <button onClick={() => setSelectedObj(null)} className="ml-2 w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: colors.black, color: colors.cream, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ LISTE DYNAMIQUE DES OBJETS SCANNÉS EN BAS */}
      <div className="w-full flex gap-4 overflow-x-auto pb-4 px-2" style={{ scrollbarWidth: 'none' }}>
        
        {unlockedObjects.map((obj) => {
          const isActive = activeBlockId === obj.id;

          return (
            <motion.div 
              key={obj.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleNetwork(obj.id)}
              className="flex-shrink-0 flex items-center p-3 rounded-[20px] cursor-pointer"
              style={{
                 backgroundColor: isActive ? colors.yellow : colors.black, 
                 border: `3px solid ${colors.black}`,
                 boxShadow: isActive ? "none" : "0 6px 0 rgba(0,0,0,1)",
                 transform: isActive ? "translateY(6px)" : "none", 
                 width: "220px",
                 transition: "all 0.2s ease"
              }}
            >
              <img src={obj.image} alt={obj.nom} className="w-14 h-14 object-cover rounded-full border-2 border-black bg-white" />
              <div className="ml-3">
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: isActive ? colors.black : colors.cream }}>
                  {obj.nom}
                </p>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, fontFamily: "'Poppins', sans-serif", color: isActive ? '#555' : '#AAA', textTransform: 'uppercase' }}>
                  {isActive ? "Réseau actif" : "Voir le réseau"}
                </p>
              </div>
            </motion.div>
          )
        })}

      </div>
    </div>
  );
}
