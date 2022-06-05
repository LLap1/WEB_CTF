const express = require('express');
const { VerifyToken } = require('../helpers/jwt_handler');
const router = express.Router()
const path = require('path');
const {db} = require('../helpers/db')


router.get("/profile", VerifyToken, (_, res) => {
    const username = res.locals.token.username
    res.status(200)
    .setHeader("Content-Security-Policy", "script-src 'self' cdn.jsdelivr.net ajax.googleapis.com ")

    .render(path.resolve('views/profile'), {name: username})
});

router.get("/admin", VerifyToken, async (_, res) => {
    const username = res.locals.token.username
    await db.is_admin(username)
    .then(result => { 
        if(result){
            return res.status(200)
            .setHeader("Content-Security-Policy", "script-src 'self'  cdn.jsdelivr.net ajax.googleapis.com ")
            .render(path.resolve('views/admin'))
        }
        return res.status(401).send('Not Authorized!')
    })
    .catch(err => {
        return res.status(500).send(err)
    })
});


router.get('/chat', VerifyToken, (_, res) => {
    return db.get_messages()
        .then(feed => {
            res
            .setHeader("Content-Security-Policy", "script-src 'self' cdn.jsdelivr.net ajax.googleapis.com *.bootstrapcdn.com 127.0.0.1:*") // that should be enough protection!
            .render(path.resolve('views/chat'), { feed });
        })
    .catch(() => res.status(500).send(response('Something went wrong!')));
});


router.get('/login', (_, res) => {
    return res.status(200)
    .setHeader("Content-Security-Policy", "script-src 'self'  cdn.jsdelivr.net ajax.googleapis.com *.bootstrapcdn.com")
    .render(path.resolve('views/login'))
});

router.get("/register", (_, res) => {
    return res.status(200)
    .setHeader("Content-Security-Policy", "script-src 'self' cdn.jsdelivr.net ajax.googleapis.com *.bootstrapcdn.com")
    .render(path.resolve('views/register'))
});


module.exports = {main_router: router}

