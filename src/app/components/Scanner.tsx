import React, { useState, useRef, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';

export default function Scanner() {
  const [resultatIA, setResultatIA] = useState<string | null>(null);
  const [ficheObjet, setFicheObjet] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // ⚠️ 1. REMPLACE CECI PAR TON LIEN TEACHABLE MACHINE (Garde bien le / à la fin)
  const URL_MODELE_TM = "https://teachablemachine.withgoogle.com/models/AwpIVAUJl/";
  
  // ⚠️ 2. REMPLACE CECI PAR TON LIEN WEBHOOK N8N
  const URL_WEBHOOK_N8N = "https://douar.app.n8n.cloud/webhook-test/recherche_objet";

  const videoRef = useRef<HTMLVideoElement>(null);
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

  useEffect(() => {
    async function initCamAndModel() {
      try {
        const modelURL = URL_MODELE_TM + "model.json";
        const metadataURL = URL_MODELE_TM + "metadata.json";
        modelRef.current = await tmImage.load(modelURL, metadataURL);

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setCameraError("La caméra n'est pas supportée sur ce navigateur.");
        }
      } catch (error) {
        console.error("Erreur de chargement :", error);
        setCameraError("Impossible de charger la caméra ou l'IA. Vérifie tes liens !");
      }
    }
    initCamAndModel();
  }, []);

  const lancerLeScan = async () => {
    if (!modelRef.current || !videoRef.current) return;
    setIsScanning(true);
    setResultatIA(null);
    setFicheObjet(null);

    try {
      const predictions = await modelRef.current.predict(videoRef.current);
      const bestPrediction = predictions.reduce((prev, current) => 
        (prev.probability > current.probability) ? prev : current
      );

      const objetDetecte = bestPrediction.className;
      setResultatIA(objetDetecte); 
      
      await envoyerAN8n(objetDetecte);
    } catch (error) {
      console.error("Erreur d'analyse :", error);
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
      console.error("Erreur n8n :", error);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-gray-50 rounded-xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Scanner Intelligent</h2>
        <p className="text-gray-600">Placez l'objet devant la caméra.</p>
      </div>

      <div className="w-80 h-80 bg-black rounded-2xl overflow-hidden shadow-lg relative">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center p-4">
            {cameraError}
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        )}
      </div>

      <button 
        onClick={lancerLeScan} 
        disabled={isScanning || cameraError !== null}
        className={`px-8 py-4 rounded-full font-bold text-white transition-all shadow-md ${
          isScanning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isScanning ? "Analyse en cours..." : "Scanner l'objet"}
      </button>

      {resultatIA && !ficheObjet && (
        <div className="text-gray-500 animate-pulse">
          Détecté : <strong>{resultatIA}</strong>... Envoi à n8n...
        </div>
      )}

      {ficheObjet && (
        <div className="mt-4 p-6 border rounded-2xl bg-white shadow-xl w-full max-w-md">
          <h3 className="text-2xl font-black text-gray-900">{ficheObjet.titre || resultatIA}</h3>
          <p className="mt-3 text-gray-700">{ficheObjet.description}</p>
          {ficheObjet.instructions_recyclage && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg">
              <strong>♻️ Recyclage :</strong> {ficheObjet.instructions_recyclage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}