import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from './Header'; 

// --- CONFIGURATION DU STYLE DES POINTS (DA) ---
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

// Création d'une fonction pour générer les icônes
const createCustomIcon = (color, isScanned) => {
  const size = isScanned ? 30 : 20; 
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
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
};

// --- DONNÉES DU RÉSEAU ---
const dataNetwork = [
  { id: "chimú", lat: -8.11, lng: -79.03, color: "yellow", nom: "Vase Chimú", pays: "Pérou", description: "Vase rituel précolombien.", image: "./image/1.png" },
  { id: "canope", lat: 29.97, lng: 31.13, color: "purple", nom: "Vase Canope", pays: "Égypte", description: "Vase funéraire égyptien.", image: "./image/2.png" },
  { id: "cratère", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère", pays: "Grèce", description: "Vase pour mélanger le vin.", image: "./image/3.png" },
  { id: "urne", lat: -12.04, lng: -77.03, color: "yellow", nom: "Urne Moche", pays: "Pérou", description: "Céramique funéraire.", image: "./image/6.png" },
  { id: "hydrie", lat: 38.11, lng: 13.36, color: "blue", nom: "Hydrie", pays: "Grèce", description: "Vase à eau.", image: "./image/5.png" },
  { id: "masque", lat: 25.72, lng: 32.61, color: "purple", nom: "Masque", pays: "Égypte", description: "Masque funéraire.", image: "./image/7.png" },
];

export default function MapPage({ 
  scanCount = 1, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection,
  onGoToInfo // 👈 N'oublie pas la page info !
}) {
  const [selectedObj, setSelectedObj] = useState(null);
  
  // GESTION DE L'ANIMATION : 0 = Rien, 1 = Objet A, 2 = Lignes, 3 = Cousins
  const [animationStep, setAnimationStep] = useState(0);
  
  const scannedObjectId = "chimú";
  const scannedObj = dataNetwork.find(obj => obj.id === scannedObjectId);
  const cousins = dataNetwork.filter(obj => obj.id !== scannedObjectId);

  // Fonction pour déclencher la séquence magique
  const triggerMapAnimation = () => {
    if (animationStep > 0) return; // Empêche de relancer si c'est déjà fait
    
    // 1. On affiche l'objet principal
    setAnimationStep(1); 
    
    // 2. Après 800ms de latence, les traits partent
    setTimeout(() => {
      setAnimationStep(2);
      
      // 3. Après 1.5s (le temps que le trait se dessine), les cousins pop !
      setTimeout(() => {
        setAnimationStep(3);
      }, 1500);
      
    }, 800);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream, overflow: 'hidden' }}>
      
      {/* MAGIE CSS POUR L'ANIMATION DES LIGNES */}
      <style>{`
        .growing-line path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawLine 1.5s ease-in-out forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* LA CARTE */}
      <div className="w-full relative z-0" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             height: "55vh", // Réduit un peu pour laisser la place au bloc
             minHeight: "380px"
           }}>
        
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

          {/* ÉTAPE 2 : Les Lignes (se dessinent) */}
          {animationStep >= 2 && cousins.map((obj, index) => (
            <Polyline 
              key={`link-${index}`}
              positions={[[scannedObj.lat, scannedObj.lng], [obj.lat, obj.lng]]}
              pathOptions={{ 
                color: colors.black, 
                weight: 2, 
                opacity: 0.5, 
                className: 'growing-line' // 👈 La classe CSS animée !
              }} 
            />
          ))}

          {/* ÉTAPE 1 : Le point A (Objet Scanné) */}
          {animationStep >= 1 && (
            <Marker 
              position={[scannedObj.lat, scannedObj.lng]} 
              icon={createCustomIcon(scannedObj.color, true)}
              eventHandlers={{ click: () => setSelectedObj(scannedObj) }}
              zIndexOffset={1000}
            >
              <Tooltip direction="right" offset={[15, 0]} opacity={1} permanent>
                <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                  <span style={{ fontWeight: 'bold' }}>{scannedObj.nom}</span><br/>
                  <span style={{ color: '#666' }}>{scannedObj.pays}</span>
                </div>
              </Tooltip>
            </Marker>
          )}

          {/* ÉTAPE 3 : Les points B (Cousins) */}
          {animationStep >= 3 && cousins.map(obj => (
            <Marker 
              key={obj.id} 
              position={[obj.lat, obj.lng]} 
              icon={createCustomIcon(obj.color, false)}
              eventHandlers={{ click: () => setSelectedObj(obj) }}
            >
              <Tooltip direction="right" offset={[15, 0]} opacity={1} permanent>
                <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                  <span style={{ fontWeight: 'bold' }}>{obj.nom}</span><br/>
                  <span style={{ color: '#666' }}>{obj.pays}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* LA LISTE DE BLOCS EN DESSOUS DE LA CARTE */}
      <div className="w-full flex gap-4 overflow-x-auto pb-4 pt-2 px-2" style={{ scrollbarWidth: 'none' }}>
        
        {/* Le bloc de l'objet qu'on vient de scanner */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={triggerMapAnimation}
          className="flex-shrink-0 flex items-center p-3 rounded-[20px] cursor-pointer"
          style={{
             backgroundColor: animationStep > 0 ? colors.yellow : colors.black, 
             border: `3px solid ${colors.black}`,
             boxShadow: "0 6px 0 rgba(0,0,0,1)",
             width: "220px",
             transition: "background-color 0.4s"
          }}
        >
          <img src={scannedObj.image} alt={scannedObj.nom} className="w-14 h-14 object-cover rounded-full border-2 border-black bg-white" />
          <div className="ml-3">
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: animationStep > 0 ? colors.black : colors.cream }}>
              {scannedObj.nom}
            </p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, fontFamily: "'Poppins', sans-serif", color: animationStep > 0 ? '#333' : '#AAA', textTransform: 'uppercase' }}>
              {animationStep === 0 ? "👉 Cliquer pour révéler" : "Objet principal"}
            </p>
          </div>
        </motion.div>

        {/* Optionnel : tu pourrais générer d'autres blocs grisés ici pour les autres objets si tu le souhaites */}

      </div>

      {/* FICHE INFO POPUP */}
      <AnimatePresence>
        {selectedObj && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-10 left-4 right-4 z-[1000] flex p-4"
            style={{ backgroundColor: colors.cream, borderRadius: 24, border: `3px solid ${colors.black}`, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
          >
            <img src={selectedObj.image} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, border: `2px solid ${colors.black}` }} alt="" />
            <div className="ml-4 flex-1">
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{selectedObj.nom}</h3>
              <p style={{ margin: 0, fontSize: 12, color: "#555", fontFamily: "'Poppins', sans-serif" }}>{selectedObj.description}</p>
            </div>
            <button onClick={() => setSelectedObj(null)} style={{ background: 'none', border: 'none', fontWeight: 'bold', fontSize: 18, cursor: 'pointer' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
