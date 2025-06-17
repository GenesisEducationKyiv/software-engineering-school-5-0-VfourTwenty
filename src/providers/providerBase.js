class IProvider
{
    get name() {
        throw new Error('Property "name" must be implemented by subclass');
    }

    async ping() {
        throw new Error("ping() must be implemented by subclass");
    }
}

module.exports = IProvider;