import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as tmImage from '@teachablemachine/image';

const Scanner = forwardRef(({ onScanSuccess }, ref) => {
  const [cameraError, setCameraError] = useState(null);

  // 🔌 TON VRAI LIEN TEACHABLE MACHINE
  const URL_MODELE_TM = "https://teachablemachine.withgoogle.com/models/AwpIVAUJl/";

  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const isScanningRef = useRef(false);

  useImperativeHandle(ref, () => ({
    lancerLeScan
  }));

  useEffect(() => {
    async function initCamAndModel() {
      try {
        const modelURL = URL_MODELE_TM + "model.json";
        const metadataURL = URL_MODELE_TM + "metadata.json";
        modelRef.current = await tmImage.load(modelURL, metadataURL);

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) { videoRef.current.srcObject = stream; }
        } else {
          setCameraError("Caméra non supportée.");
        }
      } catch (error) {
        setCameraError("Erreur IA.");
      }
    }
    initCamAndModel();
  }, []);

  const lancerLeScan = async () => {
    if (!modelRef.current || !videoRef.current || isScanningRef.current) return;
    isScanningRef.current = true;

    try {
      const predictions = await modelRef.current.predict(videoRef.current);
      const bestPrediction = predictions.reduce((prev, current) =>
        (prev.probability > current.probability) ? prev : current
      );
      
      isScanningRef.current = false;
      
      // On a trouvé l'objet ! On passe simplement le nom (className) à ScanPage
      // C'est ScanPage qui va se charger d'appeler n8n avec ce nom.
      if (onScanSuccess) {
        onScanSuccess(null, bestPrediction.className);
      }
      
    } catch (error) {
      console.error("Erreur de scan :", error);
      isScanningRef.current = false;
    }
  };

  return (
    <div className="w-full aspect-square bg-black rounded-[30px] overflow-hidden relative shadow-inner border-[4px]" style={{ borderColor: "#131313" }}>
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs p-4 text-center">{cameraError}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
    </div>
  );
});

export default Scanner;
