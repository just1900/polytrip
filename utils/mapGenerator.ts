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
  } else if (theme === 'ARCTIC') {
    if (zoneIdx === 1) return 'Ice Shelf';
    if (zoneIdx === 2) return 'Deep Freeze';
    if (zoneIdx === 3) return 'Aurora Peak';
    return 'Glacial Base';
  } else if (theme === 'JUNGLE') {
    if (zoneIdx === 1) return 'Dense Canopy';
    if (zoneIdx === 2) return 'Mist Swamp';
    if (zoneIdx === 3) return 'Ancient Ruins';
    return 'Safari Camp';
  } else if (theme === 'SOCCER') {
    if (zoneIdx === 1) return 'Training Field';
    if (zoneIdx === 2) return 'Penalty Box';
    if (zoneIdx === 3) return 'Championship Arena';
    return 'Locker Room';
  } else if (theme === 'MAGMA') {
    if (zoneIdx === 1) return 'Ash Plains';
    if (zoneIdx === 2) return 'Basalt Bridge';
    if (zoneIdx === 3) return 'Core Chamber';
    return 'Volcano Edge';
  } else if (theme === 'ANCIENT') {
    if (zoneIdx === 1) return 'Silk Road';
    if (zoneIdx === 2) return 'Great Wall';
    if (zoneIdx === 3) return 'Forbidden City';
    return 'Imperial Gate';
  } else if (theme === 'DESERT') {
    if (zoneIdx === 1) return 'Sand Dunes';
    if (zoneIdx === 2) return 'Cactus Valley';
    if (zoneIdx === 3) return 'Red Canyon';
    return 'Oasis Town';
  } else if (theme === 'HEAVEN') {
    if (zoneIdx === 1) return 'Cloud 9';
    if (zoneIdx === 2) return 'Golden Gates';
    if (zoneIdx === 3) return 'Starry Expanse';
    return 'Sky Port';
  } else if (theme === 'PARK') {
    if (zoneIdx === 1) return 'Flower Garden';
    if (zoneIdx === 2) return 'Duck Pond';
    if (zoneIdx === 3) return 'Picnic Hill';
    return 'Entrance Gate';
  } else if (theme === 'GARDEN') {
    if (zoneIdx === 1) return 'Carrot Field';
    if (zoneIdx === 2) return 'Broccoli Forest';
    if (zoneIdx === 3) return 'Pumpkin Patch';
    return 'Greenhouse';
  } else if (theme === 'KINDERGARTEN') {
    if (zoneIdx === 1) return 'Play Area';
    if (zoneIdx === 2) return 'Nap Room';
    if (zoneIdx === 3) return 'Art Corner';
    return 'Toy Castle';
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
           // Boost: ~8%, Penalty: ~2%, Freeze: ~2%
           if (rand < 0.08) { type = TileType.BOOST; description = "Boost!"; }
           else if (rand < 0.10) { type = TileType.PENALTY; description = "Oops!"; }
           else if (rand < 0.12) { type = TileType.FREEZE; description = "Sleep"; }
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
             } else if (theme === 'ARCTIC') {
                 const r = Math.random();
                 if (r < 0.4) decoType = 'ICE_CRYSTAL';
                 else if (r < 0.6) decoType = 'IGLOO';
                 else if (r < 0.8) decoType = 'SNOWMAN';
                 else decoType = 'PENGUIN';
             } else if (theme === 'JUNGLE') {
                 const r = Math.random();
                 if (r < 0.4) decoType = 'PALM_TREE';
                 else if (r < 0.6) decoType = 'VINE';
                 else if (r < 0.8) decoType = 'TOTEM';
                 else decoType = 'FLOWER';
             } else if (theme === 'SOCCER') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'SOCCER_BALL';
                 else if (r < 0.5) decoType = 'FLAG';
                 else if (r < 0.7) decoType = 'TROPHY';
                 else decoType = 'GOAL_POST';
             } else if (theme === 'MAGMA') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'FIRE_PILLAR';
                 else if (r < 0.6) decoType = 'LAVA_POOL';
                 else if (r < 0.8) decoType = 'CHAIN';
                 else decoType = 'SKULL';
             } else if (theme === 'ANCIENT') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'LANTERN';
                 else if (r < 0.6) decoType = 'CHERRY_BLOSSOM';
                 else if (r < 0.8) decoType = 'SCREEN';
                 else decoType = 'GATE';
             } else if (theme === 'DESERT') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'CACTUS';
                 else if (r < 0.6) decoType = 'BONE';
                 else if (r < 0.8) decoType = 'TUMBLEWEED';
                 else decoType = 'OIL_BARREL';
             } else if (theme === 'HEAVEN') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'CLOUD_PLATFORM';
                 else if (r < 0.5) decoType = 'HARP';
                 else if (r < 0.7) decoType = 'WING_STATUE';
                 else decoType = 'GOLD_ARCH';
             } else if (theme === 'PARK') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'FOUNTAIN';
                 else if (r < 0.5) decoType = 'BENCH';
                 else if (r < 0.7) decoType = 'BUSH_SCULPTURE';
                 else decoType = 'LAMP_POST';
             } else if (theme === 'GARDEN') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'BROCCOLI';
                 else if (r < 0.5) decoType = 'SCARECROW';
                 else if (r < 0.7) decoType = 'TOMATO';
                 else decoType = 'SPRINKLER';
             } else if (theme === 'KINDERGARTEN') {
                 const r = Math.random();
                 if (r < 0.3) decoType = 'BLOCKS';
                 else if (r < 0.5) { decoType = 'CRAYON'; decoColor = getRandom(['#ef4444', '#3b82f6', '#facc15']); }
                 else if (r < 0.7) decoType = 'ROCKING_HORSE';
                 else decoType = 'LOCKER';
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