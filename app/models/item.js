var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var ItemSchema = new Schema({
        name: { type: String, default: 'Generic Itam' },
      rarity: { type: String, default: 'Ultra Common' },
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

mongoose.model('Item', ItemSchema)
