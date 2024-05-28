const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const path = require('path');

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
  ],
});

const CHANNEL_FOR_BOT_COMMANDS = "bot-commands";
const DEFAULT_SPECIFIC_DIRECTORY = "age2";
const BASE_URL = process.env.BASE_URL || "sounds";
const URL_FLAGS = process.env.URL_FLAGS || "";

const DIRS_NUM_OF_FILES = {
  boomer: 32,
  charger: 9,
  hunter: 21,
  jockey: 31,
  smoker: 22,
  spitter: 15,
  tank: 16,
  witch: 13,
};

// In an ideal world this should really count how many files are in the subdirectory
const getNumberOfFilesInDirectory = (directory, subDirectory) => {
  return DIRS_NUM_OF_FILES[subDirectory];
};

const playSound = (voice, pathToSound) => {
  const connection = joinVoiceChannel({
    channelId: voice.channel.id,
    guildId: voice.guild.id,
    adapterCreator: voice.guild.voiceAdapterCreator,
    selfDeaf: false,
  });
  const player = createAudioPlayer();
  connection.subscribe(player);
  resource = createAudioResource(pathToSound);
  player.play(resource);
};

// Play specific sound from directory
const handleSpecificSound = (voice, directory, sound) => {
  playSound(voice, path.join(__dirname, BASE_URL , directory, `${sound}.mp3${URL_FLAGS}`));
};

// Play random sound from directory/subDirectory/...
const handleSubDirectoryRandom = (voice, directory, subDirectory) => {
  const numberOfSounds = getNumberOfFilesInDirectory(directory, subDirectory);
  const number = Math.ceil(Math.random() * Math.floor(numberOfSounds));
  playSound(voice, `${BASE_URL}/${directory}/${subDirectory}/${number}.wav${URL_FLAGS}`);
};

const subDirectoryRandom = content => content.match(/^([a-z]+) ([a-z]+)$/);
const specificSound = content => content.match(/^([a-z]+) ([0-9]+)$/);
const defaultSpecific = content => content.match(/^([0-9]+)$/);

bot.on(Events.MessageCreate, message => {
  if (message.channel.name != CHANNEL_FOR_BOT_COMMANDS) return;

  const voice = message.member.voice;
  if (!voice) return;

  const content = message.content;
  const defaultSpecificMatch = defaultSpecific(content);
  const specificSoundMatch = specificSound(content);
  const subDirectoryMatch = subDirectoryRandom(content);

  if (defaultSpecificMatch) {
    handleSpecificSound(voice, DEFAULT_SPECIFIC_DIRECTORY, defaultSpecificMatch[1]);
    return;
  }

  if (specificSoundMatch) {
    handleSpecificSound(voice, specificSoundMatch[1], specificSoundMatch[2]);
    return;
  }

  if (subDirectoryMatch) {
    handleSubDirectoryRandom(voice, subDirectoryMatch[1], subDirectoryMatch[2]);
    return;
  }

  if (content === "sgc") {
    playSound(
      voice,
      "https://storage.cloud.google.com/bot-ha-llegado-wallace-sounds/sounds/age2/10.mp3?authuser=2&supportedpurview=project");
  }
});

bot.login(process.env.BOT_AGE_TOKEN).catch(error => console.log(error));