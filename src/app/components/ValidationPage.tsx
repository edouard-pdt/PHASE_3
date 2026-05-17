import { motion } from "motion/react";

const colors = {
  yellow: "#F6C453",
  orange: "#DE5C44",
  cream: "#FFEFEC",
  black: "#131313",
};

export function ValidationPage({
  prenom,
  onAccept,
}: {
  prenom: string;
  onAccept: () => void;
}) {
  const handleClick = async () => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {
        // user refused — still continue; later pages can handle this
      }
    }
    onAccept();
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-14 max-w-xl"
          style={{
            fontSize: "clamp(1.1rem, 2.6vw, 1.5rem)",
            fontWeight: 500,
            lineHeight: 1.5,
            color: colors.cream,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          Bienvenue{" "}
          <span style={{ color: colors.yellow, fontWeight: 700 }}>
            {prenom}
          </span>{" "}
          ! Pour le bon fonctionnement de la visite, tu dois autoriser l'accès à la caméra de ton téléphone !
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleClick}
          className="rounded-full px-14 py-4 focus:outline-none focus-visible:ring-4"
          style={{
            backgroundColor: colors.yellow,
            color: colors.black,
            fontSize: "1.125rem",
            fontWeight: 600,
            fontFamily: "'Poppins', sans-serif",
            boxShadow:
              "0 10px 30px rgba(246, 196, 83, 0.35), 0 4px 12px rgba(0,0,0,0.25)",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.orange)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = colors.yellow)
          }
        >
          OK
        </motion.button>
      </motion.div>
    </div>
  );
}
