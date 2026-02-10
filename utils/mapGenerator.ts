import { Tile, TileType, ZoneType, TOTAL_TILES, Decoration } from '../types';

const ISO_WIDTH = 120;  
const ISO_HEIGHT = 60; 

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMap = (): Tile[] => {
  const tiles: Tile[] = [];
  const occupied = new Set<string>();

  let gridX = 0;
  let gridY = 0;
  let previousMove = { dx: 0, dy: 0 };
  
  // Constrain horizontal spread
  const MAX_DRIFT = 12; 

  // --- PASS 1: Generate Path ---
  for (let i = 0; i < TOTAL_TILES; i++) {
    // 1. Determine Zone
    let zone = ZoneType.CITY;
    if (i > 30 && i <= 60) zone = ZoneType.TUNNEL;
    else if (i > 60 && i <= 90) zone = ZoneType.MOUNTAIN;
    else if (i > 90) zone = ZoneType.BRIDGE;

    // 2. Calculate Screen Coords
    const screenX = (gridX - gridY) * ISO_WIDTH;
    const screenY = (gridX + gridY) * ISO_HEIGHT;

    occupied.add(`${gridX},${gridY}`);

    // 3. Tile Type
    let type = TileType.NORMAL;
    let description = "";

    if (i === 0) {
      type = TileType.STORY;
      description = "Start";
    } else if (i === TOTAL_TILES - 1) {
      type = TileType.STORY;
      description = "Finish";
    } else if ([31, 61, 91].includes(i)) {
      type = TileType.STORY;
      description = `Enter ${zone}`;
    } else {
        const prevTile = tiles[i - 1];
        const isPrevSpecial = prevTile && prevTile.type !== TileType.NORMAL && prevTile.type !== TileType.STORY;

        if (isPrevSpecial) {
           type = TileType.NORMAL;
        } else {
           const rand = Math.random();
           if (rand < 0.07) { type = TileType.BOOST; description = "Boost!"; }
           else if (rand < 0.14) { type = TileType.PENALTY; description = "Oops!"; }
           else if (rand < 0.19) { type = TileType.FREEZE; description = "Sleep"; }
        }
    }
    if (!description) description = `${zone} Path`;

    tiles.push({
      id: i,
      type,
      x: screenX,
      y: screenY,
      gridX,
      gridY,
      zone,
      description,
      decorations: [] // Initialize empty
    });

    // 5. Move Logic
    const currentDrift = gridX - gridY;
    let candidates: { gx: number, gy: number, weight: number }[] = [];

    // Forward Moves
    if (currentDrift < MAX_DRIFT) candidates.push({ gx: gridX + 1, gy: gridY, weight: 1.0 });
    if (currentDrift > -MAX_DRIFT) candidates.push({ gx: gridX, gy: gridY + 1, weight: 1.0 });

    // Side Moves
    const isPreviousMoveSidestep = (previousMove.dx === 1 && previousMove.dy === -1) || (previousMove.dx === -1 && previousMove.dy === 1);
    if (!isPreviousMoveSidestep) {
        if (currentDrift < MAX_DRIFT - 1) candidates.push({ gx: gridX + 1, gy: gridY - 1, weight: 2.0 });
        if (currentDrift > -MAX_DRIFT + 1) candidates.push({ gx: gridX - 1, gy: gridY + 1, weight: 2.0 });
    }

    // Filter occupied
    candidates = candidates.filter(c => !occupied.has(`${c.gx},${c.gy}`));

    if (candidates.length > 0) {
        const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
        let r = Math.random() * totalWeight;
        let selected = candidates[0];
        for (const c of candidates) {
            r -= c.weight;
            if (r <= 0) {
                selected = c;
                break;
            }
        }
        previousMove = { dx: selected.gx - gridX, dy: selected.gy - gridY };
        gridX = selected.gx;
        gridY = selected.gy;
    } else {
        // Fallback
        gridX += 1; 
        gridY += 1;
        previousMove = { dx: 1, dy: 1 };
    }
  }

  // --- PASS 2: Decorations ---
  const decoOccupied = new Set<string>();
  
  tiles.forEach(tile => {
      // Increased probability for more lush environments
      if (Math.random() < 0.75) {
        const decoOffsets = [{dx:0, dy:-1}, {dx:0, dy:1}, {dx:-1, dy:0}, {dx:1, dy:0}];
        if (Math.random() > 0.6) return; // Skip some to avoid total crowding
        
        const offset = decoOffsets[Math.floor(Math.random() * decoOffsets.length)];
        const dGX = tile.gridX + offset.dx;
        const dGY = tile.gridY + offset.dy;
        const key = `${dGX},${dGY}`;

        if (!occupied.has(key) && !decoOccupied.has(key)) {
             const dScreenX = (dGX - dGY) * ISO_WIDTH;
             const dScreenY = (dGX + dGY) * ISO_HEIGHT;
             
             let decoType: Decoration['type'] = 'TREE';
             let decoColor: string | undefined = undefined;

             // Diverse logic based on Zone
             if (tile.zone === ZoneType.CITY) {
                 const r = Math.random();
                 if (r < 0.4) { 
                    decoType = 'HOUSE'; 
                    decoColor = getRandom(['#fca5a5', '#fdba74', '#86efac', '#93c5fd', '#c4b5fd']); 
                 }
                 else if (r < 0.6) decoType = 'LAMP';
                 else if (r < 0.8) decoType = 'TREE';
                 else decoType = 'FLOWER';
             }
             else if (tile.zone === ZoneType.TUNNEL) {
                 const r = Math.random();
                 if (r < 0.5) { 
                    decoType = 'MUSHROOM'; 
                    decoColor = getRandom(['#ef4444', '#a855f7', '#3b82f6', '#ec4899']); 
                 }
                 else if (r < 0.7) decoType = 'STAR';
                 else decoType = 'ROCK';
             }
             else if (tile.zone === ZoneType.MOUNTAIN) {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'ROCK';
                 else if (r < 0.6) {
                    decoType = 'FLOWER';
                    decoColor = getRandom(['#f472b6', '#c084fc', '#fbbf24', '#2dd4bf']);
                 }
                 else decoType = 'TREE';
             }
             else if (tile.zone === ZoneType.BRIDGE) {
                 const r = Math.random();
                 if (r < 0.5) decoType = 'CLOUD';
                 else if (r < 0.8) decoType = 'STAR';
                 else decoType = 'LAMP';
             }

             tile.decorations = tile.decorations || [];
             tile.decorations.push({
                 id: `deco-${tile.id}`,
                 type: decoType,
                 x: dScreenX,
                 y: dScreenY,
                 gridX: dGX,
                 gridY: dGY,
                 // Increased base scale for visibility
                 scale: 1.0 + Math.random() * 0.4,
                 color: decoColor
             });
             decoOccupied.add(key);
        }
      }
  });

  // --- PASS 3: Shortcuts ---
  let shortcutsAdded = 0;
  let attempts = 0;
  while(shortcutsAdded < 3 && attempts < 100) {
      attempts++;
      const idx = Math.floor(Math.random() * (tiles.length - 20)) + 5;
      
      if(tiles[idx].type === TileType.NORMAL) {
           const jump = Math.floor(Math.random() * 7) + 4; 
           const target = idx + jump;
           
           if(target < tiles.length - 2 && tiles[target].type === TileType.NORMAL) {
               tiles[idx].type = TileType.SHORTCUT;
               tiles[idx].shortcutTargetId = target;
               tiles[idx].description = "Ladder!";
               shortcutsAdded++;
           }
      }
  }

  // --- PASS 4: Add ONE Plane Tile ---
  let planeAdded = false;
  attempts = 0;
  while (!planeAdded && attempts < 100) {
      attempts++;
      // Place it somewhat in the middle of the game for best effect (between 25% and 75%)
      const idx = Math.floor(Math.random() * (tiles.length * 0.5)) + Math.floor(tiles.length * 0.25);
      
      // Ensure target is valid (current + 20 < total)
      if (tiles[idx].type === TileType.NORMAL && (idx + 20) < tiles.length - 2) {
          tiles[idx].type = TileType.PLANE;
          tiles[idx].description = "Airport";
          tiles[idx].shortcutTargetId = idx + 20; 
          planeAdded = true;
      }
  }
  
  return tiles;
};