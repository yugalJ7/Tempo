const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currentweather")
    .setDescription("Provide Information about current weather of city")
    .addStringOption((option) =>
      option.setName("city").setDescription("Enter city name").setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("city");
    const response =
      await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${query}&aqi=yes
`);
    const weatherInfo = await response.data;
    console.log(weatherInfo);
    const { location, current } = weatherInfo;
    await interaction.deferReply();

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${query},${location.country}`)
      .setDescription(`Weather information in ${query}`)
      .setThumbnail(`https:${current.condition.icon}`)
      .addFields(
        { name: "Current Weather", value: `${current.temp_c}°C` },
        {
          name: "Description",
          value: `${current.condition.text}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B", inline: true },
        {
          name: `Wind Speed(kph)`,
          value: `${current.wind_kph}`,
          inline: true,
        }
      );
    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
