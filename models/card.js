const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        // eslint-disable-next-line no-useless-escape
        return /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v);
      },
      message: (props) => `${props.value} is not an url`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // required: true,
  },
  about: String,
});
module.exports = mongoose.model('card', cardSchema);
