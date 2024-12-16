function homeView(user,navbar="") {
    if(user) {
        return `
        ${navbar}
        Bienvenue ${user.username} ! <br><br>
        `;
    } else {
        return `
        ${navbar}
        Bienvenue ! <br><br>
        `;
    }
}




module.exports = homeView
//<button onclick="window.location.href='/EditLogin'">Modifier mon compte</button>
