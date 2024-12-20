const User = require('../models/User');
//const userView = require('../views/userView');
//const loginView = require('../views/loginView');  // pas via ejs
//const registerView = require('../views/registerView');
const db = require('../db/db'); // on importe la bdd
const bcrypt = require('bcrypt');
//const deleteView = require('../views/deleteView');
const dotenv =require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
console.log('clé secrète utilisée : ', secretKey);
//const editLoginView = require('../views/editLoginView');
//const { verifyTokenMiddleware } = require('./middlewares/verifyTokenMiddleware');    faut pas ecrire ainsi
//const adminRegisterView = require('../views/adminRegisterView');
//const modifRoleView = require('../views/modifRoleView');
//const logoutView = require('../views/logoutView');
//const homeView = require('../views/homeView');
const Annonce = require('../models/Annonce');


/* res.render('modifRoleEJSView', { 
    user: row || 'invité',
    navbar: res.locals.navbar || "", // On récupère la valeur de navbar
    errorMessage: "" ,
    validateMessage: ""
});
 */

// SANS EJS
/* function getHome(req,res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(homeView(navbar));
};
 */ 

//AVEC EJS
function getHome(req, res) {
    console.log("Valeur de req.user :", req.user);
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    if (!req.user || !req.user.username) {
        return res.render('homeEJSView', { 
            user: { username: 'invité' },
            navbar: res.locals.navbar || "",
            errorMessage: "Utilisateur non authentifié.",
            validateMessage: ""
        });
    }
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        } else if (row) {
            res.render('homeEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "" ,
                validateMessage: ""
            });            
        } else {
            res.send('Utilisateur non trouvé'); 
        }
    });
}




// SANS EJS AVEC BDD ET TOKEN ET RATTACHEMENT A USERVIEW et avec MIDDLEWARE
/* function getUser(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        } else if (row) {
            res.send(userView(row, navbar));
        } else {
            res.send('Utilisateur non trouvé');
        }
    });
}
 */

// AVEC EJS AVEC BDD ET TOKEN ET RATTACHEMENT A USERVIEW et avec MIDDLEWARE
function getUser(req, res) {
    //const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        } else if (row) {
            //res.send(userView(row, navbar)); // PAS EJS
            res.render('userEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "" ,
                validateMessage: ""
            });            

        } else {
            res.send('Utilisateur non trouvé');
        }
    });
}


// FONCTION SHOWLOGIN INITIALE
/* function showLogin(req, res) {
    res.send(loginView());
}
 */
// METHODE 1 POUR POUVOIR RATTACHER LE MIDDLEWARENAVBAR A LA VUE CAR LES VUES NE LE PRENNENT PAS EN COMPTE
/* function showLogin(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(loginView(navbar));  // On passe navbar à la vue
}
 */

// METHODE 2 AVEC EJS sup de res.send et à la place res.render
function showLogin(req, res) {
    res.render('loginEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
}

/* // VERSION AVEC LE HACHAGE DES MDP et la REDIRECTION VERS LA PAGE UTILISATEUR ET TOKEN
function traiteLogin(req, res) {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            //const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
            const token = jwt.sign(       // assignation token à l'utilisateur
                { username: row.username, role: row.role },  // Récup et ajoute username et rôle
                secretKey,
                { expiresIn: '1h' }
            ); 
            console.log("Token généré :", token); // Vérification du contenu du token ici
            res.cookie('token', token, {httpOnly : true}); // enregistrement du token dans le cookie
            //res.send("Bienvenue");
           return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
        } else {
            return res.send(loginView("Error : Mot de passe ou nom d'utilisateur incorrect")); // ça laissera l'affichage du formulaire
        }
    });
}
 */

// VERSION VIA EJS AVEC LE HACHAGE DES MDP et la REDIRECTION VERS LA PAGE UTILISATEUR ET TOKEN
function traiteLogin(req, res) {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            //const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
            const token = jwt.sign(       // assignation token à l'utilisateur
                { id: row.id, username: row.username, role: row.role },  // Récup et ajoute username et rôle
                secretKey,
                { expiresIn: '1h' }
            ); 
            console.log("Token généré :", token); // Vérification du contenu du token ici
            res.cookie('token', token, {httpOnly : true}); // enregistrement du token dans le cookie
            //res.send("Bienvenue");
           return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
        } else {
            //return res.send(loginView("Error : Mot de passe ou nom d'utilisateur incorrect")); // ça laissera l'affichage du formulaire - PAS AVEC EJS
            return res.render('loginEJSView', { 
                navbar: res.locals.navbar || "", 
                errorMessage: "Erreur : nom d'utilisateur ou mot de passe incorrect.",
                validateMessage: "" 
            });          

        }
    });
}


/* function showRegister(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(registerView(navbar));  // On passe navbar à la vue
}
 */
// METHODE 2 AVEC EJS sup de res.send et à la place res.render
function showRegister(req, res) {
    res.render('registerEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
}




/* // DANS CETTE VERSION ON VERIF LES DOUBLON UTILISATEUR ET ON HACHE LE MDP et REDIRECTION vers la page user apres enregistrement ET TOKEN qui enregistre en plus le role
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
                        console.log("user succes :" , newUser, " Utilisateur créé avec succès :", newUser.username, "role : ", newUser.role);
                        //return res.send("Compte créé avec succès."); // masquer si on le désire
                        //return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
                        //return res.redirect('/user?message=Compte+créé+avec+succès.');
                        //const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
                        const token = jwt.sign(       // assignation token à l'utilisateur
                            { username: newUser.username, role: newUser.role},  // Récup et ajoute username et rôle
                            secretKey,
                            { expiresIn: '1h' }
                        ); 
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
 */

// AVEC EJS DANS CETTE VERSION ON VERIF LES DOUBLON UTILISATEUR ET ON HACHE LE MDP et REDIRECTION vers la page user apres enregistrement ET TOKEN qui enregistre en plus le role
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
                    // return res.send(registerEJSView("Nom d'utilisateur déjà existant, veuillez en choisir un autre.")); // ça laissera l'affichage du formulaire // PAS AVEC EJS
                    return res.render('registerEJSView', { 
                        navbar: res.locals.navbar || "", 
                        errorMessage: "Erreur : nom d'utilisateur ou mot de passe incorrect.",
                        validateMessage: ""   
                    });          
        
                }
            } else {
            // Insère le nouvel utilisateur
                const queryInsert = `INSERT INTO users(username, password) VALUES (?, ?)`;
                db.run(queryInsert, [newUser.username, newUser.password], function (err) {
                    if (err) {
                        console.error("register échoué : Erreur lors de l'enregistrement :", err.message);
                        return res.send( 'ERROR : Erreur lors de la création du compte.');
                    } else {
                        console.log("user succes :" , newUser, " Utilisateur créé avec succès :", newUser.username, "role : ", newUser.role);
                        //return res.send("Compte créé avec succès."); // masquer si on le désire
                        //return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
                        //return res.redirect('/user?message=Compte+créé+avec+succès.');
                        //const token = jwt.sign({username}, secretKey, {expiresIn : '1h'}); // assignation token à l'utilisateur
                        const token = jwt.sign(       // assignation token à l'utilisateur
                            { id: newUser.id, username: newUser.username, role: newUser.role},  // Récup et ajoute username et rôle
                            secretKey,
                            { expiresIn: '1h' }
                        ); 
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

/* //SANS EJS
function adminShowRegister(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(adminRegisterView(navbar));  // On passe navbar à la vue
}
 */
// AVEC EJS
function adminShowRegister(req, res) {
    res.render('adminRegisterEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
}



// CREATION NOUVEL ADMIN ON VERIF LES DOUBLON UTILISATEUR ET ON HACHE LE MDP et REDIRECTION vers la page user apres enregistrement ET TOKEN et MIDDLEWARE ET AJOUT DU ROLE DANS LE TOKEN
function adminTraiteRegister(req, res) {
    const { username, password } = req.body; // Récupére les données du formulaire
    if (!username || !password) {            // Vérifie si les champs sont remplis
        return res.send("Veuillez remplir tous les champs.");
    } else {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hachage du mot de passe avec un salt de 10
        const role = "admin"; // Définit explicitement le rôle
        const newUser = new User(username, hashedPassword, role);
        console.log("Nouvel utilisateur :", newUser); // Ajout du log
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
                    //return res.send(adminRegisterView("Nom d'utilisateur déjà existant, veuillez en choisir un autre.")); // ça laissera l'affichage du formulaire PAS AVEC EJS
                    res.render('adminRegisterEJSView', { 
                        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                        errorMessage: "Nom d'utilisateur déjà existant, veuillez en choisir un autre." ,
                        validateMessage: ""
                    });                    
                }
            } else {
            // Insère le nouvel utilisateur
                const queryInsert = `INSERT INTO users(username, password, role) VALUES (?, ?, ?)`;
                console.log("Insertion de l'utilisateur avec les valeurs :", newUser.username, newUser.password, newUser.role); // Ajout du log
                db.run(queryInsert, [newUser.username, newUser.password, newUser.role], function (err) {
                    if (err) {
                        console.error("register échoué : Erreur lors de l'enregistrement :", err.message);
                        return res.send( 'ERROR : Erreur lors de la création du compte.');
                    } else {
                        console.log("user succes :" , newUser, " ADMIN créé avec succès :", username , "role : ", role);
                        //return res.send("Compte créé avec succès."); // masquer si on le désire
                        //return res.redirect('./user');  // pour rediriger l utilisateur vers la page user
                        //return res.redirect('/user?message=Compte+créé+avec+succès.');
                        const token = jwt.sign(       // assignation token à l'utilisateur
                            { username: newUser.username, role: newUser.role },  // Récup et ajoute username et rôle
                            secretKey,
                            { expiresIn: '1h' }
                        ); 
                        res.cookie('token', token, {httpOnly : true}); // enregistrement du token dans le cookie
                        return res.send(`
                            <p>Compte ADMIN créé avec succès. Redirection en cours...</p>
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

// SANS EJS
/* function showDelete(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(deleteView(navbar));  // On passe navbar à la vue
}
 */

// AVEC EJS
function showDelete(req, res) {
    res.render('deleteEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
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
      
// AVEC EJS AVEC REORGANISATION DES ID DES ELMT SUPPRIMES POUR COMBLER LES TROUS, CA PEUT ETRE FAIT AUSSI MANUELLEMENT
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
                            //return res.send("Compte supprimé et ID réorganisés avec succès.");// PAS EJS
                            res.render('deleteEJSView', { 
                                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                                errorMessage: "" ,
                                validateMessage: "Compte supprimé et ID réorganisés avec succès."
                            });             
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

// SANS EJS VERSION GPT 
/* function showEditLogin(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            return res.send(editLoginView(null, "Utilisateur non trouvé."));
        } else {
        res.send(editLoginView(row, navbar));
        }
    });
}
 */
// AVEC EJS FONCTIONNE AVEC LA PREMIERE FCT
/* function showEditLogin(req, res) {
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            //return res.send(editLoginView(null, "Utilisateur non trouvé.")); // SANS EJS
            res.render('editLoginEJSView', { 
                user: null,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Utilisateur non trouvé" ,
                validateMessage: ""
            });
        
        } else {
        //res.send(editLoginView(row, navbar)); // PAS EJS
        res.render('editLoginEJSView', { 
            user: row,
            navbar: res.locals.navbar || "", // On récupère la valeur de navbar
            errorMessage: "" ,
            validateMessage: ""
        });

        }
    });
}
 */
// AVEC EJS POUR TEST
function showEditLogin(req, res) {
    console.log("req.bodt de show avant select : ",req.body);
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        console.log('req.body de show apres le get : ',req.body);
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            //return res.send(editLoginView(null, "Utilisateur non trouvé.")); // SANS EJS
            res.render('editLoginEJSView', { 
                user: null,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Utilisateur non trouvé" ,
                validateMessage: ""
            });
        
        } else {
            console.log('req.body de show juste avant la vue : ',req.body);
        //res.send(editLoginView(row, navbar)); // PAS EJS
        res.render('editLoginEJSView', { 
            user: row,
            navbar: res.locals.navbar || "", // On récupère la valeur de navbar
            errorMessage: "" ,
            validateMessage: ""
        });

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

/* // SANS EJS VERSION GPT
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
 */

//AVEC EJS FONCTIONNE AVEC SHOW QUI APPELLE DB GET
/* function traiteEditLogin(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            //return res.send(editLoginView(null, "Utilisateur non trouvé.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: null,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Utilisateur non trouvé." ,
                validateMessage: ""
            });
        }

        // Vérifiez le mot de passe actuel
        if (!bcrypt.compareSync(currentPassword, row.password)) {
            //return res.send(editLoginView(row, "Mot de passe actuel incorrect.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Mot de passe actuel incorrect." ,
                validateMessage: ""
            });
        }

        // Vérifiez que les nouveaux mots de passe correspondent
        if (newPassword !== confirmPassword) {
            //return res.send(editLoginView(row, "Les nouveaux mots de passe ne correspondent pas.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Les nouveaux mots de passe ne correspondent pas.",
                validateMessage: "" 
            });
         }

        // Mettez à jour le mot de passe
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE username = ?';

        db.run(updatePasswordQuery, [hashedPassword, req.user.username], function (err) {
            if (err) {
                console.error("Erreur lors de la mise à jour du mot de passe :", err.message);
                //return res.send(editLoginView(row, "Erreur lors de la mise à jour du mot de passe.")); // PAS EJS
                res.render('editLoginEJSView', { 
                    user: row,
                    navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                    errorMessage: "Erreur lors de la mise à jour du mot de passe." ,
                    validateMessage: ""
                });
    
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

 */


//AVEC EJS POUR TESTER
function traiteEditLogin(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // REQUEST.PARAM.ID EN CONSOLELOG
    console.log('req param id de traiteedit : ',req.params.id);
    console.log('req body de traite edit : ',req.body);

/*     const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        if (err || !row) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err ? err.message : "Utilisateur non trouvé");
            //return res.send(editLoginView(null, "Utilisateur non trouvé.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: null,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Utilisateur non trouvé." ,
                validateMessage: ""
            });

 */        // Vérifiez le mot de passe actuel
        if (!bcrypt.compareSync(currentPassword, row.password)) {
            //return res.send(editLoginView(row, "Mot de passe actuel incorrect.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Mot de passe actuel incorrect." ,
                validateMessage: ""
            });
        }

        // Vérifiez que les nouveaux mots de passe correspondent
        if (newPassword !== confirmPassword) {
            //return res.send(editLoginView(row, "Les nouveaux mots de passe ne correspondent pas.")); // PAS EJS
            res.render('editLoginEJSView', { 
                user: row,
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "Les nouveaux mots de passe ne correspondent pas.",
                validateMessage: "" 
            });
         }

        // Mettez à jour le mot de passe
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        const updatePasswordQuery = 'UPDATE users SET password = ? WHERE username = ?';

        db.run(updatePasswordQuery, [hashedPassword, req.user.username], function (err) {
            if (err) {
                console.error("Erreur lors de la mise à jour du mot de passe :", err.message);
                //return res.send(editLoginView(row, "Erreur lors de la mise à jour du mot de passe.")); // PAS EJS
                res.render('editLoginEJSView', { 
                    user: row,
                    navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                    errorMessage: "Erreur lors de la mise à jour du mot de passe." ,
                    validateMessage: ""
                });
    
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
}

// Exemple de modification du rôle d'un utilisateur
/* const updateUserRole = (userId, newRole) => {
    db.run(`UPDATE users SET role = ? WHERE id = ?`, [newRole, userId], function(err) {
        if (err) {
            return console.error("Erreur lors de la mise à jour du rôle : ", err.message);
        }
        console.log(`Rôle de l'utilisateur avec l'ID ${userId} mis à jour en ${newRole}`);
    });
};

// Appel de la fonction pour mettre à jour le rôle
updateUserRole(1, 'admin');
 */

// SANS EJS
/* function showModifRole(req, res) {
    const navbar = res.locals.navbar || ""; // On récupère la valeur de navbar
    res.send(modifRoleView(navbar));  // On passe navbar à la vue
}
 */

//AVEC EJS
function showModifRole(req, res) {
    res.render('modifRoleEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
}


//  SANS EJS MODIF DU ROLE
/* function traiteModifRole(req, res) {
    const { id, username, role} = req.body;
    const queryModifRole = `UPDATE users SET role = ? WHERE id = ? AND username = ?`;
    db.run(queryModifRole, [role,id, username], function (err) {
        if (err) {
            console.error("Erreur lors de l'enregistrement :", err.message);
            return res.send( 'ERROR : Erreur lors de la modification du role.');
        } else {
            console.log(" Role modifié avec succès :", "id :", id, "nom :", username, "role :", role);
            return res.send("Role modifié avec succès."); 
        }
    })
}
 */

// AVEC EJS MODIF ROLE
function traiteModifRole(req, res) {
    const { id, username, role} = req.body;
    const queryModifRole = `UPDATE users SET role = ? WHERE id = ? AND username = ?`;
    db.run(queryModifRole, [role,id, username], function (err) {
        if (err) {
            console.error("Erreur lors de l'enregistrement :", err.message);
            return res.send( 'ERROR : Erreur lors de la modification du role.');
        } else {
            console.log(" Role modifié avec succès :", "id :", id, "nom :", username, "role :", role);
            //return res.send("Role modifié avec succès.");  // PAS EJS
            return res.render('modifRoleEJSView', { 
                navbar: res.locals.navbar || "", // On récupère la valeur de navbar
                errorMessage: "" ,
                validateMessage: "Role modifié avec succès."
            });
        
        }
    })
}

   
      
function showDepotAnnonce(req, res) {
    res.render('depotAnnonceEJSView', { 
        navbar: res.locals.navbar || "", // On récupère la valeur de navbar
        errorMessage: "" ,
        validateMessage: ""
    });
}




function traiteDepotAnnonce(req, res) {
    const { titre, description, prix, image } = req.body;  // Récupére les données du formulaire
    //const user_id = req.user.id; // Récupérer l'ID utilisateur depuis le middleware
    //const user_name = req.user.username; // Nom d'utilisateur depuis le middleware
    //const validatiion = false; // Par défaut, non validé
    //const date_de_soumission = new Date(); // Date actuelle
// Recherche l'utilisateur dans la base de données en utilisant le nom d'utilisateur
    const queryUser = 'SELECT * FROM users WHERE username = ?';
    db.get(queryUser, [req.user.username], (err, row) => {
        console.log(req.user.username);
        if (err) {
            console.error("Erreur lors de la vérification de l'utilisateur :", err.message);
            return res.send('ERROR');
        } else if (row) {
            //const user_id = row.id;
            const user_name = req.user.username;
            const validatiion = false; // Par défaut, non validé
            const date_de_soumission = new Date(); // Date actuelle
            // Vérifie si les champs obligatoires sont remplis
            if (!titre || !description || !prix) {
                return res.render('depotAnnonceEJSView', { 
                    user:row,
                    navbar: res.locals.navbar || "",
                    errorMessage: "Veuillez remplir tous les champs.",
                    validateMessage: ""
                });
            } else {
                // Insère une nouvelle annonce - Créer une instance d'annonce
                const newAnnonce = new Annonce(
                    titre,
                    description,
                    prix,
                    image || null, // Si aucune image n'est fournie, utiliser null
                    validatiion,
                    date_de_soumission,
                    user_name
                );
                // Requête d'insertion dans la base de données
                const queryInsert = `
                    INSERT INTO annonces (titre, description, prix, image, validation, date_de_soumission, user_name) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.run(
                    queryInsert,
                    [
                        newAnnonce.titre,
                        newAnnonce.description,
                        newAnnonce.prix,
                        newAnnonce.image,
                        newAnnonce.validatiion,
                        newAnnonce.date_de_soumission.toISOString(), // Formate en ISO
                        newAnnonce.user_name,
                    ],
                    function (err) {
                        if (err) {
                            console.error("Erreur lors de l'enregistrement de l'annonce :", err.message);
                            return res.render('depotAnnonceEJSView', { 
                                user: row,
                                navbar: res.locals.navbar || "",
                                errorMessage: "Erreur lors de la création de l'annonce.",
                                validateMessage: ""
                            });
                        } else {
                            console.log(
                                "annonces succes : " , newAnnonce,
                                "Annonce créée avec succès : ", newAnnonce.titre,
                                "desciption : ", newAnnonce.description,
                                "prix : ", newAnnonce.prix,
                                "image : ", newAnnonce.image,
                                "validatiion : ", newAnnonce.validatiion, 
                                "date_de_soumission : ", newAnnonce.date_de_soumission, 
                                "user_name : ", newAnnonce.user_name
                            );

                            return res.render('depotAnnonceEJSView', { 
                                user: row,
                                navbar: res.locals.navbar || "",
                                errorMessage: "",
                                validateMessage: "Annonce créée avec succès, en attente de validation. Redirection en cours...",
                                redirect: true // Indique qu'on veut rediriger, on parmetre dans la vue la redirection et le settimeout si on en désire un
                            });
                        }
                    }
                );
            }
        } else {
            return res.send('Utilisateur non trouvé.');
        }
    });
}






module.exports = {getUser, showLogin, traiteLogin, showRegister, traiteRegister, showDelete, traiteDelete, showEditLogin, traiteEditLogin,adminShowRegister, adminTraiteRegister, showModifRole, traiteModifRole, getHome, showDepotAnnonce, traiteDepotAnnonce}