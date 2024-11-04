const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must be filled"],
      minLength: [3, "Name length min 3 characters"],
      maxLength: [15, "Name length max 15 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email must be filled"],
      unique: [true, "Email must be filled"],
    },
    password: {
      type: String,
      required: [true, "Password must be filled"],
      minlength: [6, "Password must be more than 6 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ], // Referensi ke Task
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
