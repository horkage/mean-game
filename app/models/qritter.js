var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var QritterSchema = new Schema({
        name: { type: String, default: 'Unnamed Qritter' },
       level: { type: Number, default: 1 },
      rarity: { type: String, default: 'Ultra Common' },
//        gear: [GearSchema],
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

mongoose.model('Qritter', QritterSchema)
