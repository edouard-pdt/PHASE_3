import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Correction de l'import motion
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

// 🛡️ Chemin de sécurité : Données par défaut avec les couleurs assignées
const fallbackCousinsData = [
  {
    id: "main",
    nom: "Vase zoomorphe Chimu",
    relation: "Objet scanné",
    image: "./image/1.png",
    pays: "Pérou",
    tag: "Rituel",
    themeColor: colors.cream, // Couleur pour l'objet principal
    description: "Ce vase en forme de tête de canard a été fabriqué au Pérou il y a plus de 500 ans par le peuple Chimu. Ces poteries n'étaient pas utilisées au quotidien, mais servaient d'objets précieux lors de cérémonies importantes.",
    bullets: ["Servir lors de cérémonies", "Représenter la faune locale", "Témoigner du savoir-faire Chimu"]
  },
  {
    id: "c1",
    nom: "Vase anthropomorphe Mochica",
    relation: "Cousin 1/5",
    image: "./image/2.png",
    pays: "Pérou",
    tag: "Céramique",
    themeColor: colors.pink, 
    description: "Ce vase en terre cuite représente un homme portant une tunique traditionnelle. Il a été fabriqué au Pérou il y a près de 1500 ans par les Mochicas, une civilisation plus ancienne que les Chimus.",
    bullets: ["Représenter des figures humaines", "Utilisation rituelle", "Art précolombien"]
  },
  {
    id: "c2",
    nom: "Vase Nazca à double goulot",
    relation: "Cousin 2/5",
    image: "./image/3.png",
    pays: "Pérou",
    tag: "Céramique",
    themeColor: colors.blue,
    description: "Ce vase possède deux becs reliés par une poignée en forme d'étrier. Il provient de la culture Nazca, reconnue pour ses poteries colorées et ses formes particulières.",
    bullets: ["Goulot en étrier", "Poterie polychrome", "Usage cérémoniel"]
  },
  {
    id: "c3",
    nom: "Guerrier Mochica",
    relation: "Cousin 3/5",
    image: "./image/4.png",
    pays: "Pérou",
    tag: "Statuette",
    themeColor: colors.orange,
    description: "Cette statuette représente un guerrier d'Amérique du Sud, équipé de ses armes traditionnelles. Les artisans de l'époque représentaient aussi bien la faune locale que des figures humaines.",
    bullets: ["Représentation militaire", "Travail de la terre cuite", "Témoignage historique"]
  },
  {
    id: "c4",
    nom: "Coupe Maya avec glyphes",
    relation: "Cousin 4/5",
    image: "./image/5.png",
    pays: "Amérique centrale",
    tag: "Écriture",
    themeColor: colors.purple,
    description: "Cette coupe est décorée avec des glyphes, qui constituent le système d'écriture de la civilisation Maya.",
    bullets: ["Support d'écriture", "Récipient rituel", "Culture Maya"]
  },
  {
    id: "c5",
    nom: "Statuette Chimu",
    relation: "Cousin 5/5",
    image: "./image/6.png",
    pays: "Pérou",
    tag: "Divinité",
    themeColor: colors.yellow,
    description: "Cette sculpture en bois ou en pierre représente une divinité ou un esprit. C'est ce type d'objet qui a inspiré l'album de Tintin 'L'Oreille cassée'.",
    bullets: ["Représentation spirituelle", "Culture Chimu", "Inspiration contemporaine"]
  }
];

export default function CousinsPage({ 
  scanCount, 
  onGoToMap, 
  onGoToHome, 
  onGoToCollection, 
  onGoToInfo,
  n8nCousinsData 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); 
  const [showSynthesis, setShowSynthesis] = useState(false);
  
  const activeData = n8nCousinsData && n8nCousinsData.length > 0 ? n8nCousinsData : fallbackCousinsData;
  const currentObj = activeData[currentIndex];

  // Vérifier si l'utilisateur a vu le dernier cousin
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

  // --- VUE 2 : LA SYNTHÈSE ---
  if (showSynthesis) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center gap-8" style={{ backgroundColor: colors.black, color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: colors.yellow }}>Des besoins communs, des réponses multiples</h1>
        
        <div className="text-left space-y-4 text-sm leading-relaxed max-w-md">
          <p>
            Bien qu'elles soient issues d'époques ou de régions différentes, ces cultures partageaient des nécessités universelles : honorer leurs divinités, accompagner les défunts ou structurer leur société.
          </p>
          <p>
            Cependant, face à un même besoin (comme conserver une offrande ou représenter une figure tutélaire), chaque civilisation a apporté sa propre réponse esthétique et technique. 
          </p>
          <p>
            Cette diversité dépendait des matériaux à disposition (terre, bois, pierre), des croyances locales et des traditions artisanales propres à chaque peuple d'Amérique précolombienne.
          </p>
        </div>

        <button 
          onClick={onGoToCollection}
          className="mt-8 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105"
          style={{ backgroundColor: colors.yellow, color: colors.black }}
        >
          Découvrir la collection
        </button>
      </div>
    );
  }

  // --- VUE 1 : LE CARROUSEL ---
  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.black }}>
      
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* CARRÉ CENTRAL AVEC COULEUR DYNAMIQUE */}
      <div 
        className="relative w-full aspect-square rounded-[40px] flex items-center justify-center overflow-hidden transition-colors duration-500" 
        style={{ backgroundColor: currentObj.themeColor || colors.cream }}
      >
        
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

        {/* Flèches (désactivée pour prev si c'est le 1er, désactivée pour next si c'est le dernier) */}
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

        {/* Tags */}
        <div className="absolute bottom-4 flex gap-2 w-full px-4 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: colors.black, color: colors.cream, fontSize: "12px", fontFamily: "'Poppins', sans-serif" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {currentObj.pays || "Inconnu"}
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-black text-xs font-bold font-['Poppins']">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            {currentObj.tag || "Parallèle"}
          </div>
        </div>
      </div>

      {/* BOUTONS SOUS LE CARRÉ */}
      <div className="flex gap-4 w-full justify-center mt-[-10px]">
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: currentObj.themeColor || colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px", transition: "background-color 0.5s" }}>
          {currentObj.nom}
        </div>
        <div className="px-6 py-2 rounded-full font-bold text-center" style={{ backgroundColor: currentObj.themeColor || colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif", fontSize: "14px", transition: "background-color 0.5s" }}>
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
          <div className="absolute right-0 top-0 bottom-0 w-1 rounded-full transition-colors duration-500" style={{ backgroundColor: currentObj.themeColor || colors.yellow }}></div>

          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>À quoi sert cet objet ?</h3>
            <p className="text-sm pr-6 leading-relaxed transition-colors duration-500" style={{ color: currentObj.themeColor || colors.yellow, fontFamily: "'Poppins', sans-serif" }}>
              {currentObj.description || "Aucune description disponible."}
            </p>
          </div>

          {currentObj.bullets && currentObj.bullets.length > 0 && (
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
          onClick={() => setShowSynthesis(true)}
          className="w-[90%] py-4 rounded-full font-bold text-lg mb-8 shadow-lg"
          style={{ backgroundColor: colors.yellow, color: colors.black, fontFamily: "'Poppins', sans-serif" }}
        >
          Découvrir le point commun
        </motion.button>
      )}

    </div>
  );
}
