import React from "react";
import { motion } from "motion/react";

const colors = {
  yellow: "#F6C453",
  cream: "#FFEFEC",
  orange: "#DE5C44",
  black: "#131313",
};

export default function ThanksPage({ userName }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-8">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '32px', color: colors.yellow, lineHeight: 1.2 }}>
          Merci de votre visite, <br/>
          <span style={{ color: colors.cream }}>{userName || "l'ami"} !</span>
        </h1>

        <p style={{ fontFamily: 'Poppins', fontSize: '16px', color: colors.cream, maxWidth: '300px', opacity: 0.9 }}>
          Continuez à explorer les <strong>parallèles entre les cultures</strong> et à porter un nouveau regard sur le monde.
        </p>
      </motion.div>

      {/* ZONE QR CODE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '30px', 
          border: `5px solid ${colors.yellow}`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}
      >
        {/* Remplace l'URL ici par ton vrai QR code si tu en as un */}
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://votre-projet.com" 
          alt="QR Code"
          style={{ width: '180px', height: '180px' }}
        />
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
        style={{ fontFamily: 'Poppins', fontSize: '12px', color: colors.cream, marginTop: '20px' }}
      >
        Scannez pour emporter l'expérience avec vous
      </motion.p>
    </div>
  );
}