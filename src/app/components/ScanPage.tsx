import { useState, useRef } from "react";
import { motion } from "motion/react";
import Scanner from './Scanner';
import Header from './Header'; 

const colors = {
  blue: "#4595D0",
  purple: "#6559A1",
  cream: "#FFEFEC",
  yellow: "#F6C453",
  orange: "#DE5C44",
  black: "#131313"
};

export function ScanPage({
  scanCount,
  onScan,
  onGoToMap,
  onGoToHome,
  onGoToCollection 
}) {
  const scannerRef = useRef(null);

  // 3 étapes possibles : "camera" -> "loading" -> "validation"
  const [step, setStep] = useState("camera");
  const [scannedData, setScannedData] = useState(null);

  // Gère la transition quand le scanner a fini
  const handleScanSuccess = (data, className) => {
    
    // ✅ ON MET TON IMAGE LOCALE ICI
    // Note : on enlève "public/" car Vite le fait automatiquement
    let img = "/image/1.png"; 

    // (J'ai enlevé la condition if "canope" pour forcer ton image)

    setScannedData({
       nom: data?.titre || className,
       image: img
    });
    setStep("validation"); // On affiche la jolie carte !
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden py-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
      />

      {/* ÉTAT 1 : LA CAMÉRA (On la "cache" au lieu de la détruire pour ne pas couper la vidéo) */}
      <div className={`flex-1 items-center justify-center w-full ${step === "camera" ? "flex" : "hidden"}`}>
        <Scanner ref={scannerRef} onScanSuccess={handleScanSuccess} />
      </div>

      {step === "camera" && (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setStep("loading"); // 1. On lance la roue de chargement
              scannerRef.current?.lancerLeScan(); // 2. On déclenche l'IA
            }}
            className="shrink-0 rounded-full px-14 py-4 focus:outline-none focus-visible:ring-4"
            style={{
              backgroundColor: colors.blue, color: colors.cream,
              fontFamily: "'Poppins', sans-serif", fontSize: "1.125rem", fontWeight: 600,
              boxShadow: "0 10px 30px rgba(69, 149, 208, 0.35), 0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            Scanner
          </motion.button>
      )}

      {/* ÉTAT 2 : LE CHARGEMENT */}
      {step === "loading" && (
        <div className="flex flex-1 flex-col items-center justify-center w-full pb-20">
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
             style={{ 
               width: 60, height: 60, borderRadius: "50%", 
               border: `6px solid ${colors.cream}44`, borderTopColor: colors.yellow 
             }}
           />
           <p className="mt-6 text-lg font-bold tracking-wide" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif" }}>
              Analyse en cours...
           </p>
        </div>
      )}

      {/* ÉTAT 3 : LA PAGE DE VALIDATION */}
      {step === "validation" && scannedData && (
         <div className="flex flex-1 flex-col items-center justify-center w-full max-w-sm pb-6">

            <motion.div
               initial={{ scale: 0.8, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="relative w-full rounded-[40px] pt-16 pb-8 px-6 flex justify-center items-center shadow-2xl"
               style={{ backgroundColor: colors.cream }}
            >
               {/* Le macaron orange "Est ce le bon objet ?" */}
               <motion.div
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-6 -left-4 w-[110px] h-[110px] rounded-full flex items-center justify-center z-10 shadow-lg"
                  style={{ backgroundColor: colors.orange }}
               >
                  <span className="text-center font-bold leading-tight" style={{ color: colors.cream, fontFamily: "'Poppins', sans-serif", fontSize: "15px" }}>
                     Est ce<br/>le bon objet ?
                  </span>
               </motion.div>

               {/* L'image de l'objet scanné */}
               <img
                  src={scannedData.image}
                  alt="Objet scanné"
                  className="w-4/5 h-auto object-contain drop-shadow-xl"
               />
            </motion.div>

            {/* Le gros bouton de confirmation Jaune */}
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                  onScan(); 
                  onGoToCollection(); 
               }}
               className="w-full mt-10 rounded-[30px] py-4 shadow-xl"
               style={{
                  backgroundColor: colors.yellow, color: colors.black,
                  fontFamily: "'Poppins', sans-serif", fontSize: "1.2rem", fontWeight: 700
               }}
            >
               Oui c'est ça !
            </motion.button>

         </div>
      )}

    </div>
  );
}
