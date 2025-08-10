const baseUrl = 'http://localhost:5001/html';
function buildConfirmedUrl(city = '', frequency = '', token = '') 
{
    const url = new URL(`${baseUrl}/confirmed.html`);
    url.searchParams.set('city', city);
    url.searchParams.set('frequency', frequency);
    url.searchParams.set('token', token);
    return url.toString();
}

function buildUnsubscribedUrl() 
{
    return new URL(`${baseUrl}/unsubscribed.html`).toString();
}

function buildErrorUrl(error = 'Unknown error') 
{
    const errorUrl = new URL(`${baseUrl}/error.html`);
    errorUrl.searchParams.set('error', error);
    return errorUrl.toString();
}

module.exports = {
    buildConfirmedUrl,
    buildUnsubscribedUrl,
    buildErrorUrl,
}; 
