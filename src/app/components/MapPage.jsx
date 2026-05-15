import React, { useState } from "react";
import { motion } from "motion/react";
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

// Création d'une fonction pour générer les icônes circulaires avec taille variable
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
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
};

// --- DONNÉES AVEC VRAIES COORDONNÉES ---
const dataNetwork = [
  { id: "chimú", lat: -8.11, lng: -79.03, color: "yellow", nom: "Vase Chimú", pays: "Pérou", description: "Vase rituel précolombien.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moche_portrait_vessel.jpg/300px-Moche_portrait_vessel.jpg" },
  { id: "canope", lat: 29.97, lng: 31.13, color: "purple", nom: "Vase Canope", pays: "Égypte", description: "Vase funéraire égyptien.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Canopic_jars_of_Neskhons.jpg/300px-Canopic_jars_of_Neskhons.jpg" },
  { id: "cratère", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère", pays: "Grèce", description: "Vase pour mélanger le vin.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Volute_krater_BM_Vase_F277.jpg/300px-Volute_krater_BM_Vase_F277.jpg" },
  { id: "urne", lat: -12.04, lng: -77.03, color: "yellow", nom: "Urne Moche", pays: "Pérou", description: "Céramique funéraire.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moche_portrait_vessel_MNM.jpg/300px-Moche_portrait_vessel_MNM.jpg" },
  { id: "hydrie", lat: 38.11, lng: 13.36, color: "blue", nom: "Hydrie", pays: "Grèce", description: "Vase à eau.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hydria_Meidias_BM_E224.jpg/300px-Hydria_Meidias_BM_E224.jpg" },
  { id: "masque", lat: 25.72, lng: 32.61, color: "purple", nom: "Masque", pays: "Égypte", description: "Masque funéraire.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Funerary_mask_of_Tutankhamun_MNM.jpg/300px-Funerary_mask_of_Tutankhamun_MNM.jpg" },
];

export default function MapPage({ 
  scanCount = 1, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection // 👈 1. ON RÉCUPÈRE LA FONCTION ICI
}) {
  const [selectedObj, setSelectedObj] = useState(null);
  const scannedObjectId = "chimú";

  const scannedObj = dataNetwork.find(obj => obj.id === scannedObjectId);
  const starLinks = [];
  
  if (scannedObj) {
    dataNetwork.forEach(obj => {
      if (obj.id !== scannedObjectId) {
        starLinks.push([[scannedObj.lat, scannedObj.lng], [obj.lat, obj.lng]]);
      }
    });
  }

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream }}>
      
      {/* 2. ON LA TRANSMET AU HEADER */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
      />

      <div className="w-full relative z-0" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             height: "65vh", 
             minHeight: "450px"
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

          {starLinks.map((positions, index) => (
            <Polyline 
              key={`link-${index}`}
              positions={positions}
              pathOptions={{ color: colors.black, weight: 2, opacity: 0.6 }} 
            />
          ))}

          {dataNetwork.map(obj => {
            const isScanned = obj.id === scannedObjectId;
            
            return (
              <Marker 
                key={obj.id} 
                position={[obj.lat, obj.lng]} 
                icon={createCustomIcon(obj.color, isScanned)}
                eventHandlers={{ click: () => setSelectedObj(obj) }}
                zIndexOffset={isScanned ? 1000 : 0}
              >
                <Tooltip direction="right" offset={[15, 0]} opacity={1} permanent>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', lineHeight: '1.2' }}>
                    <span style={{ fontWeight: 'bold' }}>{obj.nom}</span><br/>
                    <span style={{ color: '#666' }}>{obj.pays}</span>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {selectedObj && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-10 left-4 right-4 z-[1000] flex p-4"
          style={{ backgroundColor: colors.cream, borderRadius: 24, border: `3px solid ${colors.black}`, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
        >
          <img src={selectedObj.image} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, border: `2px solid ${colors.black}` }} alt="" />
          <div className="ml-4 flex-1">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{selectedObj.nom}</h3>
            <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{selectedObj.description}</p>
          </div>
          <button onClick={() => setSelectedObj(null)} style={{ background: 'none', border: 'none', fontWeight: 'bold', fontSize: 18 }}>✕</button>
        </motion.div>
      )}
    </div>
  );
}
