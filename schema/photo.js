// "use strict";

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: String,
  date_time: { type: Date, default: Date.now },
  //   user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

/**
 * Define the Mongoose Schema for a Photo.
 */
const photoSchema = new mongoose.Schema({
  // Name of the file containing the photo (in the project6/images directory).
  file_name: String,
  date_time: { type: Date, default: Date.now },
  //   user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  user_id: mongoose.Schema.Types.ObjectId,
  // Array of comment objects representing the comments made on this photo.
  comments: [commentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  visibleTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
