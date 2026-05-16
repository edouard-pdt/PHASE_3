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
  onGoToCollection,
  onGoToCousins,
  onGoToInfo,
  onSaveN8NData 
}) {
  const scannerRef = useRef(null);
  const [step, setStep] = useState("camera");
  const [scannedData, setScannedData] = useState(null);

  const handleScanSuccess = async (data, className) => {
    setStep("loading"); 

    try {
      // 🔌 Ton vrai lien Webhook n8n est ici
      const response = await fetch("https://douar.app.n8n.cloud/webhook-test/recherche_objet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objet_detecte: className, 
        }),
      });

      if (!response.ok) throw new Error("Erreur serveur n8n");

      const n8nResponse = await response.json(); 

      // TRANSMISSION DES COUSINS À APP.TSX
      if (n8nResponse && n8nResponse.cousins) {
        onSaveN8NData(n8nResponse.cousins);
      } else if (Array.isArray(n8nResponse)) {
        onSaveN8NData(n8nResponse);
      }

      // Extraction de l'objet principal pour l'écran de validation
      const mainObject = Array.isArray(n8nResponse) ? n8nResponse[0] : n8nResponse;

      setScannedData({
        nom: mainObject.nom || className, 
        image: mainObject.image || "./image/1.png", 
        description: mainObject.description || ""
      });

      setStep("validation"); 

    } catch (error) {
      console.error("Erreur n8n :", error);
      alert("Erreur de communication avec le serveur. Utilisation du parcours de sécurité.");
      
      // En cas de panne réseau, on vide l'état n8n pour forcer l'application à utiliser le fallback
      onSaveN8NData([]); 
      
      setScannedData({
        nom: className,
        image: "./image/1.png",
        description: ""
      });
      setStep("validation");
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen overflow-x-hidden py-5 gap-6"
      style={{ paddingLeft: 10, paddingRight: 10 }}>

      <Header 
        scanCount={scanCount} 
        onGoToMap={onGoToMap} 
        onGoToHome={onGoToHome} 
        onGoToCollection={onGoToCollection} 
        onGoToInfo={onGoToInfo}
      />

      {/* ÉTAT 1 : LA CAMÉRA */}
      <div className={`flex-1 items-center justify-center w-full ${step === "camera" ? "flex" : "hidden"}`}>
        <Scanner ref={scannerRef} onScanSuccess={handleScanSuccess} />
      </div>

      {step === "camera" && (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setStep("loading"); 
              scannerRef.current?.lancerLeScan(); 
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

               <div className="flex flex-col items-center gap-4 w-full">
                   <img
                      src={scannedData.image}
                      alt="Objet scanné"
                      className="w-4/5 h-auto object-contain drop-shadow-xl"
                   />
                   <p className="text-xl font-bold text-center" style={{ color: colors.black, fontFamily: "'Poppins', sans-serif" }}>
                      {scannedData.nom}
                   </p>
               </div>
            </motion.div>

            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                  onScan(); 
                  onGoToCousins(); 
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
