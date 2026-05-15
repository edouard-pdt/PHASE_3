import React, { useState } from "react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from './Header'; // 👈 On importe la brique Lego du Header !

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
  black: "#131313",
  cream: "#FFEFEC",
};

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
export default function MapPage({ scanCount = 1, onGoToMap, onGoToHome }) {
  const [activeObject, setActiveObject] = useState(null);
  const [showCousins, setShowCousins] = useState(false);

  // Gère le clic sur le marqueur principal
  const handleMainObjectClick = () => {
    setActiveObject(mockData.objet_principal);
    setShowCousins(true); // Fait apparaître les cousins !
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden p-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      {/* 1. TON NOUVEAU HEADER TOUT PROPRE EN UNE LIGNE */}
      {/* C'est lui qui gère le clic sur le logo et sur World ! */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
      />

      {/* 2. LA ZONE DE LA CARTE */}
      <div className="flex-1 w-full relative z-0" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
           }}>
        
        <MapContainer center={[20, -20]} zoom={2.5} style={{ height: "100%", width: "100%", minHeight: "60vh" }}>
          
          {/* NOUVELLE DA GRISE CLAIRE POUR LA CARTE */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Marqueur de l'objet principal */}
          <Marker 
            position={[mockData.objet_principal.lat, mockData.objet_principal.lng]} 
            eventHandlers={{ click: handleMainObjectClick }}
          />

          {/* Marqueurs des cousins */}
          {showCousins && mockData.cousins.map((cousin, index) => (
            <Marker 
              key={index} 
              position={[cousin.lat, cousin.lng]}
              eventHandlers={{ click: () => setActiveObject(cousin) }}
            />
          ))}
        </MapContainer>
      </div>

      {/* 3. LA FICHE INFO EN BAS */}
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
