function loginView (navbar="",errorMessage = "") {
    return `<html>
    <body>
    ${navbar}
    <h1>Connexion</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <form action = "/login" method = "POST">
    <input type ="text" name = "username" placeholder = "Votre Nom" required>
    <input type ="password" name = "password" placeholder = "Mot de passe">
    <input type = "submit" value = "Envoyer">
    </form>
    <br>
    <br>
    <p>Vous n'avez pas de compte ?</p>
    <button onclick="window.location.href='/Register'">Créer un compte</button>
    </body>
    </html>
    `
}

module.exports = loginView