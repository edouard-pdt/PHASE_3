import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import * as tmImage from '@teachablemachine/image';

// On utilise forwardRef pour permettre au parent (ScanPage) de contrôler le scanner
const Scanner = forwardRef((props, ref) => {
  const [resultatIA, setResultatIA] = useState<string | null>(null);
  const [ficheObjet, setFicheObjet] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // GARDE TES LIENS ICI
  const URL_MODELE_TM = "https://teachablemachine.withgoogle.com/models/AwpIVAUJl/";
  const URL_WEBHOOK_N8N = "https://douar.app.n8n.cloud/webhook-test/recherche_objet";

  const videoRef = useRef<HTMLVideoElement>(null);
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

  // Cette partie permet au bouton extérieur d'appeler la fonction "lancerLeScan"
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
        setCameraError("Erreur de chargement de l'IA.");
      }
    }
    initCamAndModel();
  }, []);

  const lancerLeScan = async () => {
    if (!modelRef.current || !videoRef.current || isScanning) return;
    
    setIsScanning(true);
    setResultatIA(null);
    setFicheObjet(null);

    try {
      const predictions = await modelRef.current.predict(videoRef.current);
      const bestPrediction = predictions.reduce((prev, current) => 
        (prev.probability > current.probability) ? prev : current
      );

      setResultatIA(bestPrediction.className);
      await envoyerAN8n(bestPrediction.className);
    } catch (error) {
      setIsScanning(false);
    }
  };

  const envoyerAN8n = async (objetDetecte: string) => {
    try {
      const reponse = await fetch(URL_WEBHOOK_N8N, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom_objet: objetDetecte })
      });
      const data = await reponse.json();
      setFicheObjet(data);
      setIsScanning(false);
    } catch (error) {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Fenêtre de la caméra */}
      <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden relative shadow-inner">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-xs p-4">{cameraError}</div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
        
        {/* Indicateur de scan */}
        {isScanning && (
          <div className="absolute inset-0 border-4 border-blue-500 animate-pulse rounded-2xl"></div>
        )}
      </div>

      {/* RESULTATS (Le bouton a été supprimé d'ici !) */}
      <div className="w-full mt-4">
        {resultatIA && !ficheObjet && (
          <p className="text-gray-400 text-sm italic animate-bounce">Recherche de : {resultatIA}...</p>
        )}

        {ficheObjet && (
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-left">
            <h4 className="font-bold text-gray-800 text-lg">{ficheObjet.titre || resultatIA}</h4>
            <p className="text-gray-600 text-sm mt-1">{ficheObjet.description}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Scanner;
