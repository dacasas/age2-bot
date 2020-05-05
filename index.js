const Discord = require('discord.js');
const bot = new Discord.Client();

// This is the token of the bot "Ha llegado Wallace"
const token = process.env.BOT_AGE_TOKEN;

const sayNumber = (voiceChannel, content) => {
	voiceChannel.join()
		.then(connection => connection.play(`./sounds/${content}.mp3`))
		.catch(error => console.log(`ERROR EN ON PLAY: ${error}`));
};

const isNumeric = content => !isNaN(content);

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
