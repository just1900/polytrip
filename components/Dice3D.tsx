import React from 'react';

interface Dice3DProps {
  value: number | null;
  rolling: boolean;
  onClick: () => void;
  disabled: boolean;
}

export const Dice3D: React.FC<Dice3DProps> = ({ value, rolling, onClick, disabled }) => {
  // Default to face 1 if null
  const targetFace = value || 1;

  // Determine rotation angles to show the target face
  // 1: front (0, 0)
  // 2: bottom (90, 0) -> Rotate X to -90
  // 3: right (0, 90) -> Rotate Y to -90
  // 4: left (0, -90) -> Rotate Y to 90
  // 5: top (-90, 0) -> Rotate X to 90
  // 6: back (0, 180) -> Rotate Y to 180
  
  let rotateX = 0;
  let rotateY = 0;

  if (!rolling) {
    switch (targetFace) {
      case 1: rotateX = 0; rotateY = 0; break;
      case 6: rotateX = 0; rotateY = 180; break;
      case 2: rotateX = -90; rotateY = 0; break;
      case 5: rotateX = 90; rotateY = 0; break;
      case 3: rotateX = 0; rotateY = -90; break;
      case 4: rotateX = 0; rotateY = 90; break;
    }
  }

  // Base size of the dice in pixels (used for translateZ calculation)
  // We use w-24 (96px) or w-32 (128px) via scaling in parent, so we design for 128px here.
  const sizeClass = "w-32 h-32";
  const translateZ = "64px"; // Half of 128px

  return (
    <div 
        className={`perspective-[1000px] ${sizeClass} cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-110 active:scale-95'}`}
        onClick={!disabled ? onClick : undefined}
    >
      <div
        className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-1000 ease-out"
        style={{
          transform: rolling
            ? `rotateX(${720 + Math.random() * 720}deg) rotateY(${720 + Math.random() * 720}deg)`
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Face 1: Front */}
        <Face translate={`translateZ(${translateZ})`} dots={[4]} />
        
        {/* Face 6: Back */}
        <Face translate={`rotateY(180deg) translateZ(${translateZ})`} dots={[0,2,3,5,6,8]} />
        
        {/* Face 2: Top */}
        <Face translate={`rotateX(90deg) translateZ(${translateZ})`} dots={[0,8]} />
        
        {/* Face 5: Bottom */}
        <Face translate={`rotateX(-90deg) translateZ(${translateZ})`} dots={[0,2,6,8,4]} />
        
        {/* Face 3: Right */}
        <Face translate={`rotateY(90deg) translateZ(${translateZ})`} dots={[0,4,8]} />
        
        {/* Face 4: Left */}
        <Face translate={`rotateY(-90deg) translateZ(${translateZ})`} dots={[0,2,6,8]} />
      </div>
    </div>
  );
};

const Face = ({ translate, dots }: { translate: string; dots: number[] }) => (
  <div
    className="absolute w-full h-full bg-white border-[6px] border-slate-200 rounded-2xl flex items-center justify-center [backface-visibility:hidden] shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]"
    style={{ transform: translate }}
  >
    <div className="grid grid-cols-3 grid-rows-3 gap-2 p-3 w-full h-full">
        {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="flex justify-center items-center">
                {dots.includes(i) && <div className="w-full h-full bg-slate-800 rounded-full shadow-inner bg-gradient-to-br from-slate-700 to-black" />}
            </div>
        ))}
    </div>
  </div>
);