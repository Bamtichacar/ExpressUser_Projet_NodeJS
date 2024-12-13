const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; // s'assurer d'avoir une clé secrète dans .env

// Middleware pour vérifier le token
function verifyTokenMiddleware(req, res, next) {
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


module.exports = verifyTokenMiddleware