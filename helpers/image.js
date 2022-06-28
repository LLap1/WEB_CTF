const fs = require('fs');

function _get_image_path(username){ // gets a username and returns a path to the users picture.
    return new Promise((resolve, reject) => {
        try{
            const full_path = 'static/image/users/'
            const regex = new RegExp(username + '.*')
        
            fs.readdir(full_path, (_, files) => {
                for (var file in files) {
                    match = files[file].match(regex);
                    if (match !== null) {
                        return resolve(match[0]);
                    }
                }
                return resolve("default.png");
            });
        }catch(e){
            reject(e)
        }
    })
}

function _get_file_mimetype(data) { // gets a file and returns the filetype from the hex data.
    console.log(data);
    const accept_type = { // acceptable file types
        'ffd8ffe0': 'image/jpeg',
        '89504e47': 'image/png',
        '47494638': 'image/gif'
    };
    const magic_bytes = data.toString('hex', 0, 4);
    return accept_type[magic_bytes];
}

function _remove_existing(username, filename) { // gets a username and a filename, removes all the files that are not equal to the filename.
    const path = __dirname + '/../static/image/users/'
    const regex = new RegExp(username + '.*')
    console.log(filename)
    fs.readdir(path, (_, files) => {
        for (var file in files) {
            const match = files[file].match(regex);
            console.log(match)
            if (match !== null && match[0] !== filename) {
                fs.unlink(path + match[0], (err) => {
                    console.log(err)
                });
            }
        }
    });
}



module.exports = {_get_image_path, _get_file_mimetype, _remove_existing}