const User = require('../models/User');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');
const db = require('../db/db'); // on importe la bdd
const bcrypt = require('bcrypt');
const deleteView = require('../views/deleteView');


// SANS BDD
/* function getUser(req, res) {
    const user = new User(1, "Tintin");
    res.end(userView(user));
}
 */

// AVEC BDD
function getUser(req, res) {
    //const id = req.body.id;
    //const username = req.body.username;
    //POUR VERIF DU CODE
    console.log('Requête reçue :', req.body);

    const { id, username } = req.body || {};

    if (!id || !username) {
        return res.status(400).send('Requête invalide : ID ou nom d\'utilisateur manquant');
    }
    // FIN POUR VERIF DU CODE
    const queryUser = 'SELECT * FROM users WHERE id = ? AND username = ?';
    db.get(queryUser, [id, username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        } else if (row) {
            res.send(userView(row));
        } else {
            res.send('Utilisateur non trouvé');
        }
    });
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
            res.send(loginView("Error : Mot de passe ou nom d'utilisateur incorrect")); // ça laissera l'affichage du formulaire
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
                console.log("Utilisateur trouvé :", row); // pour voir pb dans le code
                if (bcrypt.compareSync(password, row.password)) {  // on vérifie le mot de passe
                    console.log("Compte déjà existant, authentification requise");
                    return res.send(`
                        <p>Vous avez déjà un compte, veuillez vous authentifier.</p>
                        <button onclick="window.location.href='/login'">Aller à la page de connexion</button>
                    `);
                } else {  // Le nom d'utilisateur existe mais le mot de passe est différent
                    console.log("Nom d'utilisateur déjà pris.");
                    return res.send(registerView("Nom d'utilisateur déjà existant, veuillez en choisir un autre.")); // ça laissera l'affichage du formulaire
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
                        return res.send("Compte créé avec succès."); // masquer si on le désire
                    } 
                });
            }
        });
    }
}


function showDelete(req, res) {
    res.send(deleteView());
}

//  SANS REORGANISATION DES ID PAR RAPPORT AUX ELEMENTS SUPPRIMES
/* function traiteDelete(req, res) {
    const { id, username} = req.body;
    db.get('SELECT * FROM users WHERE id = ? AND username = ?', [id, username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if(!row){
            return res.send('Utilisateur non trouvé');
        }
        const queryDelete = `DELETE FROM users WHERE id = ? AND username = ?`;
        db.run(queryDelete, [id, username], function (err) {
            if (err) {
                console.error("Erreur lors de l'enregistrement :", err.message);
                return res.send( 'ERROR : Erreur lors de la suppression du compte.');
            } else {
                console.log(" Utilisateur supprimé avec succès :", "id :", id, "nom :", username);
                return res.send("Compte supprimé avec succès."); 
            }
        })
    })
}
 */    
      
// AVEC REORGANISATION DES ID DES ELMT SUPPRIMES POUR COMBLER LES TROUS, CA PEUT ETRE FAIT AUSSI MANUELLEMENT
function traiteDelete(req, res) {
    const { id, username} = req.body;
    db.get('SELECT * FROM users WHERE id = ? AND username = ?', [id, username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if(!row){
            return res.send('Utilisateur non trouvé');
        }
        const queryDelete = `DELETE FROM users WHERE id = ? AND username = ?`;
        db.run(queryDelete, [id, username], function (err) {
            if (err) {
                console.error("Erreur lors de l'enregistrement :", err.message);
                return res.send( 'ERROR : Erreur lors de la suppression du compte.');
            } else {
                console.log(" Utilisateur supprimé avec succès :", "id :", id, "nom :", username);
                //return res.send("Compte supprimé avec succès."); 
                // Réorganisation des ID
                db.serialize(() => {
                    db.run("UPDATE users SET id = id - 1 WHERE id > ?", [id], function(err) {
                        if (err) {
                            console.error("Erreur lors de la réorganisation des ID :", err.message);
                            return res.send('ERROR : Erreur lors de la réorganisation des ID.');
                        }
                        console.log(`ID(s) mis à jour ${this.changes}`);
                        
                        // Réinitialiser l'auto-incrémentation
                        db.run("UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM users) WHERE name = 'users'", function(err) {
                            if (err) {
                                console.error("Erreur lors de la réinitialisation de l'auto-incrémentation :", err.message);
                                return res.send('ERROR : Erreur lors de la réinitialisation de l\'auto-incrémentation.');
                            }
                            console.log("Auto-increment réinitialisé");
                            return res.send("Compte supprimé et ID réorganisés avec succès.");
                        });
                    });
                });
            }
        });
    });
}




module.exports = {getUser, showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete}