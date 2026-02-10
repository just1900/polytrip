import React, { useState, useCallback, useRef } from 'react';
import { GameBoard } from './components/GameBoard';
import { generateMap } from './utils/mapGenerator';
import { GamePhase, GameState, TileType, TOTAL_TILES, Player, CharacterType } from './types';
// import { generateStorySegment } from './services/gemini'; // Removed Gemini import
import { audioManager } from './services/audio';
import { CarAvatar } from './components/CarAvatar';
import { getFlavorText } from './utils/flavorText';

const AVATAR_OPTIONS: CharacterType[] = ['Panda', 'Dolphin', 'Fox', 'Cat', 'Bear', 'Rabbit'];
const COLOR_OPTIONS = ['#f87171', '#38bdf8', '#fbbf24', '#a78bfa', '#4ade80', '#f472b6'];

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.DESIGN);
  const [tiles] = useState(generateMap());
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

  const startGame = () => {
    setGameState({
      players: setupPlayers,
      activePlayerIndex: 0,
      isMoving: false,
      turnCount: 1,
      history: [`Welcome to PolyTrip! ${playerCount}-Player Mode.`]
    });
    setPhase(GamePhase.PLAYING);
    if (!isMuted) audioManager.playBGM();
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
      newHistory.push(getFlavorText(TileType.BOOST, currentPlayer.character, currentPlayer.name));
      audioManager.playSFX('boost');
    } else if (tile.type === TileType.PENALTY) {
      effectPos = Math.max(pos - 3, 0);
      newHistory.push(getFlavorText(TileType.PENALTY, currentPlayer.character, currentPlayer.name));
      audioManager.playSFX('penalty');
    } else if (tile.type === TileType.FREEZE) {
      newFrozen = true;
      newHistory.push(getFlavorText(TileType.FREEZE, currentPlayer.character, currentPlayer.name));
      audioManager.playSFX('freeze');
    } else if (tile.type === TileType.SHORTCUT && tile.shortcutTargetId) {
      effectPos = tile.shortcutTargetId;
      newHistory.push(getFlavorText(TileType.SHORTCUT, currentPlayer.character, currentPlayer.name));
      audioManager.playSFX('boost');
    } else if (tile.type === TileType.PLANE && tile.shortcutTargetId) {
       // Special Plane Logic
       newHistory.push(getFlavorText(TileType.PLANE, currentPlayer.character, currentPlayer.name));
       
       // Trigger Animation State
       setFlyingAnimation({
           playerId: currentPlayer.id,
           startTileId: pos,
           endTileId: tile.shortcutTargetId
       });
       
       audioManager.playSFX('plane');

       // Pause execution for animation duration (3s)
       // We return early from the normal update flow, then execute the landing update after timeout
       setTimeout(() => {
           setFlyingAnimation(null);
           finishArrival(tile.shortcutTargetId!, newFrozen, newHistory, currentPlayer.id);
       }, 3000);

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
      <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-8 font-sans selection:bg-pink-200">
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
      <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-4 font-sans">
         <div className="bg-white p-8 rounded-[3rem] shadow-xl border-b-[16px] border-slate-200 max-w-4xl w-full">
            <h2 className="text-4xl font-black text-center mb-8 text-slate-700">Who is playing?</h2>
            
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
    <div className="min-h-screen bg-sky-50 text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-md border-b-4 border-sky-100 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl shadow-lg border-b-4 border-purple-600 flex items-center justify-center transform -rotate-6">
             <svg viewBox="-50 -50 100 100" className="w-full h-full overflow-visible">
                 <CarAvatar character="Panda" color="white" />
             </svg>
          </div>
          <h1 className="font-black text-2xl tracking-tight text-slate-700" style={{ fontFamily: 'Nunito' }}>PolyTrip <span className="text-sm font-bold text-white ml-2 bg-sky-400 px-3 py-1 rounded-full shadow-inner">KIDS MODE</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
           <button onClick={toggleMute} className="text-slate-400 hover:text-sky-500 transition-colors font-bold uppercase tracking-wider text-xs bg-slate-100 px-3 py-1 rounded-full">
              {isMuted ? '🔇 Muted' : '🔊 Sound On'}
           </button>
           <div className="bg-white px-6 py-2 rounded-full border-b-4 border-slate-200 font-black text-sm text-slate-600">
             Turn {gameState.turnCount} • <span className="text-sky-500">{tiles[activePlayer.position].zone}</span>
           </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <GameBoard 
            tiles={tiles} 
            players={gameState.players} 
            activePlayerId={activePlayer.id} 
            flyingAnimation={flyingAnimation}
        />
        
        {/* Story Overlay - 3D Card Style */}
        {storyText && (
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-40 pointer-events-none">
             <div className="bg-white/95 backdrop-blur border-b-[12px] border-r-8 border-sky-200 p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] text-center animate-in fade-in slide-in-from-top-6 transform rotate-1">
                <p className="text-2xl text-slate-700 font-black leading-snug tracking-tight" style={{ fontFamily: 'Nunito' }}>{storyText}</p>
                <div className="absolute -top-6 -right-6 text-6xl rotate-12 filter drop-shadow-md">✨</div>
             </div>
          </div>
        )}

        {/* Controls Section */}
        <div className="flex-1 bg-sky-50 p-6 flex flex-col md:flex-row gap-8 border-t-8 border-sky-100">
          
          {/* Active Player Status */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-white rounded-[2.5rem] p-8 border-b-[12px] border-slate-200 relative overflow-hidden shadow-sm">
             
            {phase === GamePhase.GAME_OVER ? (
               <div className="text-center z-10 animate-bounce">
                  <h2 className="text-7xl font-black text-yellow-400 mb-6 drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] text-stroke">YOU WIN!</h2>
                  <button onClick={() => window.location.reload()} className="px-12 py-5 bg-sky-500 text-white font-black text-xl rounded-3xl shadow-xl border-b-8 border-sky-700 active:border-b-0 active:translate-y-2 transition-all">Play Again</button>
               </div>
            ) : (
              <>
                 {/* Turn Indicator */}
                 <div className="absolute top-6 left-6 flex gap-3 z-10">
                    {gameState.players.map(p => (
                      <div key={p.id} className={`px-4 py-2 rounded-2xl text-xs font-black transition-all border-b-4 ${activePlayer.id === p.id ? 'bg-sky-500 border-sky-700 text-white scale-110 -rotate-2 shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                        {p.name}
                      </div>
                    ))}
                 </div>

                 {/* DICE BUTTON - 3D Cube Style */}
                 <button
                    onClick={handleRollDice}
                    disabled={gameState.isMoving || processingRef.current || !!flyingAnimation}
                    className={`relative w-48 h-48 rounded-[2.5rem] flex flex-col items-center justify-center transition-all transform active:scale-95 group border-b-[16px] border-r-[8px] ${
                       (gameState.isMoving || processingRef.current || !!flyingAnimation)
                       ? 'bg-slate-100 border-slate-300 text-slate-300 cursor-not-allowed translate-y-[16px] border-b-0 shadow-inner' 
                       : 'bg-white border-slate-200 hover:bg-sky-50 hover:border-sky-200 hover:-translate-y-1 shadow-xl active:translate-y-[16px] active:border-b-0 active:shadow-none'
                    }`}
                  >
                    {/* Decorative Dice Dots (Inset) */}
                    <div className="absolute top-5 left-5 w-5 h-5 bg-slate-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute top-5 right-5 w-5 h-5 bg-slate-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute bottom-5 left-5 w-5 h-5 bg-slate-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute bottom-5 right-5 w-5 h-5 bg-slate-100 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>

                    <span className="text-6xl font-black text-slate-800 z-10 drop-shadow-sm group-hover:scale-110 transition-transform">{gameState.isMoving ? '...' : (flyingAnimation ? '✈️' : 'ROLL')}</span>
                    <span className="text-xs text-slate-400 mt-3 font-black uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{background: activePlayer.color}}></div>
                      {activePlayer.name}
                    </span>
                 </button>

                 {lastDiceRoll && !gameState.isMoving && !processingRef.current && !flyingAnimation && (
                     <div className="absolute top-1/2 right-12 -translate-y-1/2 w-28 h-28 bg-yellow-400 text-white rounded-[2rem] flex items-center justify-center font-black text-7xl shadow-[0_10px_20px_rgba(250,204,21,0.4)] border-b-[12px] border-yellow-600 rotate-12 animate-in zoom-in spin-in-12 z-20">
                       {lastDiceRoll}
                     </div>
                  )}
              </>
            )}
          </div>

          {/* Log */}
          <div className="w-full md:w-[400px] bg-white rounded-[2.5rem] border-b-[12px] border-slate-200 flex flex-col overflow-hidden shadow-sm h-[320px]">
             <div className="bg-slate-50 p-5 border-b-2 border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Adventure Log</h3>
             </div>
             <div className="flex-1 overflow-y-auto space-y-3 p-5 no-scrollbar font-sans text-sm font-bold">
               {gameState.history.slice().reverse().map((entry, idx) => (
                 <div key={idx} className="p-4 bg-slate-50 rounded-2xl text-slate-600 border-l-4 border-sky-200">
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