/* const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err)=>{
    if(err){
        console.error("erreur de connection : " , err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL)`);
            console.log("connecté à la bdd");
    }
})
 */

// BDD AVEC ROLE user par défaut
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err)=>{
    if(err){
        console.error("erreur de connection : " , err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user')`);     // 'user' est le rôle par défaut
            console.log("connecté à la bdd users");

         db.run(`CREATE TABLE IF NOT EXISTS annonces(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            description TEXT NOT NULL,
            prix REAL NOT NULL,
            image BLOB,
            validation BOOLEAN NOT NULL DEFAULT false,
            date_de_soumission DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER NOT NULL,
            user_name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (user_name) REFERENCES users(username)
        )`);
            console.log("connecté à la bdd annonces");
    }
});

// pour supp table annonces

/* const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error("Erreur de connexion : ", err.message);
    } else {
        console.log("Connecté à la base de données.");

        // Supprimer la table "annonces" si elle existe
        db.run(`DROP TABLE IF EXISTS annonces`, (err) => {
            if (err) {
                console.error("Erreur lors de la suppression de la table annonces :", err.message);
            } else {
                console.log("Table annonces supprimée avec succès.");
            }
        });
    }
});
module.exports = db;
 */



module.exports = db






