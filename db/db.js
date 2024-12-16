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
            console.log("connecté à la bdd");
    }
})

// pour supp table
/* const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite', (err)=>{
    if(err){
        console.error("erreur de connection : " , err.message);
    } else {
        db.run(`DROP TABLE users)`);     // 'user' est le rôle par défaut
            console.log("connecté à la bdd");
    }
})
 */




module.exports = db






