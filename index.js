const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin,adminShowRegister, adminTraiteRegister, showModifRole, traiteModifRole} = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const  {verifyTokenMiddleware, checkRoleMiddleware} = require('./middlewares/authentifMiddleware'); 
const verifyTokenAndRoleMiddleware = require('./middlewares/authentifMiddleware'); 



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
// AVEC MIDDLEWARE - Route nécessitant un token pour accéder à l'utilisateur connecté SANS ROLE
/* app.get('/user', verifyTokenMiddleware(), (req, res) => {
    getUser(req, res); // La fonction accède à req.user si le token est valide
});
 */
// AVEC MIDDLEWARE TOUT EN 1 - Route nécessitant un token pour accéder à l'utilisateur connecté SANS ROLE
app.get('/user', verifyTokenAndRoleMiddleware(), (req, res) => {
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
/* app.get('/Delete', showDelete);
app.post('/Delete', traiteDelete);
 */

// AVEC MIDDLEWARE - ROUTE SECURISEE - AVEC ROLE Autorise uniquement les administrateurs
/* app.get('/Delete', checkRoleMiddleware(['admin']), (req, res) => {
    showDelete(req, res); // on aura accès à req.user.username
});

app.post('/Delete', checkRoleMiddleware(['admin']), (req, res) => {
    traiteDelete(req, res); // // Modification sécurisée pour l'utilisateur connecté
});
 */

// AVEC MIDDLEWARE TOUT EN 1 - ROUTE SECURISEE - AVEC ROLE Autorise uniquement les administrateurs
app.get('/Delete', verifyTokenAndRoleMiddleware(['PROPRIETAIRE','admin']), (req, res) => {
    showDelete(req, res); // on aura accès à req.user.username
});

app.post('/Delete', verifyTokenAndRoleMiddleware(['PROPRIETAIRE','admin']), (req, res) => {
    traiteDelete(req, res); // // Modification sécurisée pour l'utilisateur connecté
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

/* // SANS MIDDLEWARE
app.post('/EditLogin', (req, res) => {
    console.log('Route /EditLogin (POST) - Requête reçue');
    traiteEditLogin(req, res);
});
 */


// AVEC MIDDLEWARE - Routes GET ET POST liées à l'édition (modis) du login (protégées)
/* app.get('/EditLogin', verifyTokenMiddleware(), (req, res) => {
    showEditLogin(req, res); // Vous aurez accès à req.user.username
});

app.post('/EditLogin', verifyTokenMiddleware (), (req, res) => {
    traiteEditLogin(req, res); // Modification sécurisée pour l'utilisateur connecté
});
 */

// AVEC MIDDLEWARE TOUT EN 1 - Routes GET ET POST liées à l'édition (modis) du login (protégées) necessite slmt utilisateur connecté
app.get('/EditLogin', verifyTokenAndRoleMiddleware(), (req, res) => {
    showEditLogin(req, res); // Vous aurez accès à req.user.username
});

app.post('/EditLogin', verifyTokenAndRoleMiddleware (), (req, res) => {
    traiteEditLogin(req, res); // Modification sécurisée pour l'utilisateur connecté
});




// CREATION D UN ADMIN AVEC MIDLEWARE 1 ROLE ANCIENNE VERSION
/* app.get('/AdminRegister', verifyTokenMiddleware("admin"), (req, res) =>{
     adminShowRegister(req, res);
});
app.post('/AdminRegister', verifyTokenMiddleware("admin"), (req,res) =>{
    adminTraiteRegister(req,res);
});
 */
/* app.get('/AdminRegister', checkRoleMiddleware(['admin']), (req, res) => {
    adminTraiteRegister(req, res); // on aura accès à req.user.username
});

app.post('/AdminRegister', checkRoleMiddleware(['admin']), (req, res) => {
    adminShowRegister(req, res); // // Modification sécurisée pour l'utilisateur connecté
});
 */

//  AVEC MIDDLEWARE TOUT EN 1 - CREATION D'UN ADMIN
app.get('/modifRole', verifyTokenAndRoleMiddleware(), (req, res) => {
    showModifRole(req, res); // on aura accès à req.user.username
});

app.post('/modifRole', verifyTokenAndRoleMiddleware(), (req, res) => {
    traiteModifRole(req, res); // // Modification sécurisée pour l'utilisateur connecté
});



