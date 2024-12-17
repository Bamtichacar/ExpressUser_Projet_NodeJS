/* function homeView(user,navbar="") {
    if(user) {
        return `
        ${navbar}
        ACUEIL Bienvenue ${user.username} ! <br><br>
        `;
    } else {
        return `
        ${navbar}
        ACCUEIL Bienvenue ! <br><br>
        `;
    }
}
 */

function homeView(navbar="") {
    return `
    ${navbar}
    ACCUEIL Bienvenue ! <br><br>
    `;
}




module.exports = homeView
//<button onclick="window.location.href='/EditLogin'">Modifier mon compte</button>
