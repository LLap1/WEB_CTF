const {type, freemem, totalmem, userInfo} = require('os')

module.exports = {
    current_os: type(),
    free_mem: freemem(),
    total_mem: totalmem(),
    used_mem: totalmem() - freemem(),
    user_info: userInfo()
}

