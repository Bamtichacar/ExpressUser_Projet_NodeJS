const User = require('../models/User');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');

function getUser(req, res) {
    const user = new User(1, "Tintin");
    res.end(userView(user));
}

function showLogin(req, res) {
    res.send(loginView());
}

function traiteLogin(req, res) {
    const {username, password} = req.body;
    if(username === "admin" && password === "password") {
        res.send("Bienvenue");
    }else{
        res.send("Error");
    }

    }

function showRegister(req, res) {
    res.send(registerView())
}



module.exports = {getUser, showLogin, traiteLogin, showRegister}