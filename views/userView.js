/* function userView(user) {
    return `userId : ${user.id}, userName : ${user.username}`;
}
 */
function userView(user, navbar="") {
    return `
    ${navbar}
    Bienvenue ${user.username} ! <br><br>
    <button onclick="window.location.href='/EditLogin'">Modifier mon compte</button>
    `;
}




module.exports = userView