async function retry(func, retries, delay) 
{
    let lastError;
    for (let attempt = 0; attempt < retries; attempt++) 
    {
        try 
        {
            return await func();
        }
        catch (err) 
        {
            lastError = err;
            if (attempt < retries - 1) 
            {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    throw lastError;
}

module.exports = retry;
