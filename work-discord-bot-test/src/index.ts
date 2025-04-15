import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  CommandInteraction,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.APP_ID) throw new Error("APP_ID is required");
if (!process.env.PUBLIC_KEY) throw new Error("PUBLIC_KEY is required");
if (!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is required");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const commands = [
  new SlashCommandBuilder()
    .setName("tip")
    .setDescription("Tip a user with a specific amount in USDC")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to tip").setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount in USDC to tip")
        .setRequired(true)
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL!;

// Register commands when bot is ready
client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands(client.user!.id), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

// Handle commands and interactions
client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  try {
    if (interaction.isCommand()) {
      await handleCommandInteraction(interaction);
    } else if (interaction.isButton()) {
      console.log("is button");
    }
  } catch (error) {
    console.error("Error handling interaction:", error);

    // Reply with error if possible
    if (interaction.isRepliable() && !interaction.replied) {
      await interaction.reply({
        content: "An error occurred while processing your command.",
        ephemeral: true,
      });
    }
  }
});

// Function to handle command interactions
async function handleCommandInteraction(interaction: CommandInteraction) {
  if (interaction.commandName === "tip") {
    const mentionedUser = interaction.options.get("user")?.user;
    const amount = interaction.options.get("amount")?.value;

    if (!mentionedUser || !amount) {
      await interaction.reply({
        content: "User and amount is required.",
        ephemeral: true,
      });
    }

    const verificationLink = `${CLIENT_URL}/tip?receiver_user_id=${mentionedUser!.id}&receiver_username=${mentionedUser!.globalName}&amount=${amount}`;

    const row = new ActionRowBuilder<ButtonBuilder>();
    row.addComponents(
      new ButtonBuilder()
        .setLabel("Continue")
        .setStyle(ButtonStyle.Link)
        .setURL(verificationLink)
    );

    await interaction.reply({
      content: `**You’re about to tip @${mentionedUser} with ${amount} USDC**\nClick the button below to complete the transaction on our secure website:`,
      components: [row],
      ephemeral: true,
    });
  }
}

app.listen(PORT, () => {
  console.log(`Verification server running on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
