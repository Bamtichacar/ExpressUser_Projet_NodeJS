const User = require('../models/User');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');
const db = require('../db/db'); // on importe la bdd
const bcrypt = require('bcrypt');



function getUser(req, res) {
    const user = new User(1, "Tintin");
    res.end(userView(user));
}

function showLogin(req, res) {
    res.send(loginView());
}
// VERSION SANS LE HACHAGE DU MDP
/* function traiteLogin(req, res) {
    const {username, password} = req.body;
    if(username === "admin" && password === "password") {
        res.send("Bienvenue");
    }else{
        res.send("Error");
    }
}

 */
// VERSION AVEC LE HACHAGE DES MDP
function traiteLogin(req, res) {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            res.send("Bienvenue");
        } else {
            res.send("Error");
        }
    });
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

// VERSION BDD mais dans cette version les utilisateurs peuvent avoir les mm noms et mdp
/* function traiteRegister(req, res){
    const { username, password } = req.body; // Récupérer les données du formulaire
    if (!username || !password) {
        // Vérifie si les champs sont remplis
        return res.send("Veuillez remplir tous les champs.");
    }
    const newUser = new User(username, password);
    const query = `INSERT INTO users(username, password) VALUES (?,?)`;
    db.run(query,[newUser.username, newUser.password], function(err){
        if(err){
            console.error("register échoué :", err.message);
            return res.send('ERROR');
        } else {
            console.log("user succes :" , newUser);
        }
    });
}
 */

// ON NE PEUT PAS LE FAIRE ICI CAR C EST UNE BDD, IL FAUT PASSER PAR LES REQUETES
/* function traiteRegister(req, res){
    const { username, password } = req.body; // Récupérer les données du formulaire
    if (!username || !password) {
        // Vérifie si les champs sont remplis
        return res.send("Veuillez remplir tous les champs.");
    }
    const newUser = new User(username, password);
    const objetRecherche = {username : newUser.username, password : newUser.password};
    const existe = db.some(obj =>(objetRecherche.username ? obj.username===objetRecherche.username : true) && (objetRecherche.password ? obj.password === objetRecherche.password : true));
    console.log(existe); // renvoie true si il existe déjà
    if(existe) {
        return res.send("Vous avez déjà un compte, veuillez vous authentifier");
    } else {
        const query = `INSERT INTO users(username, password) VALUES (?,?)`;
        db.run(query,[newUser.username, newUser.password], function(err){
            if(err){
                console.error("register échoué :", err.message);
                return res.send('ERROR');
            } else {
                console.log("user succes :" , newUser);
            }
        
        });
    }
}
 */

// DANS CETTE VERSION ON VERIF DOUBLON UTILISATEUR MAIS ON NE HACHE PAS LE MDP
/* function traiteRegister(req, res) {
    const { username, password } = req.body; // Récupére les données du formulaire
    if (!username || !password) {            // Vérifie si les champs sont remplis
        return res.send("Veuillez remplir tous les champs.");
    }

    const newUser = new User(username, password);
    const queryExist = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(queryExist, [username, password], (err, row) => {    //Explication de row : Dans le contexte de la méthode db.get, row représente la ligne de résultat retournée par la requête SQL. Si un utilisateur correspondant aux critères de la requête est trouvé, row contiendra les données de cet utilisateur. Sinon, row sera undefined.
        if (err) {
            console.error("Erreur lors de la vérification :", err.message);
            return res.send("Erreur interne du serveur.");
        }
        if (row) {
            // L'utilisateur existe déjà
            return res.send("Vous avez déjà un compte, veuillez vous authentifier.");
        }
        // Insère le nouvel utilisateur
        const queryInsert = `INSERT INTO users(username, password) VALUES (?, ?)`;
        db.run(queryInsert, [newUser.username, newUser.password], function (err) {
            if (err) {
                console.error("register échoué : Erreur lors de l'enregistrement :", err.message);
                return res.send( 'ERROR : Erreur lors de la création du compte.');
            }
            console.log("user succes :" , newUser, " Utilisateur créé avec succès :", username);
            res.send("Compte créé avec succès."); // masquer si on le désire
        });
    });
}
 */

// DANS CETTE VERSION ON VERIF LES DOUBLON UTILISATEUR ET ON HACHE LE MDP
function traiteRegister(req, res) {
    const { username, password } = req.body; // Récupére les données du formulaire
    if (!username || !password) {            // Vérifie si les champs sont remplis
        return res.send("Veuillez remplir tous les champs.");
    } else {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hachage du mot de passe avec un salt de 10
        const newUser = new User(username, hashedPassword);
        const queryExist = `SELECT * FROM users WHERE username = ? `;    //vérifie si un utilisateur avec le même nom d'utilisateur existe.
        db.get(queryExist, [username], (err, row) => {     // on vérifie uniquement le nom d utilisateur
            //Explication de row : Dans le contexte de la méthode db.get, row représente la ligne de résultat retournée par la requête SQL. Si un utilisateur correspondant aux critères de la requête est trouvé, row contiendra les données de cet utilisateur. Sinon, row sera undefined.
            if (err) {
                console.error("Erreur lors de la vérification :", err.message);
                return res.send("ERROR : Erreur interne du serveur.");
            }
            else if (row) {    // L'utilisateur existe déjà, 
                if (bcrypt.compareSync(password, row.password)) {  // on vérifie le mot de passe
                    console.log("Compte déjà existant, authentification requise");
                    return res.send("Vous avez déjà un compte, veuillez vous authentifier.");
                } else {  // Le nom d'utilisateur existe mais le mot de passe est différent
                    
                    console.log("Nom d'utilisateur déjà pris.");
                    return res.send("Nom d'utilisateur déjà pris, veuillez en choisir un autre.");
                }
            } else {
            // Insère le nouvel utilisateur
                const queryInsert = `INSERT INTO users(username, password) VALUES (?, ?)`;
                db.run(queryInsert, [newUser.username, newUser.password], function (err) {
                    if (err) {
                        console.error("register échoué : Erreur lors de l'enregistrement :", err.message);
                        return res.send( 'ERROR : Erreur lors de la création du compte.');
                    } else {
                        console.log("user succes :" , newUser, " Utilisateur créé avec succès :", username);
                        res.send("Compte créé avec succès."); // masquer si on le désire
                    } 
                });
            }
        });
    }
}


module.exports = {getUser, showLogin, traiteLogin, showRegister, traiteRegister}