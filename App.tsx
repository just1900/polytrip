import React, { useState, useCallback, useRef } from 'react';
import { GameBoard } from './components/GameBoard';
import { generateMap } from './utils/mapGenerator';
import { GamePhase, GameState, TileType, TOTAL_TILES, Player, CharacterType, ThemeType } from './types';
// import { generateStorySegment } from './services/gemini'; // Removed Gemini import
import { audioManager } from './services/audio';
import { CarAvatar } from './components/CarAvatar';
import { getFlavorText } from './utils/flavorText';

const AVATAR_OPTIONS: CharacterType[] = ['Panda', 'Dolphin', 'Fox', 'Cat', 'Bear', 'Rabbit', 'Snow Fox', 'Polar Bear'];
const COLOR_OPTIONS = ['#f87171', '#38bdf8', '#fbbf24', '#a78bfa', '#4ade80', '#f472b6'];

const THEMES: { id: ThemeType; name: string; desc: string; color: string }[] = [
    { id: 'INTERSTELLAR', name: 'Interstellar Drift', desc: 'Space Station to Alien Bridge', color: '#312e81' },
    { id: 'CYBERPUNK', name: 'Cyber Neon City', desc: 'Slums to Cloud Highway', color: '#c026d3' },
    { id: 'CANDY', name: 'Candy Kingdom', desc: 'Cookie Plains to Rainbow Road', color: '#f472b6' },
    { id: 'OCEAN', name: 'Abyssal Relics', desc: 'Coral Reef to Atlantis', color: '#0ea5e9' },
    { id: 'ARCTIC', name: 'Glacial Arctic', desc: 'Frozen Tundra to Aurora', color: '#0ea5e9' },
    { id: 'JUNGLE', name: 'Jungle Safari', desc: 'Ancient Ruins to Waterfall', color: '#16a34a' },
    { id: 'SOCCER', name: 'Soccer Stadium', desc: 'Kickoff to Championship', color: '#84cc16' },
    { id: 'MAGMA', name: 'Magma Dungeon', desc: 'Lava Lake to Dragon Lair', color: '#ef4444' },
    { id: 'ANCIENT', name: 'Ancient Empire', desc: 'Silk Road to Forbidden Palace', color: '#dc2626' },
    { id: 'DESERT', name: 'Desert Rally', desc: 'Dunes to Canyon', color: '#d97706' },
    { id: 'HEAVEN', name: 'Cloud Heaven', desc: 'Sky Gates to Valhalla', color: '#60a5fa' },
    { id: 'PARK', name: 'Relaxing Park', desc: 'Gardens to Picnic Area', color: '#4ade80' },
    { id: 'GARDEN', name: 'Vegetable Garden', desc: 'Giant Broccoli to Pumpkin Patch', color: '#65a30d' },
    { id: 'KINDERGARTEN', name: 'Happy Kindergarten', desc: 'Toy Castle to Nap Room', color: '#fbbf24' },
];

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.DESIGN);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('INTERSTELLAR');
  const [tiles, setTiles] = useState(generateMap('INTERSTELLAR'));
  const [isMuted, setIsMuted] = useState(false);

  // Guard for Dice Roll Race Condition
  const processingRef = useRef(false);

  // Setup State
  const [playerCount, setPlayerCount] = useState(2);
  const [setupPlayers, setSetupPlayers] = useState<Player[]>([
    { id: 1, name: "Panda", character: 'Panda', color: "#f87171", position: 0, frozen: false, finished: false },
    { id: 2, name: "Dolphin", character: 'Dolphin', color: "#38bdf8", position: 0, frozen: false, finished: false }
  ]);

  const [gameState, setGameState] = useState<GameState>({
    players: [],
    activePlayerIndex: 0,
    isMoving: false,
    turnCount: 1,
    history: []
  });

  const [lastDiceRoll, setLastDiceRoll] = useState<number | null>(null);
  const [storyText, setStoryText] = useState<string | null>(null);
  
  // Animation state for the Plane event
  const [flyingAnimation, setFlyingAnimation] = useState<{
    playerId: number;
    startTileId: number;
    endTileId: number;
  } | null>(null);

  const activePlayer = gameState.players[gameState.activePlayerIndex];

  // -- Setup Helpers --

  const updateSetupPlayer = (index: number, field: keyof Player, value: any) => {
    const newPlayers = [...setupPlayers];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setSetupPlayers(newPlayers);
  };

  const cycleCharacter = (index: number, direction: 1 | -1) => {
      const currentPlayer = setupPlayers[index];
      const currentIdx = AVATAR_OPTIONS.indexOf(currentPlayer.character);
      let nextIdx = (currentIdx + direction) % AVATAR_OPTIONS.length;
      if (nextIdx < 0) nextIdx = AVATAR_OPTIONS.length - 1;
      updateSetupPlayer(index, 'character', AVATAR_OPTIONS[nextIdx]);
  };

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newPlayers = [...setupPlayers];
    if (count > newPlayers.length) {
      for (let i = newPlayers.length; i < count; i++) {
        newPlayers.push({
          id: i + 1,
          name: `Player ${i + 1}`,
          character: AVATAR_OPTIONS[i % AVATAR_OPTIONS.length],
          color: COLOR_OPTIONS[i % COLOR_OPTIONS.length],
          position: 0,
          frozen: false,
          finished: false
        });
      }
    } else {
      newPlayers.splice(count);
    }
    setSetupPlayers(newPlayers);
  };
  
  const handleThemeChange = (theme: ThemeType) => {
      setSelectedTheme(theme);
      setTiles(generateMap(theme));
  };

  const startGame = () => {
    setGameState({
      players: setupPlayers,
      activePlayerIndex: 0,
      isMoving: false,
      turnCount: 1,
      history: [`Welcome to ${THEMES.find(t => t.id === selectedTheme)?.name}!`]
    });
    setPhase(GamePhase.PLAYING);
    if (!isMuted) audioManager.startThemeBGM(selectedTheme);
  };

  const handlePlayAgain = () => {
    setTiles(generateMap(selectedTheme));
    setLastDiceRoll(null);
    setStoryText(null);
    setFlyingAnimation(null);
    setPhase(GamePhase.SETUP);
  };

  const handleRestartGame = () => {
      // Clean reset logic
      setLastDiceRoll(null);
      setStoryText(null);
      setFlyingAnimation(null);
      audioManager.stopBGM();
      
      // We set phase directly. The component will re-render showing the Start Page.
      setPhase(GamePhase.DESIGN);
  };

  // -- Game Mechanics --

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    audioManager.toggleMute(newVal);
    if (!newVal && phase === GamePhase.PLAYING) audioManager.playBGM();
  };

  const nextTurn = useCallback(() => {
    setGameState(prev => {
       const nextIndex = (prev.activePlayerIndex + 1) % prev.players.length;
       return {
         ...prev,
         activePlayerIndex: nextIndex,
         turnCount: nextIndex === 0 ? prev.turnCount + 1 : prev.turnCount
       };
    });
    processingRef.current = false;
  }, []);

  const handleRollDice = useCallback(async () => {
    // strict guard
    if (gameState.isMoving || phase !== GamePhase.PLAYING || processingRef.current || flyingAnimation) return;
    processingRef.current = true;
    
    // Check frozen status
    if (activePlayer.frozen) {
       setGameState(prev => ({
         ...prev,
         players: prev.players.map(p => p.id === activePlayer.id ? { ...p, frozen: false } : p),
         history: [...prev.history, `❄️ ${activePlayer.name} is asleep. Turn skipped.`]
       }));
       setTimeout(nextTurn, 1500);
       return;
    }

    // Default Roll
    let roll = Math.floor(Math.random() * 6) + 1;
    
    // Hack: 'yoyo' cheat to increase chance of higher numbers
    if (activePlayer.name.toLowerCase() === 'yoyo') {
        // Roll a second die and take the maximum, skewing the probability distribution towards 6
        const cheatRoll = Math.floor(Math.random() * 6) + 1;
        roll = Math.max(roll, cheatRoll);
    }

    setLastDiceRoll(roll);
    audioManager.playSFX('roll');
    
    setGameState(prev => ({ ...prev, isMoving: true }));

    // Animate movement
    let currentStep = 0;
    const startPos = activePlayer.position;
    
    // 400ms interval to match CSS transition
    const moveInterval = setInterval(async () => {
       currentStep++;
       const nextPos = Math.min(startPos + currentStep, TOTAL_TILES - 1);
       audioManager.playSFX('step');
       
       setGameState(prev => ({
         ...prev,
         players: prev.players.map(p => p.id === activePlayer.id ? { ...p, position: nextPos } : p)
       }));

       if (currentStep >= roll || nextPos === TOTAL_TILES - 1) {
         clearInterval(moveInterval);
         await handleArrival(nextPos);
       }
    }, 400);

  }, [gameState.isMoving, activePlayer, phase, nextTurn, flyingAnimation]);

  const handleArrival = async (pos: number) => {
    const tile = tiles[pos];
    const currentPlayer = gameState.players[gameState.activePlayerIndex];
    
    let newHistory = [`${currentPlayer.name} rolled ${lastDiceRoll}. Landed on ${pos + 1}.`]; // +1 for display
    let newFrozen = false;
    let effectPos = pos;
    let delayBeforeNext = 1000;

    // Logic
    if (tile.type === TileType.BOOST) {
      effectPos = Math.min(pos + 3, TOTAL_TILES - 1);
      newHistory.push(getFlavorText(TileType.BOOST, currentPlayer.character, currentPlayer.name, selectedTheme));
      audioManager.playSFX('boost');
    } else if (tile.type === TileType.PENALTY) {
      effectPos = Math.max(pos - 3, 0);
      newHistory.push(getFlavorText(TileType.PENALTY, currentPlayer.character, currentPlayer.name, selectedTheme));
      audioManager.playSFX('penalty');
    } else if (tile.type === TileType.FREEZE) {
      newFrozen = true;
      newHistory.push(getFlavorText(TileType.FREEZE, currentPlayer.character, currentPlayer.name, selectedTheme));
      audioManager.playSFX('freeze');
    } else if (tile.type === TileType.SHORTCUT && tile.shortcutTargetId) {
      effectPos = tile.shortcutTargetId;
      newHistory.push(getFlavorText(TileType.SHORTCUT, currentPlayer.character, currentPlayer.name, selectedTheme));
      audioManager.playSFX('boost');
    } else if (tile.type === TileType.PLANE && tile.shortcutTargetId) {
       // Special Plane Logic
      //  newHistory.push(getFlavorText(TileType.PLANE, currentPlayer.character, currentPlayer.name, selectedTheme));
       
      //  // Trigger Animation State
      //  setFlyingAnimation({
      //      playerId: currentPlayer.id,
      //      startTileId: pos,
      //      endTileId: tile.shortcutTargetId
      //  });
       
      //  // REMOVED audioManager.playSFX('plane'); here as requested

      //  // Pause execution for animation duration (3s)
      //  // We return early from the normal update flow, then execute the landing update after timeout
      //  setTimeout(() => {
      //      setFlyingAnimation(null);
      //      finishArrival(tile.shortcutTargetId!, newFrozen, newHistory, currentPlayer.id);
      //  }, 3000);

       // Don't execute the standard update yet
       return;
    }

    // Apply secondary movement for standard tiles immediately
    if (effectPos !== pos) {
       setGameState(prev => ({
         ...prev,
         players: prev.players.map(p => p.id === currentPlayer.id ? { ...p, position: effectPos } : p)
       }));
    }

    finishArrival(effectPos, newFrozen, newHistory, currentPlayer.id);
  };

  // Factored out final state update to support delayed events like the Plane
  const finishArrival = (finalPos: number, isFrozen: boolean, historyLogs: string[], playerId: number) => {
    const tile = tiles[finalPos];
    
    // Story text logic
    if (tile.type === TileType.STORY || finalPos === 0 || finalPos === TOTAL_TILES - 1) {
      let story = "";
      if (finalPos === 0) story = "The adventure begins!";
      else if (finalPos === TOTAL_TILES - 1) story = "The Grand Finale!";
      else story = `Entering the magical ${tile.zone}...`;
      
      setStoryText(story);
      historyLogs.push(`✨ ${story}`);
    } else {
      setStoryText(null);
    }

    // Update state finalization
    setGameState(prev => ({
      ...prev,
      isMoving: false,
      players: prev.players.map(p => p.id === playerId ? { ...p, position: finalPos, frozen: isFrozen } : p),
      history: [...prev.history, ...historyLogs]
    }));

    // Check Win or Next Turn
    if (finalPos === TOTAL_TILES - 1) {
      setPhase(GamePhase.GAME_OVER);
      audioManager.playSFX('win');
      audioManager.stopBGM();
      historyLogs.push(`🏆 ${gameState.players.find(p => p.id === playerId)?.name} WINS!`);
      setGameState(prev => ({ ...prev, history: [...prev.history, ...historyLogs] }));
      processingRef.current = false;
    } else {
      setTimeout(nextTurn, 1000); 
    }
  };

  // -- Render --

  if (phase === GamePhase.DESIGN) {
    return (
      <div className="h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-8 font-sans selection:bg-pink-200">
        <div className="max-w-4xl w-full space-y-12 text-center">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 tracking-tighter drop-shadow-sm filter" style={{ fontFamily: 'Nunito' }}>
              PolyTrip
            </h1>
            <p className="text-2xl text-slate-500 font-bold">
              The Cute 3D Adventure Game
            </p>

            <div className="flex justify-center pt-8">
               <button
                onClick={() => setPhase(GamePhase.SETUP)}
                className="px-12 py-6 bg-gradient-to-b from-sky-400 to-sky-500 text-white border-b-8 border-sky-700 hover:from-sky-300 hover:to-sky-400 rounded-3xl font-black text-2xl shadow-xl shadow-sky-200 transition-all active:scale-95 active:border-b-0 active:translate-y-2"
               >
                 START GAME
               </button>
            </div>
        </div>
      </div>
    );
  }

  if (phase === GamePhase.SETUP) {
    return (
      <div className="h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-4 font-sans">
         <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[16px] border-slate-200 max-w-4xl w-full">
            <h2 className="text-4xl font-black text-center mb-6 text-slate-700">Setup Your Game</h2>
            
            {/* THEME SELECTOR */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Choose World</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64 overflow-y-auto no-scrollbar pr-2">
                    {THEMES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            className={`p-4 rounded-2xl border-4 text-left transition-all ${selectedTheme === t.id ? 'bg-slate-50 border-sky-500 shadow-md scale-105' : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200 opacity-60 hover:opacity-100'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-sm min-w-[3rem]" style={{backgroundColor: t.color}}>
                                    {t.id === 'INTERSTELLAR' && '🚀'}
                                    {t.id === 'CYBERPUNK' && '🌆'}
                                    {t.id === 'CANDY' && '🍭'}
                                    {t.id === 'OCEAN' && '🌊'}
                                    {t.id === 'ARCTIC' && '❄️'}
                                    {t.id === 'JUNGLE' && '🌿'}
                                    {t.id === 'SOCCER' && '⚽'}
                                    {t.id === 'MAGMA' && '🌋'}
                                    {t.id === 'ANCIENT' && '🏮'}
                                    {t.id === 'DESERT' && '🏜️'}
                                    {t.id === 'HEAVEN' && '☁️'}
                                    {t.id === 'PARK' && '🌳'}
                                    {t.id === 'GARDEN' && '🥕'}
                                    {t.id === 'KINDERGARTEN' && '🎒'}
                                </div>
                                <div>
                                    <div className="font-black text-lg text-slate-700">{t.name}</div>
                                    <div className="text-xs font-bold text-slate-400">{t.desc}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <hr className="border-slate-100 my-6" />

            {/* Player Count Selector */}
            <div className="flex justify-center gap-4 mb-8">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => handlePlayerCountChange(num)}
                  className={`w-16 h-16 rounded-2xl font-black text-2xl border-b-4 transition-all ${
                    playerCount === num 
                    ? 'bg-sky-500 text-white border-sky-700 scale-110 shadow-lg' 
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Player Config Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {setupPlayers.map((player, idx) => (
                <div key={player.id} className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex items-center gap-6">
                   
                   {/* Visual Character Selector */}
                   <div className="flex flex-col items-center gap-2">
                       <div className="w-28 h-28 bg-white rounded-full shadow-inner flex items-center justify-center border-4" style={{ borderColor: player.color }}>
                          <div className="w-full h-full p-2">
                             {/* CarAvatar is an SVG group, needs an SVG wrapper */}
                             <svg viewBox="-50 -50 100 100" className="w-full h-full overflow-visible">
                                <CarAvatar character={player.character} color={player.color} />
                             </svg>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <button onClick={() => cycleCharacter(idx, -1)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold">&lt;</button>
                           <span className="font-black text-sm text-slate-500 w-16 text-center">{player.character}</span>
                           <button onClick={() => cycleCharacter(idx, 1)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold">&gt;</button>
                       </div>
                   </div>

                   <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                        <input 
                          type="text" 
                          value={player.name} 
                          onChange={(e) => updateSetupPlayer(idx, 'name', e.target.value)}
                          className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 focus:border-sky-400 outline-none"
                        />
                      </div>
                      <div>
                         <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Kart Color</label>
                         <div className="flex gap-1 items-center flex-wrap">
                           {COLOR_OPTIONS.map(c => (
                             <button 
                               key={c} 
                               onClick={() => updateSetupPlayer(idx, 'color', c)}
                               className={`w-8 h-8 rounded-full border-4 transition-transform ${player.color === c ? 'border-slate-500 scale-110' : 'border-transparent hover:scale-105'}`}
                               style={{ backgroundColor: c }}
                             />
                           ))}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
               <button
                  onClick={startGame}
                  className="px-12 py-5 bg-green-500 text-white font-black text-2xl rounded-3xl shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all hover:bg-green-400"
               >
                 LET'S RACE! 🏁
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-sky-50 text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b-4 border-sky-100 flex justify-between items-center sticky top-0 z-50 flex-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl shadow-lg border-b-4 border-purple-600 flex items-center justify-center transform -rotate-6">
             <svg viewBox="-50 -50 100 100" className="w-full h-full overflow-visible">
                 <CarAvatar character="Panda" color="white" />
             </svg>
          </div>
          <h1 className="font-black text-2xl tracking-tight text-slate-700" style={{ fontFamily: 'Nunito' }}>PolyTrip <span className="text-sm font-bold text-white ml-2 bg-sky-400 px-3 py-1 rounded-full shadow-inner">KIDS MODE</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           {phase === GamePhase.PLAYING && (
               <button onClick={handleRestartGame} className="text-red-400 hover:text-red-500 font-bold text-xs uppercase tracking-wide bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors">
                   Restart
               </button>
           )}
           <button onClick={toggleMute} className="text-slate-400 hover:text-sky-500 transition-colors font-bold uppercase tracking-wider text-xs bg-slate-100 px-3 py-1 rounded-full">
              {isMuted ? '🔇 Muted' : '🔊 Sound On'}
           </button>
           {/* Only show turn info if we have an active player (Game Started) */}
           {activePlayer && tiles.length > 0 && (
            <div className="hidden md:block bg-white px-6 py-2 rounded-full border-b-4 border-slate-200 font-black text-sm text-slate-600">
                Turn {gameState.turnCount} • <span className="text-sky-500">{tiles[activePlayer.position]?.zone}</span>
            </div>
           )}
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-sky-900/5 relative">
        <div className="flex-1 relative order-1 md:order-1 min-w-0 min-h-0">
            <GameBoard 
                tiles={tiles} 
                players={gameState.players} 
                activePlayerId={activePlayer?.id || 0} 
                theme={selectedTheme}
                flyingAnimation={flyingAnimation}
            />
            
            {/* Story Overlay - 3D Card Style, now positioned relative to game area */}
            {storyText && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-4 z-40 pointer-events-none">
                <div className="bg-white/95 backdrop-blur border-b-[12px] border-r-8 border-sky-200 p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] text-center animate-in fade-in slide-in-from-top-6 transform rotate-1">
                    <p className="text-2xl text-slate-700 font-black leading-snug tracking-tight" style={{ fontFamily: 'Nunito' }}>{storyText}</p>
                    <div className="absolute -top-6 -right-6 text-6xl rotate-12 filter drop-shadow-md">✨</div>
                </div>
            </div>
            )}
        </div>

        {/* Sidebar Controls Section */}
        <div className="order-2 md:order-2 flex-shrink-0 z-30
                        w-full h-[280px] md:h-full md:w-[380px] 
                        bg-white p-4 md:p-6 flex flex-row md:flex-col gap-4 md:gap-6 
                        border-t-4 md:border-t-0 md:border-l-4 border-slate-100 shadow-2xl overflow-hidden md:overflow-y-auto">
          
          {/* Active Player Status */}
          <div className="flex-1 md:flex-none flex flex-col items-center justify-center gap-4 bg-slate-50 rounded-[2rem] p-4 border-2 border-slate-100 relative overflow-hidden shadow-sm">
             
            {phase === GamePhase.GAME_OVER ? (
               <div className="text-center z-10 scale-75 md:scale-100">
                  <h2 className="text-4xl md:text-5xl font-black text-yellow-400 mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] text-stroke animate-bounce">YOU WIN!</h2>
                  <button onClick={handlePlayAgain} className="px-6 py-3 bg-sky-500 text-white font-black text-lg rounded-2xl shadow-xl border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 transition-all">Play Again</button>
               </div>
            ) : (
              <>
                 {/* Turn Indicator - Player List */}
                 <div className="flex flex-wrap gap-2 justify-center z-10 w-full">
                    {gameState.players.map(p => (
                      <div key={p.id} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all border-b-2 ${activePlayer?.id === p.id ? 'bg-sky-500 border-sky-700 text-white scale-105 shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                        {p.name}
                      </div>
                    ))}
                 </div>

                 {/* DICE BUTTON - 3D Cube Style */}
                 <button
                    onClick={handleRollDice}
                    disabled={gameState.isMoving || processingRef.current || !!flyingAnimation || !activePlayer}
                    className={`relative w-28 h-28 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center transition-all transform active:scale-95 group border-b-[8px] md:border-b-[12px] border-r-[4px] md:border-r-[6px] ${
                       (gameState.isMoving || processingRef.current || !!flyingAnimation || !activePlayer)
                       ? 'bg-slate-100 border-slate-300 text-slate-300 cursor-not-allowed translate-y-[8px] md:translate-y-[12px] border-b-0 shadow-inner' 
                       : 'bg-white border-slate-200 hover:bg-sky-50 hover:border-sky-200 hover:-translate-y-1 shadow-xl active:translate-y-[8px] md:active:translate-y-[12px] active:border-b-0 active:shadow-none'
                    }`}
                  >
                    {/* Decorative Dice Dots (Inset) */}
                    <div className="absolute top-3 left-3 w-3 h-3 bg-slate-100 rounded-full shadow-inner"></div>
                    <div className="absolute top-3 right-3 w-3 h-3 bg-slate-100 rounded-full shadow-inner"></div>
                    <div className="absolute bottom-3 left-3 w-3 h-3 bg-slate-100 rounded-full shadow-inner"></div>
                    <div className="absolute bottom-3 right-3 w-3 h-3 bg-slate-100 rounded-full shadow-inner"></div>

                    <span className="text-4xl md:text-5xl font-black text-slate-800 z-10 drop-shadow-sm group-hover:scale-110 transition-transform">{gameState.isMoving ? '...' : (flyingAnimation ? '✈️' : 'ROLL')}</span>
                    {activePlayer && (
                        <span className="text-[9px] md:text-[10px] text-slate-400 mt-1 md:mt-2 font-black uppercase tracking-widest bg-slate-100 px-2 md:px-3 py-0.5 md:py-1 rounded-full flex items-center gap-1 md:gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{background: activePlayer.color}}></div>
                        {activePlayer.name}
                        </span>
                    )}
                 </button>

                 {lastDiceRoll && !gameState.isMoving && !processingRef.current && !flyingAnimation && (
                     <div className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-yellow-400 text-white rounded-xl md:rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl shadow-[0_5px_15px_rgba(250,204,21,0.4)] border-b-4 md:border-b-8 border-yellow-600 rotate-12 animate-in zoom-in spin-in-12 z-20">
                       {lastDiceRoll}
                     </div>
                  )}
              </>
            )}
          </div>

          {/* Log */}
          <div className="flex-1 bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border-2 border-slate-100 flex flex-col overflow-hidden shadow-sm">
             <div className="bg-slate-100/50 p-2 md:p-4 border-b border-slate-200">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Adventure Log</h3>
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 p-2 md:p-4 no-scrollbar font-sans text-xs font-bold">
               {gameState.history.slice().reverse().map((entry, idx) => (
                 <div key={idx} className="p-2 md:p-3 bg-white rounded-xl text-slate-600 border-l-4 border-sky-200 shadow-sm">
                   {entry}
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}