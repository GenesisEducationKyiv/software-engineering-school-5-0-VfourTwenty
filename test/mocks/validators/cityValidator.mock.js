class CityValidatorMock
{
    async validate(city)
    {
        return ["Kyiv", "Lviv", "Odesa", "Dnipro"].includes(city);
    }
}

module.exports = CityValidatorMock;