import React from "react";
// 🚨 CORRECTION ICI : On utilise bien le même import que le reste de ton app !
import { motion } from "motion/react"; 

const colors = {
  yellow: "#F6C453",
  cream: "#FFEFEC",
  black: "#131313",
};

export default function SynthesisPage({ onGoToCollection }) {
  return (
    // 🚨 CORRECTION 2 : J'ai enlevé backgroundColor: colors.black pour laisser voir ton fond animé !
    <div className="min-h-screen p-8 flex flex-col items-center justify-center text-left gap-8" style={{ fontFamily: "'Poppins', sans-serif", zIndex: 10, position: "relative" }}>
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4 text-center" 
        style={{ color: colors.yellow }}
      >
        Des besoins communs, des réponses uniques
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 text-base leading-relaxed max-w-md"
        style={{ color: colors.cream }}
      >
        <p>
          En parcourant ces continents, on remarque une chose fascinante : <strong>toutes ces cultures partageaient un besoin similaire.</strong> Que ce soit pour honorer leurs ancêtres, protéger leurs défunts ou rassembler leur communauté, ils avaient tous besoin d'un <span style={{ color: colors.yellow, fontWeight: 'bold' }}>récipient rituel</span>.
        </p>
        <div className="h-px w-full opacity-30" style={{ backgroundColor: colors.cream }}></div>
        <p>
          Cependant, face à ce même besoin, <strong>chaque civilisation a répondu de manière totalement différente</strong>. 
        </p>
        <p>
          Cette diversité s'explique par les <strong>matériaux</strong> qu'ils avaient sous la main (la terre cuite au Pérou, le bronze en Chine, le bois précieux en Océanie) et par leurs propres traditions artistiques.
        </p>
      </motion.div>

      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGoToCollection}
        className="mt-8 px-8 py-4 rounded-full font-bold text-lg shadow-lg"
        style={{ backgroundColor: colors.yellow, color: colors.black, border: `3px solid ${colors.black}` }}
      >
        Voir ma collection
      </motion.button>
    </div>
  );
}
