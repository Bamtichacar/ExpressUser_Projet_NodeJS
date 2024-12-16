function deleteView (navbar="") {
    return `<html>
    <body>
    ${navbar}
    <form action = "/delete" method = "POST">
    <input type = "number" name = "id" placeholder = "ID de l'utilisateur à supprimer" required>
    <input type ="text" name = "username" placeholder = "Votre Nom" requiered>
    <button type="submit">SUPPRIMER</button>
    </form>
    </body>
    </html>`
}

module.exports = deleteView
//<input type ="password" name = "password" placeholder = "Mot de passe" required>
