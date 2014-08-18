require('../../app/models/schema')
var badwords = require('../../config/badwords.json')
var q = require('q')
var mongoose = require('mongoose')
var qritterServices = require('./qritterServices')

function findUserByLogin(user) {
  var d = q.defer()

  var User = mongoose.model('User')
  User.findOne({ login: user.login }, function(err, doc) {
    if (err) d.reject('invalid login credentials')
    d.resolve([doc, user.password])
  })

  return d.promise
}

function comparePasswords(args) {
  var d = q.defer()

  var user = args[0]
  var candidatePassword = args[1]
        
  user.comparePassword(candidatePassword, function(err, isMatch) {
    if (err) throw err
    if (isMatch) {
      d.resolve(user)
    } else {
      d.reject('invalid login credentials')
    }
  });

  return d.promise
}

function addStarterQrittersToUserObject(user) {
  var d = q.defer()

  qritterServices.getStarterQritters()
    .then(function(qritters) {
      user.qritters = qritters
      d.resolve(user)
    }, function(error) {
      d.reject(error)
    })

  return d.promise
}

exports.loginIsAvailable = function(login) {
  var d = q.defer()

  var User = mongoose.model('User')
  var query = { login: new RegExp('^' + login + '$') }
  User.find(query, function(err, docs) {
    if (docs.length > 0) {
      d.reject('login unavailable')
    } else {
      d.resolve(login);
    }
  })

  return d.promise;
}

exports.loginIsNotVulgar = function(login) {
  var d = q.defer()

  var count = 1;
  badwords.words.forEach(function(word) {
    var regex = new RegExp('^' + word);
    // be careful with promises..
    // remember once a promise has been resolved, 
    // it's resolved forever..

    if (login.match(regex)) {
      d.reject('login unavailable')
    } else if (count === badwords.words.length && !login.match(regex)) {
      d.resolve(login)
    }
    count++;
  });

  return d.promise
}

exports.userIsValid = function(user) {
  var d = q.defer()

  findUserByLogin(user)
    .then(comparePasswords)
    .then(function(success) {
      d.resolve(success)
    }, function(error) {
      d.reject(error)
    })

  return d.promise
}

exports.createAccount = function(obj) {
  var d = q.defer()

  var User = mongoose.model('User')
  var user = new User({ login: obj.login, password: obj.password, email: obj.email, dob: obj.dob })
  addStarterQrittersToUserObject(user)
    .then(function(user) {
      user.save(function(err,doc) {
        if (err) throw err
        d.resolve(doc)
      })
    }, function(error) {
        d.reject(error)
    })

  return d.promise
}
