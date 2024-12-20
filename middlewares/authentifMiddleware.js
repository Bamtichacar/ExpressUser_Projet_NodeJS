const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; // s'assurer d'avoir une clé secrète dans .env


// middleware pour verifier le token avec plusieurs roles pour 1 même route possible
function verifyTokenAndRoleMiddleware(allowedRoles) {
    return function (req, res, next) {
        const token = req.cookies.token; // Récupère le token dans les cookies
        const publicRoutes = ['/home', '/login', '/register']; // Liste des routes publiques
/*         if (publicRoutes.includes(req.path)) {
            req.user = null; // Définit req.user à null pour les routes publiques
            return next(); // Ignore la vérification pour les routes publiques - // Passe à la route suivante
        }
 */        if (!token) {   // Pas de token pour une route protégée
                if (publicRoutes.includes(req.path)) {
                    req.user = null; // Définit req.user à null pour les routes publiques
                    return next(); // Ignore la vérification pour les routes publiques - // Passe à la route suivante
                } else {
                    //req.user = null; // L'utilisateur n'est pas authentifié
                    return res.status(403).send("Accès refusé : Vous devez être connecté pour accéder à cette page.");
                    //return res.redirect('/login'); // Redirige vers la page de connexion
                    //res.status(403).send("Accès refusé : Vous n'avez pas les droits nécessaires.");
                    //return next();
                    //return res.redirect('/home'); // Redirige si aucun token n'est trouvé
                }
            }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.redirect('/login'); // Redirige si le token est invalide
            }

            req.user = decoded; // Ajoute les données décodées à la requête
            //req.user = { username: decoded.username, role: decoded.role }; // Ajoutez le rôle ici
        
            // Vérifie si un rôle est requis
            if (allowedRoles && !allowedRoles.includes(decoded.role)) {
                return res.status(403).send("Accès refusé : Vous n'avez pas les droits nécessaires.");
            }

            next(); // Passe au middleware ou à la fonction suivante
        });
    };
}






//module.exports = {verifyTokenMiddleware, checkRoleMiddleware}
module.exports = verifyTokenAndRoleMiddleware