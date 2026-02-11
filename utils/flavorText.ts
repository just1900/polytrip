import { TileType, CharacterType, ThemeType } from '../types';

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getFlavorText = (tileType: TileType, character: CharacterType, playerName: string, theme: ThemeType): string => {
  const c = character;
  const n = playerName;

  // -- THEME SPECIFIC TEXTS --

  if (theme === 'INTERSTELLAR') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🌌 GRAVITY SLINGSHOT! ${n} zooms forward!`,
                `🚀 Thrusters at max! ${n} speeds up!`,
                `☄️ Riding a comet's tail!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `⚠️ METEOR STRIKE! ${n} took damage!`,
                `🔧 Engine malfunction! ${n} drifts back.`,
                `📡 Lost signal... reconnecting...`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🕳️ BLACK HOLE! ${n} is trapped!`,
                `❄️ Space is cold... ${n} is frozen!`,
                `🛌 Zero-G nap time for ${n}.`,
            ]);
        case TileType.SHORTCUT:
            return `✨ WORMHOLE! ${n} warped through space!`;
      }
  }

  if (theme === 'CYBERPUNK') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `⚡ NITRO BOOST! ${n} goes supersonic!`,
                `🔋 Supercharged battery!`,
                `🚄 Maglev acceleration!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `👾 SYSTEM HACK! ${n} got glitched!`,
                `🚧 Cyber-traffic jam!`,
                `🤖 Rogue AI blocked the path!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `⛔ SYSTEM CRASH! Rebooting...`,
                `🔌 Out of power. ${n} needs to charge.`,
                `🛑 Firewall detected. access denied.`,
            ]);
        case TileType.SHORTCUT:
            return `📡 Data Stream! ${n} uploaded forward!`;
      }
  }

  if (theme === 'CANDY') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🍬 SUGAR RUSH! ${n} is hyper active!`,
                `🍩 Rolling down the donut hill!`,
                `🥤 Soda stream boost!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🍫 STICKY CHOCOLATE! ${n} is stuck!`,
                `🦷 Toothache! ${n} slows down.`,
                `🍯 Stepped in honey! So slow...`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🍭 Sugar crash... ${n} needs a nap.`,
                `🧊 Brain freeze from ice cream!`,
                `🍬 Chewing too much gum. Can't move.`,
            ]);
        case TileType.SHORTCUT:
            return `🌈 Rainbow Slide! Wheeee!`;
      }
  }

  if (theme === 'OCEAN') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🌊 RIDING THE CURRENT! ${n} surfs ahead!`,
                `🐬 Dolphins pushed ${n} forward!`,
                `🚤 Hydro-jet engaged!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `⚓ ANCHOR DROP! ${n} is weighed down.`,
                `🦀 Crabs pinched ${n}'s tires!`,
                `🌪️ Whirlpool! Spinning back!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🐙 GIANT OCTOPUS! ${n} is grabbed!`,
                `🐚 Hiding in a shell.`,
                `💤 Sleeping with the fishes.`,
            ]);
        case TileType.SHORTCUT:
            return `🐢 Sea Turtle Taxi! ${n} got a lift!`;
      }
  }

  // -- DEFAULT FALLBACKS --
  switch (tileType) {
    case TileType.BOOST:
      return getRandom([
        `🚀 ZOOM! ${n} found a booster!`,
        `💨 ${n} the ${c} caught a tailwind!`,
      ]);
    case TileType.PENALTY:
      return getRandom([
        `🍌 Oh no! ${n} slipped!`,
        `🛑 ${n} got stuck!`,
      ]);
    case TileType.FREEZE:
      return getRandom([
        `💤 ${n} decided to take a nap!`,
        `❄️ Brrr! ${n} is frozen solid!`,
      ]);
    case TileType.SHORTCUT:
      return getRandom([
        `🪜 ${n} climbed a ladder!`,
        `🎈 ${n} floated up!`,
      ]);
    case TileType.PLANE:
      return `✈️ AIRPORT! ${n} is flying high!`;
    case TileType.STORY:
      return `✨ ${n} found something magical!`;
    default:
      return `${n} is driving happily.`;
  }
};