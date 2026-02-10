import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Tile, TileType, ZoneType, Player, Decoration } from '../types';
import { CarAvatar } from './CarAvatar';

interface GameBoardProps {
  tiles: Tile[];
  players: Player[];
  activePlayerId: number;
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
    // Arch the flight path upwards significantly (-600px for height)
    const midY = (start.y + end.y) / 2 - 600; 

    return (
        <g className="pointer-events-none" style={{ zIndex: 9999 }}>
            {/* Plane Shadow on Ground */}
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

            {/* The Plane Group */}
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
                
                {/* Plane Graphic */}
                <g transform="rotate(90) scale(3)">
                    {/* Fuselage */}
                    <path d="M-10 0 L-5 -30 L5 -30 L10 0 L0 10 Z" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                    {/* Wings */}
                    <path d="M-30 -10 L0 -5 L30 -10 L0 5 Z" fill="#cbd5e1" stroke="white" />
                    {/* Tail */}
                    <path d="M-10 -25 L0 -35 L10 -25 Z" fill="#ef4444" />
                    
                    {/* Player Sitting on Top (Visible/Comical) */}
                    <g transform="translate(0, -10) scale(0.5) rotate(-90)">
                        <CarAvatar character={player.character} color={player.color} />
                    </g>
                    
                    {/* Jet Trail Particles (CSS Animation) */}
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
const TileBase = ({ tile, isHovered }: { tile: Tile, isHovered: boolean }) => {
    // Colors based on Zone
    let topColor = "#e2e8f0";
    let sideColor = "#94a3b8";
    
    if (tile.zone === ZoneType.CITY) { topColor = "#fecdd3"; sideColor = "#fda4af"; } // Pinkish
    if (tile.zone === ZoneType.TUNNEL) { topColor = "#c4b5fd"; sideColor = "#a78bfa"; } // Purple
    if (tile.zone === ZoneType.MOUNTAIN) { topColor = "#bae6fd"; sideColor = "#7dd3fc"; } // Ice Blue
    if (tile.zone === ZoneType.BRIDGE) { topColor = "#fde047"; sideColor = "#facc15"; } // Yellow/Wood

    if (tile.type === TileType.STORY) { topColor = "#fff"; sideColor = "#cbd5e1"; } 
    if (tile.type === TileType.SHORTCUT) { topColor = "#d8b4fe"; sideColor = "#c084fc"; } 
    
    // Plane Tile Styles
    if (tile.type === TileType.PLANE) { topColor = "#1e293b"; sideColor = "#0f172a"; } // Dark Tarmac

    const transform = isHovered ? "translate(0, -6)" : "translate(0, 0)";

    // Dimensions
    const RX = 42; 
    const RY = 25; 
    const HEIGHT = 20;

    return (
        <g className="transition-transform duration-300 ease-out" style={{ transform }}>
             {/* Shadow */}
            <ellipse cx="0" cy={HEIGHT} rx={RX + 3} ry={RY + 3} fill="rgba(0,0,0,0.15)" filter="blur(3px)" />
            
            {/* Block Side (Extrusion) */}
            <path d={`M-${RX} 0 L-${RX} ${HEIGHT} Q0 ${RY + HEIGHT + 6} ${RX} ${HEIGHT} L${RX} 0 Q0 ${RY + 6} -${RX} 0 Z`} fill={sideColor} />
            
            {/* Block Top */}
            <ellipse cx="0" cy="0" rx={RX} ry={RY} fill={topColor} stroke="white" strokeWidth="2.5" />
            
            {/* Inner Ring / Decor */}
            <ellipse cx="0" cy="0" rx={RX - 8} ry={RY - 6} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            
            {/* Special Visuals */}
            {tile.type === TileType.PLANE && (
                <g>
                    {/* Runway Markings */}
                    <path d="M-20 -10 L-20 10 M0 -10 L0 10 M20 -10 L20 10" stroke="yellow" strokeWidth="3" strokeDasharray="6 3" />
                    <text textAnchor="middle" y="5" fontSize="24">✈️</text>
                </g>
            )}
            
            {/* Icon/Text */}
            <g transform="translate(0, -3)">
                {tile.type === TileType.BOOST && <text textAnchor="middle" y="7" fontSize="20" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.1))">🚀</text>}
                {tile.type === TileType.PENALTY && <text textAnchor="middle" y="7" fontSize="20" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.1))">🍌</text>}
                {tile.type === TileType.FREEZE && <text textAnchor="middle" y="7" fontSize="20" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.1))">💤</text>}
                {tile.type === TileType.STORY && <text textAnchor="middle" y="7" fontSize="20" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.1))">✨</text>}
                {tile.type === TileType.SHORTCUT && <text textAnchor="middle" y="7" fontSize="20" filter="drop-shadow(0 2px 0 rgba(0,0,0,0.1))">🪜</text>}
                {tile.type === TileType.NORMAL && (
                    <text textAnchor="middle" y="5" fill="rgba(0,0,0,0.2)" fontSize="11" fontWeight="900">{tile.id}</text>
                )}
            </g>
        </g>
    );
};

const DecorationObj: React.FC<{ deco: Decoration }> = ({ deco }) => {
    // Significantly increased scale for visibility and "pop"
    const s = deco.scale * 1.2; 
    const color = deco.color || "#78350f";
    
    if (deco.type === 'TREE') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <ellipse cx="0" cy="10" rx="20" ry="8" fill="rgba(0,0,0,0.2)" />
                <path d="M-6 0 L-6 -12 L6 -12 L6 0 Z" fill="#78350f" /> 
                <circle cx="0" cy="-30" r="22" fill="#4ade80" />
                <circle cx="-12" cy="-22" r="16" fill="#22c55e" />
                <circle cx="12" cy="-22" r="16" fill="#16a34a" />
                {/* Highlights */}
                <circle cx="-8" cy="-36" r="4" fill="white" opacity="0.3" />
            </g>
        );
    }
    if (deco.type === 'HOUSE') {
         const roofColor = deco.color || "#ef4444";
         return (
            <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-22 0 L-22 -28 L22 -28 L22 0 Z" fill="#fca5a5" />
                 {/* 3D Roof */}
                 <path d="M-28 -28 L0 -55 L28 -28 Z" fill={roofColor} stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
                 <path d="M-28 -28 L0 -55 L0 -28 Z" fill="rgba(0,0,0,0.1)" />
                 
                 <rect x="-8" y="-12" width="16" height="12" fill="#78350f" rx="2" />
                 <circle cx="0" cy="-40" r="6" fill="#fff" opacity="0.8"/>
            </g>
         );
    }
    if (deco.type === 'ROCK') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <ellipse cx="0" cy="5" rx="18" ry="6" fill="rgba(0,0,0,0.2)" />
                <path d="M-15 0 L-8 -20 L8 -15 L15 0 Z" fill="#64748b" />
                <path d="M-8 0 L0 -12 L12 0 Z" fill="#94a3b8" />
                <path d="M-4 -8 L4 -14 L8 -6 Z" fill="#cbd5e1" opacity="0.5" />
             </g>
        );
    }
    if (deco.type === 'CLOUD') {
        return (
            <g transform={`translate(${deco.x}, ${deco.y - 80}) scale(${s})`} opacity="0.9">
                 <circle cx="-15" cy="0" r="15" fill="white" />
                 <circle cx="10" cy="-10" r="18" fill="white" />
                 <circle cx="25" cy="0" r="12" fill="white" />
                 <circle cx="5" cy="5" r="16" fill="#f1f5f9" />
            </g>
        );
    }
    if (deco.type === 'MUSHROOM') {
        const capColor = deco.color || "#ef4444";
        return (
            <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                <ellipse cx="0" cy="5" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
                <path d="M-6 0 L-6 -15 L6 -15 L6 0 Z" fill="#fef3c7" />
                <path d="M-20 -15 Q0 -45 20 -15 Z" fill={capColor} />
                <circle cx="-8" cy="-25" r="3" fill="white" opacity="0.8" />
                <circle cx="10" cy="-20" r="2" fill="white" opacity="0.8" />
                <circle cx="0" cy="-32" r="4" fill="white" opacity="0.8" />
            </g>
        );
    }
    if (deco.type === 'FLOWER') {
        const petalColor = deco.color || "#f472b6";
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <path d="M-1 0 L-1 -15 L1 -15 L1 0 Z" fill="#166534" />
                 <circle cx="-6" cy="-18" r="6" fill={petalColor} />
                 <circle cx="6" cy="-18" r="6" fill={petalColor} />
                 <circle cx="0" cy="-24" r="6" fill={petalColor} />
                 <circle cx="0" cy="-12" r="6" fill={petalColor} />
                 <circle cx="0" cy="-18" r="4" fill="#fef08a" />
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
    if (deco.type === 'LAMP') {
        return (
             <g transform={`translate(${deco.x}, ${deco.y}) scale(${s})`}>
                 <rect x="-2" y="-30" width="4" height="30" fill="#1e293b" />
                 <circle cx="0" cy="-30" r="8" fill="#fef3c7" filter="drop-shadow(0 0 8px #fcd34d)" />
                 <circle cx="0" cy="-30" r="4" fill="#fff" />
             </g>
        );
    }
    return null;
};

export const GameBoard: React.FC<GameBoardProps> = ({ tiles, players, activePlayerId, flyingAnimation }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredTile, setHoveredTile] = useState<Tile | null>(null);
  const [zoom, setZoom] = useState(1.0);
  
  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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

        if (flyingAnimation) {
            const start = tiles[flyingAnimation.startTileId];
            const end = tiles[flyingAnimation.endTileId];
            targetX = (start.x + end.x) / 2;
            targetY = (start.y + end.y) / 2;
        } else {
            const activePlayer = players.find(p => p.id === activePlayerId);
            if (activePlayer) {
                const t = tiles[activePlayer.position];
                targetX = t.x;
                targetY = t.y;
            }
        }

        if (targetX !== 0 && targetY !== 0) {
            const containerW = scrollContainerRef.current.clientWidth;
            const containerH = scrollContainerRef.current.clientHeight;
            
            const targetLeft = ((targetX + offsetX) * zoom) - containerW / 2;
            const targetTop = ((targetY + offsetY) * zoom) - containerH / 2;
            
            scrollContainerRef.current.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
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
        className="relative w-full h-[600px] bg-sky-200 border-y-8 border-sky-300 shadow-inner font-sans select-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #bae6fd 0%, #7dd3fc 100%)' }}
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
                                        stroke="rgba(255,255,255,0.5)"
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
                                            <TileBase tile={t} isHovered={hoveredTile?.id === t.id} />
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
                                    // Use a cubic-bezier for a "hop" like movement
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