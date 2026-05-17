import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Header } from './Header';

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
      animation: popIn 0.2s ease-out forwards;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
};

const dataNetwork = [
  // 🏺 OBJET 1 : LE VASE CHIMU (Thème : Récipients Rituels)
  { id: "1", lat: -8.11, lng: -79.03, color: "cream", nom: "Vase Zoomorphe CHIMU", pays: "Pérou (Amériques)", description: "Récipient rituel en terre cuite de la culture Chimu.", image: "./image/1.png", isMain: true },
  { id: "1-c1", parentId: "1", lat: 29.97, lng: 31.13, color: "pink", nom: "Vase Canope", pays: "Égypte (Afrique)", description: "Récipient funéraire protégeant les organes vitaux de l'au-delà.", image: "./image/2.png", isMain: false },
  { id: "1-c2", parentId: "1", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère à figures rouges", pays: "Grèce (Europe)", description: "Vase antique pour le mélange de l'eau et du vin lors des banquets.", image: "./image/3.png", isMain: false },
  { id: "1-c3", parentId: "1", lat: 34.26, lng: 108.94, color: "orange", nom: "Vase Zun en bronze", pays: "Chine (Asie)", description: "Lourd vase rituel de bronze destiné aux offrandes ancestrales.", image: "./image/4.png", isMain: false },
  { id: "1-c4", parentId: "1", lat: -17.71, lng: 178.06, color: "purple", nom: "Coupe Tanoa", pays: "Fidji (Océanie)", description: "Grande coupe de bois sculptée pour la boisson partagée du kava.", image: "./image/5.png", isMain: false },
  { id: "1-c5", parentId: "1", lat: 32.42, lng: 53.68, color: "yellow", nom: "Rhyton Perse", pays: "Iran (Moyen-Orient)", description: "Vase cérémoniel d'apparat en métal précieux sculpté.", image: "./image/6.png", isMain: false },

  // ✨ OBJET 4 : LE FLACON OTTOMAN (Thème : Parfums et Cosmétiques)
  { id: "4", lat: 36.80, lng: 10.18, color: "pink", nom: "Flacon à parfum ottoman", pays: "Tunisie (Afrique)", description: "Hexagonal et en argent, surmonté d'oiseaux et de perles.", image: "./image/4.png", isMain: true },
  { id: "4-c1", parentId: "4", lat: 37.9, lng: 22.9, color: "blue", nom: "Aryballe Corinthien", pays: "Grèce (Europe)", description: "Petit vase antique servant à stocker l'huile parfumée des athlètes.", image: "./image/c_aryballe.png", isMain: false },
  { id: "4-c2", parentId: "4", lat: 35.0, lng: 105.0, color: "orange", nom: "Flacon Tabatière", pays: "Chine (Asie)", description: "Fiole miniature richement décorée pour conserver les poudres odorantes.", image: "./image/c_tabatiere.png", isMain: false },
  { id: "4-c3", parentId: "4", lat: -13.8, lng: -171.7, color: "purple", nom: "Flacon à huile de coco", pays: "Samoa (Océanie)", description: "Récipient sculpté en noix de coco pour les huiles corporelles.", image: "./image/c_coco.png", isMain: false },
  { id: "4-c4", parentId: "4", lat: 20.0, lng: 77.0, color: "yellow", nom: "Gulabdan", pays: "Inde (Asie du Sud)", description: "Flacon à long col utilisé pour asperger l'eau de rose sur les invités.", image: "./image/c_gulabdan.png", isMain: false },
  { id: "4-c5", parentId: "4", lat: 19.4, lng: -99.1, color: "cream", nom: "Vase à onguent Maya", pays: "Mexique (Amériques)", description: "Petit récipient mésoaméricain contenant des baumes ou des pigments.", image: "./image/c_maya.png", isMain: false }
];

export default function MapPage({ 
  scanCount = 1, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection,
  onGoToInfo,
  targetedObject 
}) {
  const [selectedObj, setSelectedObj] = useState(null); 
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [animationStep, setAnimationStep] = useState(0); 

  const mainObjects = dataNetwork.filter(obj => obj.isMain);
  const unlockedObjects = mainObjects.slice(0, Math.max(1, scanCount));
  
  const activeObj = dataNetwork.find(obj => obj.id === activeBlockId);
  
  const cousins = activeObj ? dataNetwork.filter(obj => obj.parentId === activeBlockId) : [];

  const launchNetworkSequence = (id) => {
    setActiveBlockId(id);
    setAnimationStep(3); // Affichage instantané
  };

  const toggleNetwork = (id) => {
    if (activeBlockId === id) {
      setActiveBlockId(null);
      setAnimationStep(0);
      setSelectedObj(null);
    } else {
      launchNetworkSequence(id);
    }
  };

 useEffect(() => {
    if (targetedObject) {
      const matchedNode = dataNetwork.find(
        obj => obj.nom?.toLowerCase() === targetedObject?.nom?.toLowerCase() || obj.id === String(targetedObject?.id)
      );

      if (matchedNode) {
        launchNetworkSequence(matchedNode.id);
        setSelectedObj(matchedNode);
      }
    }
  }, [targetedObject]);

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ overflow: 'hidden' }}>
      
      <style>{`
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
             backgroundColor: "#AADAFF" 
           }}>
        
        <div className="flex-1 rounded-[26px] overflow-hidden relative z-0">
          <MapContainer 
            center={[20, -10]} 
            zoom={1.8}          
            style={{ height: "100%", width: "100%" }} 
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap'
            />

            {/* Les Lignes directes */}
            {activeObj && animationStep === 3 && cousins.map((obj) => (
              <Polyline 
                key={`line-${activeBlockId}-${obj.id}`} 
                positions={[[activeObj.lat, activeObj.lng], [obj.lat, obj.lng]]}
                pathOptions={{ color: colors.black, weight: 2.5, opacity: 0.6 }} 
              />
            ))}

            {/* Le Point Principal Actif */}
            {activeObj && animationStep === 3 && (
              <Marker 
                key={`main-${activeBlockId}`}
                position={[activeObj.lat, activeObj.lng]} 
                icon={createCustomIcon(activeObj.color, true)}
                eventHandlers={{ click: () => setSelectedObj(activeObj) }}
                zIndexOffset={1000}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2', textTransform: 'uppercase', fontWeight: '900' }}>
                     {activeObj.nom}
                  </div>
                </Tooltip>
              </Marker>
            )}

            {/* Les Cousins (Tooltip réactif au survol / clic) */}
            {activeObj && animationStep === 3 && cousins.map(obj => (
              <Marker 
                key={`cousin-${activeBlockId}-${obj.id}`}
                position={[obj.lat, obj.lng]} 
                icon={createCustomIcon(obj.color, false)}
                eventHandlers={{ click: () => setSelectedObj(obj) }}
              >
                <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                    <span style={{ fontWeight: 'bold' }}>{obj.nom}</span><br/>
                    <span style={{ color: '#666', fontSize: '10px' }}>{obj.pays}</span>
                  </div>
                </Tooltip>
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

      {/* LISTE DES OBJETS PRINCIPAUX EN BAS */}
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
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: isActive ? colors.black : colors.cream }}>
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
