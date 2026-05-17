import React from "react";

export function Logo() {
  return (
    <div
      className="bg-[#131313] gap-y-[10px] grid grid-cols-5 grid-rows-[auto_auto] px-[22px] py-[12px] rounded-full items-center justify-items-center select-none"
      style={{ 
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        width: "140px",
        height: "65px"
      }}
      data-name="LOGO"
    >
      {/* === RANGÉE 1 : LES 5 FORMES GÉOMÉTRIQUES === */}
      
      {/* Col 1 : Rond Jaune */}
      <div className="col-start-1 row-start-1 shrink-0 size-[15px]">
        <svg className="block size-full" fill="none" viewBox="0 0 25.83 25.83">
          <circle cx="12.915" cy="12.915" fill="#F6C453" r="12.915" />
        </svg>
      </div>

      {/* Col 2 : Triangle Violet (Correction du tracé manquant) */}
      <div className="col-start-2 row-start-1 flex items-center justify-center shrink-0">
        <div className="flex-none rotate-180">
          <div className="relative size-[15px]">
            <svg className="block size-full" fill="none" viewBox="0 0 25.83 25.83">
              <polygon points="12.915,3 23.5,21.5 2.33,21.5" fill="#6559A1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Col 3 : Carré Rose */}
      <div className="bg-[#eba7be] col-start-3 row-start-1 shrink-0 size-[13px] rounded-[2px]" />

      {/* Col 4 : Triangle Orange (Correction du tracé manquant) */}
      <div className="col-start-4 row-start-1 flex items-center justify-center shrink-0">
        <div className="flex-none rotate-180">
          <div className="relative size-[15px]">
            <svg className="block size-full" fill="none" viewBox="0 0 25.83 25.83">
              <polygon points="12.915,3 23.5,21.5 2.33,21.5" fill="#DE5C44" />
            </svg>
          </div>
        </div>
      </div>

      {/* Col 5 : Rond Bleu */}
      <div className="col-start-5 row-start-1 shrink-0 size-[15px]">
        <svg className="block size-full" fill="none" viewBox="0 0 25.83 25.83">
          <circle cx="12.915" cy="12.915" fill="#4595D0" r="12.915" />
        </svg>
      </div>

      {/* === RANGÉE 2 : LE TEXTE SÉCURISÉ (Anti-écrasement horizontal) === */}
      <div className="col-span-5 row-start-2 w-full flex justify-center">
        <span 
          className="text-[#FFEFEC] font-black uppercase tracking-[1.5px] whitespace-nowrap block text-center"
          style={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontSize: "11px",
            lineHeight: "1"
          }}
        >
          Parallèles
        </span>
      </div>

    </div>
  );
}
