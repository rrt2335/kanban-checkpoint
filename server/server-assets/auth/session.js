var expressSession = require("express-session");
var mongoStore = require("connect-mongodb-session")(expressSession);

var store = new mongoStore({
 // uri: "mongodb://coolerkanban:1012912923!@den1.mongo1.gear.host:27001/coolerkanban",
  //"mongodb://markkanban:He02R~9I82-M@den1.mongo1.gear.host:27001/markkanban", //CHANGE ME!!!!!!
  uri: "mongodb://mykanban:I<3Jake96!@den1.mongo1.gear.host:27001/mykanban", //CHANGE ME!!!!!!
  collection: "Sessions"
});

store.on("error", function (err) {
  console.log("[SESSION ERROR]", err);
});

// @ts-ignore
var session = expressSession({
  secret: "you should change this", //CHANGE ME!!!!
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 52 * 2,
  },
  store,
  resave: true,
  saveUninitialized: true
});

module.exports = session;