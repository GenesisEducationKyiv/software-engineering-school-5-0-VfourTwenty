async function handleSubscribe(e)
{
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const city = form.get('city');
    const frequency = form.get('frequency');
    const msg = document.getElementById('message');
    msg.innerText = 'Validating city...';

    msg.innerText = 'Subscribing...';
    const data = JSON.stringify({ email, city, frequency });
    console.log('sending data: ', data);

    try 
    {
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data
        });

        const json = await res.json();
        msg.innerText = json.message || json.error;
    }
    catch (err) 
    {
        msg.innerText = 'Failed to subscribe!';
        console.error(err);
    }
}

// Attach the event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', function() 
{
    document.getElementById('subscribe-form').addEventListener('submit', handleSubscribe);
});
