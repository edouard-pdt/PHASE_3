import svgPaths from "../../imports/PageDepart/svg-20wrg994x5";

function Paralleles() {
  return (
    <div className="col-1 h-[15.568px] relative row-2 shrink-0 w-[24.866px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.8662 15.5683">
        <path d={svgPaths.p3f344400} fill="#FFEFEC" />
        <path d={svgPaths.pc4dae00} fill="#FFEFEC" />
      </svg>
    </div>
  );
}
function G1() {
  return (
    <div className="col-2 h-[15.568px] relative row-2 shrink-0 w-[24.974px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.9742 15.5683">
        <path d={svgPaths.p19154000} fill="#FFEFEC" />
        <path d={svgPaths.p1429f100} fill="#FFEFEC" />
      </svg>
    </div>
  );
}
function G2() {
  return (
    <div className="col-3 h-[15.568px] relative row-2 shrink-0 w-[23.606px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.6057 15.5683">
        <path d={svgPaths.p8975c00} fill="#FFEFEC" />
        <path d={svgPaths.p1c54ed00} fill="#FFEFEC" />
      </svg>
    </div>
  );
}
function G3() {
  return (
    <div className="col-4 h-[15.568px] relative row-2 shrink-0 w-[23.8px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.8005 15.5683">
        <path d={svgPaths.p3dd5aa80} fill="#FFEFEC" />
        <path d={svgPaths.p37802680} fill="#FFEFEC" />
      </svg>
    </div>
  );
}
function G4() {
  return (
    <div className="col-5 h-[16.329px] relative row-2 shrink-0 w-[24.062px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0616 16.3293">
        <path d={svgPaths.p2d5ea380} fill="#FFEFEC" />
        <path d={svgPaths.p11294e00} fill="#FFEFEC" />
      </svg>
    </div>
  );
}

export function Logo() {
  return (
    <div
      className="bg-[#131313] gap-y-[13px] grid grid-cols-[repeat(5,fit-content(100%))] grid-rows-[repeat(2,fit-content(100%))] px-[22px] py-[12px] rounded-full"
      style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}
      data-name="LOGO"
    >
      <div className="col-2 flex items-center justify-center relative row-1 shrink-0">
        <div className="flex-none rotate-180">
          <div className="relative size-[19px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.83 25.83">
              <path d={svgPaths.p2c058500} fill="#6559A1" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-4 flex items-center justify-center relative row-1 shrink-0">
        <div className="flex-none rotate-180">
          <div className="relative size-[19px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.83 25.83">
              <path d={svgPaths.p2c058500} fill="#DE5C44" />
            </svg>
          </div>
        </div>
      </div>
      <div className="col-1 relative row-1 shrink-0 size-[19px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.83 25.83">
          <circle cx="12.915" cy="12.915" fill="#F6C453" r="12.915" />
        </svg>
      </div>
      <div className="bg-[#eba7be] col-3 relative row-1 shrink-0 size-[19px]" />
      <div className="col-5 relative row-1 shrink-0 size-[19px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.83 25.83">
          <circle cx="12.915" cy="12.915" fill="#4595D0" r="12.915" />
        </svg>
      </div>
      <Paralleles />
      <G1 />
      <G2 />
      <G3 />
      <G4 />
    </div>
  );
}
