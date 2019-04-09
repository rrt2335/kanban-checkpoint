var express = require('express')
var bp = require('body-parser')
var server = express()
var cors = require('cors')

// Sets the port to Heroku's, and the files to the built project
var port = process.env.PORT || 3000
server.use(express.static(__dirname + '/../client/dist'))

var whitelist = ['http://localhost:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
server.use(cors(corsOptions))

//Fire up database connection
require('./server-assets/db/gearhost-config')


//REGISTER MIDDLEWARE
server.use(bp.json())
server.use(bp.urlencoded({
  extended: true
}))

//REGISTER YOUR AUTH ROUTES BEFORE YOUR GATEKEEPER, OTHERWISE YOU WILL NEVER GET LOGGED IN
let auth = require('./server-assets/auth/routes')
server.use(auth.session)
server.use(auth.router)


//Gate Keeper Must login to access any route below this code
server.use((req, res, next) => {
  if (!req.session.uid) {
    return res.status(401).send({
      error: 'please login to continue'
    })
  }
  next()
})

//YOUR ROUTES HERE!!!!!!
let boardRoutes = require('./server-assets/routes/board')
let listRoutes = require('./server-assets/routes/list')
let taskRoutes = require('./server-assets/routes/task')
server.use('/api/boards', boardRoutes)
server.use('/api/lists', listRoutes)
server.use('/api/tasks', taskRoutes)





//default error handler
server.use('*', (err, req, res, next)=>{
  res.status(500).send(err)
})

//Catch all
server.use('*', (req, res, next) => {
  res.status(404).send({
    error: 'No matching routes'
  })
})


server.listen(port, () => {
  console.log('server running on port', port)
})


// hello