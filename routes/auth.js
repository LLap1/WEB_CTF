const express = require('express');
const { GenerateToken, VerifyToken } = require('../helpers/jwt_handler')
const router = express.Router()
const {db} = require('../helpers/db');


router.post("/admin/make_admin", VerifyToken, (req, res) => {
    const initiator = res.locals.token.username
    const username = req.body.username
    if(initiator === "admin"){
        db.make_admin(username)
        .then((response) => {
            console.log(response)
            res.status(200).send(response)
        })
        .catch((e) => {
            console.log(e)
            res.status(400).send(e)
        })
    }else{
        res.status(400).send("Initator is not an admin, only the user 'admin' can add admins")
    }
})

router.post("/admin/remove_admin", VerifyToken, (req, res) => {
    const initiator = res.locals.token.username
    const username = req.body.username
    if(initiator === "admin"){
        db.remove_admin(username)
        .then((response) => {
            console.log(response)
            res.status(200).send(response)
        })
        .catch((e) => {
            console.log(e)
            res.status(400).send(e)
        })
    }else{
        res.status(400).send("Initator is not an admin, only the user 'admin' can remove admins")
    }
   
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!(username && password)) {
        return res.send("Missing Login Params!");
    }
    await db.login(username, password)
        .then(async () => {
            try {
                await GenerateToken(username)
                    .then(token => {
                        res.cookie('auth', token, {httpOnly: true});
                        res.cookie('username', username)
                        return res.send('success');
                    });
            }
            catch { return res.status(500).send('Internal Error') }
        })
        .catch(e => {
            return res.send(e);
        });
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const regex = /^[A-Za-z1-9]*$/gs

    
    if (!(username && password)) {
        return res.send("Missing Register Params");
    };
    if(!(regex.test(username))) {
        return res.send("Username must contain only letters and numbers");
    }

    await db.register(username, password, 0)
        .then(async () => {
            try {
                await GenerateToken(username)
                    .then(token => {
                        res.cookie('auth', token, {httpOnly: true});
                        res.cookie('username', username)
                        return res.send('success');
                    });
            }
            catch (e) { return res.status(500).send('Internal Error') }
        })
        .catch(e => {
            return res.send(e);
        });
});

router.all("/logout", (_, res) => {
    res.clearCookie("auth");
    return res.redirect('/');
});

const auth_router = router;
module.exports = { auth_router };
