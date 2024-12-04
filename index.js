const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister} = require('./controllers/userController');
const bodyParser = require('body-parser');

const app = express();
app.listen(3002,() => {
    console.log("coucou");
});

app.get('/user',(req, res) => {
    getUser(req, res);
})

app.get('/Login',showLogin);

app.use(bodyParser.urlencoded({extended : true})); // attention la mettre avant celle d apres sinon n aura pas chargé avant de l appeler

app.post('/Login', traiteLogin);

app.get('/Register', showRegister);
