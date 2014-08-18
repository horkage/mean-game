/**
 * Module dependencies.
 */


/**
 * ok let's get this straight:
 * there will be qritter objects on mongo, but I want the
 * stats to be tweakable externally.  Basically, only the 
 * qritter name, type, level and gear will be saved to 
 * mongo.
 *
 * The app will be responsible for "vivifying" them into 
 * actual workable instances that will refer to external
 * config for looking up game rules.  That way I can radically
 * change qritter behavior without touching a lick of code.
 *
 * This means that I will have to create some kind of qritter
 * GENERATOR which will create the base qritter objects, then
 * I will need a qritter "qrittifier" that will give them
 * crack cocaine - granting them the ability to interact with 
 * the user, the environment, and other qritters.
 *
 * So, the generator will create base qritters, and the 
 * qrittifier will grant them powers, turning them into qritters,
 * this, "qrittifier"
 *
 * Base, stupid and dumb critters get turbocharged into the real
 * deal.
 *
 */

var express  = require('express')
  , app      = require('express')()
  , server   = require('http').createServer(app)
  , io       = require('socket.io').listen(server)
  , path     = require('path')
  , fs       = require("fs")
  , mongoose = require('mongoose')
  , config   = require('./config/config.js')
  , pool     = []
  , guys     = []
  , utils    = require('util')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

/* 
 * mongoose crap
 */

mongoose.connect('mongodb://localhost/qrunch')
mongoose.connection.on('error', function(err) {
  console.log(err);
});

require('./app/models/schema')
//qritterGenerator = require('./lib/qritter_generator')

/*
 * we'll need these..
 */

var User    = mongoose.model('User')


var Qritter = mongoose.model('Qritter')

/*
Qritter.findRandom(function(err, dude) {
  console.log(dude)
})
*/

/*
Qritter.findRandomP()
  .then(function(dude) {
    console.log('DUDE: ', dude)
  }, function(err) {
    console.log('ERROR: ', err)
  })
*/

Qritter.findWeightedP()
  .then(function(dude) {
    console.log('DUDE: ', dude)
  }, function(err) {
    console.log('ERROR: ', err)
  })


/*
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function(file) {
  var regDot = /^\./
  if (!file.match(regDot) && ~file.indexOf('.js'))
    require(models_path + '/' + file)
});
*/

/*
 * setup passport
 */

passport.serializeUser(function(user, done) {
  console.log('DEBUG: serializeUser called');
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  console.log('DEBUG: deserializeUser called');
  User.findById(id, function(err, user) {
    console.log('DEBUG: deserializeUser#User.findById called');
    done(err, user)
  })
})

passport.use(new LocalStrategy(
  {
    usernameField: 'login'
  },
  function(username, password, done) {
    console.log('passport.use called()')
    user.findOne({ login: username }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        console.log('no user')
        return done(null, false, { message: 'Incorrect login' });
      }
      if (!user.validPassword(password)) {
        console.log('no password')
        return done(null, false, { message: 'Incorrect password' });
      }
      console.log('everything ok')
      return done(null, user);
    });
  }
));


/*
 * standard middleware configuration
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
})

require('./routes/http')(app,passport,pool)
require('./routes/tcp')(app,passport)



/*
 * 404 bucket at end of middleware stack
 */
app.use(function(req, res) {
  res.status(404).sendfile('public/404.html');
});


/*
 * socket events (NOT ROUTES)
 */
io.sockets.on('connection', function (socket) {
  socket.on('push', function (data) {
    socket.emit('sample', { 'id' : 3, 'name' : 'carrier has arrived' });
    console.log('got socket data from push' + data);
  });
  
  setInterval(function() {
    socket.emit('item', { 'id' : 22, 'name' : 'A Spiffy Free Itam' });
  }, 5000);
});


/*
 * Oh, look - starting the server IS in here
 */
server.listen(3000, function() {
  setInterval(function() {
    console.log(pool);
  }, 5000);
});
