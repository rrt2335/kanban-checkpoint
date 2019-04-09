var mongoose = require('mongoose')
//var connectionString = "mongodb://coolerkanban:1012912923!@den1.mongo1.gear.host:27001/coolerkanban"
                      //  "mongodb://markkanban:He02R~9I82-M@den1.mongo1.gear.host:27001/markkanban" 
var connectionString = "mongodb://mykanban:I<3Jake96!@den1.mongo1.gear.host:27001/mykanban" //CHANGE ME!!!!!
var connection = mongoose.connection


mongoose.connect(connectionString, { useMongoClient: true })

connection.on('error', err => {
  console.log('ERROR FROM DATABASE: ', err)
})


connection.once('open', () => {
  console.log('Connected to Database')
})
