const  io = require('socket.io')(3000);
const {parse} = require('cookie');
const jwt = require('jsonwebtoken');
const {db} = require('./helpers/db')
const image = require('./helpers/image')

console.log('[!]Starting socket.io server on port '+process.env.CHAT_PORT+'')

io.on('connection',  (socket)=>{
    const cookies_plain = socket.handshake.headers.cookie
    const cookies = parse(cookies_plain);
    try {  
        const username = jwt.verify(cookies.auth, process.env.TOKEN_SECRET).username
        console.log("a user connected via socket! -> " + username)
        socket.on('disconnect', ()=>{
            console.log("a user disconnected!")
        })
    
        socket.on('message', async (msg)=>{
            const filename = await image._get_image_path(username)
            console.log(filename)
            const response = {name: username, data: msg, image: filename}
            console.log(response.name + " sends: "+ response.data)
            db.add_message(username, msg)
            io.emit('response', response)
            
        })
    } catch(e){
        console.log(e)
    }

})

