import React from "react";
import { motion } from "motion/react";
import Header from "./Header";

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

// Liste des 10 objets avec tes images locales
const collectionData = [
  { id: 1, nom: "Vase Chimú", image: "/images/1.png" },
  { id: 2, nom: "Vase Canope", image: "/image/2.png" },
  { id: 3, nom: "Cratère", image: "/image/3.png" },
  { id: 4, nom: "Statuette Ibis", image: "/image/4.png" },
  { id: 5, nom: "Hydrie", image: "/image/5.png" },
  { id: 6, nom: "Urne Moche", image: "/image/6.png" },
  { id: 7, nom: "Masque", image: "/image/7.png" },
  { id: 8, nom: "Fibule", image: "/image/8.png" },
  { id: 9, nom: "Coupe Satyre", image: "/image/9.png" },
  { id: 10, nom: "Idole", image: "/image/10.png" },
];

export default function CollectionPage({ scanCount, onGoToMap, onGoToHome, onGoToCollection }) {
  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream }}>
      
      {/* Header avec les bonnes fonctions de navigation */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
      />

      <div className="w-full flex justify-between items-end px-2 mt-2">
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '28px', color: colors.black, margin: 0 }}>
          Ma Collection
        </h2>
        <span style={{ fontFamily: 'Poppins', fontWeight: 700, color: colors.orange }}>
          {scanCount}/10
        </span>
      </div>

      {/* Grille des 10 objets */}
      <div className="grid grid-cols-2 gap-5 w-full pb-10">
        {collectionData.map((item, index) => {
          // L'objet est débloqué si son index est inférieur au nombre de scans effectués
          const isUnlocked = index < scanCount;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                backgroundColor: isUnlocked ? 'white' : '#D1D1D1',
                borderRadius: 30,
                border: `4px solid ${colors.black}`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isUnlocked ? "0 8px 0 rgba(0,0,0,0.1)" : "none"
              }}
            >
              {/* Image de l'objet */}
              <img
                src={item.image}
                alt={item.nom}
                style={{
                  width: '85%',
                  height: '85%',
                  objectFit: 'contain',
                  opacity: isUnlocked ? 1 : 0.15, // Très faible opacité si bloqué
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  transition: 'all 0.5s ease'
                }}
              />

              {/* Cadenas si bloqué */}
              {!isUnlocked && (
                <div style={{ position: 'absolute', opacity: 0.6 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={colors.black}>
                     <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Z"/>
                  </svg>
                </div>
              )}

              {/* Étiquette nom (uniquement si débloqué) */}
              {isUnlocked && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: colors.yellow,
                  padding: '4px 0',
                  textAlign: 'center',
                  borderTop: `3px solid ${colors.black}`
                }}>
                  <span style={{ 
                    fontFamily: 'Poppins', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: colors.black,
                    textTransform: 'uppercase'
                  }}>
                    {item.nom}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
