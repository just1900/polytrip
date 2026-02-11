import React, { useId } from 'react';
import { CharacterType } from '../types';

interface CarAvatarProps {
  character: CharacterType;
  color?: string;
}

/* --- Chibi Character Heads (Large) --- */

const PandaHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <circle cx="-14" cy="-12" r="8" fill="#1f2937" />
      <circle cx="14" cy="-12" r="8" fill="#1f2937" />
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      
      {/* Patches */}
      <ellipse cx="-8" cy="0" rx="6" ry="8" fill="#1f2937" transform="rotate(-15 -8 0)" />
      <ellipse cx="8" cy="0" rx="6" ry="8" fill="#1f2937" transform="rotate(15 8 0)" />
      
      {/* Eyes */}
      <circle cx="-8" cy="-2" r="2.5" fill="white" />
      <circle cx="8" cy="-2" r="2.5" fill="white" />
      
      {/* Snout */}
      <ellipse cx="0" cy="6" rx="4" ry="3" fill="#1f2937" />
      <path d="M-2 10 Q0 12 2 10" stroke="#1f2937" strokeWidth="1.5" fill="none" />
      
      {/* Blush */}
      <ellipse cx="-16" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.6" />
      <ellipse cx="16" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.6" />
  </g>
);

const DolphinHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Base */}
      <circle cx="0" cy="0" r="22" fill="#67e8f9" stroke="#22d3ee" strokeWidth="1" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.2" />
      
      {/* Snout Area */}
      <ellipse cx="0" cy="6" rx="12" ry="8" fill="#cffafe" />
      
      {/* Eyes */}
      <circle cx="-8" cy="-2" r="3" fill="#0e7490" />
      <circle cx="8" cy="-2" r="3" fill="#0e7490" />
      <circle cx="-9" cy="-3" r="1" fill="white" />
      <circle cx="7" cy="-3" r="1" fill="white" />
      
      {/* Blowhole */}
      <ellipse cx="0" cy="-14" rx="2" ry="1" fill="#155e75" />
      
      {/* Blush */}
      <ellipse cx="-16" cy="4" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.5" />
      <ellipse cx="16" cy="4" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.5" />
  </g>
);

const FoxHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <path d="M-15 -10 L-22 -26 L-5 -18 Z" fill="#ea580c" />
      <path d="M15 -10 L22 -26 L5 -18 Z" fill="#ea580c" />
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#fb923c" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      {/* Cheeks */}
      <path d="M-22 4 Q-11 4 0 10 Q11 4 22 4 Q18 20 0 20 Q-18 20 -22 4" fill="#fff7ed" />
      
      {/* Eyes */}
      <circle cx="-8" cy="2" r="3" fill="#000" />
      <circle cx="8" cy="2" r="3" fill="#000" />
      <circle cx="-9" cy="1" r="1" fill="white" />
      
      {/* Nose */}
      <circle cx="0" cy="10" r="2.5" fill="#000" />
  </g>
);

const BearHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <circle cx="-16" cy="-14" r="7" fill="#92400e" />
      <circle cx="16" cy="-14" r="7" fill="#92400e" />
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#b45309" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      {/* Snout */}
      <ellipse cx="0" cy="6" rx="9" ry="7" fill="#fde68a" />
      <ellipse cx="0" cy="4" rx="3" ry="2" fill="#451a03" />
      
      {/* Eyes */}
      <circle cx="-8" cy="-2" r="2.5" fill="#000" />
      <circle cx="8" cy="-2" r="2.5" fill="#000" />
  </g>
);

const CatHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <path d="M-14 -10 L-18 -26 L-4 -16 Z" fill="#e5e7eb" />
      <path d="M14 -10 L18 -26 L4 -16 Z" fill="#e5e7eb" />
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#f3f4f6" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      
      {/* Eyes */}
      <circle cx="-8" cy="0" r="3" fill="#000" />
      <circle cx="8" cy="0" r="3" fill="#000" />
      <circle cx="-9" cy="-1" r="1" fill="white" />
      
      {/* Whiskers */}
      <path d="M-12 6 L-20 4 M-12 9 L-20 10" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 6 L20 4 M12 9 L20 10" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Nose */}
      <path d="M-2 6 L0 8 L2 6" stroke="#f472b6" strokeWidth="1.5" fill="none" />
  </g>
);

const RabbitHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <ellipse cx="-8" cy="-25" rx="5" ry="14" fill="#fcd34d" transform="rotate(-10 -8 -15)"/>
      <ellipse cx="8" cy="-25" rx="5" ry="14" fill="#fcd34d" transform="rotate(10 8 -15)"/>
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#fde68a" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      
      {/* Eyes */}
      <circle cx="-7" cy="0" r="3" fill="#000" />
      <circle cx="7" cy="0" r="3" fill="#000" />
      <circle cx="-8" cy="-1" r="1" fill="white" />
      
      {/* Nose */}
      <path d="M-2 8 Q0 10 2 8" stroke="#000" fill="none" strokeWidth="1.5"/>
      <ellipse cx="0" cy="6" rx="2" ry="1.5" fill="#f472b6" />
      
      {/* Blush */}
      <ellipse cx="-14" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.6" />
      <ellipse cx="14" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.6" />
  </g>
);

const SnowFoxHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears - White with blue/grey inside */}
      <path d="M-15 -10 L-22 -26 L-5 -18 Z" fill="#e2e8f0" />
      <path d="M15 -10 L22 -26 L5 -18 Z" fill="#e2e8f0" />
      <path d="M-15 -10 L-18 -20 L-8 -15 Z" fill="#cbd5e1" /> 
      <path d="M15 -10 L18 -20 L8 -15 Z" fill="#cbd5e1" />

      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      
      {/* Eyes */}
      <circle cx="-8" cy="2" r="3" fill="#0f172a" />
      <circle cx="8" cy="2" r="3" fill="#0f172a" />
      <circle cx="-9" cy="1" r="1" fill="white" />
      
      {/* Nose */}
      <circle cx="0" cy="10" r="2.5" fill="#0f172a" />
      
      {/* Cheeks / Blush - Icy Blue */}
      <ellipse cx="-16" cy="8" rx="4" ry="2.5" fill="#bae6fd" opacity="0.6" />
      <ellipse cx="16" cy="8" rx="4" ry="2.5" fill="#bae6fd" opacity="0.6" />
  </g>
);

const PolarBearHead = ({ id }: { id: string }) => (
  <g transform="translate(0, -10)">
      {/* Ears */}
      <circle cx="-16" cy="-14" r="7" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
      <circle cx="16" cy="-14" r="7" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
      {/* Face */}
      <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <circle cx="0" cy="0" r="22" fill={`url(#gradHead-${id})`} opacity="0.1" />
      
      {/* Snout */}
      <ellipse cx="0" cy="6" rx="9" ry="7" fill="#f8fafc" />
      <ellipse cx="0" cy="4" rx="3" ry="2" fill="#1e293b" />
      
      {/* Eyes */}
      <circle cx="-8" cy="-2" r="2.5" fill="#000" />
      <circle cx="8" cy="-2" r="2.5" fill="#000" />

      {/* Blush */}
      <ellipse cx="-15" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.4" />
      <ellipse cx="15" cy="6" rx="4" ry="2.5" fill="#fbcfe8" opacity="0.4" />
  </g>
);

export const CarAvatar: React.FC<CarAvatarProps> = ({ character, color = "#f87171" }) => {
  const id = useId();
  const gradBody = `gradBody-${id}`;
  const gradHead = `gradHead-${id}`;

  const renderHead = () => {
    switch (character) {
      case 'Dolphin': return <DolphinHead id={id} />;
      case 'Fox': return <FoxHead id={id} />;
      case 'Bear': return <BearHead id={id} />;
      case 'Cat': return <CatHead id={id} />;
      case 'Rabbit': return <RabbitHead id={id} />;
      case 'Snow Fox': return <SnowFoxHead id={id} />;
      case 'Polar Bear': return <PolarBearHead id={id} />;
      case 'Panda':
      default: return <PandaHead id={id} />;
    }
  };

  return (
    <g transform="translate(-20, -25) scale(1)">
       <defs>
         <linearGradient id={gradBody} x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
           <stop offset="50%" stopColor={color} />
           <stop offset="100%" stopColor="#000" stopOpacity="0.3" />
         </linearGradient>
         <linearGradient id={gradHead} x1="0%" y1="0%" x2="0%" y2="100%">
           <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
           <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
         </linearGradient>
       </defs>

       {/* Isometric Shadow */}
       <ellipse cx="20" cy="40" rx="20" ry="8" fill="rgba(0,0,0,0.25)" filter="blur(2px)" />
       
       {/* Kart Body (Bumper Car Style) */}
       <path d="M0 30 Q20 45 40 30 L40 20 Q20 35 0 20 Z" fill="#991b1b" opacity="0.4" /> {/* Side Shadow */}
       <path d="M0 20 Q20 35 40 20 Q35 5 20 5 Q5 5 0 20 Z" fill={color} />
       <path d="M0 20 Q20 35 40 20 Q35 5 20 5 Q5 5 0 20 Z" fill={`url(#${gradBody})`} />
       
       {/* Wheels (Tiny) */}
       <circle cx="5" cy="30" r="5" fill="#1f2937" />
       <circle cx="35" cy="30" r="5" fill="#1f2937" />
       <circle cx="20" cy="38" r="5" fill="#1f2937" />

       {/* Steering Wheel */}
       <path d="M14 15 L26 15" stroke="#374151" strokeWidth="3" strokeLinecap="round" />

       {/* Character Head - Scaled Up for Chibi Look */}
       <g transform="translate(20, 10) scale(0.9)">
          {renderHead()}
       </g>
    </g>
  );
};