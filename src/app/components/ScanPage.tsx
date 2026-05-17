import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  userName,          // 👈 NOUVEAU : Le prénom du joueur
  scannedIds = [],   // 👈 NOUVEAU : La liste des objets déjà scannés
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
  
  // 👈 NOUVEAU : État pour afficher la pop-up de doublon
  const [showDuplicate, setShowDuplicate] = useState(false);

  // 🔌 Cette fonction réceptionne ce que le Scanner a trouvé ET récupéré sur n8n
  const handleScanSuccess = (n8nResponse, className) => {
    
    // Extraction de l'objet principal
    const mainObject = n8nResponse 
      ? (Array.isArray(n8nResponse) ? n8nResponse[0] : n8nResponse) 
      : { nom: className, image: "./image/1.png", description: "" };

    // 🛡️ VÉRIFICATION DES DOUBLONS AVANT TOUT
    // On utilise l'ID de l'objet ou son nom comme référence
    const objectId = mainObject.id || className;

    if (scannedIds.includes(objectId)) {
      setShowDuplicate(true); // On affiche l'alerte !
      setStep("camera");      // On remet la caméra en fond
      return;                 // On arrête la fonction ici, on ne va pas à la validation
    }

    // CAS 1 : N8N a répondu avec succès !
    if (n8nResponse) {
      // TRANSMISSION DES COUSINS À APP.TSX
      if (n8nResponse.cousins) {
        onSaveN8NData(n8nResponse.cousins);
      } else if (Array.isArray(n8nResponse)) {
        onSaveN8NData(n8nResponse);
      }

      setScannedData({
        nom: mainObject.nom || className, 
        image: mainObject.image || "./image/1.png", 
        description: mainObject.description || ""
      });

      setStep("validation"); 

    } else {
      // CAS 2 : PARCOURS DE SÉCURITÉ (Si le Scanner a détecté une erreur réseau/CORS)
      console.warn("Utilisation du parcours de sécurité pour :", className);
      
      // On vide l'état n8n pour forcer l'application à utiliser le fallback local
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
        <Scanner 
          ref={scannerRef} 
          onScanSuccess={handleScanSuccess} 
          onScanLoading={(isLoading) => setStep(isLoading ? "loading" : "camera")}
        />
      </div>

      {step === "camera" && (
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              // Le déclenchement du chargement est maintenant géré par le scanner lui-même au clic
              scannerRef.current?.lancerLeScan(); 
            }}
            className="shrink-0 rounded-full px-14 py-4 focus:outline-none focus-visible:ring-4 z-10"
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
         <div className="flex flex-1 flex-col items-center justify-center w-full max-w-sm pb-6 z-10">
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

      {/* 🌟 LA POP-UP DE DOUBLON (Par-dessus tout le reste) */}
      <AnimatePresence>
        {showDuplicate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-sm rounded-[30px] p-8 flex flex-col items-center text-center gap-6 shadow-2xl"
              style={{ backgroundColor: colors.cream, border: `4px solid ${colors.black}` }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner" style={{ backgroundColor: colors.pink }}>
                👀
              </div>
              
              <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "22px", color: colors.black, lineHeight: 1.2 }}>
                Attends un peu,<br/>
                <span style={{ color: colors.orange }}>{userName || "l'ami"}</span> !
              </h2>
              
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px", color: "#333" }}>
                Je crois bien que tu as déjà scanné cet objet. Essaie d'en trouver un nouveau pour agrandir ta collection !
              </p>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDuplicate(false)} // 👈 On ferme la pop-up
                className="w-full py-4 rounded-full font-bold text-[16px] shadow-lg mt-2"
                style={{ backgroundColor: colors.yellow, color: colors.black, border: `2px solid ${colors.black}`, fontFamily: "'Poppins', sans-serif" }}
              >
                Continuer l'exploration
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
