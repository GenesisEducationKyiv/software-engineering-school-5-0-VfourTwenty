const { join } = require('path');

const homepageController = (req, res) => {
    res.sendFile(join(__dirname, '../public/subscribe.html'));
}

module.exports = { homepageController };