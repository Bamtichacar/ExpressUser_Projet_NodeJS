function adminRegisterView (errorMessage = "") {
    return `<html>
    <body>
    <h1> ADMIN Formulaire d'inscription</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <form action = "/AdminRegister" method = "POST">
    <input type ="text" name = "username" placeholder = "Votre Nom" requiered>
    <input type ="password" name = "password" placeholder = "Mot de passe" required>
    <button type="submit">S'inscrire</button>
    </form>
        <br>
    <br>
    <p>Vous avez déjà un compte ?</p>
    <button onclick="window.location.href='/Login'">Se connecter</button>

    </body>
    </html>`
}

module.exports = adminRegisterView