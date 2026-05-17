import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
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

// --- BASE DE DONNÉES GÉOGRAPHIQUE CORRIGÉE AVEC LES 5 NOUVEAUX COUSINS ---
const dataNetwork = [
  { id: "1", lat: -8.11, lng: -79.03, color: "cream", nom: "Vase Zoomorphe CHIMU", pays: "Pérou (Amériques)", description: "Récipient rituel en terre cuite de la culture Chimu.", image: "./image/1.png" },
  { id: "2", lat: 29.97, lng: 31.13, color: "pink", nom: "Vase Canope", pays: "Égypte (Afrique)", description: "Récipient funéraire protégeant les organes vitaux de l'au-delà.", image: "./image/2.png" },
  { id: "3", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère à figures rouges", pays: "Grèce (Europe)", description: "Vase antique pour le mélange de l'eau et du vin lors des banquets.", image: "./image/3.png" },
  { id: "4", lat: 34.26, lng: 108.94, color: "orange", nom: "Vase Zun en bronze", pays: "Chine (Asie)", description: "Lourd vase rituel de bronze destiné aux offrandes ancestrales.", image: "./image/4.png" },
  { id: "5", lat: -17.71, lng: 178.06, color: "purple", nom: "Coupe Tanoa", pays: "Fidji (Océanie)", description: "Grande coupe de bois sculptée pour la boisson partagée du kava.", image: "./image/5.png" },
  { id: "6", lat: 32.42, lng: 53.68, color: "yellow", nom: "Rhyton Perse", pays: "Iran (Moyen-Orient)", description: "Vase cérémoniel d'apparat en métal précieux sculpté.", image: "./image/6.png" }
];

export default function MapPage({ 
  scanCount = 1, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection,
  onGoToInfo,
  targetedObject // 🔌 Reçoit directement l'objet sélectionné depuis le parent
}) {
  const [selectedObj, setSelectedObj] = useState(null); 
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [animationStep, setAnimationStep] = useState(0); 

  const unlockedObjects = dataNetwork.slice(0, Math.max(1, scanCount));
  const activeObj = dataNetwork.find(obj => obj.id === activeBlockId);
  const cousins = activeObj ? dataNetwork.filter(obj => obj.id !== activeBlockId) : [];

  // Déclencheur de l'animation de réseau de l'objet
  const launchNetworkSequence = (id) => {
    setActiveBlockId(id);
    setAnimationStep(1); // 1. Le point central apparaît
    
    setTimeout(() => {
      setAnimationStep(2); // 2. Les lignes se tracent vers les autres continents
      
      setTimeout(() => {
        setAnimationStep(3); // 3. Les cousins apparaissent aux extrémités
      }, 1200); 
    }, 500);
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

  // 🎯 EFFET DE LIEN DEPUIS LA PROP DIRECTE (Plus de dépendance à react-router-dom)
  useEffect(() => {
    if (targetedObject) {
      const matchedNode = dataNetwork.find(
        obj => obj.nom.toLowerCase() === targetedObject.nom.toLowerCase() || obj.id === String(targetedObject.id)
      );

      if (matchedNode) {
        // Déclenchement automatique de la séquence
        launchNetworkSequence(matchedNode.id);
        setSelectedObj(matchedNode);
      }
    }
  }, [targetedObject]);

  return (
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
             backgroundColor: "#AADAFF" 
           }}>
        
        <div className="flex-1 rounded-[26px] overflow-hidden relative z-0">
          <MapContainer 
            center={[15, -10]} 
            zoom={2}          
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
                key={`line-${activeBlockId}-${obj.id}`} 
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
                {(selectedObj?.id === obj.id || animationStep === 3) && (
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

      {/* LISTE DES OBJETS SCANNÉS EN BAS */}
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
