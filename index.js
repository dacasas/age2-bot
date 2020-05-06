const Discord = require('discord.js');
const bot = new Discord.Client();

const L4D2_INFECTED = {
  boomer: 32,
  charger: 9,
  hunter: 21,
  jockey: 31,
  smoker: 22,
  spitter: 15,
  tank: 16,
  witch: 13,
};

// This is the token of the bot "Ha llegado Wallace"
const token = process.env.BOT_AGE_TOKEN;

const handleAge2Message = (voiceChannel, content) => {
  voiceChannel.join()
		.then(connection => connection.play(`./sounds/age2/${content}.mp3`))
		.catch(error => console.log(`ERROR EN ON PLAY: ${error}`));
};

const handleL4d2Message = (voiceChannel, content) => {
  const infectedName = l4d2Message(content)[0];
  const numberOfSounds = L4D2_INFECTED[infectedName];
  if (numberOfSounds) {
    const number = Math.ceil(Math.random() * Math.floor(numberOfSounds));
    voiceChannel.join()
      .then(connection => connection.play(`./sounds/l4d2/${infectedName}/${number}.wav`))
      .catch(error => console.log(`ERROR EN ON PLAY: ${error}`));
  }
};

const l4d2Message = content => content.match(/([a-zA-Z]*)/);
const age2Message = content => isNumeric(content);

const isNumeric = content => !isNaN(content);

bot.on('message', message => {
  const content = message.content;
	if (isNumeric(content) || l4d2Message(content)) {
    const voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
      if (age2Message(content)) handleAge2Message(voiceChannel, content);
      if (l4d2Message(content)) handleL4d2Message(voiceChannel, content);
    } else  {
      message.channel.send("Tienes que estar en un canal de voz");
    }
	}
});

bot.login(token).catch(error => console.log(`ERROR EN LOGIN: ${error}`));
