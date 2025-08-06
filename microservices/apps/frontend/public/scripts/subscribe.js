async function loadConfig() {
    const res = await fetch(`/config.json`);
    if (!res.ok) {
        throw new Error('Could not load config');
    }
    const config = await res.json();
}

async function handleSubscribe(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const city = form.get('city');
    const frequency = form.get('frequency');
    const msg = document.getElementById('message');
    msg.innerText = 'Validating city...';

    msg.innerText = 'Subscribing...';
    const data = JSON.stringify({ email, city, frequency })
    console.log('sending data: ', data);

    const res = await fetch(`/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
    });

    const json = await res.json();
    msg.innerText = json.message || json.error;
}

// Load config first, then set up event listener
loadConfig().then(() => {
    document.getElementById('subscribe-form').addEventListener('submit', handleSubscribe);
}).catch(err => {
    document.getElementById('message').innerText = 'Failed to load config!';
    console.error(err);
});