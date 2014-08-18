var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10

var UserSchema = new Schema({
       login: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
       email: { type: String, required: true },
         dob: { type: Date, required: true },
    qritters: [],
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next()

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

mongoose.model('User', UserSchema)

/*
db.qritters.insert({name: "Gremlin Snot-Tosser", level:1, type:"Combat", rarity:"Trash", gear:[ {weapon: {name:"Snot Slingshot", type:"Ranged", rarity:"Trash", damage:1}}, {head:"Broken Helmet", type:"Head", rarity:"Trash"}]})

{
  name: "Gremlin Snot-Tosser",
  leve: 1,
  type: "Combat",
  rarity: "Trash",
  gear: {
    weapon: {
      name: "Snot SlingShot",
      type: "Ranged",
      rarity: "Trash",
      damage: 1
    },
    head: {
      name: "Broken Helmet",
      armor: 1
    }
  }
}
BLEEDING GLEET
GLISTENING MOUND
DANGLING BLOB
{
     name: "Gremlin Snot Tosser",
    level: 1,
     type: "Ranged",
    qlass: "Gremlin",
   rarity: "Common",
  starter: true,
    bound: true,
  gear: {
    weapon: {
      name: "Snot Rocket",
      type: "Ranged",
    rarity: "Trash",
    damage: 2
    },
    armor: {
      helmet: {
        name: "Copper Helmet",
      rarity: "Common",
       armor: 2
      },
      body: {
        name: "Copper Chainmail",
      rarity: "Common",
       armor: 6
      },
      feet: {
         name: "Worn Shoes",
       rarity: "Trash",
        armor: 1
      }
    }
  }
}
*/


// module.exports = mongoose.model('User', UserSchema')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRarity() {
  var roll   = getRandomInt(1, 100)
  var rarity = 'Trash' // default

  /*
  29 trash        01-29
  24 ultra common 29-53
  19 common       53-72
  14 uncommon     72-86
  09 rare         86-95
  04 ultra rare   95-99
   1 heroic       100
  */

  if (roll <= 29) {                      // Trash
    rarity = 'Trash'
  } else if (roll > 29 && roll <= 53) {  // ultra common 
    rarity = 'Ultra Common'
  } else if (roll > 53 && roll <= 72) {  // Common
    rarity = 'Common'
  } else if (roll > 72 && roll <= 86) {  // uncommon
    rarity = 'Uncommon'
  } else if (roll > 86 && roll <= 95) {  // rare
    rarity = 'Rare'
  } else if (roll > 95 && roll <= 99) {  // ultra rare
    rarity = 'Ultra Rare'
  } else if (roll == 100) {              // heroic
    rarity = 'Heroic'
  } else {                               // RNG broke
    rarity = 'Broke'
  }
  return rarity
}

var q = require('q')

var QritterSchema = new Schema({
        name: { type: String, default: 'Unnamed Qritter' },
       level: { type: Number, default: 1 },
        type: { type: String, default: 'Combat' },
       qlass: { type: String },
      rarity: { type: String, default: 'Trash' },
     starter: { type: Boolean, default: false },
       bound: { type: Boolean, default: false },
         img: { type: String, default: '/images/qritters/themes' },
        gear: {},
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

/* CLASS METHODS */
QritterSchema.statics.findRandom = function(cb) {
  var self = this
  this.count(function(err, count) {
    //self.findOne({rarity: new RegExp(/ommon/)} ).skip(rand).exec(cb)
    self.findOne().skip(getRandomInt(1, count - 1)).exec(cb)
  })
}

/* apparently, exec() is already a promise - yay! */
QritterSchema.statics.findRandomP = function() {
  var self = this
  var d = q.defer()
  this.count(function(err, count) {
    if (err) d.reject(err)
    d.resolve(self.findOne().skip(getRandomInt(1, count - 1)).exec())
  })
  return d.promise
}

QritterSchema.statics.findWeightedP = function() {
  var self = this
  var d = q.defer()
  var rarity = getRarity()
  this.find({rarity: rarity}, function(err,dudes) {
    console.log('PULLING %s DUDES', rarity)
    if (err) d.reject(err)
    d.resolve(dudes[Math.floor(Math.random() * dudes.length)])
  })
  return d.promise
}

QritterSchema.methods.hit = function(other_guy) {
  if(getRandomInt(1,100) >= 20) {
    console.log("%s hits %s BIFF", this.name, other_guy.name)
    other_guy.health -= this.damage
    console.log("%s now has %d health", other_guy.name, other_guy.health)
  } else {
    console.log("%s MISSES %s", this.name, other_guy.name)
  }
}

/* INSTANCE METHODS
kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  console.log(greeting);
}
*/

mongoose.model('Qritter', QritterSchema)

var WeaponSchema = new Schema({
        name: { type: String, default: 'Broken Sword' },
        type: { type: String, default: 'Melee' },
      rarity: { type: String, default: 'Trash' },
      damage: { type: Number, default: 1 },
         img: { type: String, default: '/images/weapons' },
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})
mongoose.model('Weapon', WeaponSchema)

var ArmorSchema = new Schema({
        name: { type: String, default: 'Tattered Rags' },
      rarity: { type: String, default: 'Trash' },
       armor: { type: Number, default: 1 },
        type: { type: String, default: 'Body' },
         img: { type: String, default: '/images/armor' },
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})
mongoose.model('Armor', ArmorSchema)

var ItemSchema = new Schema({
        name: { type: String, default: 'Generic Itam' },
      rarity: { type: String, default: 'Ultra Common' },
         img: { type: String, default: '/images/items' },
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})
mongoose.model('Item', ItemSchema)
