import { TileType, CharacterType } from '../types';

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getFlavorText = (tileType: TileType, character: CharacterType, playerName: string): string => {
  const c = character;
  const n = playerName;

  switch (tileType) {
    case TileType.BOOST:
      return getRandom([
        `🚀 ZOOM! ${n} found a rocket booster!`,
        `💨 ${n} the ${c} caught a super tailwind!`,
        `🏎️ ${n} found a secret shortcut!`,
        `✨ Sparkles make ${n}'s car go fast!`,
        `🛹 ${n} did a cool trick and sped up!`
      ]);
    
    case TileType.PENALTY:
      return getRandom([
        `🍌 Oh no! ${n} slipped on a banana peel!`,
        `🛑 ${n} got stuck at a red light!`,
        `🐢 ${n} stopped to watch a turtle cross!`,
        `🗺️ ${n} held the map upside down!`,
        `🔧 ${n}'s race car got a flat tire!`
      ]);

    case TileType.FREEZE:
      return getRandom([
        `💤 ${n} decided to take a nap!`,
        `❄️ Brrr! ${n} is frozen solid!`,
        `🍦 ${n} stopped for ice cream!`,
        `🧸 ${n} is hugging a teddy bear. Skipped turn.`,
        `🦋 ${n} got distracted by a butterfly!`
      ]);

    case TileType.SHORTCUT:
      return getRandom([
        `🪜 ${n} climbed a magic ladder!`,
        `🌈 ${n} rode a rainbow across the sky!`,
        `🦅 A giant eagle carried ${n} forward!`,
        `🚇 ${n} found a secret tunnel!`,
        `🎈 ${n} floated up in a hot air balloon!`
      ]);
    
    case TileType.PLANE:
      return getRandom([
        `✈️ FIRST CLASS! ${n} is flying high!`,
        `🛫 ${n} boarded a jet! See ya later!`,
        `☁️ Up in the clouds! ${n} skips traffic!`,
        `🕶️ ${n} put on sunglasses and flew away!`,
      ]);

    case TileType.STORY:
      return `✨ ${n} found something magical!`;

    default:
      return `${n} is driving happily.`;
  }
};