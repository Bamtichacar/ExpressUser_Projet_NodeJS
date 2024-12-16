const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; // s'assurer d'avoir une clé secrète dans .env

/// Middleware pour vérifier le token (on voit si l utilisateur est "connecté")
/* function verifyTokenMiddleware(req, res, next) {
    const token = req.cookies.token; // Récupè le token dans les cookies
    if (!token) {
        return res.status(401).redirect('/login'); // Redirige si aucun token n'est trouvé
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error("Erreur de vérification du token :", err.message);
            return res.status(401).redirect('/login'); // Redirige si le token est invalide
        }

        // Ajoute les informations décodées à l'objet req
        req.user = decoded; // `decoded` contient les données encodées dans le token
        next(); // Passe au middleware ou à la fonction suivante
    });
}

 */ 

/* // middleware pour verifier le token avec 1 seul role
function verifyTokenMiddleware(roleRequired) {
    return function(req, res, next) {
        const token = req.cookies.token;   // Récupè le token dans les cookies
        if (!token) {
            return res.redirect('/login'); // Redirige si aucun token n'est trouvé
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.redirect('/login');   // Redirige si le token est invalide
            }

            // Vérifie si l'utilisateur a le rôle requis
            if (decoded.role !== roleRequired) {
                return res.status(403).send("Accès refusé : Vous n'avez pas les droits nécessaires.");
            }
            // Ajoute les informations décodées à l'objet req
            req.user = decoded;  // Ajoute les infos utilisateur à la requête, `decoded` contient les données encodées dans le token
            next();  // Passe au middleware ou à la fonction suivante
        });
    };
}
 
 */

// middleware pour verifier plusieurs roles
// Middleware de vérification du token
/* function verifyTokenMiddleware(req, res, next) {
    const token = req.cookies.token; // Récupère le token dans les cookies
    if (!token) {
        return res.redirect('/login'); // Redirige si aucun token n'est trouvé
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.redirect('/login'); // Redirige si le token est invalide
        }
        req.user = decoded; // Ajoute les données décodées (par ex., username, role) à la requête
        next();
    });
}
 */
// Middleware de vérification du rôle
/* function checkRoleMiddleware(allowedRoles) {
    return (req, res, next) => {
        // Vérifiez si req.user existe et contient un rôle
        if (!req.user || !req.user.role) {
            return res.status(403).send("Accès refusé : Aucun rôle défini.");
        }

        const userRole = req.user.role;

        // Vérifie si le rôle de l'utilisateur est dans les rôles autorisés
        if (allowedRoles.includes(userRole)) {
            return next();
        } else {
            return res.status(403).send("Accès refusé : Vous n'avez pas les permissions nécessaires.");
        }
    };
}
 */


// middleware pour verifier le token avec plusieurs roles pour 1 même route possible
function verifyTokenAndRoleMiddleware(allowedRoles) {
    return function (req, res, next) {
        const token = req.cookies.token; // Récupère le token dans les cookies
        if (!token) {
            return res.redirect('/home'); // Redirige si aucun token n'est trouvé
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.redirect('/login'); // Redirige si le token est invalide
            }

            req.user = decoded; // Ajoute les données décodées à la requête

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