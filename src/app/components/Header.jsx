import logoSvg from "../../imports/LOGO.svg";

export function Header({ scanCount, onGoToMap, onGoToHome, onGoToCollection, onGoToInfo }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-4">
      <img src={logoSvg} alt="Logo" className="h-12" />
      {/* Tu peux ajouter d'autres éléments du header ici si besoin */}
    </header>
  );
}
