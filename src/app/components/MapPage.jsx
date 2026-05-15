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
  const size = isScanned ? 30 : 20; // Plus grand si scanné (30px contre 20px)
  const anchor = size / 2; // Point d'ancrage central
  
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
  { id: "chimú", lat: -8.11, lng: -79.03, color: "yellow", nom: "Vase Chimú", pays: "Pérou", description: "Vase rituel précolombien.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moche_portrait_vessel.jpg/300px-Moche_portrait_vessel.jpg", links: [] },
  { id: "canope", lat: 29.97, lng: 31.13, color: "purple", nom: "Vase Canope", pays: "Égypte", description: "Vase funéraire égyptien.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Canopic_jars_of_Neskhons.jpg/300px-Canopic_jars_of_Neskhons.jpg", links: [] },
  { id: "cratère", lat: 37.98, lng: 23.72, color: "blue", nom: "Cratère", pays: "Grèce", description: "Vase pour mélanger le vin.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Volute_krater_BM_Vase_F277.jpg/300px-Volute_krater_BM_Vase_F277.jpg", links: [] },
  { id: "urne", lat: -12.04, lng: -77.03, color: "yellow", nom: "Urne Moche", pays: "Pérou", description: "Céramique funéraire.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moche_portrait_vessel_MNM.jpg/300px-Moche_portrait_vessel_MNM.jpg", links: [] },
  { id: "hydrie", lat: 38.11, lng: 13.36, color: "blue", nom: "Hydrie", pays: "Grèce", description: "Vase à eau.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hydria_Meidias_BM_E224.jpg/300px-Hydria_Meidias_BM_E224.jpg", links: [] },
  { id: "masque", lat: 25.72, lng: 32.61, color: "purple", nom: "Masque", pays: "Égypte", description: "Masque funéraire.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Funerary_mask_of_Tutankhamun_MNM.jpg/300px-Funerary_mask_of_Tutankhamun_MNM.jpg", links: [] },
];

// Générer toutes les paires uniques pour que tous les points soient reliés entre eux
const allLinks = [];
dataNetwork.forEach((objA, indexA) => {
  dataNetwork.forEach((objB, indexB) => {
    // Ne dessiner le lien qu'une seule fois par paire
    if (indexA < indexB) {
      allLinks.push([[objA.lat, objA.lng], [objB.lat, objB.lng]]);
    }
  });
});

export default function MapPage({ scanCount = 1, onGoToMap, onGoToHome }) {
  const [selectedObj, setSelectedObj] = useState(null);

  // Définir l'ID de l'objet "scanné" (actuellement le Vase Chimú)
  const scannedObjectId = "chimú";

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream }}>
      
      <Header scanCount={scanCount} onGoToMap={onGoToMap} onGoToHome={onGoToHome} />

      {/* LA ZONE DE LA CARTE */}
      <div className="w-full relative z-0" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`, // Cadre noir impeccable
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
             height: "65vh", // Hauteur fixe stricte
             minHeight: "450px"
           }}>
        
        <MapContainer 
          center={[15, -20]} // Centre ajusté pour mieux voir Europe/Amériques
          zoom={2.5}         // Zoom légèrement plus fort
          style={{ height: "100%", width: "100%" }} 
          zoomControl={false}
        >
          
          {/* FOND CLAIR TYPE GLOBE */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap'
          />

          {/* TRAITS NOIRS (Réseau complet) */}
          {allLinks.map((positions, index) => (
            <Polyline 
              key={`link-${index}`}
              positions={positions}
              pathOptions={{ color: colors.black, weight: 2, opacity: 0.5 }} // Légèrement transparent
            />
          ))}

          {/* POINTS COLORÉS + ÉTIQUETTES */}
          {dataNetwork.map(obj => {
            const isScanned = obj.id === scannedObjectId;
            
            return (
              <Marker 
                key={obj.id} 
                position={[obj.lat, obj.lng]} 
                icon={createCustomIcon(obj.color, isScanned)}
                eventHandlers={{ click: () => setSelectedObj(obj) }}
                zIndexOffset={isScanned ? 1000 : 0} // L'objet scanné passe au-dessus des lignes
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

      {/* FICHE INFO POPUP */}
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
