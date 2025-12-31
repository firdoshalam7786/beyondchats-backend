const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    sourceUrl: {
      type: String,
      required: true,
      unique: true 
    },
    isUpdated: {
      type: Boolean,
      default: false
    },
    references: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
