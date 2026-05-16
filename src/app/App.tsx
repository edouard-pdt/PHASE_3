import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "motion/react";
import { Logo } from "./components/Logo";
import { Fond } from "./components/Fond";
import { NamePage } from "./components/NamePage";
import { ValidationPage } from "./components/ValidationPage";
import { ExplicationPage } from "./components/ExplicationPage";
import { ScanPage } from "./components/ScanPage";
import MapPage from "./components/MapPage"; 
import CollectionPage from "./components/CollectionPage";
import CousinsPage from "./components/CousinsPage"; 
import InfoPage from "./components/InfoPage"; 

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

function ScrollReveal({
  children,
  progress,
  start,
  end,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [80, 0]);
  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
}

function IntroPage({ onNext }: { onNext: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    const LOCK = 0.92;
    return scrollYProgress.on("change", (v) => {
      if (v > LOCK) {
        const maxY = LOCK * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, maxY);
      }
    });
  }, [scrollYProgress]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", height: "350vh", width: "100%" }}
    >
      <StaticFondBackground />

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
          <ScrollReveal progress={scrollYProgress} start={0.05} end={0.28}>
            <h1
              className="mb-10"
              style={{
                fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: colors.cream,
                textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              Découvre les objets{" "}
              <span style={{ color: colors.yellow }}>du monde entier</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal progress={scrollYProgress} start={0.32} end={0.58}>
            <p
              className="mb-12 max-w-xl"
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: colors.cream,
                opacity: 0.95,
              }}
            >
              Scanne les objets du musée et découvre comment différentes
              cultures ont créé des objets similaires pour les mêmes besoins.
            </p>
          </ScrollReveal>

          <ScrollReveal progress={scrollYProgress} start={0.7} end={0.92}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="rounded-full px-12 py-4 focus:outline-none focus-visible:ring-4"
              style={{
                backgroundColor: colors.yellow,
                color: colors.black,
                fontSize: "1.125rem",
                fontWeight: 600,
                fontFamily: "'Poppins', sans-serif",
                boxShadow:
                  "0 10px 30px rgba(246, 196, 83, 0.35), 0 4px 12px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = colors.orange)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = colors.yellow)
              }
            >
              Suivant
            </motion.button>
          </ScrollReveal>
        </div>

        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div
            className="flex flex-col items-center gap-2"
            style={{ color: colors.cream, opacity: 0.7 }}
          >
            <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 2,
                height: 28,
                backgroundColor: colors.cream,
                opacity: 0.6,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StaticFondBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        initial={{ y: "-10%", scale: 1.2, rotate: 0 }}
        animate={{ y: "-15%", scale: 1.25, rotate: 3 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          width: "100%",
          height: "180vh",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Fond />
      </motion.div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<"intro" | "name" | "validation" | "explication" | "scan" | "map" | "collection" | "cousins" | "info">("intro");
  const [userName, setUserName] = useState("");
  const [scanCount, setScanCount] = useState(0);

  // 📦 AJOUT DE L'ÉTAT GLOBAL POUR CONSERVER LES DONNÉES N8N
  const [n8nCousins, setN8nCousins] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  return (
    <div
      className="w-full"
      style={{
        position: "relative",
        backgroundColor: colors.black,
        fontFamily: "'Poppins', sans-serif",
        color: colors.cream,
        minHeight: "100vh",
      }}
    >
      {page !== "scan" && page !== "map" && page !== "collection" && page !== "cousins" && page !== "info" && (
        <header className="fixed top-0 left-0 right-0 z-30 flex justify-center px-6 pt-6 sm:justify-start sm:px-12">
          <Logo />
        </header>
      )}

      <AnimatePresence mode="wait">
        {page === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative" }}
          >
            <IntroPage onNext={() => setPage("name")} />
          </motion.div>
        )}
        {page === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <NamePage
              initialName={userName}
              onSubmit={(name) => {
                setUserName(name);
                setPage("validation");
              }}
            />
          </motion.div>
        )}
        {page === "validation" && (
          <motion.div
            key="validation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <ValidationPage
              prenom={userName}
              onAccept={() => setPage("explication")}
            />
          </motion.div>
        )}
        {page === "explication" && (
          <motion.div
            key="explication"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative" }}
          >
            <StaticFondBackground />
            <ExplicationPage
              userName={userName}
              onNext={() => setPage("scan")}
            />
          </motion.div>
        )}
        
        {page === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <ScanPage
              scanCount={scanCount}
              onScan={() => setScanCount((c) => Math.min(c + 1, 10))}
              onGoToMap={() => setPage("map")}
              onGoToHome={() => setPage("scan")} 
              onGoToCollection={() => setPage("collection")}
              onGoToCousins={() => setPage("cousins")}
              onGoToInfo={() => setPage("info")}
              // 🔌 Branchement : Sauvegarde les données reçues de n8n à la réussite du scan
              onSaveN8NData={(data) => setN8nCousins(data)}
            />
          </motion.div>
        )}

        {page === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <MapPage
              scanCount={scanCount}
              onGoToMap={() => setPage("map")}
              onGoToHome={() => setPage("scan")}
              onGoToCollection={() => setPage("collection")} 
              onGoToInfo={() => setPage("info")}
              // 🔌 AJOUT : MapPage reçoit maintenant les données de n8n !
              n8nCousinsData={n8nCousins}
            />
          </motion.div>
        )}

        {page === "collection" && (
          <motion.div
            key="collection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <CollectionPage
              scanCount={scanCount}
              onGoToMap={() => setPage("map")}
              onGoToHome={() => setPage("scan")}
              onGoToCollection={() => setPage("collection")}
              onGoToInfo={() => setPage("info")}
              // 🔌 AJOUT : Câblage pour le bouton "Voir le réseau"
              onGoToCousins={() => setPage("cousins")}
            />
          </motion.div>
        )}

        {page === "cousins" && (
          <motion.div
            key="cousins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <CousinsPage
              scanCount={scanCount}
              onGoToMap={() => setPage("map")}
              onGoToHome={() => setPage("scan")}
              onGoToCollection={() => setPage("collection")}
              onGoToInfo={() => setPage("info")}
              // 🔌 Distribution : Injecte les données n8n interceptées dans CousinsPage
              n8nCousinsData={n8nCousins}
            />
          </motion.div>
        )}

        {page === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "relative", minHeight: "100vh" }}
          >
            <StaticFondBackground />
            <InfoPage
              scanCount={scanCount}
              onGoToMap={() => setPage("map")}
              onGoToHome={() => setPage("scan")}
              onGoToCollection={() => setPage("collection")}
              onGoToInfo={() => setPage("info")}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
