import { useRef } from "react";
import { motion } from "motion/react";
import Scanner from './Scanner';
import Header from './Header'; // 👈 On importe la brique Lego du Header !

// On ne garde que les couleurs utiles pour cette page spécifique (le bouton Scanner)
const colors = {
  blue: "#4595D0",
  purple: "#6559A1",
  cream: "#FFEFEC",
};

export function ScanPage({
  scanCount,
  onScan,
  onGoToMap, // 👈 Nouveau pouvoir : aller vers la carte
  onGoToHome // 👈 Nouveau pouvoir : revenir à l'accueil
}) {
  const scannerRef = useRef(null);

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden py-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      {/* TON NOUVEAU HEADER TOUT PROPRE EN UNE LIGNE */}
      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
      />

      {/* Le Scanner */}
      <div className="flex flex-1 items-center justify-center w-full">
        <Scanner ref={scannerRef} />
      </div>

      {/* Le Bouton d'action Scanner */}
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          scannerRef.current?.lancerLeScan();
          onScan(); 
        }}
        className="shrink-0 rounded-full px-14 py-4 focus:outline-none focus-visible:ring-4"
        style={{
          backgroundColor: colors.blue,
          color: colors.cream,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "1.125rem",
          fontWeight: 600,
          boxShadow: "0 10px 30px rgba(69, 149, 208, 0.35), 0 4px 12px rgba(0,0,0,0.25)",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.purple)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.blue)}
      >
        Scanner
      </motion.button>
    </div>
  );
}
