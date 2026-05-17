import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as tmImage from '@teachablemachine/image';

const Scanner = forwardRef(({ onScanSuccess, onScanLoading }, ref) => {
  const [cameraError, setCameraError] = useState(null);

  // 🔌 LIEN DE PRODUCTION N8N
  const URL_MODELE_TM = "https://teachablemachine.withgoogle.com/models/AwpIVAUJl/";
  const URL_WEBHOOK_N8N = "https://douar.app.n8n.cloud/webhook/recherche_objet";

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
    
    if (onScanLoading) onScanLoading(true);

    try {
      const predictions = await modelRef.current.predict(videoRef.current);
      const bestPrediction = predictions.reduce((prev, current) =>
        (prev.probability > current.probability) ? prev : current
      );
      
      await envoyerAN8n(bestPrediction.className);
    } catch (error) {
      isScanningRef.current = false;
      if (onScanLoading) onScanLoading(false);
    }
  };

  const envoyerAN8n = async (objetDetecte) => {
    try {
      // 🛠️ L'ASTUCE : On utilise URLSearchParams pour envoyer les données comme un formulaire.
      // Cela court-circuite le mécanisme de Preflight du navigateur !
      const params = new URLSearchParams();
      params.append('objet_detecte', objetDetecte);
      params.append('nom_objet', objetDetecte); // Double sécurité selon ce qu'attend ton n8n

      const reponse = await fetch(URL_WEBHOOK_N8N, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        body: params.toString()
      });
      
      const data = await reponse.json();
      isScanningRef.current = false;
      
      if (onScanSuccess) onScanSuccess(data, objetDetecte);
    } catch (error) {
      console.error("Erreur n8n interceptée :", error);
      isScanningRef.current = false;
      
      // Si l'affichage final bloque encore, le parcours de sécurité prend le relais
      if (onScanSuccess) onScanSuccess(null, objetDetecte);
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
