// "use strict";

const mongoose = require('mongoose');

/**
 * Create a Mongoose Schema.
 */
const schemaInfo = new mongoose.Schema({
  version: String,
  load_date_time: { type: Date, default: Date.now },
});

const SchemaInfo = mongoose.model('SchemaInfo', schemaInfo);

module.exports = SchemaInfo;
