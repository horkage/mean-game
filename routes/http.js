/*
 * HTTP Routs
 */

var mongoose = require('mongoose')
var validations = require('../server_side/validations/createAccount')
var accountServices = require('../server_side/services/accountServices')
require('../app/models/schema')


module.exports = function(app,passport,pool) {
  app.get('/', function(req,res){
    res.sendfile('public/index.html');

  });

  app.get('/logout', function(request, response) {
    request.logout()
    response.redirect('/')
  })

  app.post('/api/getLogin', function(request, response) {
    response.end(JSON.stringify({ user: request.user }))
  })

  app.post('/api/check/login', function(request, response) {
    if(request.body.value == 'fuck') {
      response.end(JSON.stringify({isClean: false}));
    } else {
      response.end(JSON.stringify({isClean: true}));
    }
  })

  app.post('/accountServices/isLoginAvailable', function(request, response) {
    accountServices.loginIsAvailable(request.body.value)
      .then(accountServices.loginIsNotVulgar)
      .then(function(login) {
        response.end(JSON.stringify({isAvailable: true}));
      }, function(error) {
        response.end(JSON.stringify({isAvailable: false}));
      });
  })


  app.post('/api/createAccount', function(request, response) {
    var formData = request.body

    validations.loginIsValid(formData)
      .then(validations.emailIsValid)
      .then(validations.passwordIsValid)
      .then(validations.passwordConfirmIsValid)
      .then(accountServices.createAccount)
      .then(function(user) {
        request.login(user, function(err) {
          if (err) { return next(err) }
          response.end(JSON.stringify({success: true, message: 'yay'}));
        })
      }, function(error) {
        response.end(JSON.stringify({
          success: false, 
          errors: error 
        }));
      })
  })
  
  app.post('/api/login', function(request, response) {
    var formData = request.body

    validations.loginIsValid(formData)
      .then(validations.passwordIsValid)
      .then(accountServices.userIsValid)
      .then(function(user) {
        request.login(user, function(err) {
          if (err) { return next(err) }
          response.end(JSON.stringify({success: true, message: 'yay'}));
          return
        })
      }, function(error) {
        response.end(JSON.stringify({success: false, message: 'invalid login credentials'}));
        return
      })
  })

  app.post('/api/dispatchQritter', function(request, response) {
    var formData = request.body
    pool.push(formData.qritterId)
    response.end(JSON.stringify({success: true, timestamp: new Date().getTime()}))
  })

  app.post('/snot/qritters', function(request, response) {
    var Qritter = mongoose.model('Qritter')
    var qritter = new Qritter(request.body)
    qritter.save(function(err, doc) {
      if (err) {
        response.end(JSON.stringify({success: false}))
        return
      } else {
        response.end(JSON.stringify({success: true}))
        return
      }
    })
  })

  app.get('/snot/qritters', function(request, response) {
    var Qritter = mongoose.model('Qritter')
    Qritter.find(function(err, qritters) {
      response.end(JSON.stringify(qritters))
      return
    })
  })

  app.delete('/snot/qritters/:id', function(request, response) {
    var Qritter = mongoose.model('Qritter')
    Qritter.find({ _id: request.params.id }).remove().exec()
    response.end(JSON.stringify({success: 'whee'}))
    return
  })
  
  app.post('/snot/weapons', function(request, response) {
    var Weapon = mongoose.model('Weapon')
    var weapon = new Weapon(request.body)
    weapon.save(function(err, doc) {
      if (err) {
        response.end(JSON.stringify({success: false}))
        return
      } else {
        response.end(JSON.stringify({success: true}))
        return
      }
    })
  })

  app.get('/snot/weapons', function(request, response) {
    var Weapon = mongoose.model('Weapon')
    Weapon.find(function(err, weapons) {
      response.end(JSON.stringify(weapons))
      return
    })
  })

  app.delete('/snot/weapons/:id', function(request, response) {
    var Weapon = mongoose.model('Weapon')
    Weapon.find({ _id: request.params.id }).remove().exec()
    response.end(JSON.stringify({success: 'whee'}))
    return
  })
  
  app.post('/snot/armors', function(request, response) {
    var Armor = mongoose.model('Armor')
    var armor = new Armor(request.body)
    armor.save(function(err, doc) {
      if (err) {
        response.end(JSON.stringify({success: false}))
        return
      } else {
        response.end(JSON.stringify({success: true}))
        return
      }
    })
  })

  app.get('/snot/armors', function(request, response) {
    var Armor = mongoose.model('Armor')
    Armor.find(function(err, armors) {
      response.end(JSON.stringify(armors))
      return
    })
  })

  app.delete('/snot/armors/:id', function(request, response) {
    var Armor = mongoose.model('Armor')
    Armor.find({ _id: request.params.id }).remove().exec()
    response.end(JSON.stringify({success: 'whee'}))
    return
  })
  
  app.post('/snot/items', function(request, response) {
    var Item = mongoose.model('Item')
    var item = new Item(request.body)
    item.save(function(err, doc) {
      if (err) {
        response.end(JSON.stringify({success: false}))
        return
      } else {
        response.end(JSON.stringify({success: true}))
        return
      }
    })
  })

  app.get('/snot/items', function(request, response) {
    var Item = mongoose.model('Item')
    Item.find(function(err, items) {
      response.end(JSON.stringify(items))
      return
    })
  })

  app.delete('/snot/items/:id', function(request, response) {
    var Item = mongoose.model('Item')
    Item.find({ _id: request.params.id }).remove().exec()
    response.end(JSON.stringify({success: 'whee'}))
    return
  })
}
