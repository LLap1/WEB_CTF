const express = require('express');
const router = express.Router()
const { VerifyToken } = require('../helpers/jwt_handler');
const fileUpload = require('express-fileupload');
const path = require('path');
const image = require('../helpers/image')


router.post('/profile/upload_picture', VerifyToken, fileUpload(), (req, res) => {
    try {
        if (req.files !== null) {
            const file = req.files.file;
            console.log(file)
            const file_mimetype = image._get_file_mimetype(file.data)
            const username = res.locals.token.username;
            if (file_mimetype) {
    
                const filetype = file.name.split('.')[1]
                const filename = username + '.' + filetype
                
                const filepath = path.join(__dirname + "/../static/image/users/", filename);
                image._remove_existing(username, filename)
                file.mv(filepath);
                res.status(200).send("Image Uploaded Successfully!");
         
            } else {
                res.status(200).send("File must be a valid image (jpg, png, gif)");
            }
        } else {
            res.status(200).send("File must be a valid image (jpg, png, gif)");
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});



module.exports = { profile_router: router }