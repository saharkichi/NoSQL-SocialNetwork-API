// require mongoose and thought data
const { Schema, model, Types } = require('mongoose');
const thoughtSchema = require('./thought');

const userSchema = new Schema(
    {
        username: {
            type: String, 
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String, 
            required: true,
            unique: true,
            // remember regex *personal note
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']             
        },
        thoughts: [ {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    });
    userSchema.virtual('friendCount').get(function () {
        return this.friends.length
    });
    
    userSchema.pre('findOneAndDelete', { document: false, query: true }, async function() {
        const doc = await this.model.findOne(this.getFilter());
        console.log(doc.username);
        await thought.deleteMany({ username: doc.username });
    });
    

    //export user model
    const User = model('user', userSchema);
    module.exports = User;
