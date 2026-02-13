import { TileType, CharacterType, ThemeType } from '../types';

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getTileIcon = (tileType: TileType, theme: ThemeType): string => {
  if (tileType === TileType.STORY) return "✨";
  if (tileType === TileType.NORMAL) return "";

  if (theme === 'INTERSTELLAR') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🚀", "🌠", "🛰️", "🌌", "☄️"]);
        case TileType.PENALTY: return getRandom(["☄️", "🌑", "🧑‍🚀"]);
        case TileType.FREEZE: return getRandom(["🪐", "⏱️", "⚡", "🛸"]);
        case TileType.SHORTCUT: return "🛸";
      }
  } else if (theme === 'CYBERPUNK') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["⚡", "🔋", "🚄"]);
        case TileType.PENALTY: return getRandom(["🏍️", "🚧", "📡", "🤖", "🛹"]);
        case TileType.FREEZE: return getRandom(["💾", "💿", "🔄", "🕴️"]);
        case TileType.SHORTCUT: return "📡";
      }
  } else if (theme === 'CANDY') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🍬", "🍩", "🥤"]);
        case TileType.PENALTY: return getRandom(["🍫", "🍭", "🍰"]);
        case TileType.FREEZE: return getRandom(["🍪", "☕", "🎉"]);
        case TileType.SHORTCUT: return "🌈";
      }
  } else if (theme === 'OCEAN') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌊", "🐬", "🚤"]);
        case TileType.PENALTY: return getRandom(["🏄", "🌬️", "🐢", "💨", "🐳"]);
        case TileType.FREEZE: return getRandom(["🧜‍♀️", "🐚", "🐙", "🌪️"]);
        case TileType.SHORTCUT: return "🐢";
      }
  } else if (theme === 'ARCTIC') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌌", "⛷️", "🛷", "💨"]);
        case TileType.PENALTY: return getRandom(["🛷", "🐧", "❄️", "🐻"]);
        case TileType.FREEZE: return getRandom(["🌟", "🔥", "⛸️", "🌞"]);
        case TileType.SHORTCUT: return "❄️";
      }
  } else if (theme === 'JUNGLE') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🐆", "🌿", "🛶"]);
        case TileType.PENALTY: return getRandom(["🛶", "🐒", "🐵", "🎋", "🦜"]);
        case TileType.FREEZE: return getRandom(["🦁", "🍌", "🥁"]);
        case TileType.SHORTCUT: return "🗿";
      }
  } else if (theme === 'SOCCER') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["⚽", "🏃", "👟"]);
        case TileType.PENALTY: return getRandom(["👟", "📣", "⚡", "🛡️", "📢"]);
        case TileType.FREEZE: return getRandom(["⏱️", "🥤", "🔄"]);
        case TileType.SHORTCUT: return "🏆";
      }
  } else if (theme === 'MAGMA') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🔥", "🌋", "⛓️"]);
        case TileType.PENALTY: return getRandom(["🏃", "🛡️", "💨"]);
        case TileType.FREEZE: return getRandom(["🐲", "💎", "🌋"]);
        case TileType.SHORTCUT: return "🐲";
      }
  } else if (theme === 'ANCIENT') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌸", "🏇", "🎆"]);
        case TileType.PENALTY: return getRandom(["🐎", "🍵", "🥋", "📜"]);
        case TileType.FREEZE: return getRandom(["🧧", "🏮", "🐉", "🧘"]);
        case TileType.SHORTCUT: return "🕊️";
      }
  } else if (theme === 'DESERT') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🏎️", "🌪️", "🚀", "🛣️"]);
        case TileType.PENALTY: return getRandom(["🐫", "🦎", "🌵"]);
        case TileType.FREEZE: return getRandom(["🏺", "🦅", "💧", "🌬️"]);
        case TileType.SHORTCUT: return "🦅";
      }
  } else if (theme === 'HEAVEN') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌈", "🕊️", "🌬️"]);
        case TileType.PENALTY: return getRandom(["🌬️", "☁️", "✨", "🎐"]);
        case TileType.FREEZE: return getRandom(["🔔", "☀️", "🙌"]);
        case TileType.SHORTCUT: return "✨";
      }
  } else if (theme === 'PARK') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["✂️", "🚲", "🐕"]);
        case TileType.PENALTY: return getRandom(["🛹", "🪁", "🧺"]);
        case TileType.FREEZE: return getRandom(["🍦", "🦋", "⚽"]);
        case TileType.SHORTCUT: return "🛶";
      }
  } else if (theme === 'GARDEN') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🥬", "🌽", "🌻"]);
        case TileType.PENALTY: return getRandom(["🐇", "🐞", "🐰", "🚿"]);
        case TileType.FREEZE: return getRandom(["🐝", "🌸", "☀️"]);
        case TileType.SHORTCUT: return "🕳️";
      }
  } else if (theme === 'KINDERGARTEN') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🪢", "🍪", "🛴"]);
        case TileType.PENALTY: return getRandom(["🛴", "🎨", "🧱", "🧸"]);
        case TileType.FREEZE: return getRandom(["🌟", "🔔", "🍎"]);
        case TileType.SHORTCUT: return "🛝";
      }
  } else if (theme === 'KITCHEN') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌶️", "🍳", "🧈"]);
        case TileType.PENALTY: return getRandom(["🧼", "🥛", "🌪️"]);
        case TileType.FREEZE: return getRandom(["👨‍🍳", "⏲️", "🍕"]);
        case TileType.SHORTCUT: return "🌬️";
      }
  } else if (theme === 'BALCONY') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🌵", "🪴", "💨"]);
        case TileType.PENALTY: return getRandom(["🐾", "🐈", "🐦", "💧"]);
        case TileType.FREEZE: return getRandom(["💤", "☀️", "📖"]);
        case TileType.SHORTCUT: return "👕";
      }
  } else if (theme === 'AMUSEMENT_PARK') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🤹", "🎈", "🚗", "🍿"]);
        case TileType.PENALTY: return getRandom(["🎆", "🎉", "🤡", "🎈"]);
        case TileType.FREEZE: return getRandom(["🎟️", "🎰", "🎪"]);
        case TileType.SHORTCUT: return "🎢";
      }
  } else if (theme === 'FAMILY') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["📺", "🧸", "🧦", "🏃"]);
        case TileType.PENALTY: return getRandom(["🧱", "🍵", "🐕"]);
        case TileType.FREEZE: return getRandom(["💤", "🛋️", "🧸"]);
        case TileType.SHORTCUT: return "🚪";
      }
  } else if (theme === 'MARKET') {
      switch (tileType) {
        case TileType.BOOST: return getRandom(["🛒", "🌽", "📢"]);
        case TileType.PENALTY: return getRandom(["🍌", "🥚", "🐔", "🍎"]);
        case TileType.FREEZE: return getRandom(["🏷️", "⚖️", "🍖"]);
        case TileType.SHORTCUT: return "📦";
      }
  }

  // Fallback Icons
  switch (tileType) {
    case TileType.BOOST: return "🚀";
    case TileType.PENALTY: return "⏩";
    case TileType.FREEZE: return "🎲";
    case TileType.SHORTCUT: return "🪜";
    default: return "";
  }
};

export const getFlavorText = (tileType: TileType, character: CharacterType, playerName: string, theme: ThemeType, icon?: string): string => {
  const c = character;
  const n = playerName;
  let options: string[] = [];

  // -- THEME SPECIFIC TEXTS --

  if (theme === 'INTERSTELLAR') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌌 GRAVITY SLINGSHOT! ${n} zooms forward!`,
                `🚀 Thrusters at max! ${n} speeds up!`,
                `☄️ Riding a comet's tail!`,
            ]; break;
        case TileType.PENALTY: // Now Forward +2
            options = [
                `🛰️ SATELLITE BOOST! ${n} gets a signal push!`,
                `🌠 Shooting star wish! Forward 2 steps!`,
                `🧑‍🚀 Zero-G float! Drifting forward!`,
            ]; break;
        case TileType.FREEZE: // Now Extra Turn
            options = [
                `⏱️ TIME WARP! ${n} gets another turn!`,
                `⚡ ENERGY SURGE! System recharged instantly!`,
                `🛸 Alien technology found! Roll again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`✨ WORMHOLE! ${n} warped through space!`]; break;
      }
  }

  if (theme === 'CYBERPUNK') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `⚡ NITRO BOOST! ${n} goes supersonic!`,
                `🔋 Supercharged battery!`,
                `🚄 Maglev acceleration!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `📡 DATA UPLINK! Fast travel enabled!`,
                `🤖 HACKED THE MAINFRAME! +2 Steps!`,
                `🛹 Hoverboard upgrade! Smooth ride!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🔄 SYSTEM OVERCLOCK! Immediate reboot!`,
                `💿 Quick Time Event success! Go again!`,
                `🕴️ Bullet time! Extra action!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`📡 Data Stream! ${n} uploaded forward!`]; break;
      }
  }

  if (theme === 'CANDY') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🍬 SUGAR RUSH! ${n} is hyper active!`,
                `🍩 Rolling down the donut hill!`,
                `🥤 Soda stream boost!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🍫 CHOCOLATE SLIDE! Smooth move +2!`,
                `🍭 Found a shortcut in the gumdrops!`,
                `🍰 Cake walk! Easy progress!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `☕ SUGAR HIGH! Can't stop moving!`,
                `🎉 Sprinkle shower! Extra turn!`,
                `🍪 Cookie power! Roll again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🌈 Rainbow Slide! Wheeee!`]; break;
      }
  }

  if (theme === 'OCEAN') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌊 RIDING THE CURRENT! ${n} surfs ahead!`,
                `🐬 Dolphins pushed ${n} forward!`,
                `🚤 Hydro-jet engaged!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🐢 TURTLE GLIDE! Slow but steady +2!`,
                `💨 Sea breeze push!`,
                `🐳 Whale spout lift! Forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🐙 EIGHT ARMS! Multitasking master! Roll again!`,
                `🧜‍♀️ Mermaid song energizes ${n}!`,
                `🌪️ Tidal wave momentum! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🐢 Sea Turtle Taxi! ${n} got a lift!`]; break;
      }
  }

  if (theme === 'ARCTIC') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌌 AURORA POWER! ${n} glows and speeds up!`,
                `🛷 Sledding down the ice slope!`,
                `💨 Tailwind from a blizzard!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🐧 PENGUIN SLIDE! Belly slide +2!`,
                `❄️ Ice skating dash!`,
                `🐻 Polar bear push!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🔥 HOT COCOA! Recharged and ready! Roll again!`,
                `⛸️ Figure 8 spin! Extra momentum!`,
                `🌞 Midnight Sun! No sleeping! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🏔️ Ice Bridge! A shortcut across the crevasse!`]; break;
      }
  }

  if (theme === 'JUNGLE') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🐆 JAGUAR SPRINT! ${n} runs wild!`,
                `🛶 Canoeing down the rapids!`,
                `🌿 Swinging on vines like Tarzan!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🐵 MONKEY SHORTCUT! Follow the leader +2!`,
                `🎋 Bamboo bounce! Boing!`,
                `🦜 Parrot guide! "Squawk! This way!"`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🍌 BANANA ENERGY! Go again!`,
                `🦁 Lion's roar wakes everyone up! Extra turn!`,
                `🥁 Tribal drums rhythm! Move it!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🗿 Ancient Passage! The ruins reveal a path!`]; break;
      }
  }

  if (theme === 'SOCCER') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `⚽ GOALLLL! The crowd cheers ${n} on!`,
                `🏃 Counter-attack! Fast break!`,
                `👟 New cleats! Super grip!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `⚡ QUICK PASS! 1-2 play forward!`,
                `🛡️ Great defense leads to offense! +2`,
                `📢 Coach shouts instructions! Forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `⏱️ EXTRA TIME! Play continues!`,
                `🔄 Substitution fresh legs! Roll again!`,
                `🥤 Energy drink boost! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🏆 Championship Cup! A free pass to the finals!`]; break;
      }
  }

  if (theme === 'MAGMA') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🔥 HEAT THRUST! ${n} rides the steam!`,
                `🌋 Eruption jump! Flying high!`,
                `⛓️ Slide down the giant chain!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🏃 HOT FEET! Running faster +2!`,
                `💨 Steam vent boost!`,
                `🛡️ Obsidian shield! Push forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🐲 DRAGON FURY! Adrenaline rush! Roll again!`,
                `💎 Found a fire gem! Extra power!`,
                `🌋 Volcano rumble! Move before it blows!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🐲 Dragon Ride! ${n} flew over the dungeon!`]; break;
      }
  }

  if (theme === 'ANCIENT') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌸 PEACH BLOSSOM WIND! So fast!`,
                `🏇 Imperial Horse Express!`,
                `🎆 Fireworks propel ${n} forward!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🍵 HERBAL TEA! Feeling refreshed +2!`,
                `🥋 Kung Fu leap!`,
                `📜 Royal Decree: Advance!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🏮 FESTIVAL NIGHT! Party time! Roll again!`,
                `🐉 Dragon Dance energy! Extra turn!`,
                `🧘 Zen focus! Perfect move!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🕊️ Paper Crane Flight! Magical!`]; break;
      }
  }

  if (theme === 'DESERT') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🚀 NITRO JET! Mad Max style!`,
                `🌪️ Riding a dust devil!`,
                `🛣️ Open highway! Pedal to the metal!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🦎 LIZARD SPRINT! Skedaddle +2!`,
                `🌵 Cactus juice! Quenched!`,
                `🐪 Camel ride! Steady pace!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `💧 OASIS FOUND! Refilled! Roll again!`,
                `🦅 Eagle vision! Spot the path!`,
                `🌬️ Cool breeze at sunset! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🦅 Eagle Lift! ${n} soars over the canyon!`]; break;
      }
  }

  if (theme === 'HEAVEN') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌈 RAINBOW SLIDE! Wheee!`,
                `🕊️ Angel wings deployed!`,
                `🌬️ Divine wind pushes ${n}!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `☁️ CLOUD HOP! Soft landing +2!`,
                `✨ Stardust trail! Follow it!`,
                `🎐 Gentle breeze! Float forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🔔 HEAVENLY CHIME! Wake up call! Roll again!`,
                `☀️ Sunbeam energy! Extra turn!`,
                `🙌 High five from a cloud! Go!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`✨ Teleportation Gate! Instant travel!`]; break;
      }
  }

  if (theme === 'PARK') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `✂️ LAWN MOWER TURBO!`,
                `🐕 Chased by a happy dog!`,
                `🚲 Downhill bike path!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🛹 SKATEBOARD TRICK! Ollie forward +2!`,
                `🪁 Kite wind! Pulling you along!`,
                `🧺 Picnic energy! Yummy!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🍦 ICE CREAM TRUCK! Energy boost! Roll again!`,
                `🦋 Butterfly chase! Extra turn!`,
                `⚽ Kick the ball! Go go go!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🛶 Boat ride across the pond!`]; break;
      }
  }

  if (theme === 'GARDEN') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🥬 EAT SPINACH! ${n} is super strong!`,
                `🌽 Corn rocket! Pop off!`,
                `🌻 Sunflower turn! Chasing the sun!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🐰 HOP LIKE A BUNNY! Jump +2!`,
                `🐞 Ladybug luck! Move forward!`,
                `🚿 Watering can shower! Refreshing!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🐝 BUZZY BEE! Move fast! Roll again!`,
                `🌸 Flower power bloom! Extra turn!`,
                `☀️ Photosynthesis! Energy up!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🕳️ MOLE TUNNEL! Digging under!`]; break;
      }
  }

  if (theme === 'KINDERGARTEN') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🪢 JUMP ROPE MASTER! Double jump ahead!`,
                `🛴 Scooter trick! Speed up!`,
                `🍪 Cookie energy! Yummy!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🎨 FINGER PAINTING! Messy fun +2!`,
                `🧱 Building block tower! Climb up!`,
                `🧸 Share a toy! Good karma forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🔔 RECESS BELL! Playtime! Roll again!`,
                `🌟 Gold star sticker! Extra turn!`,
                `🍎 Teacher's pet! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🛝 SUPER SLIDE! Whoosh to the bottom!`]; break;
      }
  }

  if (theme === 'KITCHEN') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌶️ SPICE EXPLOSION! Hot speed!`,
                `🍳 Hot Oil Jump! Sizzle forward!`,
                `🧈 Sliding on melted butter! Whoosh!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🧼 SOAP SLIDE! Slippery fun +2!`,
                `🥛 Spilled milk! Don't cry, just dash!`,
                `🌪️ Blender whirlwind push!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `👨‍🍳 CHEF'S SPECIAL! Taste test! Roll again!`,
                `⏲️ Timer Ding! Your turn again!`,
                `🍕 Pizza delivery! Energy boost! Go!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🌬️ Hood Vent Updraft! Flying high!`]; break;
      }
  }

  if (theme === 'BALCONY') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌵 SUCCULENT BOUNCE! Springy jump!`,
                `🪴 Plant growth spurt! Moving up!`,
                `💨 Caught the wind chime breeze!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🐾 CAT PAW SWIPE! Pushed ahead +2!`,
                `🐦 Pigeon flutter! Startled dash!`,
                `💧 Watering can spill! Slide forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `💤 AFTERNOON NAP! So refreshed! Roll again!`,
                `☀️ Basking in the sun! Energy recharge!`,
                `📖 Good book break! Ready to go!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`👕 Clothesline Zipline! Sliding down!`]; break;
      }
  }

  if (theme === 'AMUSEMENT_PARK') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🤹 CIRCUS ACT! Seal headbutt +2!`,
                `🚗 BUMPER CAR BUMP! Pushed ahead!`,
                `🍿 POPCORN EXPLOSION! Flying forward!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🎆 FIREWORKS! Shot by a confetti cannon +2!`,
                `🤡 Clown car chaotic drive! Dash +2!`,
                `🎈 Balloon float! Drifting forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🎰 LUCKY DRAW! You won a prize! Roll again!`,
                `🎟️ Found a golden ticket! Extra turn!`,
                `🎪 Front row seats! Energy up! Go again!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🎢 COASTER WARP! Extreme speed loop!`]; break;
      }
  }

  if (theme === 'FAMILY') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `📺 REMOTE CONTROL! Fast forwarded!`,
                `🧦 SLIDING ON SOCKS! Whoosh!`,
                `🏃 DINNER BELL! Running to the table!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🧱 STEPPED ON A LEGO! Hop forward in pain +2!`,
                `🍵 SPILLED TEA! Scramble away!`,
                `🐕 DOG CHASE! Zoomies activated!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `💤 COZY NAP! Woke up refreshed! Roll again!`,
                `🧸 FOUND FAVORITE TOY! Happy energy! Go!`,
                `🛋️ PILLOW FORT! Safe and sound! Extra turn!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`🚪 SECRET PASSAGE behind the bookshelf!`]; break;
      }
  }

  if (theme === 'MARKET') {
      switch (tileType) {
        case TileType.BOOST:
            options = [
                `🌽 FRESH CORN! Super energy boost!`,
                `🛒 SHOPPING CART RIDE! Wheee!`,
                `📢 FLASH SALE! Rushing to the deal!`,
            ]; break;
        case TileType.PENALTY:
            options = [
                `🍌 SLIPPED ON A PEEL! Slid forward +2!`,
                `🐔 CHICKEN ESCAPE! Chasing it ahead!`,
                `🍎 APPLES ROLLING! Stumble forward!`,
            ]; break;
        case TileType.FREEZE:
            options = [
                `🏷️ COUPON FOUND! Extra value! Roll again!`,
                `⚖️ PERFECT WEIGHT! Bonus prize! Go!`,
                `🍖 FREE SAMPLE! Tasty energy! Extra turn!`,
            ]; break;
        case TileType.SHORTCUT:
            options = [`📦 DELIVERY CHUTE! Express shipping!`]; break;
      }
  }

  // --- Logic to return text ---
  
  // If options were not populated (fallback for missing theme/type combination)
  if (options.length === 0) {
      switch (tileType) {
        case TileType.BOOST: options = [`🚀 ZOOM! ${n} found a booster!`, `💨 ${n} the ${c} caught a tailwind!`]; break;
        case TileType.PENALTY: options = [`🏃 DASH! ${n} sprints ahead!`, `👟 ${n} found a shortcut!`]; break;
        case TileType.FREEZE: options = [`🎲 BONUS! ${n} rolls again!`, `⏱️ ${n} acts quickly! Extra turn!`]; break;
        case TileType.SHORTCUT: options = [`🪜 ${n} climbed a ladder!`, `🎈 ${n} floated up!`]; break;
        case TileType.STORY: return `✨ ${n} found something magical!`;
        default: return `${n} is driving happily.`;
      }
  }

  // If icon is provided, prioritize matching texts or enforce visual consistency
  if (icon) {
      const matches = options.filter(o => o.startsWith(icon));
      if (matches.length > 0) return getRandom(matches);
      
      // Fallback: Use the provided icon with a random text description (stripping original emoji)
      const randomOption = getRandom(options);
      const firstSpace = randomOption.indexOf(' ');
      if (firstSpace > -1) {
          return `${icon} ${randomOption.substring(firstSpace + 1)}`;
      }
  }
  
  return getRandom(options);
};