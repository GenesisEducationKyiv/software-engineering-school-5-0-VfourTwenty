class WeatherProviderManagerMock {
    async fetchWeather(city) {
        if (["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city)) {
            return {
                temperature: 22,
                humidity: 60,
                description: "Clear sky"
            };
        } else {
            return null;
        }
    }
}

module.exports = WeatherProviderManagerMock;