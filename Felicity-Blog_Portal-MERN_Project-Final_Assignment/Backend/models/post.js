const mongoose = require('mongoose');
const _ = require('lodash');

const POST_CATEGORIES = {
    ALL_CATEGORIES: 'All Categories',
    FICTION: 'Fiction'
};

const Post = mongoose.model('Post', {

    category: {
        type: String,
        enum: _.values(POST_CATEGORIES),
        default: POST_CATEGORIES.ALL_CATEGORIES,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },

    postDate: {
        type: String,
        required: true
    },

    comments: { type: Object },

    reactions: { type: Object },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


module.exports = Post