console.log("using mocked db models")

class Subscription
{
    static data = [];

    email;
    city;
    frequency;
    confirmed;

    constructor(params)
    {
        this.email = params.email;
        this.city = params.city;
        this.frequency = params.frequency;
        this.confirmed = params.confirmed || false;
    }

    static async create(params) {
        const sub = new Subscription(params);
        this.data.push(sub);
        return sub;
    }

    static async findAll(params = {}) {
        return this.data.filter(entry =>
            entry.frequency === params.where.frequency &&
            entry.confirmed === true
        );
    }
}


class WeatherData
{
    static data = {};

    city;
    temperature;
    humidity;
    description;
    fetchedAt;

    constructor(params) {
        this.city = params.city;
        this.temperature = params.temperature;
        this.humidity = params.humidity;
        this.description = params.description;
        this.fetchedAt = params.fetchedAt ?? new Date();
    }

    static async findByPk(city)
    {
        return this.data[city];
    }

    static async upsert(params)
    {
        this.data[params.city] = new WeatherData(params);
    }

    async toJSON()
    {
        return {
            city: this.city,
            temperature: this.temperature,
            humidity: this.humidity,
            description: this.description.description,
            fetchedAt: this.fetchedAt
        }
    }
}

class WeatherCity
{
    static data = {};

    city;
    hourly_count;
    daily_count;

    constructor(params)
    {
        this.city = params.city;
        this.hourly_count = params.hourly_count;
        this.daily_count = params.daily_count;
    }

    static async findAll(params)
    {
        let matching = [];
        // condition from fetchweather.js
        //    where: {
        //             daily_count: { [Op.gt]: 0 },
        //             hourly_count: 0
        //         }
        if (params.where)
        {
            for (const v of Object.values(this.data))
            {
                if (v.daily_count > 0 && v.hourly_count === 0)
                {
                    matching.push({city: v.city});
                }
            }
        }
        else
        // condition from fetchweather.js
        // {
        //     hourly_count: { [Op.gt]: 0 }
        // }
        {
            for (const v of Object.values(this.data))
            {
                if (v.hourly_count > 0)
                {
                    matching.push({ city: v.city});
                }
            }
        }
        return matching;
    }

    static async findByPk(city)
    {
        return this.data[city];
    }

    static async create(params)
    {
        this.data[params.city] = new WeatherCity(params);
    }

    async save() {console.log('entry updated')}
    async destroy()
    {
        delete WeatherCity.data[this.city];
    }
}

module.exports = { Subscription, WeatherData, WeatherCity }