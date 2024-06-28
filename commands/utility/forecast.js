const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("forecast")
    .setDescription("3 Days forecast of city weather")
    .addStringOption((option) =>
      option.setName("city").setDescription("Enter city name").setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString("city");
    await interaction.deferReply();
    // const currentDate = new Date().toJSON().slice(0, 10);
    const response =
      await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${query}&days=3&aqi=yes&alerts=yes
`);
    const forecastInfo = await response.data;
    console.log(forecastInfo);
    const { location, forecast } = forecastInfo;

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${location.name},${location.country}`)
      .setDescription(`3 Days forecast of ${location.name}`)
      .addFields(
        {
          name: "Today",
          value: "Weather report",
        },
        {
          name: "Max/Min",
          value: `${forecast.forecastday[0].day.maxtemp_c}°C / ${forecast.forecastday[0].day.mintemp_c}°C`,
          inline: true,
        },
        {
          name: "Rain Chance",
          value: `${forecast.forecastday[0].day.daily_chance_of_rain}`,
          inline: true,
        },
        {
          name: "Condition",
          value: `${forecast.forecastday[0].day.condition.text}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" }
      )
      .addFields(
        {
          name: `${forecast.forecastday[1].date}`,
          value: "Weather report",
        },
        {
          name: "Max/Min",
          value: `${forecast.forecastday[1].day.maxtemp_c}°C / ${forecast.forecastday[1].day.mintemp_c}°C`,
          inline: true,
        },
        {
          name: "Rain Chance",
          value: `${forecast.forecastday[1].day.daily_chance_of_rain}`,
          inline: true,
        },
        {
          name: "Condition",
          value: `${forecast.forecastday[1].day.condition.text}`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" }
      )
      .addFields(
        {
          name: `${forecast.forecastday[2].date}`,
          value: "Weather report",
        },
        {
          name: "Max/Min",
          value: `${forecast.forecastday[2].day.maxtemp_c}°C / ${forecast.forecastday[2].day.mintemp_c}°C`,
          inline: true,
        },
        {
          name: "Rain Chance",
          value: `${forecast.forecastday[2].day.daily_chance_of_rain}`,
          inline: true,
        },
        {
          name: "Condition",
          value: `${forecast.forecastday[2].day.condition.text}`,
          inline: true,
        }
      );
    await interaction.editReply({ embeds: [exampleEmbed] });
  },
};
