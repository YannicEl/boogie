import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';
import { clientId, guildId, token } from '../config';

const pingCommand = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies with Pong!');

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: [pingCommand],
		});

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
