export enum GamePhase {
  DESIGN = 'DESIGN',
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum TileType {
  NORMAL = 'NORMAL',
  FREEZE = 'FREEZE',
  BOOST = 'BOOST',
  PENALTY = 'PENALTY',
  STORY = 'STORY',
  SHORTCUT = 'SHORTCUT',
  PLANE = 'PLANE'
}

export type ThemeType = 'INTERSTELLAR' | 'CYBERPUNK' | 'CANDY' | 'OCEAN' | 'ARCTIC' | 'JUNGLE' | 'SOCCER' | 'MAGMA' | 'ANCIENT' | 'DESERT' | 'HEAVEN' | 'PARK' | 'GARDEN' | 'KINDERGARTEN';

export enum ZoneType {
  // Generic mapping, names will be dynamic based on theme
  ZONE_1 = 'Zone 1',
  ZONE_2 = 'Zone 2',
  ZONE_3 = 'Zone 3',
  ZONE_4 = 'Zone 4'
}

export type CharacterType = 'Panda' | 'Dolphin' | 'Fox' | 'Cat' | 'Bear' | 'Rabbit' | 'Snow Fox' | 'Polar Bear';

export interface Decoration {
  id: string;
  type: 
    // Generic/Nature
    'TREE' | 'ROCK' | 'CLOUD' | 'STAR' |
    // Space
    'ROCKET' | 'PLANET' | 'UFO' | 'SATELLITE' |
    // Cyberpunk
    'NEON_SIGN' | 'HOLOGRAM' | 'SKYSCRAPER' | 'BLIMP' |
    // Candy
    'CANDY_CANE' | 'LOLLIPOP' | 'DONUT' | 'ICE_CREAM' |
    // Ocean
    'CORAL' | 'BUBBLE' | 'JELLYFISH' | 'SUBMARINE' |
    // Arctic
    'PENGUIN' | 'ICE_CRYSTAL' | 'IGLOO' | 'SNOWMAN' |
    // Jungle
    'PALM_TREE' | 'VINE' | 'TOTEM' | 'FLOWER' |
    // Soccer
    'SOCCER_BALL' | 'FLAG' | 'TROPHY' | 'GOAL_POST' |
    // Magma
    'FIRE_PILLAR' | 'LAVA_POOL' | 'CHAIN' | 'SKULL' |
    // Ancient
    'LANTERN' | 'CHERRY_BLOSSOM' | 'SCREEN' | 'GATE' |
    // Desert
    'CACTUS' | 'BONE' | 'TUMBLEWEED' | 'OIL_BARREL' |
    // Heaven
    'CLOUD_PLATFORM' | 'HARP' | 'WING_STATUE' | 'GOLD_ARCH' |
    // Park
    'FOUNTAIN' | 'BENCH' | 'BUSH_SCULPTURE' | 'LAMP_POST' |
    // Garden
    'BROCCOLI' | 'SCARECROW' | 'TOMATO' | 'SPRINKLER' |
    // Kindergarten
    'BLOCKS' | 'CRAYON' | 'ROCKING_HORSE' | 'LOCKER';
  x: number;
  y: number; // Screen coordinates
  gridX: number;
  gridY: number;
  scale: number;
  color?: string; // Optional custom color for diversity
}

export interface Tile {
  id: number;
  type: TileType;
  x: number; // Screen X
  y: number; // Screen Y
  gridX: number;
  gridY: number;
  zone: string; // Changed to string to allow dynamic names
  description?: string;
  decorations?: Decoration[];
  shortcutTargetId?: number;
}

export interface Player {
  id: number;
  name: string;
  character: CharacterType;
  color: string;
  position: number;
  frozen: boolean;
  finished: boolean;
}

export interface GameState {
  players: Player[];
  activePlayerIndex: number;
  isMoving: boolean;
  turnCount: number;
  history: string[];
}

export const TOTAL_TILES = 120;