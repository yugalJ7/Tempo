const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();

// Collection - This is used throughout discord.js rather than Arrays for anything that has an ID, for significantly improved performance and ease-of-use.
const { Client, Events, Collection, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// const token = process.env["TOKEN"];
// .commands = to access commands in other files
client.commands = new Collection();

const folderPath = path.join(__dirname, "commands");
console.log("folderPath", folderPath);
const commandFolder = fs.readdirSync(folderPath);

for (const folder of commandFolder) {
  const commandPath = path.join(folderPath, folder);
  console.log("commandPath", commandPath);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    console.log("filePath", filePath);
    const command = require(filePath);
    console.log("command", command);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// guild refer as disocrd server
// GatewayIntentBits ensures that the caches for guilds, channels, and roles are populated and available for internal use
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// below is the event listener for the interactionCreate event that will execute code when application recieves an interaction
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log("interaction", interaction);

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);
