// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import {
	createAudioPlayer,
	createAudioResource,
	StreamType,
	demuxProbe,
	joinVoiceChannel,
	NoSubscriberBehavior,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	getVoiceConnection,
	AudioPlayer
} from '@discordjs/voice';
import { token } from '../config';
import {stream, validate} from "play-dl";

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const commandPrefix = '-';

// global audioplayer object aka 1 audio stream only hehe
let player: AudioPlayer;

// youtube queue
let playQueue;

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('bot is ready!');
});

client.on("messageCreate", async function (message) {
	console.log("new message received");
	console.log("timestamp: ", +Date.now());
	console.log("author: ", message.author);
	console.log("content: ", message.content);

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
			await message.reply("Connect to a Voice Channel du huso");
		}

		if (!args[0]) return;

		let youtubeUrl = '' + args.shift();
		let check = await validate(youtubeUrl);
		console.log(check);

		if (!check) return;

		if (!(check === 'yt_video' || check === 'yt_playlist')) {
			return;
		}

		if (check === "yt_playlist") {

		}

		console.log("its a yt vid");

		const connection = joinVoiceChannel({
			channelId : message.member?.voice.channel?.id,
			guildId : message.guild?.id,
			adapterCreator: message.guild?.voiceAdapterCreator
		});

		let ytStream = await stream(youtubeUrl);

		let resource = createAudioResource(ytStream.stream, {
			inputType : ytStream.type
		});

		player = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Play
			}
		});

		player.play(resource)
		connection.subscribe(player)
	}

	if (command === 'stop') {
		player.stop();
	}

	if (command === 'pause') {
		player.pause();
	}

	if (command === 'resume') {
		player.unpause();
	}

});

// Login to Discord with your client's token
client.login(token);
