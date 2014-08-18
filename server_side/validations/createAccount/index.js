var q = require('q')
var validations = require('../')

exports.loginIsValid = function(obj) {
  var d = q.defer()

  if (!validations.loginIsThere(obj.login))          d.reject({'login':'no login provided'})
  if (!validations.loginIsAlphanumeric(obj.login))   d.reject({'login':'login can only be letters or numbers'})
  if (!validations.loginIsLongEnough(obj.login))     d.reject({'login':'login is not long enough'})
  if (!validations.loginIsShortEnough(obj.login))    d.reject({'login':'login is too long'})
  if (!validations.loginIsFamilyFriendly(obj.login)) d.reject({'login':'login is not family friendly'})

  d.resolve(obj)
  return d.promise
}

exports.passwordIsValid = function(obj) {
  var d = q.defer()

  if(!validations.passwordIsThere(obj.password))          d.reject({'password':'no password provided'})
  if(!validations.passwordIsLongEnough(obj.password))     d.reject({'password':'password is not long enough'})
  if(!validations.passwordIsShortEnough(obj.password))    d.reject({'password':'password is too long'})

  d.resolve(obj)
  return d.promise
}

exports.passwordConfirmIsValid = function(obj) {
  var d = q.defer()

  if(!validations.passwordConfirmIsThere(obj.password_confirm))          d.reject({'password_confirm':'no confimation password provided'})
  if(!validations.passwordConfirmIsLongEnough(obj.password_confirm))     d.reject({'password_confirm':'password confirmation is not long enough'})
  if(!validations.passwordConfirmIsShortEnough(obj.password_confirm))    d.reject({'password_confirm':'password confirmation is too long'})
  if(!validations.passwordsMatch(obj.password, obj.password_confirm))    d.reject({'password_confirm':'passwords do not match'})

  d.resolve(obj)
  return d.promise
}

exports.emailIsValid = function(obj) {
  var d = q.defer()

  if (!validations.emailIsThere(obj.email))          d.reject({'email':'no email provided'})
  if (!validations.emailIsLongEnough(obj.email))     d.reject({'email':'email is not long enough'})
  if (!validations.emailIsShortEnough(obj.email))    d.reject({'email':'email is too long'})
  if (!validations.emailIsProper(obj.email))         d.reject({'email':'invalid email format'})

  d.resolve(obj)
  return d.promise
}
