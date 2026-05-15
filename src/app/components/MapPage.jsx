import React, { useState } from "react";
import { motion } from "motion/react";
import Header from './Header'; // 👈 On importe la brique Lego du Header !

// --- TON DESIGN SYSTEM (Copiés du Header.jsx) ---
const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

// --- NOUVELLES DONNÉES DE DÉMO (Réseau Abstrait) ---
// On crée un réseau de "cousins" culturels avec des positions de grille.
// Chaque couleur représente un pays (Jaune=Pérou, Violet=Égypte, Bleu=Grèce, etc.)
const dataNetwork = [
  { id: "chimú", gridX: 4, gridY: 4, color: "yellow", nom: "Vase Zoomorphe Chimú", pays: "Pérou", description: "Vase rituel précolombien à goulot en forme de tête de canard.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moche_portrait_vessel.jpg/300px-Moche_portrait_vessel.jpg", links: ["canope", "cratère", "ibis", "hydrie", "fibule", "urne", "masque"] },
  { id: "canope", gridX: 7, gridY: 3, color: "purple", nom: "Vase Canope", pays: "Égypte", description: "Vase utilisé pour contenir les viscères lors d'une momification.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Canopic_jars_of_Neskhons.jpg/300px-Canopic_jars_of_Neskhons.jpg", links: ["chimu", "satyre", "masque", "urne", "fibule"] },
  { id: "cratère", gridX: 1, gridY: 2, color: "blue", nom: "Cratère à volutes", pays: "Grèce", description: "Vase de grande dimension utilisé pour le mélange du vin et de l'eau.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Volute_krater_BM_Vase_F277.jpg/300px-Volute_krater_BM_Vase_F277.jpg", links: ["chimu", "hydrie", "urne", "fibule"] },
  { id: "ibis", gridX: 7, gridY: 6, color: "orange", nom: "Statuette d'Ibis", pays: "Égypte", description: "Représentation du dieu Thot sous sa forme d'ibis sacré.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ibis_statue_MN_Cairo.jpg/300px-Ibis_statue_MN_Cairo.jpg", links: ["chimu", "canope", "satyre", "masque", "fibule"] },
  { id: "hydrie", gridX: 1, gridY: 5, color: "pink", nom: "Hydrie", pays: "Grèce", description: "Vase à eau muni de trois anses pour le transport et le versement.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hydria_Meidias_BM_E224.jpg/300px-Hydria_Meidias_BM_E224.jpg", links: ["chimu", "cratère", "urne", "fibule"] },
  { id: "fibule", gridX: 3, gridY: 7, color: "green", nom: "Fibule tridimensionnelle", pays: "Culture indéterminée", description: "Broche complexe de la famille des 'Cousins', présentant des formes et des décors sans précédent.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Fibula_geometric_Louvre_MNB586.jpg/300px-Fibula_geometric_Louvre_MNB586.jpg", links: ["chimu", "canope", "cratère", "ibis", "hydrie", "urne", "masque"] },
  { id: "urne", gridX: 6, gridY: 5, color: "yellow", nom: "Urne Funéraire Moche", pays: "Pérou", description: "Vase céramique utilisé lors des rituels funéraires Moche.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moche_portrait_vessel_MNM.jpg/300px-Moche_portrait_vessel_MNM.jpg", links: ["chimu", "canope", "cratère", "hydrie", "fibule"] },
  { id: "masque", gridX: 2, gridY: 6, color: "purple", nom: "Masque Funéraire Égyptien", pays: "Égypte", description: "Représentation idéalisée du défunt pour assurer sa survie dans l'au-delà.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Funerary_mask_of_Tutankhamun_MNM.jpg/300px-Funerary_mask_of_Tutankhamun_MNM.jpg", links: ["chimu", "canope", "ibis", "fibule"] },
  { id: "satyre", gridX: 4, gridY: 1, color: "blue", nom: "Coupe au Satyre", pays: "Grèce", description: "Rhyton orné d'une scène dionysiaque, utilisé pour les libations.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Rhyton_satyr_BM_E796.jpg/300px-Rhyton_satyr_BM_E796.jpg", links: ["canope", "ibis"] },
];

const GRID_MAX = 8; // Nombre de cellules par côté
const CELL_SIZE = 80; // Taille de chaque cellule SVG
const POINT_RADIUS = 16; // Taille des cercles colorés

// --- COMPOSANT DE RENDU RÉSEAU SVG ---
function NetworkMap({ data, onSelectObject }) {
  //viewBox SVG de 800x800 pour une grille de 10x10 avec des marges
  const viewSize = (GRID_MAX + 1) * CELL_SIZE;

  // Création d'une carte pour un accès rapide aux objets par ID
  const objectMap = new Map(data.map(obj => [obj.id, obj]));

  return (
    <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full h-full" style={{ border: `4px solid ${colors.black}`, borderRadius: 30, overflow: "hidden" }}>
      
      {/* 1. LA GRILLE (Lignes noires fines) */}
      {[...Array(GRID_MAX + 1)].map((_, i) => (
        <React.Fragment key={i}>
          <line x1={(i + 0.5) * CELL_SIZE} y1={0} x2={(i + 0.5) * CELL_SIZE} y2={viewSize} stroke={colors.black} strokeWidth={1} />
          <line x1={0} y1={(i + 0.5) * CELL_SIZE} x2={viewSize} y2={(i + 0.5) * CELL_SIZE} stroke={colors.black} strokeWidth={1} />
        </React.Fragment>
      ))}

      {/* 2. LES TRAITS NOIRS ENTRE COUSINS (Réseau de liens) */}
      {data.map(objA => objA.links.map(linkId => {
        const objB = objectMap.get(linkId);
        //On ne dessine la ligne qu'une seule fois pour chaque paire de cousins
        if (objB && objA.id < objB.id) {
          return (
            <line 
              key={`${objA.id}-${objB.id}`}
              x1={(objA.gridX + 0.5) * CELL_SIZE} y1={(objA.gridY + 0.5) * CELL_SIZE}
              x2={(objB.gridX + 0.5) * CELL_SIZE} y2={(objB.gridY + 0.5) * CELL_SIZE}
              stroke={colors.black} strokeWidth={3}
            />
          );
        }
        return null;
      }))}

      {/* 3. LES POINTS COLORÉS (Objets) ET LEURS TEXTES */}
      {data.map(obj => (
        <React.Fragment key={obj.id}>
          {/* Le Cercle Cliquable avec effet de survol */}
          <motion.circle
            cx={(obj.gridX + 0.5) * CELL_SIZE}
            cy={(obj.gridY + 0.5) * CELL_SIZE}
            r={POINT_RADIUS}
            fill={colors[obj.color]}
            stroke={colors.black}
            strokeWidth={3}
            whileHover={{ r: POINT_RADIUS + 4 }}
            onClick={() => onSelectObject(obj)}
            style={{ cursor: "pointer" }}
          />

          {/* Le Texte : Nom de l'objet (Pays) à droite du cercle */}
          <text 
            x={(obj.gridX + 0.5) * CELL_SIZE + POINT_RADIUS + CELL_SIZE / 2}
            y={(obj.gridY + 0.5) * CELL_SIZE}
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, textAnchor: "middle" }}
          >
            <tspan x={(obj.gridX + 0.5) * CELL_SIZE + POINT_RADIUS + CELL_SIZE / 2} dy={0} fontWeight="bold" fill={colors.black}>{obj.nom}</tspan>
            <tspan x={(obj.gridX + 0.5) * CELL_SIZE + POINT_RADIUS + CELL_SIZE / 2} dy={18} fontSize={12} fill={"#555"}>({obj.pays})</tspan>
          </text>
        </React.Fragment>
      ))}
    </svg>
  );
}


// --- LA PAGE DE LA CARTE ---
export default function MapPage({ scanCount = 1, onGoToMap, onGoToHome }) {
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  const activeObject = selectedObjectId ? dataNetwork.find(obj => obj.id === selectedObjectId) : null;

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden p-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      {/* 1. TON NOUVEAU HEADER TOUT PROPRE EN UNE LIGNE */}
      {/* Il récupère sa DA parfaite depuis le fichier Header.jsx */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
      />

      {/* 2. LA ZONE DU RÉSEAU (Remplace la carte) */}
      <div className="flex-1 w-full relative z-0 aspect-square" 
           style={{ 
             borderRadius: 30, 
             overflow: "hidden", 
             border: `4px solid ${colors.black}`,
             boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
           }}>
        <NetworkMap data={dataNetwork} onSelectObject={(obj) => setSelectedObjectId(obj.id)} />
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
            onClick={() => setSelectedObjectId(null)}
            style={{ position: "absolute", top: 12, right: 16, border: "none", background: "none", fontSize: 20, cursor: "pointer", color: colors.black, fontWeight: "bold" }}
          >
            ✕
          </button>
        </motion.div>
      )}

    </div>
  );
}
