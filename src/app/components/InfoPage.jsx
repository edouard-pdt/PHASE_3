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

// Tableau de tes plans avec les chemins d'accès vers ton dossier "public/image/plan"
const museumPlans = [
  { id: 1, img: "./image/plan/th-930x620-plan--0--en-attente-corrections_930x620.jpg.jpg", title: "Plan Niveau 0" },
  { id: 2, img: "./image/plan/th-930x620-plan--1-en-attente-corrections_930x620.jpg.jpg", title: "Plan Niveau 1" },
  { id: 3, img: "./image/plan/th-930x620-plan--1-en-attente-corrections_930x620.jpg.jpg", title: "Plan Niveau 1 (Suite)" }, // Remplace par le nom exact du fichier s'il est différent
  { id: 4, img: "./image/plan/th-930x620-plan--2-en-attente-corrections_930x620.jpg.jpg", title: "Plan Niveau 2" }
];

export default function InfoPage({ scanCount, onGoToMap, onGoToHome, onGoToCollection, onGoToInfo }) {
  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6 pb-12">
      
      {/* Header */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection}
        onGoToInfo={onGoToInfo} 
      />

      {/* Titre de la page */}
      <div className="w-full flex justify-start px-2 mt-2">
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '28px', color: colors.cream, margin: 0 }}>
          Informations
        </h2>
      </div>

      {/* CARTE 1 : Le Musée & Le Carrousel de Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full rounded-[30px] p-6 shadow-xl flex flex-col gap-4"
        style={{ backgroundColor: colors.cream, border: `4px solid ${colors.black}` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.pink }}>
             {/* Icône Musée */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.cream} strokeWidth="2.5"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3"/></svg>
          </div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', color: colors.black, margin: 0 }}>Les plans du Musée</h3>
        </div>
        
        <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: '#555', margin: 0 }}>
          Glissez vers la gauche pour explorer les différents niveaux et retrouver les objets de votre collection.
        </p>

        {/* 🎠 CARROUSEL HORIZONTAL DES PLANS */}
        <div className="w-full overflow-x-auto pb-4 pt-2 -mx-2 px-2 flex gap-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {museumPlans.map((plan) => (
            <div 
              key={plan.id} 
              className="flex-shrink-0 w-[90%] snap-center flex flex-col items-center gap-2"
            >
              <div 
                className="w-full rounded-[20px] overflow-hidden border-2 shadow-sm" 
                style={{ borderColor: colors.black, backgroundColor: "white" }}
              >
                <img 
                  src={plan.img} 
                  alt={plan.title} 
                  className="w-full h-auto object-cover" 
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold font-['Poppins'] text-center" style={{ color: colors.black }}>
                {plan.title}
              </span>
            </div>
          ))}
        </div>
        {/* Fin du carrousel */}

      </motion.div>


      {/* CARTE 2 : Confidentialité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full rounded-[30px] p-6 flex flex-col gap-3"
        style={{ backgroundColor: colors.blue, border: `4px solid ${colors.black}` }}
      >
        <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '18px', color: colors.cream, margin: 0 }}>
          Confidentialité 🔒
        </h3>
        <p style={{ fontFamily: 'Poppins', fontSize: '13px', color: colors.cream, margin: 0, opacity: 0.9 }}>
          L'appareil photo est utilisé uniquement pour analyser les objets en temps réel. <strong>Aucune image n'est sauvegardée</strong> sur nos serveurs.
        </p>
      </motion.div>


      {/* CARTE 3 : Crédits de l'App */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full rounded-[30px] p-6 shadow-xl flex flex-col gap-4"
        style={{ backgroundColor: colors.black, border: `4px solid ${colors.yellow}` }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.yellow }}>
             {/* Icône Code */}
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.black} strokeWidth="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
          </div>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', color: colors.cream, margin: 0 }}>Crédits</h3>
        </div>

        <div className="flex flex-col gap-2 mt-2" style={{ fontFamily: 'Poppins', fontSize: '14px', color: colors.cream }}>
          <div className="flex justify-between border-b pb-2" style={{ borderColor: '#333' }}>
            <span style={{ opacity: 0.7 }}>Application</span>
            <span style={{ fontWeight: 700, color: colors.yellow }}>Parallèles</span>
          </div>
          <div className="flex justify-between border-b pb-2" style={{ borderColor: '#333' }}>
            <span style={{ opacity: 0.7 }}>Design & Dévelopement</span>
            <span style={{ fontWeight: 700, color: colors.yellow }}>Ton Équipe</span>
          </div>
          <div className="flex justify-between pb-2">
            <span style={{ opacity: 0.7 }}>IA & Détection</span>
            <span style={{ fontWeight: 700, color: colors.yellow }}>Teachable Machine</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
