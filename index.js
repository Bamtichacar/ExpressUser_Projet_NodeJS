const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete} = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');



const app = express();
app.listen(3002,() => {
    console.log("coucou");
});

//app.use(express.urlencoded({ extended: true }));

app.get('/user',(req, res) => {
    getUser(req, res);
})

app.get('/Login',showLogin);

app.use(bodyParser.urlencoded({extended : true})); // attention la mettre avant celle d apres sinon n aura pas chargé avant de l appeler

app.post('/Login', traiteLogin);

app.get('/Register', showRegister);

app.use(cookieParser());

app.post('/Register', traiteRegister);

app.get('/Delete', showDelete);


app.post('/Delete', traiteDelete);

