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
  { id: 1, nom: "Vase Chimu", image: "./image/1.png" },
  { id: 2, nom: "Massue Wahaika", image: "./image/7.png" },
  { id: 3, nom: "Lampe Grecque", image: "./image/9.png" },
  { id: 4, nom: "Flacon Ottoman", image: "./image/8.png" },
  { id: 5, nom: "Manilles", image: "./image/6.png" },
  { id: 6, nom: "Tanga", image: "./image/10.png" },
  { id: 7, nom: "À venir", image: "./image/Plan de travail 1.png" },
  { id: 8, nom: "À venir", image: "./image/Plan de travail 1.png" },
  { id: 9, nom: "À venir", image: "./image/Plan de travail 1.png" },
  { id: 10, nom: "À venir", image: "./image/Plan de travail 1.png" },
];

export default function FinalCollectionPage({ 
  userName, // 👈 On récupère le prénom pour le bouton de fin
  onGoToMap, 
  onGoToHome, 
  onGoToCollection, 
  onGoToInfo, 
  onGoToCousins 
}) {
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = collectionData.find(item => item.id === selectedId);

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6 pb-40">
      
      {/* ⚠️ On force le scanCount à 6 pour que le header affiche 6/10 ! */}
      <Header 
        scanCount={6} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      <div className="w-full flex justify-start px-2 mt-2">
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '28px', color: colors.cream, margin: 0 }}>
          Ma galerie
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5 w-full">
        {collectionData.map((item) => {
          // 🎯 L'ASTUCE : Tout est débloqué SAUF si ça s'appelle "À venir"
          const isUnlocked = item.nom !== "À venir";
          const isSelected = selectedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => {
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

              {!isUnlocked && (
                <div style={{ position: 'absolute', opacity: 0.6 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={colors.black}>
                     <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Z"/>
                  </svg>
                </div>
              )}

              {isUnlocked && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: isSelected ? colors.blue : colors.yellow,
                  padding: '5px 6px', 
                  textAlign: 'center',
                  borderTop: `3px solid ${colors.black}`,
                  transition: 'background-color 0.2s ease'
                }}>
                  <span style={{ 
                    display: 'block', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    fontFamily: 'Poppins', 
                    fontSize: '9px', 
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

      {/* 🎬 LE BOUTON DE FIN DE PRÉSENTATION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-6 flex justify-center z-10"
      >
        <div 
          className="w-full max-w-sm rounded-[30px] py-5 px-6 shadow-xl text-center"
          style={{
            backgroundColor: colors.orange, 
            color: colors.cream,
            border: `4px solid ${colors.black}`,
            fontFamily: "'Poppins', sans-serif", 
            fontSize: "1.1rem", 
            fontWeight: 800,
            lineHeight: 1.3
          }}
        >
          C'est déjà la fin de la visite,<br/>
          <span style={{ color: colors.yellow, fontSize: "1.3rem" }}>{userName || "l'ami"}</span> !
        </div>
      </motion.div>

      {/* BANDEAU ACTION SUR L'OBJET SELECTIONNÉ */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 px-5 z-50 flex justify-center pointer-events-none"
          >
            <div className="w-full max-w-md flex gap-3 pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onGoToMap(selectedItem)} 
                className="flex-1 rounded-[25px] py-3 flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.pink, color: colors.black, border: `3px solid ${colors.black}`, fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", fontWeight: 800 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Sur la carte
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGoToCousins}
                className="flex-1 rounded-[25px] py-3 flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.yellow, color: colors.black, border: `3px solid ${colors.black}`, fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", fontWeight: 800 }}
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