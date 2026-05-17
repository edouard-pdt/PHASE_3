import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react"; 
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

const collectionData = [
  { id: 1, nom: "Vase Zoomorphe CHIMU", image: "./image/1.png" },
  { id: 2, nom: "Massue de chef wahaika", image: "./image/7.png" },
  { id: 3, nom: "lampe à huile grecque", image: "./image/9.png" },
  { id: 4, nom: "flacon à parfum ottoman", image: "./image/8.png" },
  { id: 5, nom: "Manilles", image: "./image/6.png" },
  { id: 6, nom: "cache sexe tanga", image: "./image/10.png" },
  { id: 7, nom: "À venir", image: "./image/7.png" },
  { id: 8, nom: "À venir", image: "./image/8.png" },
  { id: 9, nom: "À venir", image: "./image/9.png" },
  { id: 10, nom: "À venir", image: "./image/10.png" },
];

export default function CollectionPage({ scanCount, onGoToMap, onGoToHome, onGoToCollection, onGoToInfo, onGoToCousins }) {
  // État pour savoir quel objet est sélectionné
  const [selectedId, setSelectedId] = useState(null);

  // On récupère les infos de l'objet sélectionné pour le bouton
  const selectedItem = collectionData.find(item => item.id === selectedId);

  return (
    // Ajout d'un padding-bottom (pb-40) pour éviter que le double bouton flottant ne cache la dernière ligne
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6 pb-40">
      
      {/* Header avec les bonnes fonctions de navigation */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      <div className="w-full flex justify-start px-2 mt-2">
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '28px', color: colors.cream, margin: 0 }}>
          Ma Collection
        </h2>
      </div>

      {/* Grille des 10 objets */}
      <div className="grid grid-cols-2 gap-5 w-full">
        {collectionData.map((item, index) => {
          // L'objet est débloqué si son index est inférieur au nombre de scans effectués
          const isUnlocked = index < scanCount;
          const isSelected = selectedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                // On ne peut sélectionner que les objets débloqués. Si on reclique dessus, on le désélectionne.
                if (isUnlocked) {
                  setSelectedId(isSelected ? null : item.id);
                }
              }}
              whileHover={isUnlocked ? { scale: 1.03 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                backgroundColor: isUnlocked ? 'white' : '#D1D1D1',
                borderRadius: 30,
                // Mise en surbrillance bleue si l'objet est cliqué
                border: isSelected ? `5px solid ${colors.blue}` : `4px solid ${colors.black}`,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected ? `0 0 20px ${colors.blue}88` : (isUnlocked ? "0 8px 0 rgba(0,0,0,0.1)" : "none"),
                cursor: isUnlocked ? 'pointer' : 'default',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                transition: 'all 0.2s ease'
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
                  opacity: isUnlocked ? 1 : 0.15,
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
                  backgroundColor: isSelected ? colors.blue : colors.yellow,
                  padding: '4px 0',
                  textAlign: 'center',
                  borderTop: `3px solid ${colors.black}`,
                  transition: 'background-color 0.2s ease'
                }}>
                  <span style={{ 
                    fontFamily: 'Poppins', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: isSelected ? colors.cream : colors.black,
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

      {/* BANDEAU ACTION SUR L'OBJET SELECTIONNÉ */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 px-5 z-50 flex justify-center pointer-events-none"
          >
            {/* Conteneur horizontal pour les deux boutons tactiles côte à côte */}
            <div className="w-full max-w-md flex gap-3 pointer-events-auto">
              
              {/* BOUTON 1 : Voir la carte (Focalisé sur l'objet) */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onGoToMap(selectedItem)} // Transmet l'objet entier en argument pour la carte
                className="flex-1 rounded-[25px] py-3 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.pink,
                  color: colors.black,
                  border: `3px solid ${colors.black}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Sur la carte
              </motion.button>

              {/* BOUTON 2 : Voir le réseau de cousins */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGoToCousins}
                className="flex-1 rounded-[25px] py-3 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.yellow,
                  color: colors.black,
                  border: `3px solid ${colors.black}`,
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 800
                }}
              >
                Le réseau
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
