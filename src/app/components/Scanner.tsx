import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as tmImage from '@teachablemachine/image';

const Scanner = forwardRef(({ onScanSuccess }, ref) => {
  const [cameraError, setCameraError] = useState(null);

  // TES LIENS
  const URL_MODELE_TM = "https://teachablemachine.withgoogle.com/models/AwpIVAUJl/";
  const URL_WEBHOOK_N8N = "https://douar.app.n8n.cloud/webhook-test/recherche_objet";

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
      await envoyerAN8n(bestPrediction.className);
    } catch (error) {
      isScanningRef.current = false;
    }
  };

  const envoyerAN8n = async (objetDetecte) => {
    try {
      const reponse = await fetch(URL_WEBHOOK_N8N, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom_objet: objetDetecte })
      });
      const data = await reponse.json();
      isScanningRef.current = false;
      // On prévient la ScanPage que c'est fini !
      if (onScanSuccess) onScanSuccess(data, objetDetecte);
    } catch (error) {
      isScanningRef.current = false;
      // Si N8N bloque, on valide quand même l'objet trouvé par l'IA
      if (onScanSuccess) onScanSuccess({ titre: objetDetecte }, objetDetecte);
    }
  };

  return (
    <div className="w-full aspect-square bg-black rounded-[30px] overflow-hidden relative shadow-inner border-[4px]" style={{ borderColor: "#131313" }}>
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs p-4">{cameraError}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
    </div>
  );
});

export default Scanner;
