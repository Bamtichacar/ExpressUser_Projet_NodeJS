const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin} = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const app = express();
app.listen(3002,() => {
    console.log("coucou");
});

// Utiliser cookie-parser avant les routes
app.use(cookieParser());

// Utiliser body-parser avant les routes POST
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => { // Ajout d'un middleware pour vérif que les cookies st bien reçus par le serveur.
    console.log('Cookies:', req.cookies);
    next();
});




app.get('/user',(req, res) => {
    getUser(req, res);
})


app.get('/Login',showLogin);
//app.use(bodyParser.urlencoded({extended : true})); // attention la mettre avant celle d apres sinon n aura pas chargé avant de l appeler
app.post('/Login', traiteLogin);

app.get('/Register', showRegister);
//app.use(cookieParser());
app.post('/Register', traiteRegister);

app.get('/Delete', showDelete);
app.post('/Delete', traiteDelete);

/* app.get('/EditLogin', showEditLogin);
app.post('/EditLogin', traiteEditLogin);
 */
app.get('/EditLogin', (req, res) => {
    console.log('Route /EditLogin - Requête reçue');
    showEditLogin(req, res);
});

app.post('/EditLogin', (req, res) => {
    console.log('Route /EditLogin (POST) - Requête reçue');
    traiteEditLogin(req, res);
});

