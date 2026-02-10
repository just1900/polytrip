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

export enum ZoneType {
  CITY = 'City',
  TUNNEL = 'Tunnel',
  MOUNTAIN = 'Mountain',
  BRIDGE = 'Bridge'
}

export type CharacterType = 'Panda' | 'Dolphin' | 'Fox' | 'Cat' | 'Bear' | 'Rabbit';

export interface Decoration {
  id: string;
  type: 'TREE' | 'ROCK' | 'HOUSE' | 'CLOUD' | 'MUSHROOM' | 'FLOWER' | 'STAR' | 'LAMP';
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
  zone: ZoneType;
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