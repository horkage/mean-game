var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
        name: { type: String, default: 'unknown' },
    qritters: [QritterSchema],
   createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
})

mongoose.model('User', UserSchema)
