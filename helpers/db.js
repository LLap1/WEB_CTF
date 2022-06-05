const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const image = require('./image');


class DBClass {
    _db;
    constructor() { // constructs the database in memory.
        this._db = new sqlite3.Database(':memory:'); // Creating db in memory
    }

    login(username, password) { // gets username and password. compares them to the data in the database. resolves if the data is correct. rejects if the data is incorrect.
        return new Promise((resolve, reject) => {
            try {
                const hashed_pass = crypto.createHash('md5').update(password).digest("hex");
                let stmt = this._db.prepare('SELECT id FROM users WHERE username=? and password=?', username, hashed_pass);
                stmt.get((_, result) => {
                    if (result) {
                        resolve('Login Success!')
                    } else {
                        reject('Wrong Credentials');
                    }
                });
            }
            catch (e) {
                reject(e);
            };
        });
    };

    register(username, password, is_admin) { // gets username, password, and is_admin flag. registers a user if the username is not already registered. also gives admin access according to is_admin
        return new Promise((resolve, reject) => {
            // Checks if username already exists in the table
            try {
                let stmt = this._db.prepare('SELECT id FROM users WHERE username=?', username);
                stmt.get((_, result) => {
                    if (result) {
                        return reject('Username Already Exists!');
                    }
                    const hashed_pass = crypto.createHash('md5').update(password).digest("hex")
                    stmt = this._db.prepare('INSERT INTO users (username, password, admin) VALUES (?, ?, ?)',
                        [username, hashed_pass, is_admin]
                    );
                    stmt.run();
                    resolve('User added successfully!');
                });
            }
            catch (e) {
                reject(e);
            };
        });
    };
    
    is_admin(username) { // gets a username, returns rather the user is registered as an admin in the database.
        return new Promise((resolve, reject) => {
            try {
                let stmt = this._db.prepare('SELECT admin FROM users WHERE username=?', username);
                stmt.get((err, result) => {
                    console.log(result);
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (result && result.admin === 1) {
                            return resolve(true);
                        }
                        else { resolve(false) }
                    }
                })
            }
            catch (e) { reject(e); }
        })
    }

    make_admin(username) { // gets a username, add admin permissions  to the user in the database.
        return new Promise((resolve, reject) => {
            try{
                console.log(username);
                this._db.run('UPDATE users SET admin = 1 WHERE username=?', username);
                resolve('Success');
            }catch(e) {
                console.log(e);
                reject(e); 
            }
        })
    }

    remove_admin(username) { //  gets a username, removes admin permissions  to the user in the database.
        return new Promise((resolve, reject) => {
            try{
                console.log(username);
                this._db.run('UPDATE users SET admin = 0 WHERE username=?', username);
                resolve('Success');
            }catch(e) {
                console.log(e);
                reject(e); 
            }
        })
    }

    async get_messages(){ // returns all the messages in the database.
        return new Promise((resolve, reject) => {
            try{
                let stmt = this._db.prepare("SELECT * FROM chat");
                stmt.all(async (_,  _data) => {
                    var data = _data;
                    for(let index in data) {
                        await image._get_image_path(data[index].username).then(filename => {
                            data[index].filename = filename
                        })
                    }
                    resolve(data);
                })
            }catch(e) {
                console.log(e);
                reject(); 
            }
        })
    }
    add_message(username, message) { // gets sender username, message, and its profile picture path, adds them to the database.
        try{
            this._db.run("INSERT INTO chat (username, message) VALUES (?, ?)", username, message)
        }catch(e) {
            console.log(e);
        }
    }
    setup() { // sets up the database with the default settings.
        return new Promise((resolve, reject) => {
            try {
                //sets up default db
                this._db.exec(
                    `
                    CREATE TABLE users (
                        ID INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        admin INTEGER NOT NULL
                    );

                    INSERT INTO users (username, password, admin)
                    VALUES ('admin', '21232f297a57a5a743894a0e4a801fc3', 1), ('user', 'ee11cbb19052e40b07aac0ca060c23ee', 0);
                    

                    CREATE TABLE chat (
                        ID INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        message TEXT NOT NULL
                    );


                `
                ); return resolve();
            }
            catch (e) {
                return reject(e);
            };

        });
    };
}

const db = new DBClass();
module.exports = { db };