const ISubscriptionRepo = require('../../../domain/interfaces/repositories/subscriptionRepoInterface');
const Result = require('../../../common/utils/result');
const { Subscription } = require('../models');
const metricsKeys = require('../../../common/metrics/metricsKeys');

class SequelizeSubscriptionRepo extends ISubscriptionRepo
{
    constructor(metricsProvider)
    {
        super();
        this.metricsProvider = metricsProvider;
    }

    async createSub(data)
    {
        const start = process.hrtime();
        try
        {
            await Subscription.create(data);
            return new Result(true);
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'create' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'create' });
        }
    }

    async findSub(params)
    {
        const start = process.hrtime();
        try
        {
            const sub = await Subscription.findOne({ where: params });
            if (!sub) return new Result(false, 'SUBSCRIPTION NOT FOUND');
            return new Result(true, null, this.toPlainObject(sub));
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'find' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'find' });
        }
    }

    async confirmSub(token)
    {
        const start = process.hrtime();
        try
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new Result(false, 'SUBSCRIPTION NOT FOUND');
            sub.confirmed = true;
            await sub.save();
            return new Result(true);
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'update' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'update' });
        }
    }

    async deleteSub(token)
    {
        const start = process.hrtime();
        try
        {
            const sub = await Subscription.findOne({ where: { token } });
            if (!sub) return new Result(false, 'SUBSCRIPTION NOT FOUND');
            await sub.destroy();
            return new Result(true);
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'delete' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'delete' });
        }
    }

    async findAllSubs(params)
    {
        const start = process.hrtime();
        try
        {
            const subs = await Subscription.findAll({ where: params });
            if (!subs) return new Result(false, 'failed to find subscriptions by given params');
            const subObjects = subs.map(sub => this.toPlainObject(sub));
            return new Result(true, null, subObjects);
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'findAll' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'findAll' });
        }
    }

    async clear()
    {
        const start = process.hrtime();
        try
        {
            await Subscription.destroy({ where: {}, truncate: true, force: true });
            return new Result(true);
        }
        catch (error)
        {
            this.metricsProvider.incrementCounter(metricsKeys.DB_QUERY_ERRORS, 1, { operation: 'clear' });
            return new Result(false, error.message);
        }
        finally
        {
            const duration = process.hrtime(start);
            const durationInSeconds = duration[0] + duration[1] / 1e9;
            this.metricsProvider.observeHistogram(metricsKeys.DB_QUERY_DURATION, durationInSeconds, { operation: 'clear' });
        }
    }

    toPlainObject(sub)
    {
        return {
            email: sub.email,
            city: sub.city,
            frequency: sub.frequency,
            confirmed: sub.confirmed,
            token: sub.token
        };
    }
}

module.exports = SequelizeSubscriptionRepo;
