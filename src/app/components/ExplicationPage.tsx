import { useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
  blue: "#4595D0",
  orange: "#DE5C44",
};

const blocks = [
  {
    number: "01",
    title: "Scan pour révéler l'invisible",
    text: "Approche ton appareil de l'objet qui éveille ta curiosité. En un instant, l'application le reconnaît et t'ouvre les portes de son histoire.",
    bg: colors.yellow,
    textColor: colors.black,
  },
  {
    number: "02",
    title: "Plonge au cœur du récit",
    text: "Lis l'histoire de l'œuvre. De sa fabrication à son usage, découvre des anecdotes sur son usage ou sa forme, comprend ce que l'objet ne dit pas au premier regard.",
    bg: colors.pink,
    textColor: colors.black,
  },
  {
    number: "03",
    title: "Tisse des liens entre les cultures",
    text: "Découvre les cousins de cette oeuvre et regarde leurs formes, leurs matériaux ou leurs fonctions…",
    bg: colors.blue,
    textColor: colors.cream,
  },
  {
    number: "04",
    title: "Visualise",
    text: "Grâce à l'atlas, les objets que tu as scanné et leurs cousins apparaissent. Regarde les parallèles entre les cultures.",
    bg: colors.purple,
    textColor: colors.cream,
  },
  {
    number: "05",
    title: "Le meilleur pour la fin",
    text: "Si tu as scanné tous les objets proposés, tu peux aller chercher un cadeau à la boutique.",
    bg: colors.orange,
    textColor: colors.cream,
  },
];

// ⏳ TIMINGS SÉPARÉS STRICTEMENT (Pas de chevauchement pour éviter les bugs)
// Chaque étape (entrée, pause, sortie) est bien délimitée.
const TIMINGS = [
  { inStart: 0.00, inEnd: 0.02, outStart: 0.12, outEnd: 0.16 }, // Bloc 1 (Apparaît très vite au début)
  { inStart: 0.17, inEnd: 0.22, outStart: 0.32, outEnd: 0.36 }, // Bloc 2
  { inStart: 0.37, inEnd: 0.42, outStart: 0.52, outEnd: 0.56 }, // Bloc 3
  { inStart: 0.57, inEnd: 0.62, outStart: 0.72, outEnd: 0.76 }, // Bloc 4
  { inStart: 0.77, inEnd: 0.82, outStart: 0.90, outEnd: 0.94 }, // Bloc 5 (S'en va à 94%)
];

// Le CTA apparaît à 95%, SEUL, après la disparition du bloc 5
const CTA_TIMING = { inStart: 0.95, inEnd: 1.00 };

function AnimatedBlock({
  block,
  progress,
  timing,
}: {
  block: (typeof blocks)[0];
  progress: MotionValue<number>;
  timing: (typeof TIMINGS)[0];
}) {
  // Une seule logique universelle : 4 points.
  const inputRange = [timing.inStart, timing.inEnd, timing.outStart, timing.outEnd];
  const opacityRange = [0, 1, 1, 0];
  const yRange = [60, 0, 0, -60];

  const opacity = useTransform(progress, inputRange, opacityRange);
  const y = useTransform(progress, inputRange, yRange);

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", inset: 0 }}
      className="flex items-center justify-center px-6"
    >
      <div
        className="w-full max-w-lg rounded-3xl px-8 py-10"
        style={{
          backgroundColor: block.bg,
          boxShadow: `0 24px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.2)`,
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 10vw, 5rem)",
            lineHeight: 1,
            color: block.textColor,
            opacity: 0.15,
            display: "block",
            marginBottom: "12px",
          }}
        >
          {block.number}
        </span>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
            lineHeight: 1.2,
            color: block.textColor,
            marginBottom: "16px",
          }}
        >
          {block.title}
        </p>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
            lineHeight: 1.65,
            color: block.textColor,
            opacity: 0.82,
          }}
        >
          {block.text}
        </p>
      </div>
    </motion.div>
  );
}

function AnimatedCTA({
  userName,
  onNext,
  progress,
}: {
  userName: string;
  onNext: () => void;
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(
    progress,
    [CTA_TIMING.inStart, CTA_TIMING.inEnd],
    [0, 1]
  );
  const y = useTransform(
    progress,
    [CTA_TIMING.inStart, CTA_TIMING.inEnd],
    [60, 0]
  );

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", inset: 0 }}
      className="flex items-center justify-center px-6"
    >
      <motion.button
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        className="rounded-full px-14 py-5 focus:outline-none focus-visible:ring-4"
        style={{
          backgroundColor: colors.yellow,
          color: colors.black,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(1.1rem, 3vw, 1.35rem)",
          fontWeight: 700,
          boxShadow:
            "0 10px 30px rgba(246, 196, 83, 0.4), 0 4px 12px rgba(0,0,0,0.25)",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = colors.orange)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = colors.yellow)
        }
      >
        À toi de jouer {userName} !
      </motion.button>
    </motion.div>
  );
}

export function ExplicationPage({
  userName,
  onNext,
}: {
  userName: string;
  onNext: () => void;
}) {
  const { scrollYProgress } = useScroll();

  // 🔒 Le blocage du scroll n'est plus nécessaire ici puisque le CTA apparaît à la toute fin du scroll (1.00)
  // Cela rend la navigation plus naturelle pour l'utilisateur.

  return (
    <div style={{ height: "600vh", position: "relative", width: "100%" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="relative h-full w-full">
          {blocks.map((block, i) => (
            <AnimatedBlock
              key={block.number}
              block={block}
              progress={scrollYProgress}
              timing={TIMINGS[i]}
              // On a supprimé isFirst, tous les blocs fonctionnent de la même manière
            />
          ))}
          <AnimatedCTA
            userName={userName}
            onNext={onNext}
            progress={scrollYProgress}
          />
        </div>
      </div>
    </div>
  );
}
