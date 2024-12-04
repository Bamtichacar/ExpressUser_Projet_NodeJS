const user = require('../models/User');
const userView = require('../views/userView');

function getUser(req, res) {
    const user = new User(1, "Tintin");
    res.end(userView(user));
}

module.exports = getUser