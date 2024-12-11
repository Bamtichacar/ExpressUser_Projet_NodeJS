function editLoginView(user, errorMessage = "") {
    return `<html>
    <body>
    <h1>Bienvenue ${user.username} !</h1>
    ${errorMessage ? `<p style="color: red;">${errorMessage}</p>` : ""}
    <h3>Modifier mes Coordonnées</h3>

    <form action = "/Edit/${user.id}" method = "POST">
    <label for="username">Name : </label>
    <input type ="text" name = "username" value="${user.name}">
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




module.exports = editLoginView;