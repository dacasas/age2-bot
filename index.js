const Discord = require('discord.js');
const bot = new Discord.Client();

// This is the token of the bot "Ha llegado Wallace"
const token = process.env.BOT_AGE_TOKEN;

const path = './sounds/';
const extension = '.mp3';

const sayNumber = (voiceChannel, message) => {
	voiceChannel.join()
		.then(connection => connection.play(path + message.content + extension))
		.catch(error => console.log(`ERROR CAPTURADO: ${error}`));
};

const checkChannelConnection = (voiceChannel, message) => {
	if (!voiceChannel) {
		message.channel.send("Tienes que estar en un canal de voz");
		return false;
    }
	return true;
};

const checkNumber = message => +message.content && +message.content < 43;

bot.on('message', message => {
	if (checkNumber(message)) {
		const voiceChannel = message.member.voice.channel;
		if (checkChannelConnection(voiceChannel, message)) {
			sayNumber(voiceChannel, message);
		}
	}
});

bot.login(token);
