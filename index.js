const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin} = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { verifyTokenMiddleware } = require('./middlewares/verifyTokenMiddleware'); 


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



// SANS MIDDLEWARE
/* app.get('/user',(req, res) => {
    getUser(req, res);
})
 */
// AVEC MIDDLEWARE - Route nécessitant un token pour accéder à l'utilisateur connecté
app.get('/user', verifyTokenMiddleware, (req, res) => {
    getUser(req, res); // La fonction accède à req.user si le token est valide
});

// Routes publiques LOGIN ET REGISTER - -pas de middleware
app.get('/Login',showLogin);
//app.use(bodyParser.urlencoded({extended : true})); // attention la mettre avant celle d apres sinon n aura pas chargé avant de l appeler
app.post('/Login', traiteLogin);

app.get('/Register', showRegister);
//app.use(cookieParser());
app.post('/Register', traiteRegister);


// SANS MIDDLEWARE
app.get('/Delete', showDelete);
app.post('/Delete', traiteDelete);

// AVEC MIDDLEWARE - ROUTE SECURISEE
app.get('/Delete', verifyTokenMiddleware, (req, res) => {
    showDelete(req, res); // Vous aurez accès à req.user.username
});

app.post('/Delete', verifyTokenMiddleware, (req, res) => {
    traiteDelete(req, res); // Modification sécurisée pour l'utilisateur connecté
});




/* app.get('/EditLogin', showEditLogin);
app.post('/EditLogin', traiteEditLogin);
 */
// SANS MIDDLEWARE
/* app.get('/EditLogin', (req, res) => {
    console.log('Route /EditLogin - Requête reçue');
    showEditLogin(req, res);
});
 */

// AVEC MIDDLEWARE - Routes GET ET POST liées à l'édition (modis) du login (protégées)
app.get('/EditLogin', verifyTokenMiddleware, (req, res) => {
    showEditLogin(req, res); // Vous aurez accès à req.user.username
});

/* // SANS MIDDLEWARE
app.post('/EditLogin', (req, res) => {
    console.log('Route /EditLogin (POST) - Requête reçue');
    traiteEditLogin(req, res);
});
 */

// AVEC MIDDLEWARE
app.post('/EditLogin', verifyTokenMiddleware, (req, res) => {
    traiteEditLogin(req, res); // Modification sécurisée pour l'utilisateur connecté
});