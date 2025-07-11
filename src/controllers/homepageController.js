const { join } = require('path');

class HomepageController
{
    getStaticHomepage(req, res) {
        res.sendFile(join(__dirname, '../public/subscribe.html'));
    }
}

module.exports = HomepageController;