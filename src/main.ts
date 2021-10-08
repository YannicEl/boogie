// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } from '@discordjs/voice';
import { token } from '../config';
import {stream, validate} from "play-dl";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const commandPrefix = '-';

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		console.log("received ping");
		await interaction.reply('Pong!');
	}

	if (commandName === 'play') {
		console.log("received play");

		console.log(JSON.stringify(interaction));

		console.log(interaction.options.getMessage("youtube_url"));

		const youtubeUrl = '' + interaction.options.getString('youtube_url');
		console.log(youtubeUrl);

		let check = await validate(youtubeUrl);
		console.log(check);
		if (check === 'yt_video') {
			console.log("its a yt vid");
		}

		await interaction.reply('no play!');
	}

});

client.on("messageCreate", async function (message) {
	console.log("MESSAGE RECEIVED");

	if (message.author.bot) return;
	if (!message.content.startsWith(commandPrefix)) return;

	const commandBody = message.content.slice(commandPrefix.length);
	const args = commandBody.split(' ');
	// @ts-ignore
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		const timeTaken = Date.now() - message.createdTimestamp;
		message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
	}

	if (command === 'play') {
		if (!message.member?.voice.channel) {
			await message.reply("Connect to a Voice Channel huso");
		}

		if (!args[0]) return;

		let youtubeUrl = '' + args.shift();
		let check = await validate(youtubeUrl);
		console.log(check);

		if (!check) return;
		if (check !== 'yt_video') return;

		console.log("its a yt vid");

		const connection = joinVoiceChannel({
			channelId : message.member?.voice.channel?.id,
			guildId : message.guild?.id,
			adapterCreator: message.guild?.voiceAdapterCreator
		});

		let ytStream = await stream(youtubeUrl);

		let resource = createAudioResource(ytStream.stream, {
			inputType : ytStream.type
		})
		let player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play
			}
		})

		player.play(resource)
		connection.subscribe(player)
	}

});

// Login to Discord with your client's token
client.login(token);
