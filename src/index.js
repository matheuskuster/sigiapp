const server = require('./server')

console.log('Server running in port ' + process.env.PORT)
server.listen(process.env.PORT)
