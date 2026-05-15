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

// Liste des 10 objets de la collection
const collectionData = [
  { id: "chimú", nom: "Vase Chimú", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Moche_portrait_vessel.jpg/300px-Moche_portrait_vessel.jpg", unlocked: true },
  { id: "canope", nom: "Vase Canope", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Canopic_jars_of_Neskhons.jpg/300px-Canopic_jars_of_Neskhons.jpg", unlocked: false },
  { id: "cratère", nom: "Cratère à volutes", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Volute_krater_BM_Vase_F277.jpg/300px-Volute_krater_BM_Vase_F277.jpg", unlocked: false },
  { id: "ibis", nom: "Statuette d'Ibis", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ibis_statue_MN_Cairo.jpg/300px-Ibis_statue_MN_Cairo.jpg", unlocked: false },
  { id: "hydrie", nom: "Hydrie Grecque", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Hydria_Meidias_BM_E224.jpg/300px-Hydria_Meidias_BM_E224.jpg", unlocked: false },
  { id: "urne", nom: "Urne Moche", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Moche_portrait_vessel_MNM.jpg/300px-Moche_portrait_vessel_MNM.jpg", unlocked: false },
  { id: "masque", nom: "Masque Funéraire", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Funerary_mask_of_Tutankhamun_MNM.jpg/300px-Funerary_mask_of_Tutankhamun_MNM.jpg", unlocked: false },
  { id: "fibule", nom: "Fibule d'Or", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Fibula_geometric_Louvre_MNB586.jpg/300px-Fibula_geometric_Louvre_MNB586.jpg", unlocked: false },
  { id: "satyre", nom: "Coupe au Satyre", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Rhyton_satyr_BM_E796.jpg/300px-Rhyton_satyr_BM_E796.jpg", unlocked: false },
  { id: "statuette", nom: "Idole Cycladique", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Cycladic_female_figure_BM_GR1875.5-17.495.jpg/300px-Cycladic_female_figure_BM_GR1875.5-17.495.jpg", unlocked: false },
];

export default function CollectionPage({ scanCount = 1, onGoToMap, onGoToHome, onGoToCollection }) {
  return (
    <div className="relative flex flex-col items-center min-h-screen p-5 gap-6" style={{ backgroundColor: colors.cream }}>
      
      {/* Header réutilisable */}
      <Header scanCount={scanCount} onGoToMap={onGoToMap} onGoToHome={onGoToHome} onGoToCollection={onGoToCollection} />

      <h2 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '24px', color: colors.black, alignSelf: 'flex-start', margin: '10px 0 -10px 5px' }}>
        Ma Collection
      </h2>

      {/* Grille des 10 objets */}
      <div className="grid grid-cols-2 gap-4 w-full pb-10">
        {collectionData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              position: 'relative',
              aspectRatio: '1/1',
              backgroundColor: item.unlocked ? 'white' : '#E0E0E0',
              borderRadius: 24,
              border: `3px solid ${colors.black}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: item.unlocked ? '0 8px 0 rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {/* Image de l'objet */}
            <img
              src={item.image}
              alt={item.nom}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: item.unlocked ? 1 : 0.2, // Faible opacité si bloqué
                filter: item.unlocked ? 'none' : 'grayscale(100%)',
              }}
            />

            {/* Overlay Cadenas si bloqué */}
            {!item.unlocked && (
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill={colors.black}>
                   <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2ZM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6Z"/>
                </svg>
              </div>
            )}

            {/* Nom de l'objet en bas */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: item.unlocked ? colors.blue : 'rgba(0,0,0,0.1)',
              padding: '5px 10px',
              textAlign: 'center',
              borderTop: `2px solid ${colors.black}`
            }}>
              <span style={{ 
                fontFamily: 'Poppins', 
                fontSize: '10px', 
                fontWeight: 700, 
                color: item.unlocked ? colors.cream : colors.black,
                textTransform: 'uppercase'
              }}>
                {item.unlocked ? item.nom : 'Mystère...'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
