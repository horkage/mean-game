var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var GearSchema = new Schema({
        name: { type: String, default: 'Generic Piece of Gear' },
        type: { type: String, default: 'Broken Sword' },
      rarity: { type: String, default: 'Ultra Common' },
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

mongoose.model('Gear', GearSchema)
