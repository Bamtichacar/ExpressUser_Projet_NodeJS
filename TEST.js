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
                    return res.send(adminRegisterView("Nom d'utilisateur déjà existant, veuillez en choisir un autre.")); // ça laissera l'affichage du formulaire
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
                            { username: row.username, role: row.role },  // Récup et ajoute username et rôle
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

