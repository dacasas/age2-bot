const Discord = require('discord.js');
const bot = new Discord.Client();

// This is the token of the bot "Ha llegado Wallace"
const token = process.env.BOT_AGE_TOKEN;

const path = './sounds/';
const extension = '.mp3';

const sayNumber = (voiceChannel, content) => {
	voiceChannel.join()
		.then(connection => connection.play(path + content + extension))
		.catch(error => console.log(`ERROR EN ON PLAY: ${error}`));
};

const isNumeric = content => !isNan(content);

bot.on('message', message => {
  const content = message.content;
	if (isNumeric(content)) {
		const voiceChannel = message.member.voice.channel;
		if (voiceChannel) {
			sayNumber(voiceChannel, content);
		} else {
      message.channel.send("Tienes que estar en un canal de voz");
    }
	}
});

bot.login(token).catch(error => console.log(`ERROR EN LOGIN: ${error}`));
