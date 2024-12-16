function logoutView (errorMessage = "") {
    return `<html>
    <body>
    ${res.locals.navbar}

    <form action="/logout" method="get">
        <button type="submit">Logout</button>
    </form>
    </body>
    </html>
    `
}

module.exports = logoutView
//<button onclick="window.location.href='/Register'">Créer un compte</button>
