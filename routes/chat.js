const express = require('express');
const { VerifyToken } = require('../helpers/jwt_handler');
const router = express.Router()
const {db} = require('../helpers/db')

router.post("/chat/post_comment", VerifyToken, (req, res) => {
    const comment = req.body.comment;
    const username = res.locals.token.username;
    console.log(req);
    db.add_comment(comment, username)
    return res.status(200)
        .send(req.body.message);

});


module.exports = {chat_router: router}

