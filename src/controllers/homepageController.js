const { join } = require('path');

class HomepageController {
    static getStaticHomepage(req, res) {
        res.sendFile(join(__dirname, '../public/subscribe.html'));
    }
}

module.exports = HomepageController;