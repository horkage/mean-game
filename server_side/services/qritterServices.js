require('../../app/models/schema')
var q = require('q')
var mongoose = require('mongoose')

var Qritter = mongoose.model('Qritter')

exports.getStarterQritters = function() {
  var d = q.defer()

  Qritter.find({starter: true}, function(err, qritters) {
    if (err) throw err
    d.resolve(qritters)
  }, function(error) {
    d.reject(error) 
  })

  return d.promise
}

