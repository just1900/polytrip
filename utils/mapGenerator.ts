import { Tile, TileType, TOTAL_TILES, Decoration, ThemeType } from '../types';

const ISO_WIDTH = 120;  
const ISO_HEIGHT = 60; 

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to get zone names based on theme
const getZoneName = (theme: ThemeType, zoneIdx: number): string => {
  if (theme === 'INTERSTELLAR') {
    if (zoneIdx === 1) return 'Asteroid Belt';
    if (zoneIdx === 2) return 'Black Hole';
    if (zoneIdx === 3) return 'Alien Bridge';
    return 'Earth Station';
  } else if (theme === 'CYBERPUNK') {
    if (zoneIdx === 1) return 'The Slums';
    if (zoneIdx === 2) return 'City Center';
    if (zoneIdx === 3) return 'Cloud Hwy';
    return 'Undercity';
  } else if (theme === 'CANDY') {
    if (zoneIdx === 1) return 'Cookie Plains';
    if (zoneIdx === 2) return 'Choco Mtn';
    if (zoneIdx === 3) return 'Rainbow Road';
    return 'Gingerbread House';
  } else if (theme === 'OCEAN') {
    if (zoneIdx === 1) return 'Coral Reef';
    if (zoneIdx === 2) return 'Dark Trench';
    if (zoneIdx === 3) return 'Atlantis';
    return 'The Shallows';
  }
  return `Zone ${zoneIdx}`;
}

export const generateMap = (theme: ThemeType = 'INTERSTELLAR'): Tile[] => {
  const tiles: Tile[] = [];
  const occupied = new Set<string>();

  let gridX = 0;
  let gridY = 0;
  let previousMove = { dx: 0, dy: 0 };
  
  const MAX_DRIFT = 12; 

  // --- PASS 1: Generate Path ---
  for (let i = 0; i < TOTAL_TILES; i++) {
    // 1. Determine Zone (Split 120 tiles into 3 main segments + start/end)
    let zoneName = getZoneName(theme, 0);
    if (i > 0 && i <= 40) zoneName = getZoneName(theme, 1);
    else if (i > 40 && i <= 80) zoneName = getZoneName(theme, 2);
    else if (i > 80) zoneName = getZoneName(theme, 3);

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
    } else if ([40, 80].includes(i)) {
      type = TileType.STORY;
      description = `Enter ${zoneName}`;
    } else {
        const prevTile = tiles[i - 1];
        const isPrevSpecial = prevTile && prevTile.type !== TileType.NORMAL && prevTile.type !== TileType.STORY;

        if (isPrevSpecial) {
           type = TileType.NORMAL;
        } else {
           const rand = Math.random();
           // Reduced probabilities for negative events
           // Boost: ~8%, Penalty: ~4%, Freeze: ~3%
           if (rand < 0.08) { type = TileType.BOOST; description = "Boost!"; }
           else if (rand < 0.12) { type = TileType.PENALTY; description = "Oops!"; }
           else if (rand < 0.15) { type = TileType.FREEZE; description = "Sleep"; }
        }
    }
    if (!description) description = `${zoneName}`;

    tiles.push({
      id: i,
      type,
      x: screenX,
      y: screenY,
      gridX,
      gridY,
      zone: zoneName,
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

             // THEME SPECIFIC DECORATION LOGIC
             if (theme === 'INTERSTELLAR') {
                 const r = Math.random();
                 if (r < 0.25) decoType = 'ROCKET';
                 else if (r < 0.5) { decoType = 'PLANET'; decoColor = getRandom(['#eab308', '#a855f7', '#ec4899', '#3b82f6']); }
                 else if (r < 0.75) decoType = 'UFO';
                 else if (r < 0.9) decoType = 'SATELLITE';
                 else decoType = 'STAR';
             } else if (theme === 'CYBERPUNK') {
                 const r = Math.random();
                 if (r < 0.3) { decoType = 'NEON_SIGN'; decoColor = getRandom(['#f0abfc', '#22d3ee', '#34d399']); }
                 else if (r < 0.6) decoType = 'SKYSCRAPER';
                 else if (r < 0.8) decoType = 'HOLOGRAM';
                 else decoType = 'BLIMP';
             } else if (theme === 'CANDY') {
                 const r = Math.random();
                 if (r < 0.3) { decoType = 'CANDY_CANE'; decoColor = getRandom(['#ef4444', '#22c55e']); }
                 else if (r < 0.6) { decoType = 'LOLLIPOP'; decoColor = getRandom(['#f472b6', '#facc15', '#60a5fa']); }
                 else if (r < 0.8) decoType = 'DONUT';
                 else decoType = 'ICE_CREAM';
             } else if (theme === 'OCEAN') {
                 const r = Math.random();
                 if (r < 0.3) { decoType = 'CORAL'; decoColor = getRandom(['#f43f5e', '#a855f7', '#f97316']); }
                 else if (r < 0.5) decoType = 'BUBBLE';
                 else if (r < 0.8) decoType = 'JELLYFISH';
                 else decoType = 'SUBMARINE';
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
           const jump = Math.floor(Math.random() * 8) + 5; // Longer jumps for larger map
           const target = idx + jump;
           
           if(target < tiles.length - 2 && tiles[target].type === TileType.NORMAL) {
               tiles[idx].type = TileType.SHORTCUT;
               tiles[idx].shortcutTargetId = target;
               tiles[idx].description = "Shortcut!";
               shortcutsAdded++;
           }
      }
  }

  // --- PASS 4: Add ONE Plane Tile ---
  let planeAdded = false;
  attempts = 0;
  while (!planeAdded && attempts < 100) {
      attempts++;
      // Place it somewhat in the middle of the game for best effect (between 30% and 70%)
      const idx = Math.floor(Math.random() * (tiles.length * 0.4)) + Math.floor(tiles.length * 0.3);
      
      // Ensure target is valid
      if (tiles[idx].type === TileType.NORMAL && (idx + 25) < tiles.length - 2) {
          tiles[idx].type = TileType.PLANE;
          tiles[idx].description = "Airport";
          tiles[idx].shortcutTargetId = idx + 25; 
          planeAdded = true;
      }
  }
  
  return tiles;
};