const User = require('../models/User');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');
const db = require('./db/db');


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

/* function traiteRegister(req, res) {
    const { username, password } = req.body;
    if(username!=="" && password !== ""){
    res.cookie('username', username, { maxAge: 900000, httpOnly: true });
    res.cookie('password', password, { maxAge: 900000, httpOnly: true });
    res.send('Compte créé avec succès');
    } else{
        res.send("Le compte n'a pu être créé, Veuillez réessayer")
    }
}
 *///poiur récup le cookie
//if(username === req.cookies.username && password === req.cookies.password)

// VERSION BDD
function traiteRegister(){
    const newUser = new User(username, password);
    const query = `INSERT INTO users(username, password) VALUES (?,?)`;
    db.run(query,[newUser.username, newUser.password], function(err){
        if(err){
            console.error("register échoué :", err.message);
            res.send('ERROR');
        } else {
            console.log("user succes :" , newUser);
        }
    });
}




module.exports = {getUser, showLogin, traiteLogin, showRegister, traiteRegister}