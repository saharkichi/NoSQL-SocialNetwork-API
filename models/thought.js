//require mongoose, reaction schema, formatDate
const { Schema, model, Types } = require('mongoose');
const reactionSchema = require('./reaction');
const formatDate = require('../utils/date');

// thought schema and create thought params
// input data and/or requirements from acceptance critera models 
const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        maxlength: 280,
        minlength: 1
      },
      createdAt: {
        type: Date,
        default: Date.now(),
        get: timeStamp => formatDate(timeStamp)
      },
      username: {
        type: String,
      required: true  
      },
      reactions: [reactionSchema],
    },
    {
      toJSON: {
        getters: true,
        virtuals: true,
      },
      id: false,
    }
  );
  thoughtSchema.virtual("reactionCount").get(function(){
    return this.reactions.length;
  });
  
  const Thought = model('thought', thoughtSchema);
  
  module.exports = Thought;