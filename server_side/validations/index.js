exports.loginIsThere = function(arg) {
  if (!arg || arg == '') return false
  return true
}

exports.loginIsAlphanumeric = function(arg) {
  if (arg && arg.match(/[^\w+]/)) return false
  return true
}

exports.loginIsLongEnough = function(arg) {
  if (arg && arg.length >= 3) return true
  return false
}

exports.loginIsShortEnough = function(arg) {
  if (arg && arg.length <= 20) return true
  return false
}

exports.loginIsFamilyFriendly = function(arg) {
  if (arg == 'fuck') return false
  return true
}

exports.passwordIsThere = function(arg) {
  if (!arg || arg == '') return false
  return true
}

exports.passwordIsLongEnough = function(arg) {
  if (arg && arg.length >= 4) return true
  return false
}

exports.passwordIsShortEnough = function(arg) {
  if (arg && arg.length <= 20) return true
  return false
}

exports.passwordConfirmIsThere = function(arg) {
  if (!arg || arg == '') return false
  return true
}

exports.passwordConfirmIsLongEnough = function(arg) {
  if (arg && arg.length >= 4) return true
  return false
}

exports.passwordConfirmIsShortEnough = function(arg) {
  if (arg && arg.length <= 20) return true
  return false
}

exports.passwordsMatch = function(arg1, arg2) {
  if (arg1 === arg2) return true
  return false
}

exports.emailIsThere = function(arg) {
  if (!arg || arg == '') return false
  return true
}

exports.emailIsLongEnough = function(arg) {
  if (arg && arg.length >= 6) return true
  return false
}

exports.emailIsShortEnough = function(arg) {
  if (arg && arg.length <= 35) return true
  return false
}

exports.emailIsProper = function(arg) {
  if (arg && !arg.match(/.+@.+\..+/i)) return false
  return true
}
