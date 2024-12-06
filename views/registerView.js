function registerView () {
    return `<html>
    <body>
    <form action = "/register" method = "POST">
    <input type ="text" name = "username" placeholder = "Votre Nom" requiered>
    <input type ="password" name = "password" placeholder = "Mot de passe" required>
    <button type="submit">S'inscrire</button>
    </form>
    </body>
    </html>`
}

module.exports = registerView