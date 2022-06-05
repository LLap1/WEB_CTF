const express       = require('express');
const cookieParser  = require('cookie-parser');
const {db}          = require('./helpers/db');
const {auth_router} = require('./routes/auth');
const {main_router} = require('./routes/index');
const {profile_router} = require('./routes/profile');
const {chat_router} = require('./routes/chat');


require('dotenv').config();
require('./ws_chat.js')

const app = express()
const path = require('path')


app.use('/', express.static(path.join(__dirname, 'static')))
app.use([
    express.json(),
    express.urlencoded(),   
    cookieParser(),
    auth_router,
    profile_router,
    chat_router,
    main_router
]);


app.set('view engine', 'ejs')
app.get("/", async (_, res) => {
    return res.status(200).render(path.resolve('views/index'));
});

app.all('*', (_, res) => {
    return res.status(404).send('404 page not found');
});

(async () => {
    await db.setup()
    .then( () => {
        app.listen(process.env.APP_PORT, () => {
            console.log('[!]Starting server on port '+process.env.APP_PORT+'')
        });
    })
    .catch(e => {
        console.error(e)
    }
)})();

