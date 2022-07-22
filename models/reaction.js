//require mongoose, reaction schema, formatDate
const { Schema, Types } = require('mongoose');
const formatDate = require('../utils/date');
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
      },
    username: {
      type: String,
      required: true,
      },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timeStamp => formatDate(timeStamp)
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;