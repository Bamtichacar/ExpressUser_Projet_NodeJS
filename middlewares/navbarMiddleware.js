// Middleware pour générer et injecter la navbar dans chaque réponse
function navbarMiddleware() {
    return function (req, res, next) {
    const token = req.cookies.token; // Vérifie si un utilisateur est connecté

    // Crée la navbar dynamique
    res.locals.navbar = `
        <nav style="background-color: #333; padding: 10px; color: white;">
            <a href="/home" style="color: white; margin-right: 10px;">Accueil</a>
    `;

    if (token) {
        const userRole = req.user.role || 'guest'; // Récupère le rôle depuis les cookies ou "guest" par défaut
        console.log("role dans navbar :", userRole, "token :", token);
    
        res.locals.navbar += `
            <a href="/user" style="color: white; margin-right: 10px;">Mon compte</a>
            <a href="/EditLogin" style="color: white; margin-right: 10px;">Modifier mon mot de passe</a>
        `;
        if (userRole === 'admin') {
            res.locals.navbar += `
            <a href="/Delete" style="color: white; margin-right: 10px;">Supprimer un utilisateur</a>
            `;
        } else if (userRole === 'PROPRIETAIRE') {
            res.locals.navbar += `
            <a href="/Delete" style="color: white; margin-right: 10px;">Supprimer un utilisateur</a>
            <a href="/AdminRegister" style="color: white; margin-right: 10px;">Créer un compte admin</a>
            <a href="/ModifRole" style="color: white; margin-right: 10px;">Modifier un role</a>
            `;
        }
        res.locals.navbar += `
        <a href="/logout" style="color: white;">Déconnexion</a>
        `;

    } else {
        res.locals.navbar += `
            <a href="/login" style="color: white; margin-right: 10px;">Connexion</a>
            <a href="/register" style="color: white;">Inscription</a>
        `;
    }
    res.locals.navbar += `</nav>`;
    //console.log(res.locals.navbar); // Vérification de la navbar générée
    console.log("Rôle de l'utilisateur dans navbarMiddleware :", req.user?.role);
    next(); // Continue vers la prochaine middleware ou route
}}


module.exports = navbarMiddleware