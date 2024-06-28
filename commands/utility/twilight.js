const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("twilight")
    .setDescription("Provide Information about sunrise, sunset")
    .addStringOption((option) =>
      option.setName("city").setDescription("Enter city name").setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("city");
    const currentDate = new Date().toJSON().slice(0, 10);
    const response =
      await axios.get(`http://api.weatherapi.com/v1/astronomy.json?key=${process.env.WEATHER_API_KEY}&q=${query}&dt=${currentDate}
`);
    const twilightInfo = await response.data;
    console.log(twilightInfo);
    const { location, astronomy } = twilightInfo;
    await interaction.deferReply();

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${location.name},${location.country}`)
      .setDescription(`Sunrise, Sunset in ${location.name}`)
      .addFields(
        {
          name: "Sunrise",
          value: `${astronomy.astro.sunrise}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        {
          name: "Sunset",
          value: `${astronomy.astro.sunset}`,
          inline: true,
        }
      );
    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
