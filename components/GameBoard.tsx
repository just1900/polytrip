import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Tile, TileType, Player, Decoration, ThemeType } from '../types';
import { CarAvatar } from './CarAvatar';

interface GameBoardProps {
  tiles: Tile[];
  players: Player[];
  activePlayerId: number;
  theme: ThemeType;
  flyingAnimation?: {
      playerId: number;
      startTileId: number;
      endTileId: number;
  } | null;
}

// Cinematic Flight Animation Overlay
const FlightOverlay = ({ start, end, players, playerId }: { start: Tile, end: Tile, players: Player[], playerId: number }) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return null;

    // Calculate path
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 - 600; 

    return (
        <g className="pointer-events-none" style={{ zIndex: 9999 }}>
            <circle r="40" fill="rgba(0,0,0,0.3)" filter="blur(10px)">
                <animateMotion 
                    dur="3s" 
                    repeatCount="1"
                    fill="freeze"
                    path={`M${start.x} ${start.y} Q${midX} ${(start.y + end.y) / 2} ${end.x} ${end.y}`} 
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                />
            </circle>

            <g>
                <animateMotion 
                    dur="3s" 
                    repeatCount="1"
                    fill="freeze"
                    path={`M${start.x} ${start.y} Q${midX} ${midY} ${end.x} ${end.y}`} 
                    rotate="auto"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.45 0 0.55 1" 
                />
                
                <g transform="rotate(90) scale(3)">
                    <path d="M-10 0 L-5 -30 L5 -30 L10 0 L0 10 Z" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    <path d="M-30 -10 L0 -5 L30 -10 L0 5 Z" fill="#cbd5e1" stroke="white" />
                    <path d="M-10 -25 L0 -35 L10 -25 Z" fill="#ef4444" />
                    
                    <g transform="translate(0, -10) scale(0.5) rotate(-90)">
                        <CarAvatar character={player.character} color={player.color} />
                    </g>
                    
                    <circle cx="-5" cy="-30" r="2" fill="white" opacity="0.8">
                         <animate attributeName="cy" values="-30;-50" dur="0.5s" repeatCount="indefinite" />
                         <animate attributeName="opacity" values="0.8;0" dur="0.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="5" cy="-30" r="2" fill="white" opacity="0.8">
                         <animate attributeName="cy" values="-30;-50" dur="0.5s" repeatCount="indefinite" begin="0.1s" />
                         <animate attributeName="opacity" values="0.8;0" dur="0.5s" repeatCount="indefinite" begin="0.1s" />
                    </circle>
                </g>
            </g>
        </g>
    );
};

// Isometric Graphics Helpers
const TileBase = ({ tile, isHovered, theme }: { tile: Tile, isHovered: boolean, theme: ThemeType }) => {
    // Determine colors based on Theme and "Zone" (segment of the map)
    let topColor = "#e2e8f0";
    let sideColor = "#94a3b8";
    
    if (theme === 'INTERSTELLAR') {
        // Space Theme Palette
        topColor = "#312e81"; sideColor = "#1e1b4b"; // Deep Blue
        if (tile.zone.includes('Asteroid')) { topColor = "#475569"; sideColor = "#334155"; }
        if (tile.zone.includes('Black')) { topColor = "#0f172a"; sideColor = "#020617"; }
        if (tile.zone.includes('Alien')) { topColor = "#a855f7"; sideColor = "#7e22ce"; }
    } else if (theme === 'CYBERPUNK') {
        // Cyber Theme Palette
        topColor = "#27272a"; sideColor = "#18181b"; // Asphalt
        if (tile.zone.includes('Slums')) { topColor = "#52525b"; sideColor = "#3f3f46"; }
        if (tile.zone.includes('Center')) { topColor = "#c026d3"; sideColor = "#a21caf"; } // Neon Purple
        if (tile.zone.includes('Cloud')) { topColor = "#06b6d4"; sideColor = "#0891b2"; } // Neon Cyan
    } else if (theme === 'CANDY') {
        // Candy Theme Palette
        topColor = "#fcd34d"; sideColor = "#f59e0b"; // Cookie dough
        if (tile.zone.includes('Choco')) { topColor = "#78350f"; sideColor = "#451a03"; } // Chocolate
        if (tile.zone.includes('Rainbow')) { topColor = "#fca5a5"; sideColor = "#ef4444"; } // Pink
    } else if (theme === 'OCEAN') {
        // Ocean Theme Palette
        topColor = "#67e8f9"; sideColor = "#06b6d4"; // Shallow Cyan
        if (tile.zone.includes('Trench')) { topColor = "#1e3a8a"; sideColor = "#172554"; } // Deep Blue
        if (tile.zone.includes('Atlantis')) { topColor = "#ccfbf1"; sideColor = "#99f6e4"; } // Glowing Teal
    } else if (theme === 'ARCTIC') {
        // Arctic Palette
        topColor = "#e0f2fe"; sideColor = "#7dd3fc"; // Ice
        if (tile.zone.includes('Deep')) { topColor = "#0ea5e9"; sideColor = "#0284c7"; }
        if (tile.zone.includes('Aurora')) { topColor = "#c084fc"; sideColor = "#a855f7"; }
    } else if (theme === 'JUNGLE') {
        // Jungle Palette
        topColor = "#4ade80"; sideColor = "#15803d"; // Lush Green
        if (tile.zone.includes('Swamp')) { topColor = "#3f6212"; sideColor = "#1a2e05"; } // Murky Green
        if (tile.zone.includes('Ruins')) { topColor = "#a8a29e"; sideColor = "#57534e"; } // Stone
    } else if (theme === 'SOCCER') {
        // Soccer Palette
        topColor = "#84cc16"; sideColor = "#3f6212"; // Pitch Green
        if (tile.zone.includes('Penalty')) { topColor = "#fde047"; sideColor = "#eab308"; } // Warning Yellow
        if (tile.zone.includes('Arena')) { topColor = "#f87171"; sideColor = "#b91c1c"; } // Track Red
    } else if (theme === 'MAGMA') {
        // Magma Palette
        topColor = "#3f3f46"; sideColor = "#18181b"; // Black Rock
        if (tile.zone.includes('Basalt')) { topColor = "#57534e"; sideColor = "#292524"; }
        if (tile.zone.includes('Core')) { topColor = "#7f1d1d"; sideColor = "#450a0a"; } // Dark Red
    } else if (theme === 'ANCIENT') {
        // Ancient Palette
        topColor = "#9f1239"; sideColor = "#881337"; // Imperial Red
        if (tile.zone.includes('Silk')) { topColor = "#fcd34d"; sideColor = "#d97706"; } // Gold
        if (tile.zone.includes('Wall')) { topColor = "#cbd5e1"; sideColor = "#64748b"; } // Stone
    } else if (theme === 'DESERT') {
        // Desert Palette
        topColor = "#fdba74"; sideColor = "#ea580c"; // Orange Sand
        if (tile.zone.includes('Canyon')) { topColor = "#c2410c"; sideColor = "#7c2d12"; } // Red Rock
        if (tile.zone.includes('Oasis')) { topColor = "#fef3c7"; sideColor = "#d97706"; } // Light Sand
    } else if (theme === 'HEAVEN') {
        // Heaven Palette
        topColor = "#ffffff"; sideColor = "#e2e8f0"; // Cloud White
        if (tile.zone.includes('Golden')) { topColor = "#fef08a"; sideColor = "#fbbf24"; } // Gold
        if (tile.zone.includes('Sky')) { topColor = "#bae6fd"; sideColor = "#38bdf8"; } // Light Blue
    } else if (theme === 'PARK') {
        // Park Palette
        topColor = "#86efac"; sideColor = "#22c55e"; // Grass
        if (tile.zone.includes('Pond')) { topColor = "#7dd3fc"; sideColor = "#0284c7"; } // Water
        if (tile.zone.includes('Picnic')) { topColor = "#fca5a5"; sideColor = "#ef4444"; } // Blanket
    } else if (theme === 'GARDEN') {
        // Garden Palette
        topColor = "#bef264"; sideColor = "#65a30d"; // Lime Green
        if (tile.zone.includes('Broccoli')) { topColor = "#4d7c0f"; sideColor = "#1a2e05"; } // Dark Green
        if (tile.zone.includes('Pumpkin')) { topColor = "#fb923c"; sideColor = "#c2410c"; } // Orange
    } else if (theme === 'KINDERGARTEN') {
        // Kindergarten Palette
        topColor = "#fde047"; sideColor = "#ca8a04"; // Yellow
        if (tile.zone.includes('Nap')) { topColor = "#c4b5fd"; sideColor = "#7c3aed"; } // Lavender
        if (tile.zone.includes('Art')) { topColor = "#fca5a5"; sideColor = "#ef4444"; } // Pinkish Red
    }

    if (tile.type === TileType.STORY) { topColor = "#fff"; sideColor = "#cbd5e1"; } 
    if (tile.type === TileType.SHORTCUT) { topColor = "#d8b4fe"; sideColor = "#c084fc"; } 
    // if (tile.type === TileType.PLANE) { topColor = "#1e293b"; sideColor = "#0f172a"; }

    const transform = isHovered ? "translate(0, -6)" : "translate(0, 0)";

    // Dimensions
    const RX = 42; 
    const RY = 25; 
    const HEIGHT = 20;

    // --- ICONS BASED ON THEME ---
    let icon = "";
    if (tile.type === TileType.BOOST) {
        if (theme === 'INTERSTELLAR') icon = "🚀"; 
        else if (theme === 'CYBERPUNK') icon = "⚡"; 
        else if (theme === 'CANDY') icon = "🍬"; 
        else if (theme === 'OCEAN') icon = "🌊"; 
        else if (theme === 'ARCTIC') icon = "🌌"; 
        else if (theme === 'JUNGLE') icon = "🐆"; 
        else if (theme === 'SOCCER') icon = "⚽"; 
        else if (theme === 'MAGMA') icon = "🔥"; 
        else if (theme === 'ANCIENT') icon = "🌸"; 
        else if (theme === 'DESERT') icon = "🏎️"; 
        else if (theme === 'HEAVEN') icon = "🌈"; 
        else if (theme === 'PARK') icon = "✂️"; 
        else if (theme === 'GARDEN') icon = "🥬"; 
        else if (theme === 'KINDERGARTEN') icon = "🪢"; // Jump Rope
        else icon = "🚀";
    }
    else if (tile.type === TileType.PENALTY) {
        if (theme === 'INTERSTELLAR') icon = "☄️"; 
        else if (theme === 'CYBERPUNK') icon = "👾"; 
        else if (theme === 'CANDY') icon = "🍫"; 
        else if (theme === 'OCEAN') icon = "⚓"; 
        else if (theme === 'ARCTIC') icon = "🧊"; 
        else if (theme === 'JUNGLE') icon = "🍃"; 
        else if (theme === 'SOCCER') icon = "🟥"; // Red Card
        else if (theme === 'MAGMA') icon = "🌋"; 
        else if (theme === 'ANCIENT') icon = "🌧️"; 
        else if (theme === 'DESERT') icon = "🌵"; 
        else if (theme === 'HEAVEN') icon = "🌩️"; 
        else if (theme === 'PARK') icon = "💦"; 
        else if (theme === 'GARDEN') icon = "🐛"; 
        else if (theme === 'KINDERGARTEN') icon = "🚩"; // Flag
        else icon = "🍌";
    }
    else if (tile.type === TileType.FREEZE) {
        if (theme === 'INTERSTELLAR') icon = "🕳️"; 
        else if (theme === 'CYBERPUNK') icon = "⛔"; 
        else if (theme === 'CANDY') icon = "🍭"; 
        else if (theme === 'OCEAN') icon = "🐙"; 
        else if (theme === 'ARCTIC') icon = "🥶"; 
        else if (theme === 'JUNGLE') icon = "🌿"; 
        else if (theme === 'SOCCER') icon = "🟨"; // Yellow Card
        else if (theme === 'MAGMA') icon = "⛓️"; 
        else if (theme === 'ANCIENT') icon = "🏮"; 
        else if (theme === 'DESERT') icon = "🌪️"; 
        else if (theme === 'HEAVEN') icon = "🎼"; 
        else if (theme === 'PARK') icon = "🪑"; 
        else if (theme === 'GARDEN') icon = "🐌"; 
        else if (theme === 'KINDERGARTEN') icon = "⏰"; // Late
        else icon = "💤";
    }
    else if (tile.type === TileType.STORY) icon = "✨";
    else if (tile.type === TileType.SHORTCUT) {
        if (theme === 'INTERSTELLAR') icon = "🛸";
        else if (theme === 'CYBERPUNK') icon = "📡";
        else if (theme === 'CANDY') icon = "🌈";
        else if (theme === 'OCEAN') icon = "🐢";
        else if (theme === 'ARCTIC') icon = "❄️";
        else if (theme === 'JUNGLE') icon = "🗿"; // Statue
        else if (theme === 'SOCCER') icon = "🏆";
        else if (theme === 'MAGMA') icon = "🐲";
        else if (theme === 'ANCIENT') icon = "🕊️"; // Crane
        else if (theme === 'DESERT') icon = "🦅";
        else if (theme === 'HEAVEN') icon = "✨";
        else if (theme === 'PARK') icon = "🛶";
        else if (theme === 'GARDEN') icon = "🕳️"; 
        else if (theme === 'KINDERGARTEN') icon = "🛝"; // Slide
        else icon = "🪜";
    }

    return (
        <g className="transition-transform duration-300 ease-out" style={{ transform }}>
             {/* Shadow */}
            <ellipse cx="0" cy={HEIGHT} rx={RX + 3} ry={RY + 3} fill="rgba(0,0,0,0.15)" filter="blur(3px)" />
            
            {/* Block Side (Extrusion) */}
            <path d={`M-${RX} 0 L-${RX} ${HEIGHT} Q0 ${RY + HEIGHT + 6} ${RX} ${HEIGHT} L${RX} 0 Q0 ${RY + 6} -${RX} 0 Z`} fill={sideColor} />
            
            {/* Block Top */}
            <ellipse cx="0" cy="0" rx={RX} ry={RY} fill={topColor} stroke="white" strokeWidth="2" />
            
            {/* Inner Ring / Decor */}
            <ellipse cx="0" cy="0" rx={RX - 8} ry={RY - 6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Specks for Space/Ocean/Arctic */}
            {(theme === 'INTERSTELLAR' || theme === 'OCEAN' || theme === 'ARCTIC') && tile.type === TileType.NORMAL && (
                <g opacity="0.3">
                    <circle cx="-20" cy="-10" r="1.5" fill="white" />
                    <circle cx="20" cy="5" r="1" fill="white" />
                </g>
            )}

            
            {/* Icon/Text */}
            <g transform="translate(0, -3)">
                {/* Increased fontSize from 20 to 32 and adjusted y position */}
                {icon && <text textAnchor="middle" y="10" fontSize="32" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.2))">{icon}</text>}
                
                {tile.type === TileType.NORMAL && (
                    <text textAnchor="middle" y="5" fill="rgba(0,0,0,0.2)" fontSize="11" fontWeight="900">{tile.id}</text>
                )}
            </g>
        </g>
    );
};

const DecorationObj: React.FC<{ deco: Decoration }> = ({ deco }) => {
    const s = deco.scale * 1.6; // Increased scale for better visibility (was 1.2)
    const color = deco.color || "#78350f";
    
    // --- SPACE DECORATIONS ---
    if (deco.type === 'ROCKET') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 20}) scale(${s}) rotate(-15)`}>
                <path d="M-10 0 L-10 -30 Q0 -45 10 -30 L10 0 Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                <path d="M-10 0 L-15 10 L-10 -5 Z" fill="#ef4444" />
                <path d="M10 0 L15 10 L10 -5 Z" fill="#ef4444" />
                <circle cx="0" cy="-20" r="5" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2" />
                <path d="M-5 0 Q0 15 5 0 Z" fill="#f59e0b" className="animate-pulse" />
            </g>
        );
    }
    if (deco.type === 'PLANET') {
        const pColor = deco.color || "#a855f7";
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 40}) scale(${s})`}>
                <ellipse cx="0" cy="0" rx="28" ry="8" fill="none" stroke="#fde68a" strokeWidth="4" strokeDasharray="50 50" transform="rotate(-20)" opacity="0.6"/>
                <circle cx="0" cy="0" r="18" fill={pColor} />
                <circle cx="-6" cy="-6" r="4" fill="white" opacity="0.2" />
                <path d="M-26 2 Q0 12 26 -2" fill="none" stroke="#fde68a" strokeWidth="3" transform="rotate(-20)" strokeLinecap="round" />
            </g>
        );
    }
    if (deco.type === 'UFO') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 50}) scale(${s})`}>
                 <animateTransform attributeName="transform" type="translate" values={`${deco.x},${deco.y-50}; ${deco.x},${deco.y-60}; ${deco.x},${deco.y-50}`} dur="3s" repeatCount="indefinite" />
                 <path d="M-10 0 Q0 -15 10 0 Z" fill="#60a5fa" opacity="0.8" />
                 <ellipse cx="0" cy="0" rx="20" ry="6" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                 <circle cx="-12" cy="2" r="2" fill="#ef4444" className="animate-ping" />
                 <circle cx="0" cy="4" r="2" fill="#22c55e" className="animate-ping" style={{animationDelay: '0.3s'}} />
                 <circle cx="12" cy="2" r="2" fill="#eab308" className="animate-ping" style={{animationDelay: '0.6s'}} />
            </g>
        );
    }
    if (deco.type === 'SATELLITE') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 60}) scale(${s}) rotate(20)`}>
                 <rect x="-20" y="-8" width="14" height="16" fill="#1e40af" stroke="#60a5fa" />
                 <rect x="6" y="-8" width="14" height="16" fill="#1e40af" stroke="#60a5fa" />
                 <rect x="-6" y="-6" width="12" height="12" fill="#cbd5e1" />
                 <line x1="-6" y1="0" x2="-20" y2="0" stroke="#94a3b8" strokeWidth="2" />
                 <line x1="6" y1="0" x2="20" y2="0" stroke="#94a3b8" strokeWidth="2" />
                 <line x1="0" y1="-6" x2="0" y2="-15" stroke="#94a3b8" strokeWidth="1" />
                 <circle cx="0" cy="-15" r="2" fill="#ef4444" className="animate-pulse" />
            </g>
        );
    }

    // --- CYBERPUNK ---
    if (deco.type === 'NEON_SIGN') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 50}) scale(${s})`}>
                 <rect x="-2" y="0" width="4" height="50" fill="#333" />
                 <rect x="-20" y="-30" width="40" height="20" fill="#111" stroke={color} strokeWidth="3" className="animate-pulse" />
                 <text x="0" y="-18" textAnchor="middle" fill={color} fontSize="10" fontFamily="monospace" fontWeight="bold">OPEN</text>
            </g>
        );
    }
    if (deco.type === 'HOLOGRAM') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 40}) scale(${s})`}>
                <ellipse cx="0" cy="40" rx="10" ry="5" fill="#22d3ee" opacity="0.5" />
                <path d="M-10 40 L-15 0 L15 0 L10 40 Z" fill="url(#gradHolo)" opacity="0.2" />
                <circle cx="0" cy="10" r="10" fill="#22d3ee" opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
             </g>
        );
    }
    if (deco.type === 'SKYSCRAPER') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <path d="M-15 0 L-15 -60 L0 -70 L15 -60 L15 0 Z" fill="#3f3f46" stroke="#22d3ee" strokeWidth="1" />
                <rect x="-10" y="-50" width="4" height="4" fill="#facc15" />
                <rect x="5" y="-30" width="4" height="4" fill="#e879f9" />
                <rect x="-8" y="-20" width="4" height="4" fill="#22d3ee" />
            </g>
        );
    }
    if (deco.type === 'BLIMP') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 80}) scale(${s})`}>
                 <ellipse cx="0" cy="0" rx="30" ry="12" fill="#333" stroke="#f0abfc" strokeWidth="2" />
                 <text x="0" y="4" textAnchor="middle" fill="#f0abfc" fontSize="8" fontWeight="bold">CYBER</text>
             </g>
        );
    }

    // --- CANDY ---
    if (deco.type === 'CANDY_CANE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <path d="M-5 0 L-5 -30 Q-5 -40 5 -40 Q15 -40 15 -30" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <path d="M-5 0 L-5 -30 Q-5 -40 5 -40 Q15 -40 15 -30" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray="5 5" />
             </g>
        );
    }
    if (deco.type === 'LOLLIPOP') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-2" y="-40" width="4" height="40" fill="#fff" />
                 <circle cx="0" cy="-40" r="15" fill={color} stroke="white" strokeWidth="3" />
                 <path d="M-10 -40 Q0 -50 10 -40" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/>
             </g>
        );
    }
    if (deco.type === 'DONUT') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 10}) scale(${s})`}>
                 <ellipse cx="0" cy="0" rx="15" ry="8" fill="#fcd34d" />
                 <ellipse cx="0" cy="-2" rx="15" ry="8" fill="#f472b6" /> {/* Icing */}
                 <ellipse cx="0" cy="-2" rx="5" ry="3" fill="#bae6fd" /> {/* Hole (sky color approximation) */}
                 <rect x="-10" y="-5" width="2" height="2" fill="white" />
                 <rect x="8" y="0" width="2" height="2" fill="yellow" />
            </g>
        );
    }
    if (deco.type === 'ICE_CREAM') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <path d="M0 0 L-10 -20 L10 -20 Z" fill="#fde047" stroke="#b45309" strokeWidth="1" />
                <circle cx="0" cy="-25" r="10" fill="#f472b6" />
                <circle cx="0" cy="-35" r="8" fill="#fff" />
            </g>
        );
    }

    // --- OCEAN ---
    if (deco.type === 'CORAL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M0 0 L0 -20 Q-10 -30 -10 -40 M0 -20 Q10 -30 10 -35" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
                 <circle cx="-10" cy="-40" r="3" fill={color} />
                 <circle cx="10" cy="-35" r="3" fill={color} />
             </g>
        );
    }
    if (deco.type === 'BUBBLE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 40}) scale(${s})`}>
                 <circle cx="0" cy="0" r="5" fill="none" stroke="white" strokeWidth="1" opacity="0.6">
                    <animate attributeName="cy" values="0;-40" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
                 </circle>
             </g>
        );
    }
    if (deco.type === 'JELLYFISH') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 40}) scale(${s})`}>
                 <path d="M-10 0 Q0 -15 10 0" fill="#e879f9" opacity="0.7" />
                 <line x1="-5" y1="0" x2="-5" y2="10" stroke="#e879f9" strokeWidth="1" />
                 <line x1="0" y1="0" x2="0" y2="12" stroke="#e879f9" strokeWidth="1" />
                 <line x1="5" y1="0" x2="5" y2="10" stroke="#e879f9" strokeWidth="1" />
                 <animateTransform attributeName="transform" type="translate" values={`${deco.x},${deco.y-40}; ${deco.x},${deco.y-50}; ${deco.x},${deco.y-40}`} dur="4s" repeatCount="indefinite" />
             </g>
        );
    }
    if (deco.type === 'SUBMARINE') {
         return (
             <g transform={`translate(${deco.x}, ${deco.y - 30}) scale(${s})`}>
                 <ellipse cx="0" cy="0" rx="20" ry="10" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                 <rect x="-5" y="-15" width="10" height="8" fill="#facc15" />
                 <line x1="0" y1="-15" x2="0" y2="-20" stroke="#ca8a04" strokeWidth="2" />
                 <circle cx="5" cy="0" r="3" fill="#38bdf8" />
                 <path d="M-20 0 L-25 -5 L-25 5 Z" fill="#ca8a04" /> {/* Propeller */}
             </g>
         );
    }
    
    // --- ARCTIC ---
    if (deco.type === 'PENGUIN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <ellipse cx="0" cy="-10" rx="8" ry="12" fill="#1f2937" />
                 <ellipse cx="0" cy="-8" rx="5" ry="8" fill="white" />
                 <circle cx="-3" cy="-14" r="1" fill="black" />
                 <circle cx="3" cy="-14" r="1" fill="black" />
                 <path d="M-2 -12 L0 -10 L2 -12" fill="#f59e0b" />
                 <ellipse cx="-4" cy="0" rx="3" ry="1.5" fill="#f59e0b" />
                 <ellipse cx="4" cy="0" rx="3" ry="1.5" fill="#f59e0b" />
             </g>
        );
    }
    if (deco.type === 'ICE_CRYSTAL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 20}) scale(${s})`}>
                 <path d="M0 0 L-5 -15 L0 -30 L5 -15 Z" fill="#cffafe" stroke="#22d3ee" strokeWidth="1" />
                 <path d="M-5 0 L-10 -10 L-5 -20 Z" fill="#a5f3fc" opacity="0.8" />
                 <path d="M5 0 L10 -10 L5 -20 Z" fill="#a5f3fc" opacity="0.8" />
             </g>
        );
    }
    if (deco.type === 'IGLOO') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-15 0 A 15 15 0 0 1 15 0" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="2" />
                 <rect x="-5" y="-5" width="10" height="5" fill="#e0f2fe" stroke="#bae6fd" />
                 <line x1="-15" y1="0" x2="15" y2="0" stroke="#bae6fd" strokeWidth="2" />
             </g>
        );
    }
    if (deco.type === 'SNOWMAN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <circle cx="0" cy="-8" r="10" fill="white" />
                 <circle cx="0" cy="-22" r="7" fill="white" />
                 <circle cx="-2" cy="-24" r="1" fill="black" />
                 <circle cx="2" cy="-24" r="1" fill="black" />
                 <path d="M0 -22 L4 -21 L0 -20 Z" fill="#f97316" />
                 <rect x="-6" y="-30" width="12" height="2" fill="#374151" />
                 <rect x="-4" y="-36" width="8" height="6" fill="#374151" />
             </g>
        );
    }

    // --- JUNGLE ---
    if (deco.type === 'PALM_TREE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M0 0 Q5 -20 0 -40" stroke="#78350f" strokeWidth="4" fill="none" />
                 <g transform="translate(0, -40)">
                     <path d="M0 0 Q-15 -10 -20 5" stroke="#22c55e" strokeWidth="4" fill="none" />
                     <path d="M0 0 Q15 -10 20 5" stroke="#22c55e" strokeWidth="4" fill="none" />
                     <path d="M0 0 Q0 -20 10 -15" stroke="#22c55e" strokeWidth="4" fill="none" />
                     <path d="M0 0 Q-5 -20 -15 -15" stroke="#22c55e" strokeWidth="4" fill="none" />
                 </g>
             </g>
        );
    }
    if (deco.type === 'VINE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 30}) scale(${s})`}>
                 <path d="M-10 -10 Q0 10 10 -10 Q0 -30 -10 -10" stroke="#15803d" strokeWidth="2" fill="none" />
                 <circle cx="0" cy="0" r="2" fill="#15803d" />
             </g>
        );
    }
    if (deco.type === 'TOTEM') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-8" y="-40" width="16" height="40" fill="#a8a29e" />
                 <rect x="-10" y="-30" width="20" height="8" fill="#ef4444" />
                 <rect x="-10" y="-15" width="20" height="8" fill="#facc15" />
                 <circle cx="-4" cy="-35" r="2" fill="black" />
                 <circle cx="4" cy="-35" r="2" fill="black" />
             </g>
        );
    }
    if (deco.type === 'FLOWER') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <line x1="0" y1="0" x2="0" y2="-15" stroke="#22c55e" strokeWidth="2" />
                 <circle cx="-5" cy="-20" r="5" fill="#f472b6" />
                 <circle cx="5" cy="-20" r="5" fill="#f472b6" />
                 <circle cx="0" cy="-25" r="5" fill="#f472b6" />
                 <circle cx="0" cy="-15" r="5" fill="#f472b6" />
                 <circle cx="0" cy="-20" r="3" fill="#facc15" />
             </g>
        );
    }

    // --- SOCCER ---
    if (deco.type === 'SOCCER_BALL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 10}) scale(${s})`}>
                 <circle cx="0" cy="0" r="10" fill="white" stroke="black" strokeWidth="1" />
                 <path d="M-4 -2 L4 -2 L0 4 Z" fill="black" />
                 <path d="M-8 4 L-4 8" stroke="black" strokeWidth="1" />
                 <path d="M8 4 L4 8" stroke="black" strokeWidth="1" />
                 <path d="M0 -10 L0 -6" stroke="black" strokeWidth="1" />
             </g>
        );
    }
    if (deco.type === 'FLAG') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <line x1="0" y1="0" x2="0" y2="-30" stroke="#f1f5f9" strokeWidth="2" />
                 <path d="M0 -30 L15 -25 L0 -20 Z" fill="#ef4444" />
             </g>
        );
    }
    if (deco.type === 'TROPHY') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 10}) scale(${s})`}>
                 <path d="M-8 0 L-5 -15 L5 -15 L8 0 L0 5 Z" fill="#eab308" />
                 <rect x="-4" y="5" width="8" height="5" fill="#ca8a04" />
             </g>
        );
    }
    if (deco.type === 'GOAL_POST') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <line x1="-15" y1="0" x2="-15" y2="-25" stroke="white" strokeWidth="3" />
                 <line x1="15" y1="0" x2="15" y2="-25" stroke="white" strokeWidth="3" />
                 <line x1="-15" y1="-25" x2="15" y2="-25" stroke="white" strokeWidth="3" />
             </g>
        );
    }
    
    // --- MAGMA ---
    if (deco.type === 'FIRE_PILLAR') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 20}) scale(${s})`}>
                 <path d="M-10 20 L0 -30 L10 20 Z" fill="#ef4444" opacity="0.8">
                    <animate attributeName="d" values="M-10 20 L0 -30 L10 20 Z; M-8 20 L0 -40 L8 20 Z; M-10 20 L0 -30 L10 20 Z" dur="0.8s" repeatCount="indefinite"/>
                 </path>
                 <path d="M-5 20 L0 -15 L5 20 Z" fill="#facc15">
                     <animate attributeName="opacity" values="0.6;1;0.6" dur="0.5s" repeatCount="indefinite"/>
                 </path>
             </g>
        );
    }
    if (deco.type === 'LAVA_POOL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <ellipse cx="0" cy="0" rx="20" ry="10" fill="#b91c1c" />
                 <ellipse cx="0" cy="0" rx="15" ry="7" fill="#ef4444" />
                 <circle cx="-5" cy="-2" r="2" fill="#facc15">
                     <animate attributeName="r" values="0;4;0" dur="2s" repeatCount="indefinite" />
                 </circle>
             </g>
        );
    }
    if (deco.type === 'CHAIN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 30}) scale(${s})`}>
                 <path d="M-5 -20 Q0 0 5 -20" stroke="#57534e" strokeWidth="3" fill="none" />
                 <path d="M-5 -10 Q0 10 5 -10" stroke="#57534e" strokeWidth="3" fill="none" />
                 <path d="M0 0 L0 15" stroke="#57534e" strokeWidth="2" />
                 <circle cx="0" cy="18" r="3" fill="#292524" />
             </g>
        );
    }
    if (deco.type === 'SKULL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-6 -8 L-6 -14 Q0 -20 6 -14 L6 -8 Q0 0 -6 -8" fill="#e5e5e5" />
                 <circle cx="-2" cy="-12" r="1.5" fill="black" />
                 <circle cx="2" cy="-12" r="1.5" fill="black" />
                 <path d="M-1 -8 L0 -9 L1 -8" stroke="black" strokeWidth="0.5" />
             </g>
        );
    }

    // --- ANCIENT ---
    if (deco.type === 'LANTERN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 40}) scale(${s})`}>
                 <line x1="0" y1="0" x2="0" y2="-20" stroke="#78350f" strokeWidth="1" />
                 <ellipse cx="0" cy="0" rx="10" ry="12" fill="#dc2626" />
                 <path d="M-10 0 L10 0" stroke="#facc15" strokeWidth="2" opacity="0.5" />
                 <rect x="-4" y="10" width="8" height="6" fill="#facc15" />
                 <animateTransform attributeName="transform" type="rotate" values="-5 0 -50; 5 0 -50; -5 0 -50" dur="3s" repeatCount="indefinite" />
             </g>
        );
    }
    if (deco.type === 'CHERRY_BLOSSOM') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 30}) scale(${s})`}>
                 <path d="M0 30 Q5 10 0 0" stroke="#57534e" strokeWidth="3" />
                 <circle cx="-5" cy="5" r="4" fill="#fbcfe8" />
                 <circle cx="5" cy="0" r="5" fill="#fbcfe8" />
                 <circle cx="0" cy="-5" r="4" fill="#fbcfe8" />
                 <circle cx="0" cy="0" r="2" fill="#f472b6" />
             </g>
        );
    }
    if (deco.type === 'SCREEN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-15" y="-20" width="30" height="20" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
                 <path d="M-5 -15 L5 -5 M5 -15 L-5 -5" stroke="#dc2626" strokeWidth="1" />
             </g>
        );
    }
    if (deco.type === 'GATE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-15" y="-30" width="4" height="30" fill="#b91c1c" />
                 <rect x="11" y="-30" width="4" height="30" fill="#b91c1c" />
                 <path d="M-20 -25 L20 -25 L20 -30 L-20 -30 Z" fill="#b91c1c" />
                 <path d="M-22 -32 L22 -32 L20 -25 L-20 -25 Z" fill="#7f1d1d" />
             </g>
        );
    }

    // --- DESERT ---
    if (deco.type === 'CACTUS') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-4" y="-30" width="8" height="30" rx="4" fill="#16a34a" />
                 <path d="M-4 -20 L-10 -20 L-10 -28 L-6 -28" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                 <path d="M4 -15 L10 -15 L10 -22 L6 -22" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
             </g>
        );
    }
    if (deco.type === 'BONE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-10 0 L10 0" stroke="#fefce8" strokeWidth="4" strokeLinecap="round" />
                 <circle cx="-12" cy="-2" r="2" fill="#fefce8" />
                 <circle cx="-12" cy="2" r="2" fill="#fefce8" />
                 <circle cx="12" cy="-2" r="2" fill="#fefce8" />
                 <circle cx="12" cy="2" r="2" fill="#fefce8" />
             </g>
        );
    }
    if (deco.type === 'TUMBLEWEED') {
         return (
             <g transform={`translate(${deco.x}, ${deco.y - 5}) scale(${s})`}>
                 <circle cx="0" cy="0" r="8" fill="none" stroke="#a16207" strokeWidth="1" strokeDasharray="4 2" />
                 <circle cx="0" cy="0" r="6" fill="none" stroke="#a16207" strokeWidth="1" transform="rotate(45)" />
                 <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="4s" repeatCount="indefinite" />
             </g>
         );
    }
    if (deco.type === 'OIL_BARREL') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-8" y="-20" width="16" height="20" fill="#dc2626" stroke="#991b1b" />
                 <line x1="-8" y1="-15" x2="8" y2="-15" stroke="#991b1b" />
                 <line x1="-8" y1="-5" x2="8" y2="-5" stroke="#991b1b" />
                 <text x="0" y="-8" fontSize="6" textAnchor="middle" fill="white">TNT</text>
             </g>
        );
    }

    // --- HEAVEN ---
    if (deco.type === 'CLOUD_PLATFORM') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <circle cx="-10" cy="-5" r="8" fill="white" />
                 <circle cx="0" cy="-10" r="10" fill="white" />
                 <circle cx="10" cy="-5" r="8" fill="white" />
             </g>
        );
    }
    if (deco.type === 'HARP') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 10}) scale(${s})`}>
                 <path d="M-5 0 L-5 -20 Q5 -25 10 -10 L0 0 Z" fill="none" stroke="#facc15" strokeWidth="2" />
                 <line x1="-2" y1="0" x2="-2" y2="-18" stroke="#facc15" strokeWidth="0.5" />
                 <line x1="0" y1="0" x2="2" y2="-15" stroke="#facc15" strokeWidth="0.5" />
             </g>
        );
    }
    if (deco.type === 'WING_STATUE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M0 0 L-10 -10 Q-15 -20 -5 -25" stroke="white" strokeWidth="3" fill="none" />
                 <path d="M0 0 L10 -10 Q15 -20 5 -25" stroke="white" strokeWidth="3" fill="none" />
             </g>
        );
    }
    if (deco.type === 'GOLD_ARCH') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-15 0 Q0 -30 15 0" stroke="#facc15" strokeWidth="3" fill="none" />
             </g>
        );
    }

    // --- PARK ---
    if (deco.type === 'FOUNTAIN') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <ellipse cx="0" cy="0" rx="15" ry="5" fill="#e2e8f0" stroke="#94a3b8" />
                 <rect x="-2" y="-10" width="4" height="10" fill="#e2e8f0" />
                 <circle cx="0" cy="-15" r="2" fill="#38bdf8" />
                 <path d="M0 -15 Q-5 -25 -10 -10" stroke="#38bdf8" fill="none" />
                 <path d="M0 -15 Q5 -25 10 -10" stroke="#38bdf8" fill="none" />
             </g>
        );
    }
    if (deco.type === 'BENCH') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 5}) scale(${s})`}>
                 <line x1="-10" y1="0" x2="10" y2="0" stroke="#78350f" strokeWidth="4" />
                 <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#78350f" strokeWidth="2" />
                 <line x1="-8" y1="0" x2="-8" y2="5" stroke="#3f3f46" strokeWidth="1" />
                 <line x1="8" y1="0" x2="8" y2="5" stroke="#3f3f46" strokeWidth="1" />
             </g>
        );
    }
    if (deco.type === 'BUSH_SCULPTURE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-8" y="-15" width="16" height="15" rx="5" fill="#16a34a" />
                 <rect x="-2" y="0" width="4" height="5" fill="#78350f" />
             </g>
        );
    }
    if (deco.type === 'LAMP_POST') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <line x1="0" y1="0" x2="0" y2="-30" stroke="#1f2937" strokeWidth="1" />
                 <circle cx="0" cy="-30" r="3" fill="#facc15" />
                 <circle cx="0" cy="-30" r="5" fill="#facc15" opacity="0.3" className="animate-pulse" />
             </g>
        );
    }

    // --- GARDEN ---
    if (deco.type === 'BROCCOLI') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M0 0 L0 -15" stroke="#65a30d" strokeWidth="6" />
                 <circle cx="-8" cy="-20" r="8" fill="#4d7c0f" />
                 <circle cx="8" cy="-20" r="8" fill="#4d7c0f" />
                 <circle cx="0" cy="-25" r="10" fill="#65a30d" />
             </g>
        );
    }
    if (deco.type === 'SCARECROW') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 20}) scale(${s})`}>
                 <line x1="0" y1="0" x2="0" y2="20" stroke="#78350f" strokeWidth="2" />
                 <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#78350f" strokeWidth="2" />
                 <circle cx="0" cy="-10" r="5" fill="#fde047" />
                 <path d="M-10 -5 L10 -5 L5 10 L-5 10 Z" fill="#3b82f6" />
             </g>
        );
    }
    if (deco.type === 'TOMATO') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 10}) scale(${s})`}>
                 <circle cx="0" cy="0" r="10" fill="#ef4444" />
                 <path d="M0 -10 L-3 -14 M0 -10 L3 -14" stroke="#4ade80" strokeWidth="2" />
             </g>
        );
    }
    if (deco.type === 'SPRINKLER') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-2" y="-5" width="4" height="5" fill="#475569" />
                 <circle cx="0" cy="-5" r="3" fill="#94a3b8" />
                 <path d="M0 -5 L10 -10" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" className="animate-ping" />
             </g>
        );
    }

    // --- KINDERGARTEN ---
    if (deco.type === 'BLOCKS') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-10" y="-10" width="10" height="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
                 <rect x="0" y="-10" width="10" height="10" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
                 <rect x="-5" y="-20" width="10" height="10" fill="#facc15" stroke="#b45309" strokeWidth="1" />
             </g>
        );
    }
    if (deco.type === 'CRAYON') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-5 0 L-5 -25 L0 -35 L5 -25 L5 0 Z" fill={color} stroke="black" strokeWidth="0.5" />
                 <rect x="-5" y="-20" width="10" height="15" fill="black" opacity="0.1" />
             </g>
        );
    }
    if (deco.type === 'ROCKING_HORSE') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-15 0 Q0 5 15 0" stroke="#78350f" strokeWidth="3" fill="none" />
                 <path d="M-5 0 L-5 -15 L5 -15 L5 0" stroke="#fcd34d" strokeWidth="4" />
                 <circle cx="-5" cy="-20" r="5" fill="#fcd34d" />
             </g>
        );
    }
    if (deco.type === 'LOCKER') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-8" y="-25" width="16" height="25" fill="#9ca3af" stroke="#4b5563" />
                 <line x1="-8" y1="-12" x2="8" y2="-12" stroke="#4b5563" />
                 <rect x="-6" y="-22" width="12" height="2" fill="#4b5563" />
                 <rect x="-6" y="-9" width="12" height="2" fill="#4b5563" />
             </g>
        );
    }

    if (deco.type === 'STAR') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y - 60}) scale(${s})`} className="animate-pulse">
                 <path d="M0 -20 L5 -8 L18 -8 L8 2 L12 15 L0 8 L-12 15 L-8 2 L-18 -8 L-5 -8 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
             </g>
        );
    }

    // Default Fallback
    return null;
};

export const GameBoard: React.FC<GameBoardProps> = ({ tiles, players, activePlayerId, theme, flyingAnimation }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const [zoom, setZoom] = useState(1.0);
  
  // Track initial mount to snap camera to start
  const isInitialMount = useRef(true);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Get Background Gradient based on Theme
  const getBgGradient = () => {
      switch (theme) {
          case 'INTERSTELLAR': return 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #020617 100%)'; // Deep Space
          case 'CYBERPUNK': return 'linear-gradient(to bottom right, #2e1065, #0f172a)'; // Dark Purple/Slate
          case 'CANDY': return 'radial-gradient(circle at 50% 50%, #fce7f3 0%, #fbcfe8 100%)'; // Pinkish
          case 'OCEAN': return 'linear-gradient(to bottom, #bae6fd, #1e3a8a)'; // Light blue to Deep blue
          case 'ARCTIC': return 'linear-gradient(to bottom, #e0f2fe, #7dd3fc, #0284c7)'; // Ice Blue
          case 'JUNGLE': return 'linear-gradient(to bottom, #dcfce7, #4ade80, #14532d)'; // Green lush
          case 'SOCCER': return 'radial-gradient(circle at 50% 50%, #ecfccb 0%, #65a30d 100%)'; // Stadium lights
          case 'MAGMA': return 'radial-gradient(circle at 50% 50%, #7f1d1d 0%, #450a0a 100%)'; // Red Dark
          case 'ANCIENT': return 'linear-gradient(to bottom, #fef2f2, #fca5a5, #ef4444)'; // Red Mist
          case 'DESERT': return 'linear-gradient(to bottom, #ffedd5, #fdba74, #ea580c)'; // Orange Sunset
          case 'HEAVEN': return 'radial-gradient(circle at 50% 10%, #ffffff 0%, #bae6fd 100%)'; // Sky
          case 'PARK': return 'linear-gradient(to bottom, #f0fdf4, #bbf7d0, #86efac)'; // Fresh Green
          case 'GARDEN': return 'linear-gradient(to bottom, #fefce8, #d9f99d, #65a30d)'; // Sunny Garden
          case 'KINDERGARTEN': return 'linear-gradient(to bottom, #fff7ed, #fde68a, #fcd34d)'; // Warm Yellow
          default: return 'radial-gradient(circle at 50% 50%, #bae6fd 0%, #7dd3fc 100%)';
      }
  }

  // Combine and sort for painter's algorithm
  const renderList = useMemo(() => {
     const list: any[] = [];
     
     tiles.forEach(t => {
         list.push({ type: 'TILE', y: t.y, x: t.x, obj: t, id: `tile-${t.id}` });
         if (t.decorations) {
             t.decorations.forEach(d => {
                 list.push({ type: 'DECO', y: d.y, x: d.x, obj: d, id: d.id });
             });
         }
     });

     players.forEach(p => {
         // Don't render the player on the tile if they are currently flying
         if (flyingAnimation && flyingAnimation.playerId === p.id) return;

         const t = tiles[p.position];
         list.push({ type: 'PLAYER', y: t.y + 1, x: t.x, obj: p, id: `player-${p.id}`, tile: t });
     });

     return list.sort((a, b) => {
         if (Math.abs(a.y - b.y) > 5) return a.y - b.y;
         return a.x - b.x; 
     });
  }, [tiles, players, flyingAnimation]);

  // Bounds
  const minX = Math.min(...tiles.map(t => t.x));
  const maxX = Math.max(...tiles.map(t => t.x));
  const minY = Math.min(...tiles.map(t => t.y));
  const maxY = Math.max(...tiles.map(t => t.y));
  
  const width = maxX - minX + 800;
  const height = maxY - minY + 800;
  const offsetX = -minX + 400;
  const offsetY = -minY + 400;

  // Auto-center on active player
  useEffect(() => {
    if (scrollContainerRef.current && !isDragging) {
        // If flying, target the midpoint of flight
        let targetX = 0;
        let targetY = 0;
        let hasTarget = false;

        if (flyingAnimation) {
            const start = tiles[flyingAnimation.startTileId];
            const end = tiles[flyingAnimation.endTileId];
            targetX = (start.x + end.x) / 2;
            targetY = (start.y + end.y) / 2;
            hasTarget = true;
        } else {
            const activePlayer = players.find(p => p.id === activePlayerId);
            if (activePlayer) {
                const t = tiles[activePlayer.position];
                if (t) {
                    targetX = t.x;
                    targetY = t.y;
                    hasTarget = true;
                }
            }
        }

        if (hasTarget) {
            const containerW = scrollContainerRef.current.clientWidth;
            const containerH = scrollContainerRef.current.clientHeight;
            
            const targetLeft = ((targetX + offsetX) * zoom) - containerW / 2;
            const targetTop = ((targetY + offsetY) * zoom) - containerH / 2;
            
            const behavior = isInitialMount.current ? 'auto' : 'smooth';
            scrollContainerRef.current.scrollTo({ left: targetLeft, top: targetTop, behavior });
            
            if (isInitialMount.current) isInitialMount.current = false;
        }
    }
  }, [activePlayerId, zoom, flyingAnimation]); 

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.min(Math.max(0.4, z + delta), 2.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    scrollContainerRef.current.scrollLeft -= dx;
    scrollContainerRef.current.scrollTop -= dy;
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
        className="relative w-full h-full shadow-inner font-sans select-none"
        style={{ background: getBgGradient() }}
    >
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
            <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="w-10 h-10 bg-white rounded-full shadow-lg font-black text-slate-600 hover:bg-slate-50 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-xl flex items-center justify-center">+</button>
            <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="w-10 h-10 bg-white rounded-full shadow-lg font-black text-slate-600 hover:bg-slate-50 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 text-xl flex items-center justify-center">-</button>
            <div className="bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-center text-slate-500 shadow-sm border border-white/50">{(zoom * 100).toFixed(0)}%</div>
        </div>
        
        {/* Instructions Hint */}
        <div className="absolute bottom-4 left-4 z-40 bg-white/60 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-500 border border-white/50 shadow-sm pointer-events-none">
            🖱️ Drag to Pan • 📜 Scroll to Zoom
        </div>

        <div 
            ref={scrollContainerRef}
            className={`w-full h-full overflow-hidden relative cursor-${isDragging ? 'grabbing' : 'grab'}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div 
                style={{ 
                    width: width * zoom, 
                    height: height * zoom, 
                    position: 'relative',
                    transformOrigin: '0 0'
                }}
            >
                <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0' }}>
                    <svg width={width} height={height} className="overflow-visible">
                        <defs>
                            <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ff9a9e" />
                                <stop offset="33%" stopColor="#fad0c4" />
                                <stop offset="66%" stopColor="#ffd1ff" />
                                <stop offset="100%" stopColor="#a18cd1" />
                            </linearGradient>
                            {/* Hologram Gradient */}
                            <linearGradient id="gradHolo" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
                            </linearGradient>
                        </defs>
                        <g transform={`translate(${offsetX}, ${offsetY})`}>
                            
                            {/* Road Connections - Drawn first (bottom layer) */}
                            {tiles.map((t, i) => {
                                if (i === tiles.length - 1) return null;
                                const next = tiles[i+1];
                                return (
                                    <path 
                                        key={`road-${i}`}
                                        d={`M${t.x} ${t.y} L${next.x} ${next.y}`}
                                        stroke={theme === 'INTERSTELLAR' || theme === 'CYBERPUNK' || theme === 'MAGMA' ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)"}
                                        strokeWidth="32"
                                        strokeLinecap="round"
                                        fill="none"
                                    />
                                );
                            })}

                            {/* Shortcut Arcs (Ladders) */}
                            {tiles.filter(t => t.type === TileType.SHORTCUT && t.shortcutTargetId).map(t => {
                                const target = tiles[t.shortcutTargetId!];
                                const mx = (t.x + target.x) / 2;
                                const my = (t.y + target.y) / 2 - 100; // Increased Arc height
                                const d = `M${t.x} ${t.y} Q${mx} ${my} ${target.x} ${target.y}`;
                                return (
                                    <g key={`shortcut-${t.id}`}>
                                        <path d={d} stroke="url(#rainbow)" strokeWidth="5" fill="none" strokeDasharray="10 5" className="animate-pulse" strokeLinecap="round" />
                                        <circle cx={mx} cy={my} r="5" fill="white" className="animate-ping" />
                                    </g>
                                );
                            })}
                            
                            {/* Flight Overlay */}
                            {flyingAnimation && (
                                <FlightOverlay 
                                    start={tiles[flyingAnimation.startTileId]} 
                                    end={tiles[flyingAnimation.endTileId]}
                                    players={players}
                                    playerId={flyingAnimation.playerId}
                                />
                            )}

                            {renderList.map((item) => {
                                if (item.type === 'TILE') {
                                    const t = item.obj as Tile;
                                    return (
                                        <g 
                                            key={item.id} 
                                            transform={`translate(${t.x}, ${t.y})`}
                                            onMouseEnter={() => setHoveredTile(t)}
                                            onMouseLeave={() => setHoveredTile(null)}
                                            className="cursor-pointer"
                                        >
                                            <TileBase tile={t} isHovered={hoveredTile?.id === t.id} theme={theme} />
                                        </g>
                                    );
                                }
                                if (item.type === 'DECO') {
                                    const d = item.obj as Decoration;
                                    return <DecorationObj key={item.id} deco={d} />;
                                }
                                if (item.type === 'PLAYER') {
                                    const p = item.obj as Player;
                                    const t = item.tile as Tile;
                                    return (
                                        <g 
                                            key={item.id} 
                                            transform={`translate(${t.x}, ${t.y - 30}) scale(0.9)`} 
                                            className="transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                        >
                                            <CarAvatar character={p.character} color={p.color} />
                                            
                                            {/* Name Tag */}
                                            <g transform="translate(0, -90)">
                                                <rect x="-30" y="-14" width="60" height="24" rx="12" fill="white" stroke={p.color} strokeWidth="3" />
                                                <text y="3" textAnchor="middle" fontSize="12" fill={p.color} fontWeight="900">{p.name}</text>
                                            </g>
                                            
                                            {p.id === activePlayerId && (
                                                <ellipse cx="0" cy="35" rx="35" ry="18" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 6" className="animate-spin opacity-50" />
                                            )}
                                        </g>
                                    );
                                }
                                return null;
                            })}
                        </g>
                    </svg>
                </div>
            </div>

            {hoveredTile && (
                <div 
                className="absolute z-50 bg-white/90 backdrop-blur text-gray-800 p-4 rounded-xl shadow-xl border-2 border-white pointer-events-none transition-all"
                style={{ 
                    left: (hoveredTile.x + offsetX) * zoom, 
                    top: (hoveredTile.y + offsetY) * zoom - (60 * zoom),
                    transform: 'translate(-50%, -100%)'
                }}
                >
                    <div className="font-bold text-sky-500 text-xs tracking-wider">{hoveredTile.zone}</div>
                    <div className="font-black text-sm">{hoveredTile.description}</div>
                </div>
            )}
        </div>
    </div>
  );
};