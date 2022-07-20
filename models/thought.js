//require mongoose
const { Schema, model, Types } = require('mongoose');

// create reactions of users posts using schema
// input data and/or requirements from acceptance critera models 
const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: time => dateFormat(time)
    }
});


// user posting and requirements
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true,
            minlength: 1, 
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: time => dateFormat(time)
        },
        username: {
            type: String, 
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    });
    thoughtSchema.virtual('reactionCount').get(function() {
        return this.reactions.length;
    });
    
    // export thought model
    const Thought = model('thought', thoughtSchema);
    module.exports = Thought