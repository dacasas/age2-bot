const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI();

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

const CHANNEL_FOR_BOT_COMMANDS = process.env.CHANNEL_FOR_BOT_COMMANDS || "bot-commands";
const DEFAULT_SPECIFIC_DIRECTORY = process.env.DEFAULT_SPECIFIC_DIRECTORY || "age2";
const USE_BUCKET = process.env.USE_GC_BUCKET == "true" || false;

const BASE_URL = USE_BUCKET ? process.env.GC_BUCKET_BASE_URL : path.join(__dirname, "sounds");

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
  playSound(voice, path.join(BASE_URL, directory, `${sound}.mp3`));
};

// Play random sound from directory/subDirectory/...
const handleSubDirectoryRandom = (voice, directory, subDirectory) => {
  const numberOfSounds = getNumberOfFilesInDirectory(directory, subDirectory);
  const number = Math.ceil(Math.random() * Math.floor(numberOfSounds));
  playSound(voice, path.join(BASE_URL, directory, subDirectory, `${number}.wav`));
};

const sunTzuMatch = content => content.match(/^sunTzu (.+)$/);
const subDirectoryRandom = content => content.match(/^([a-z]+) ([a-z]+)$/);
const specificSound = content => content.match(/^([a-z]+[0-9]?) ([0-9]+)$/);
const defaultSpecific = content => content.match(/^([0-9]+)$/);

bot.on(Events.MessageCreate, async message => {
  if (message.channel.name != CHANNEL_FOR_BOT_COMMANDS) return;

  const voice = message.member.voice;
  if (!voice) return;

  const content = message.content;
  const sunTzu = sunTzuMatch(content);
  const defaultSpecificMatch = defaultSpecific(content);
  const specificSoundMatch = specificSound(content);
  const subDirectoryMatch = subDirectoryRandom(content);

  if (sunTzu) {
    const completion = await openai.chat.completions.create({
      messages: [
          {"role": "system", "content": "You are Sun Tzu, the greatest military general and strategist of all time."},
          {"role": "user", "content": sunTzu[1]},
      ],
      model: "gpt-3.5-turbo",
    });

    message.channel.send(completion.choices[0].message);
    return;
  }

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
});

bot.login(process.env.BOT_AGE_TOKEN).catch(error => console.log(error));