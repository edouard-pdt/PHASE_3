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

// Création d'une fonction pour générer les icônes (avec animation CSS intégrée !)
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
  onGoToInfo 
}) {
  const [selectedObj, setSelectedObj] = useState(null);
  
  // GESTION DU TOGGLE ET DE L'ANIMATION
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  
  const scannedObjectId = "chimú";
  const scannedObj = dataNetwork.find(obj => obj.id === scannedObjectId);
  const cousins = dataNetwork.filter(obj => obj.id !== scannedObjectId);

  // Fonction pour allumer / éteindre la carte
  const toggleMapAnimation = () => {
    if (isRevealed) {
      // On éteint tout
      setIsRevealed(false);
      setAnimationStep(0);
      setSelectedObj(null);
    } else {
      // On allume avec une séquence fluide
      setIsRevealed(true);
      setAnimationStep(1); // Le point principal apparaît
      
      setTimeout(() => {
        setAnimationStep(2); // Les lignes démarrent
        
        setTimeout(() => {
          setAnimationStep(3); // Les cousins apparaissent à la fin des lignes
        }, 1200); // 1.2s c'est le temps parfait pour le dessin de la ligne
        
      }, 500); // On attend 0.5s après l'apparition du premier point
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream, overflow: 'hidden' }}>
      
      {/* MAGIE CSS POUR L'ANIMATION FLUIDE */}
      <style>{`
        /* Animation pour dessiner les lignes */
        .growing-line path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: drawLine 1.2s ease-in-out forwards;
        }
        @keyframes drawLine {
          to { stroke-dashoffset: 0; }
        }

        /* Animation "Ressort" pour les points */
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

      {/* LA ZONE CARTE (Relative pour bien emprisonner la popup) */}
      <div className="w-full relative flex flex-col" 
           style={{ 
             borderRadius: 30, 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             height: "55vh", 
             minHeight: "380px",
             backgroundColor: "#AADAFF" // Une belle couleur eau pour le chargement
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
            {animationStep >= 2 && cousins.map((obj, index) => (
              <Polyline 
                key={`link-${index}`}
                positions={[[scannedObj.lat, scannedObj.lng], [obj.lat, obj.lng]]}
                pathOptions={{ color: colors.black, weight: 2, opacity: 0.5, className: 'growing-line' }} 
              />
            ))}

            {/* ÉTAPE 1 : L'Objet Scanné (Lui a toujours son étiquette visible) */}
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

            {/* ÉTAPE 3 : Les Cousins (Étiquette visible SEULEMENT si sélectionné) */}
            {animationStep >= 3 && cousins.map(obj => (
              <Marker 
                key={obj.id} 
                position={[obj.lat, obj.lng]} 
                icon={createCustomIcon(obj.color, false)}
                eventHandlers={{ click: () => setSelectedObj(obj) }}
              >
                {/* Condition : On n'affiche le Tooltip que si l'objet est cliqué ! */}
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

        {/* 🚨 LA FICHE INFO (Maintenant à l'intérieur de la carte pour régler la superposition) 🚨 */}
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

      {/* LA LISTE DE BLOCS (Le bouton de contrôle) */}
      <div className="w-full flex gap-4 overflow-x-auto pb-4 px-2" style={{ scrollbarWidth: 'none' }}>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMapAnimation} // 👈 Appelle la fonction on/off
          className="flex-shrink-0 flex items-center p-3 rounded-[20px] cursor-pointer"
          style={{
             backgroundColor: isRevealed ? colors.yellow : colors.black, 
             border: `3px solid ${colors.black}`,
             boxShadow: isRevealed ? "none" : "0 6px 0 rgba(0,0,0,1)",
             transform: isRevealed ? "translateY(6px)" : "none", // Effet d'enfoncement physique du bouton
             width: "220px",
             transition: "all 0.2s ease"
          }}
        >
          <img src={scannedObj.image} alt={scannedObj.nom} className="w-14 h-14 object-cover rounded-full border-2 border-black bg-white" />
          <div className="ml-3">
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, fontFamily: "'Poppins', sans-serif", color: isRevealed ? colors.black : colors.cream }}>
              {scannedObj.nom}
            </p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, fontFamily: "'Poppins', sans-serif", color: isRevealed ? '#555' : '#AAA', textTransform: 'uppercase' }}>
              {isRevealed ? "Masquer le réseau" : "Révéler le réseau"}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
