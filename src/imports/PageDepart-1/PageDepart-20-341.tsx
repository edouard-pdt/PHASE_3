import svgPaths from "imports/LOGO.svg"; // Assurez-vous que ce chemin est correct dans votre projet

function Paralleles() {
  return (
    <div className="col-1 h-[9.274px] relative row-2 shrink-0 w-[14.812px]" data-name="Paralleles">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8124 9.27383">
        <g id="Paralleles">
          <path d={svgPaths.p1dfa0400} fill="var(--fill-0, #FFEFEC)" id="Vector" />
          <path d={svgPaths.p1bf53000} fill="var(--fill-0, #FFEFEC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="col-2 h-[9.274px] relative row-2 shrink-0 w-[14.877px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8768 9.27383">
        <g id="Group 1">
          <path d={svgPaths.p2d970b80} fill="var(--fill-0, #FFEFEC)" id="Vector" />
          <path d={svgPaths.p4ed6680} fill="var(--fill-0, #FFEFEC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="col-3 h-[9.274px] relative row-2 shrink-0 w-[14.062px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.0616 9.27383">
        <g id="Group 2">
          <path d={svgPaths.p217f5600} fill="var(--fill-0, #FFEFEC)" id="Vector" />
          <path d={svgPaths.p2ff25700} fill="var(--fill-0, #FFEFEC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group2() {
  return (
    <div className="col-4 h-[9.274px] relative row-2 shrink-0 w-[14.178px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.1776 9.27383">
        <g id="Group 3">
          <path d={svgPaths.p37715400} fill="var(--fill-0, #FFEFEC)" id="Vector" />
          <path d={svgPaths.p1ccdc100} fill="var(--fill-0, #FFEFEC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="col-5 h-[9.727px] relative row-2 shrink-0 w-[14.333px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3332 9.72716">
        <g id="Group 4">
          <path d={svgPaths.p2061b5c0} fill="var(--fill-0, #FFEFEC)" id="Vector" />
          <path d={svgPaths.p2499370} fill="var(--fill-0, #FFEFEC)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[20.41%_18.37%_18.37%_20.41%]">
      <div className="absolute inset-[20.41%_18.37%_18.37%_20.41%] overflow-clip" data-name="language">
        <div className="absolute inset-[8.33%]" data-name="icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 25">
            <path d={svgPaths.p39fc4580} fill="var(--fill-0, #FFEFEC)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[28.57%_28.57%_26.53%_28.57%]">
      <div className="absolute bg-[#ffefec] inset-[28.57%_28.57%_63.27%_28.57%]" />
      <div className="absolute bg-[#ffefec] inset-[46.94%_28.57%_44.9%_28.57%]" />
      <div className="absolute bg-[#ffefec] inset-[65.31%_28.57%_26.53%_28.57%]" />
    </div>
  );
}

// ⚠️ J'ai renommé le composant exporté "Logo" car c'est ce que tu appelles dans ton App.jsx
export function Logo() {
  return (
    // 🛠️ CORRECTION : Le conteneur principal bloque désormais toute déformation !
    <div className="flex justify-center items-center h-[50px] w-[120px]">
      
      {/* Ton logo avec sa grille exacte, mais protégé des étirements extérieurs */}
      <div className="bg-[#131313] gap-y-[10px] grid grid-cols-[repeat(5,fit-content(100%))] grid-rows-[repeat(2,fit-content(100%))] h-[50px] px-[20px] py-[10px] relative rounded-[80px] shrink-0 w-[120px] items-center justify-items-center" data-name="LOGO">
        
        {/* Les formes géométriques du haut */}
        <div className="col-1 relative row-1 shrink-0 size-[12px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <circle cx="7.5" cy="7.5" fill="var(--fill-0, #F6C453)" id="Ellipse 20" r="7.5" />
          </svg>
        </div>
        
        <div className="bg-[#eba7be] col-2 relative row-1 shrink-0 size-[12px]" />
        
        <div className="col-3 flex items-center justify-center relative row-1 shrink-0">
          <div className="flex-none rotate-180">
            <div className="relative size-[12px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                <path d={svgPaths.p38c32300} fill="var(--fill-0, #DE5C44)" id="Vector 13" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="col-4 relative row-1 shrink-0 size-[12px]">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
            <circle cx="7.5" cy="7.5" fill="var(--fill-0, #4595D0)" id="Ellipse 19" r="7.5" />
          </svg>
        </div>
        
        <div className="col-5 flex items-center justify-center relative row-1 shrink-0">
          <div className="flex-none rotate-180">
            <div className="relative size-[12px]">
              <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
                <path d={svgPaths.p38c32300} fill="var(--fill-0, #6559A1)" id="Vector 14" />
              </svg>
            </div>
          </div>
        </div>

        {/* Le texte "PARALLELES" du bas */}
        <Paralleles />
        <Group />
        <Group1 />
        <Group2 />
        <Group3 />
        
      </div>
    </div>
  );
}
