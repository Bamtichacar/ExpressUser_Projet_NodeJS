function modifRoleView (navbar="") {
    return `<html>
    <body>
    ${navbar}
    <form action = "/modifRole" method = "POST">
    <input type = "number" name = "id" placeholder = "ID de l'utilisateur dont le role est à odifier" required> <br>
    <input type ="text" name = "username" placeholder = "Nom de l'utilisateur dont le role est à modifier" requiered> <br>
    <select name="role" >
        <option value="">--Choisir le role--</option>
        <option value="admin">Admin</option>
        <option value="moderateur">Modérateur</option>
        <option value="user">Utilisateur</option>
    </select> <br>
    <button type="submit">MODIFIER</button>
    </form>
    </body>
    </html>`
}



module.exports = modifRoleView
//<input type ="password" name = "password" placeholder = "Mot de passe" required>
//<input type ="text" name = "role" placeholder = "Nouveau Role" requiered>

//<option value="PROPRIETAIRE">PROPRIETAIRE</option>


