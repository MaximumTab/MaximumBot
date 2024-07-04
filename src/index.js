const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const TOKEN = fs.readFileSync('token.txt', 'utf8').trim();

client.on(Events.ClientReady, async () => {
    console.log(`${client.user.tag} is ready!`);
    client.user.setActivity('Jordan ist gay');

    const ping = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('This is a ping command!');

    const quote = new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random quote from the quotes channel');

    try {
        await client.application.commands.create(ping);
        await client.application.commands.create(quote);
        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;

    if (interaction.commandName == "ping") {
        interaction.reply("pong");
    }

    if (interaction.commandName == "quote") {
        const quotesChannel = interaction.guild.channels.cache.find(channel => channel.name === "quotes");
        if (!quotesChannel) {
            interaction.reply("Quotes channel not found!");
            return;
        }

        const messages = await quotesChannel.messages.fetch({ limit: 100 });
        const quoteMessages = messages.filter(msg => msg.content.includes('"'));
        
        if (quoteMessages.size === 0) {
            interaction.reply("No quotes found with the `\"` character!");
            return;
        }

        const randomQuote = quoteMessages.random();
        interaction.reply(randomQuote.content);
    }
});

client.login(TOKEN);
