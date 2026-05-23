const mongoose = require("mongoose");

const todoSchemas = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title is required"],
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Todo", todoSchemas);
