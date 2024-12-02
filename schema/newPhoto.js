const mongoose = require('mongoose');

const newPhotoSchema = new mongoose.Schema({
  name: String,
  creationData: String,
  user_id: String,
});

const NewPhoto = mongoose.model('NewPhoto', newPhotoSchema);

module.exports = NewPhoto;
