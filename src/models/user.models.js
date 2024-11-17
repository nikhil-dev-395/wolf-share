const mongoose = require("mongoose");

/* ^ warning :  carefully change the code here - because it will affect the database collections
 */

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    allFileLinks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "File", required: false },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
