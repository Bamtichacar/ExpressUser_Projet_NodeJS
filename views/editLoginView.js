/* function editLoginView(user, errorMessage = "") {
    return `<html>
    <body>
    <h1>Bienvenue ${user.username} !</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <h3>Modifier mes Coordonnées</h3>

    <form action = "/EditLogin/${user.id}" method = "POST">
    <label for="username">Name : </label>
    <input type ="text" name = "username" value="${user.username}">
    <label for="password">Mot de passe : </label>
    <input type ="password" name = "password" placeholder = "Mot de passe">
    <input type = "submit" value = "Valider">
    </form>
    <br>
    <br>
    <button onclick="window.location.href='/User'">Annuler</button>
    </body>
    </html>`
}
 */


/* function editLoginView(user, errorMessage = "") {
    return `<html>
    <body>
    <h1>Bienvenue ${user.username} !</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <h3>Modifier mes Coordonnées</h3>

    <form action="/EditLogin" method="POST">
    <label for="username">Nom d'utilisateur : </label>
    <input type="text" name="username" value="${user.username}">
    <label for="password">Mot de passe : </label>
    <input type="password" name="password" placeholder="Mot de passe">
    <input type="submit" value="Valider">
    </form>
    <br>
    <br>
    <button onclick="window.location.href='/User'">Annuler</button>
    </body>
    </html>`;
}
 */


/* function editLoginView(user, errorMessage = "") {
    if (!user || !user.username) {
        return `<html>
        <body>
            <h1>Erreur : Utilisateur non trouvé</h1>
            <p>${errorMessage || "Impossible de charger les informations utilisateur."}</p>
        </body>
        </html>`;
    }

    return `<html>
    <body>
    <h1>Bienvenue ${user.username} !</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <h3>Modifier mes Coordonnées</h3>

    <form action="/EditLogin" method="POST">
    <label for="username">Nom d'utilisateur : </label>
    <input type="text" name="username" value="${user.username}">
    <label for="password">Mot de passe : </label>
    <input type="password" name="password" placeholder="Mot de passe">
    <input type="submit" value="Valider">
    </form>
    <br>
    <br>
    <button onclick="window.location.href='/User'">Annuler</button>
    </body>
    </html>`;
}
 */


// VERSION GPT 
function editLoginView(user, navbar="",errorMessage = "") {
    return `
    <html>
    <body>
        ${navbar}
        <h1>Bienvenue ${user.username} !</h1>
        ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
        <h3>Modifier mon mot de passe</h3>
        <form action="/EditLogin" method="POST">
            <label for="currentPassword">Mot de passe actuel : </label>
            <input type="password" name="currentPassword" placeholder="Mot de passe actuel" required>
            <br>
            <label for="newPassword">Nouveau mot de passe : </label>
            <input type="password" name="newPassword" placeholder="Nouveau mot de passe" required>
            <br>
            <label for="confirmPassword">Confirmer le mot de passe : </label>
            <input type="password" name="confirmPassword" placeholder="Confirmez le mot de passe" required>
            <br><br>
            <input type="submit" value="Modifier le mot de passe">
        </form>
        <br>
        <button onclick="window.location.href='/User'">Annuler</button>
    </body>
    </html>`;
}

module.exports = editLoginView;



