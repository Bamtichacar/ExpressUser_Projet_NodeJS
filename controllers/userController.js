const User = require('../models/User');
const userView = require('../views/userView');
const loginView = require('../views/loginView');
const registerView = require('../views/registerView');
const db = require('../db/db'); // on importe la bdd
const bcrypt = require('bcrypt');
const deleteView = require('../views/deleteView');
const dotenv =require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
console.log('clé secrète utilisée : ', secretKey);
const editLoginView = require('../views/editLoginView');
const { verifyTokenMiddleware } = require('./middlewares/verifyTokenMiddleware');


// AVEC BDD ET TOKEN ET RATTACHEMENT A USERVIEW et avec MIDDLEWARE
function getUser(req, res) {
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
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

// VERSION AVEC LE HACHAGE DES MDP et la REDIRECTION VERS LA PAGE UTILISATEUR ET TOKEN
function traiteLogin(req, res) {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
            console.log("Token généré :", token); // Vérification du contenu du token ici
            res.cookie('token', token, {httpOnly : true}); // enregistrement du token dans le cookie
            //res.send("Bienvenue");
           return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
        } else {
            return res.send(loginView("Error : Mot de passe ou nom d'utilisateur incorrect")); // ça laissera l'affichage du formulaire
        }
    });
}


function showRegister(req, res) {
    res.send(registerView())
}


// DANS CETTE VERSION ON VERIF LES DOUBLON UTILISATEUR ET ON HACHE LE MDP et REDIRECTION vers la page user apres enregistrement ET TOKEN
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
                        //return res.send("Compte créé avec succès."); // masquer si on le désire
                        //return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
                        //return res.redirect('/user?message=Compte+créé+avec+succès.');
                        const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
                        res.cookie('token', token, {httpOnly : true}); // enregistrement du token dans le cookie
                        return res.send(`
                            <p>Compte créé avec succès. Redirection en cours...</p>
                            <script>
                                setTimeout(function() {
                                    window.location.href = '/user';
                                }, 3000); // Redirige après 3 secondes
                            </script>
                        `);
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

/* function showEditLogin(req, res) {
    res.send(editLoginView());
}
 */

// VERSION GPT
function showEditLogin(req, res) {
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            return res.send(editLoginView(null, "Utilisateur non trouvé."));
        } else {
        res.send(editLoginView(row));
        }
    });
}


  
/*   // VERSION AVEC LE HACHAGE DES MDP et la REDIRECTION VERS LA PAGE EDITLOGIN ET TOKEN
 function traiteEditLogin(req, res) {
    console.log('Requête reçue pour traiteEditLogin');
    const token = req.cookies.token;   // Vérification du token dans la route editlogin
        if(token) {
            console.log("token de traiteeditlogin : ",token);
            jwt.verify(token, secretKey, (err, decoded)=>{
                if(err) {
                    return res.redirect ('/login');
                } else {
                    const queryUser = 'SELECT * FROM users WHERE username = ?';
                    db.get(queryUser, [decoded.username], (err, row) => {
                        if (err) {
                            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
                            return res.send('ERROR');
                        } else if (row) {
                            console.log(row); // Ajoutez cette ligne pour vérifier la structure de l'objet `row`
                            return res.send(editLoginView(row));
                            //res.send(`Bienvenue ${decoded.username} !`);
                        } else {
                            return res.send('Utilisateur non trouvé');
                        }
                    });
                }
            });
        } else {
            console.log("token inexistant sur traiteeditlogin");
            return res.redirect('/login');
        }
    }
 */

/*     function traiteEditLogin(req, res) {
        console.log('Requête reçue pour traiteEditLogin');
        const token = req.cookies.token;
        if (!token) {
            console.log("Token inexistant");
            return res.redirect('/login');
        }
    
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.error("Erreur lors de la vérification du token :", err.message);
                return res.redirect('/login');
            }
            console.log("Token valide et décodage :", decoded);
    
            const queryUser = 'SELECT * FROM users WHERE username = ?';
            db.get(queryUser, [decoded.username], (err, row) => {
                if (err) {
                    console.error("Erreur lors de la requête SQL :", err.message);
                    return res.send('ERROR : Erreur interne.');
                }
                if (!row) {
                    console.log("Utilisateur non trouvé dans la base pour le username :", decoded.username);
                    return res.send(editLoginView(null, "Utilisateur non trouvé."));
                }
                console.log("Utilisateur récupéré :", row);
    
                return res.send(editLoginView(row));
            });
        });
    }
    
 */

// VERSION GPT
function traiteEditLogin(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            return res.send(editLoginView(null, "Utilisateur non trouvé."));
        }

        // Vérifiez le mot de passe actuel
        if (!bcrypt.compareSync(currentPassword, row.password)) {
            return res.send(editLoginView(row, "Mot de passe actuel incorrect."));
        }

        // Vérifiez que les nouveaux mots de passe correspondent
        if (newPassword !== confirmPassword) {
            return res.send(editLoginView(row, "Les nouveaux mots de passe ne correspondent pas."));
        }

        // Mettez à jour le mot de passe
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE username = ?';

        db.run(updatePasswordQuery, [hashedPassword, req.user.username], function (err) {
            if (err) {
                console.error("Erreur lors de la mise à jour du mot de passe :", err.message);
                return res.send(editLoginView(row, "Erreur lors de la mise à jour du mot de passe."));
            }

            res.send(`
                <p>Mot de passe modifié avec succès. Redirection en cours...</p>
                <script>
                    setTimeout(function() {
                        window.location.href = '/User';
                    }, 3000);
                </script>
            `);
        });
    });
}






module.exports = {getUser, showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin}