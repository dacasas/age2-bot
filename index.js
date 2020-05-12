const Discord = require('discord.js');
const bot = new Discord.Client();

const CHANNEL_FOR_BOT_COMMANDS = "bot-commands";
const DEFAULT_SPECIFIC_DIRECTORY = "age2";
const BASE_URL = process.env.BASE_URL || "./sounds";
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

const playSound = (voiceChannel, pathToSound) => {
  voiceChannel.join().then(connection => connection.play(pathToSound));
};

// Play specific sound from directory
const handleSpecificSound = (voiceChannel, directory, sound) => {
  playSound(voiceChannel, `${BASE_URL}/${directory}/${sound}.mp3?${URL_FLAGS}`);
};

// Play random sound from directory/subDirectory/...
const handleSubDirectoryRandom = (voiceChannel, directory, subDirectory) => {
  const numberOfSounds = getNumberOfFilesInDirectory(directory, subDirectory);
  const number = Math.ceil(Math.random() * Math.floor(numberOfSounds));
  playSound(voiceChannel, `./sounds/${directory}/${subDirectory}/${number}.wav`);
};

const subDirectoryRandom = content => content.match(/^([a-z]+) ([a-z]+)$/);
const specificSound = content => content.match(/^([a-z]+) ([0-9]+)$/);
const defaultSpecific = content => content.match(/^([0-9]+)$/);

bot.on('message', message => {
  if (message.channel.name != CHANNEL_FOR_BOT_COMMANDS) return;

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) return;

  const content = message.content;
  const defaultSpecificMatch = defaultSpecific(content);
  const specificSoundMatch = specificSound(content);
  const subDirectoryMatch = subDirectoryRandom(content);

  if (defaultSpecificMatch) {
    handleSpecificSound(voiceChannel, DEFAULT_SPECIFIC_DIRECTORY, defaultSpecificMatch[1]);
    return;
  }

  if (specificSoundMatch) {
    handleSpecificSound(voiceChannel, specificSoundMatch[1], specificSoundMatch[2]);
    return;
  }

  if (subDirectoryMatch) {
    handleSubDirectoryRandom(voiceChannel, subDirectoryMatch[1], subDirectoryMatch[2]);
    return;
  }
});

bot.login(process.env.BOT_AGE_TOKEN).catch(error => console.log(error));
