const express = require('express');
const {getUser,showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin,adminShowRegister, adminTraiteRegister, showModifRole, traiteModifRole, getHome, showDepotAnnonce, traiteDepotAnnonce} = require('./controllers/userController');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const verifyTokenAndRoleMiddleware = require('./middlewares/authentifMiddleware'); 
const navbarMiddleware = require('./middlewares/navbarMiddleware'); 


const app = express();
app.listen(3002,() => {
    console.log("coucou");
});

// Utiliser cookie-parser avant les routes
app.use(cookieParser());

// Utiliser body-parser avant les routes POST
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(express.urlencoded({ extended: true }));
app.use(verifyTokenAndRoleMiddleware()); // Définit req.user
app.use(navbarMiddleware()); // Génère la navbar en fonction de req.user


app.use((req, res, next) => { // Ajout d'un middleware pour vérif que les cookies st bien reçus par le serveur.
    console.log('Cookies:', req.cookies);
    next();
});

// Configuration du moteur de template
app.set('view engine', 'ejs');  // Définit EJS comme moteur de vue
app.set('views', './views'); // Indique où se trouvent les fichiers de vue





// Route publique non sécurisée
app.get('/home', (req,res) => {
    getHome(req, res);
});

// AVEC MIDDLEWARE TOUT EN 1 - Route nécessitant un token pour accéder à l'utilisateur connecté SANS ROLE
app.get('/user', verifyTokenAndRoleMiddleware(), (req, res) => {
    getUser(req, res); // La fonction accède à req.user si le token est valide
});


// Routes publiques LOGIN ET REGISTER - -pas de middleware
app.get('/Login',showLogin);
app.post('/Login', traiteLogin);

app.get('/Register', showRegister);
app.post('/Register', traiteRegister);




// AVEC MIDDLEWARE TOUT EN 1 - SUPPRESSION UTILISATEUR ROUTE SECURISEE AVEC ROLE Autorise uniquement PROP ET admins 
app.get('/Delete', verifyTokenAndRoleMiddleware(['PROPRIETAIRE','admin']), (req, res) => {
    showDelete(req, res); // on aura accès à req.user.username
});
app.post('/Delete', verifyTokenAndRoleMiddleware(['PROPRIETAIRE','admin']), (req, res) => {
    traiteDelete(req, res); // // Modification sécurisée pour l'utilisateur connecté
});

// AVEC MIDDLEWARE TOUT EN 1 - Routes GET ET POST liées à l'édition (modis) du login (protégées) necessite slmt utilisateur connecté
app.get('/EditLogin', verifyTokenAndRoleMiddleware(), (req, res) => {
    showEditLogin(req, res); // Vous aurez accès à req.user.username
});
app.post('/EditLogin/:id', verifyTokenAndRoleMiddleware (), (req, res) => {  // rattache l ide à la route, plus besoin de db get
    traiteEditLogin(req, res); // Modification sécurisée pour l'utilisateur connecté
});

//  AVEC MIDDLEWARE TOUT EN 1 - CREATION D UN OMPTE ADMIN
app.get('/AdminRegister', verifyTokenAndRoleMiddleware(['PROPRIETAIRE']), (req, res) => {
    adminShowRegister(req, res); // on aura accès à req.user.username
});
app.post('/AdminRegister', verifyTokenAndRoleMiddleware(['PROPRIETAIRE']), (req, res) => {
    adminTraiteRegister(req, res); // // Modification sécurisée pour l'utilisateur connecté
});

//  AVEC MIDDLEWARE TOUT EN 1 - MODIF DES ROLES
app.get('/modifRole', verifyTokenAndRoleMiddleware(["PROPRIETAIRE"]), (req, res) => {
    showModifRole(req, res); // on aura accès à req.user.username
});
app.post('/modifRole', verifyTokenAndRoleMiddleware(["PROPRIETAIRE"]), (req, res) => {
    traiteModifRole(req, res); // // Modification sécurisée pour l'utilisateur connecté
});


// GESTION DE LA DECONNECTION LOGOUT : SUPPRESSION DU COOKIE CONTENANT LE TOKEN
app.get('/logout', verifyTokenAndRoleMiddleware(),(req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le token
    res.redirect('/login'); // Redirige vers la page de connexion
});

//  AVEC MIDDLEWARE TOUT EN 1 - DEPOT D UNE ANNONCE
app.get('/DepotAnnonce', verifyTokenAndRoleMiddleware(), (req, res) => {
    showDepotAnnonce(req, res); // on aura accès à req.user.username
});
app.post('/DepotAnnonce', verifyTokenAndRoleMiddleware(), (req, res) => {
    traiteDepotAnnonce(req, res); // // Modification sécurisée pour l'utilisateur connecté
});
