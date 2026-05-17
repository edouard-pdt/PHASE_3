import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from './Header';

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

// 🛡️ Golden Path : Un cousin par continent avec un tag strictement identique
const fallbackCousinsData = [
  {
    id: "main",
    nom: "Vase zoomorphe Chimu",
    relation: "Objet scanné",
    image: "./image/1.png",
    pays: "Pérou (Amériques)",
    tag: "Récipient rituel",
    themeColor: colors.cream,
    description: "Ce vase en forme de tête de canard a été fabriqué au Pérou il y a plus de 500 ans par le peuple Chimu. Ces poteries servaient d'objets précieux lors de cérémonies importantes.",
    bullets: ["Servir lors de cérémonies", "Représenter la faune locale", "Témoigner du savoir-faire Chimu"]
  },
  {
    id: "c1",
    nom: "Vase Canope",
    relation: "Cousin 1/5",
    image: "./image/11.png",
    pays: "Égypte (Afrique)",
    tag: "Récipient rituel",
    themeColor: colors.pink, 
    description: "Utilisé lors de la momification, ce vase protégeait les organes vitaux du défunt pour l'accompagner dans son voyage vers l'au-delà.",
    bullets: ["Protéger le corps", "Assurer la vie éternelle", "Honorer les dieux"]
  },
  {
    id: "c2",
    nom: "Cratère à figures rouges",
    relation: "Cousin 2/5",
    image: "./image/12.png",
    pays: "Grèce (Europe)",
    tag: "Récipient rituel",
    themeColor: colors.blue,
    description: "Ce grand vase servait à mélanger l'eau et le vin lors des banquets (symposions), des moments de célébration clés de la vie sociale antique.",
    bullets: ["Mélanger les boissons", "Rassembler la communauté", "Exposer des scènes mythologiques"]
  },
  {
    id: "c3",
    nom: "Vase Zun en bronze",
    relation: "Cousin 3/5",
    image: "./image/13.png",
    pays: "Chine (Asie)",
    tag: "Récipient rituel",
    themeColor: colors.orange,
    description: "Ce lourd récipient en bronze était utilisé sous la dynastie Shang pour offrir du vin aux ancêtres lors de cérémonies sacrées.",
    bullets: ["Honorer les ancêtres", "Faire des offrandes", "Démontrer la maîtrise du bronze"]
  },
  {
    id: "c4",
    nom: "Coupe Tanoa",
    relation: "Cousin 4/5",
    image: "./image/14.png",
    pays: "Fidji (Océanie)",
    tag: "Récipient rituel",
    themeColor: colors.purple,
    description: "Grande coupe sculptée dans un bois précieux, utilisée pour préparer et partager le kava, une boisson qui renforce les liens de la communauté.",
    bullets: ["Préparer une boisson sacrée", "Renforcer les liens sociaux", "Sculpter le bois local"]
  },
  {
    id: "c5",
    nom: "Rhyton Perse",
    relation: "Cousin 5/5",
    image: "./image/15.png",
    pays: "Iran (Moyen-Orient)",
    tag: "Récipient rituel",
    themeColor: colors.yellow,
    description: "Ce vase à boire en forme de corne ou d'animal était utilisé lors des grands banquets royaux dans l'empire perse pour célébrer les victoires.",
    bullets: ["Célébrer le pouvoir", "Boire lors des banquets", "Travailler les métaux précieux"]
  }
];

export default function CousinsPage({ 
  scanCount, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection, 
  onGoToInfo,
  onGoToSynthesis, // 🔌 NOUVELLE PROP
  n8nCousinsData 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); 
  
  const activeData = n8nCousinsData && n8nCousinsData.length > 0 ? n8nCousinsData : fallbackCousinsData;
  const currentObj = activeData[currentIndex];

  const hasSeenAll = currentIndex === activeData.length - 1;

  const nextObj = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeData.length);
  };

  const prevObj = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeData.length) % activeData.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  // --------------------------------------------------------
  // 🔄 VUE 1 : LE CARROUSEL DES COUSINS
  // --------------------------------------------------------
  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.black }}>
      
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* CARRÉ CENTRAL */}
      <div 
        className="relative w-full aspect-square rounded-[40px] flex items-center justify-center overflow-hidden transition-colors duration-500" 
        style={{ backgroundColor: currentObj.themeColor || colors.cream }}
      >
        
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.img
            key={currentObj.id || currentIndex}
            src={currentObj.image}
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
        {currentIndex > 0 && (
          <button onClick={prevObj} className="absolute left-4 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}

        {currentIndex < activeData.length - 1 && (
          <button onClick={nextObj} className="absolute right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}

        {/* Tags EXACTEMENT comme sur ta capture d'écran */}
        <div className="absolute bottom-4 flex gap-2 w-full px-4 justify-center font-['Poppins']">
          {/* Tag Noir : Pays/Continent */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: colors.black, color: "white", fontSize: "14px", fontWeight: "500" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {currentObj.pays}
          </div>
          {/* Tag Blanc : Étiquette commune */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF5F0] text-black text-[14px] font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            {currentObj.tag}
          </div>
        </div>
      </div>

      {/* BOUTONS SOUS LE CARRÉ */}
      <div className="flex gap-4 w-full justify-center mt-[-10px]">
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: currentObj.themeColor || colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px", transition: "background-color 0.5s" }}>
          {currentObj.nom}
        </div>
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: currentObj.themeColor || colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px", transition: "background-color 0.5s" }}>
          {currentObj.relation}
        </div>
      </div>

      {/* ZONE DE TEXTE */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentObj.id || currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative w-full px-2 mt-4 flex flex-col gap-4 pb-4"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 rounded-full transition-colors duration-500" style={{ backgroundColor: currentObj.themeColor || colors.yellow }}></div>

          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>À quoi sert cet objet ?</h3>
            <p className="text-sm pr-6 leading-relaxed transition-colors duration-500" style={{ color: currentObj.themeColor || colors.yellow, fontFamily: "'Poppins', sans-serif" }}>
              {currentObj.description}
            </p>
          </div>

          {currentObj.bullets && (
            <div>
              <h3 className="text-lg font-bold mb-2 mt-2" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>Ce que cet objet permet de faire</h3>
              <div className="flex flex-col gap-3 pr-6">
                {currentObj.bullets.map((bullet, i) => (
                  <span key={i} className="text-sm transition-colors duration-500" style={{ color: currentObj.themeColor || colors.yellow, fontFamily: "'Poppins', sans-serif" }}>
                    • {bullet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* BOUTON DÉCOUVERTE DU LIEN (S'affiche uniquement à la fin) */}
      {hasSeenAll && (
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onGoToSynthesis}
          className="w-[90%] py-4 rounded-full font-bold text-lg mb-8 shadow-lg"
          style={{ backgroundColor: colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif" }}
        >
          Découvrir le point commun
        </motion.button>
      )}

    </div>
  );
}
