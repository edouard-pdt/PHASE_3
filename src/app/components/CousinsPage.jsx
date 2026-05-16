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

// 🛡️ Chemin de sécurité : Données par défaut si n8n ne renvoie rien
const fallbackCousinsData = [
  {
    id: "main",
    nom: "Vase Chimú",
    relation: "Objet scanné",
    image: "./image/1.png",
    pays: "Pérou",
    tag: "Célébrer et protéger",
    description: "Ce vase rituel était porté lors de cérémonies importantes. Il permettait de célébrer des événements spéciaux et de se connecter aux esprits protecteurs.",
    bullets: ["Célébrer des moments importants", "Se connecter au monde spirituel", "Transmettre des histoires et traditions"]
  },
  {
    id: "c1",
    nom: "Vase Canope",
    relation: "Cousin 1/5",
    image: "./image/2.png",
    pays: "Égypte",
    tag: "Protéger l'au-delà",
    description: "Utilisé lors de la momification, ce vase protégeait les organes vitaux du défunt pour l'accompagner dans son voyage vers l'éternité.",
    bullets: ["Protéger le corps", "Assurer la vie éternelle", "Honorer les dieux"]
  },
  {
    id: "c2",
    nom: "Cratère Grec",
    relation: "Cousin 2/5",
    image: "./image/3.png",
    pays: "Grèce",
    tag: "Partager et célébrer",
    description: "Ce grand vase servait à mélanger l'eau et le vin lors des banquets (symposions), moments clés de la vie sociale et politique.",
    bullets: ["Mélanger les boissons", "Rassembler la communauté", "Exposer des scènes mythologiques"]
  },
  {
    id: "c3",
    nom: "Statuette Ibis",
    relation: "Cousin 3/5",
    image: "./image/4.png",
    pays: "Égypte",
    tag: "Invoquer la sagesse",
    description: "Représentant le dieu Thot, cette statuette servait d'offrande pour s'attirer les favors du dieu de l'écriture et du savoir.",
    bullets: ["Vénérer le dieu Thot", "Demander la sagesse", "Accompagner les scribes"]
  },
  {
    id: "c4",
    nom: "Hydrie",
    relation: "Cousin 4/5",
    image: "./image/5.png",
    pays: "Grèce",
    tag: "Transporter la vie",
    description: "Vase à trois anses conçu spécifiquement pour puiser, transporter et verser l'eau, élément central du quotidien.",
    bullets: ["Transporter l'eau", "Faciliter le versement", "Décorer le foyer"]
  },
  {
    id: "c5",
    nom: "Urne Moche",
    relation: "Cousin 5/5",
    image: "./image/6.png",
    pays: "Pérou",
    tag: "Honorer les ancêtres",
    description: "Céramique funéraire très détaillée, souvent en forme de portrait, placée dans les tombes pour accompagner les morts.",
    bullets: ["Capturer les traits du défunt", "Servir d'offrande funéraire", "Montrer le statut social"]
  }
];

export default function CousinsPage({ 
  scanCount, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection, 
  onGoToInfo,
  n8nCousinsData // 👈 NOUVEAU : On reçoit les données fraîches de ton n8n ici !
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); 

  // Selection de la source : n8n en priorité, sinon le fallback de secours
  const activeData = n8nCousinsData && n8nCousinsData.length > 0 ? n8nCousinsData : fallbackCousinsData;

  const nextObj = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeData.length);
  };

  const prevObj = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeData.length) % activeData.length);
  };

  const currentObj = activeData[currentIndex];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.black }}>
      
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* CARRÉ CENTRAL CRÈME */}
      <div className="relative w-full aspect-square rounded-[40px] flex items-center justify-center overflow-hidden" style={{ backgroundColor: colors.cream }}>
        
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.img
            key={currentObj.id || currentIndex}
            src={currentObj.image || "./image/1.png"}
            alt={currentObj.nom}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-3/5 h-3/5 object-contain"
          />
        </AnimatePresence>

        {/* Flèches */}
        <button onClick={prevObj} className="absolute left-4 w-10 h-10 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: colors.yellow, color: colors.black }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <button onClick={nextObj} className="absolute right-4 w-10 h-10 rounded-full flex items-center justify-center z-10" style={{ backgroundColor: colors.yellow, color: colors.black }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        {/* Tags */}
        <div className="absolute bottom-4 flex gap-2 w-full px-4 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: colors.black, color: colors.cream, fontSize: "12px", fontFamily: "'Poppins', sans-serif" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {currentObj.pays || "Inconnu"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: colors.yellow, color: colors.black, fontSize: "12px", fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            {currentObj.tag || "Parallèle"}
          </div>
        </div>
      </div>

      {/* BOUTONS SOUS LE CARRÉ */}
      <div className="flex gap-4 w-full justify-center mt-[-10px]">
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}>
          {currentObj.nom}
        </div>
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}>
          {currentObj.relation || (currentIndex === 0 ? "Objet scanné" : `Cousin ${currentIndex}/5`)}
        </div>
      </div>

      {/* ZONE DE TEXTE DYNAMIQUE */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentObj.id || currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative w-full px-2 mt-4 flex flex-col gap-4 pb-10"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: colors.yellow }}></div>

          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>À quoi sert cet objet ?</h3>
            <p className="text-sm pr-6 leading-relaxed" style={{ color: colors.yellow, fontFamily: "'Poppins', sans-serif" }}>
              {currentObj.description || "Aucune description disponible."}
            </p>
          </div>

          {currentObj.bullets && currentObj.bullets.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-2 mt-2" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>Ce que cet objet permet de faire</h3>
              <div className="flex flex-col gap-3 pr-6">
                {currentObj.bullets.map((bullet, i) => (
                  <span key={i} className="text-sm" style={{ color: colors.yellow, fontFamily: "'Poppins', sans-serif" }}>
                    • {bullet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
