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

  if (theme === 'ARCTIC') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🌌 AURORA POWER! ${n} glows and speeds up!`,
                `🛷 Sledding down the ice slope!`,
                `💨 Tailwind from a blizzard!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🧊 SLIPPED ON ICE! ${n} spins out!`,
                `❄️ Snowball fight! ${n} got hit!`,
                `🌬️ Headwind slows ${n} down.`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🥶 FROZEN SOLID! ${n} is an ice sculpture!`,
                `🐧 Penguins blocked the road!`,
                `⛄ Stuck inside a snowman!`,
            ]);
        case TileType.SHORTCUT:
            return `🏔️ Ice Bridge! A shortcut across the crevasse!`;
      }
  }

  if (theme === 'JUNGLE') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🐆 JAGUAR SPRINT! ${n} runs wild!`,
                `🛶 Canoeing down the rapids!`,
                `🌿 Swinging on vines like Tarzan!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🍃 MUD SLIDE! ${n} gets dirty and slow.`,
                `🙈 Monkeys stole the keys!`,
                `🦟 Giant mosquitos attacking!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🐍 VINE TANGLE! ${n} is trapped!`,
                `🌺 Sleeping pollen from a giant flower.`,
                `🕸️ Caught in a giant spider web!`,
            ]);
        case TileType.SHORTCUT:
            return `🗿 Ancient Passage! The ruins reveal a path!`;
      }
  }

  if (theme === 'SOCCER') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `⚽ GOALLLL! The crowd cheers ${n} on!`,
                `🏃 Counter-attack! Fast break!`,
                `👟 New cleats! Super grip!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🤦 OWN GOAL! ${n} is embarrassed.`,
                `🤕 Fake injury! ${n} rolls on the floor.`,
                `🏁 Offside! Go back!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🟨 YELLOW CARD! Warning delay!`,
                `🥤 Water break!`,
                `🚑 Stretcher needed! (Just kidding)`,
            ]);
        case TileType.SHORTCUT:
            return `🏆 Championship Cup! A free pass to the finals!`;
      }
  }

  if (theme === 'MAGMA') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🔥 HEAT THRUST! ${n} rides the steam!`,
                `🌋 Eruption jump! Flying high!`,
                `⛓️ Slide down the giant chain!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `⚠️ LAVA FLOW! ${n}'s tires are melting!`,
                `🧱 Wall collapse! Go back!`,
                `🦇 Bat swarm attack!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `⛓️ DUNGEON SHACKLES! ${n} is locked up!`,
                `🕸️ Too scared to move...`,
                `🛑 Bridge is out! Wait for it...`,
            ]);
        case TileType.SHORTCUT:
            return `🐲 Dragon Ride! ${n} flew over the dungeon!`;
      }
  }

  if (theme === 'ANCIENT') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🌸 PEACH BLOSSOM WIND! So fast!`,
                `🏇 Imperial Horse Express!`,
                `🎆 Fireworks propel ${n} forward!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🚧 Road construction for the Emperor!`,
                `🎎 Crowded market! Can't move fast.`,
                `🌧️ Heavy rain on the Silk Road.`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🏮 LANTERN RIDDLE! ${n} is thinking...`,
                `🍵 Tea ceremony break.`,
                `📜 Reading an ancient scroll.`,
            ]);
        case TileType.SHORTCUT:
            return `🕊️ Paper Crane Flight! Magical!`;
      }
  }

  if (theme === 'DESERT') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🚀 NITRO JET! Mad Max style!`,
                `🌪️ Riding a dust devil!`,
                `🛣️ Open highway! Pedal to the metal!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🌵 CACTUS PUNCTURE! Flat tire!`,
                `🏜️ Quicksand! ${n} is sinking!`,
                `⛽ Out of gas!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🌪️ SANDSTORM! Visibility zero!`,
                `🦎 Sunbathing lizard blocks the road.`,
                `🔧 Engine overheating!`,
            ]);
        case TileType.SHORTCUT:
            return `🦅 Eagle Lift! ${n} soars over the canyon!`;
      }
  }

  if (theme === 'HEAVEN') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🌈 RAINBOW SLIDE! Wheee!`,
                `🕊️ Angel wings deployed!`,
                `🌬️ Divine wind pushes ${n}!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🌩️ THUNDER CLOUD! Shocking!`,
                `🌧️ Raining cats and dogs!`,
                `🌫️ Lost in the mist.`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🎼 Harp concert! ${n} stopped to listen.`,
                `⛔ Pearly Gates are closed. Knock first!`,
                `🛌 Sleeping on a soft cloud.`,
            ]);
        case TileType.SHORTCUT:
            return `✨ Teleportation Gate! Instant travel!`;
      }
  }

  if (theme === 'PARK') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `✂️ LAWN MOWER TURBO!`,
                `🐕 Chased by a happy dog!`,
                `🚲 Downhill bike path!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `💦 SPRINKLER ATTACK! ${n} got soaked!`,
                `🐜 Ant picnic! Go around!`,
                `🦆 Ducks crossing! Wait!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🪑 PARK BENCH! Time for a nap.`,
                `🍦 Ice cream fell! Crying break.`,
                `🪁 Kite got stuck in a tree.`,
            ]);
        case TileType.SHORTCUT:
            return `🛶 Boat ride across the pond!`;
      }
  }

  if (theme === 'GARDEN') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🥬 EAT SPINACH! ${n} is super strong!`,
                `🌽 Corn rocket! Pop off!`,
                `🌻 Sunflower turn! Chasing the sun!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🐛 CATERPILLAR ATTACK! ${n}'s tires got chewed!`,
                `💩 Stepped in fertilizer... ew!`,
                `💧 SPRINKLER SHOWER! Soaked!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `🐌 STUCK IN MUD! Slow like a snail.`,
                `🥕 Rooted like a carrot!`,
                `🕸️ Spider web trap!`,
            ]);
        case TileType.SHORTCUT:
            return `🕳️ MOLE TUNNEL! Digging under!`;
      }
  }

  if (theme === 'KINDERGARTEN') {
      switch (tileType) {
        case TileType.BOOST:
            return getRandom([
                `🪢 JUMP ROPE MASTER! Double jump ahead!`,
                `🛴 Scooter trick! Speed up!`,
                `🍪 Cookie energy! Yummy!`,
            ]);
        case TileType.PENALTY:
            return getRandom([
                `🥛 Spilled the milk! Slippery!`,
                `🧱 Stepped on a LEGO! Ouch!`,
            ]);
        case TileType.FREEZE:
            return getRandom([
                `😴 Nap time! Everyone shhh!`,
                `🧸 Toy distraction! ${n} is playing.`,
            ]);
        case TileType.SHORTCUT:
            return `🛝 SUPER SLIDE! Whoosh to the bottom!`;
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
    // case TileType.PLANE:
    //   return `✈️ AIRPORT! ${n} is flying high!`;
    case TileType.STORY:
      return `✨ ${n} found something magical!`;
    default:
      return `${n} is driving happily.`;
  }
};