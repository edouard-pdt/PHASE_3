import { useState } from "react";
import { motion } from "motion/react";

const colors = {
  yellow: "#F6C453",
  pink: "#EBA7BE",
  cream: "#FFEFEC",
  black: "#131313",
  purple: "#6559A1",
};

export function NamePage({
  initialName,
  onSubmit,
}: {
  initialName: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const canSubmit = name.trim().length > 0;

  return (
    <div className="flex h-screen w-full items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-10"
          style={{
            fontSize: "clamp(2rem, 5.5vw, 3.25rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: colors.cream,
            textShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >
          Comment tu <span style={{ color: colors.pink }}>t'appelles</span> ?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-12 w-full max-w-md"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) onSubmit(name.trim());
            }}
            placeholder="Ton prénom"
            autoFocus
            className="w-full rounded-2xl border-2 px-6 py-4 text-center outline-none transition-all focus:scale-[1.02]"
            style={{
              backgroundColor: "rgba(255, 239, 236, 0.08)",
              borderColor: colors.purple,
              color: colors.cream,
              fontFamily: "'Poppins', sans-serif",
              fontSize: "1.25rem",
              fontWeight: 500,
              boxShadow: "0 8px 24px rgba(101, 89, 161, 0.25)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.pink;
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(235, 167, 190, 0.35)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.purple;
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(101, 89, 161, 0.25)";
            }}
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          whileHover={canSubmit ? { scale: 1.04, y: -2 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          onClick={() => canSubmit && onSubmit(name.trim())}
          disabled={!canSubmit}
          className="rounded-full px-12 py-4 focus:outline-none focus-visible:ring-4"
          style={{
            backgroundColor: canSubmit ? colors.pink : "rgba(235,167,190,0.35)",
            color: colors.black,
            fontSize: "1.125rem",
            fontWeight: 600,
            cursor: canSubmit ? "pointer" : "not-allowed",
            boxShadow: canSubmit
              ? "0 10px 30px rgba(235, 167, 190, 0.4), 0 4px 12px rgba(0,0,0,0.25)"
              : "none",
            transition: "background-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (canSubmit) {
              e.currentTarget.style.backgroundColor = colors.purple;
              e.currentTarget.style.color = colors.cream;
            }
          }}
          onMouseLeave={(e) => {
            if (canSubmit) {
              e.currentTarget.style.backgroundColor = colors.pink;
              e.currentTarget.style.color = colors.black;
            }
          }}
        >
          Suivant
        </motion.button>
      </motion.div>
    </div>
  );
}
