const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Please enter an email'],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
    },
    balance: {
      type: Number,
      default: 0, // Starting balance for wallet
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ['buy', 'sell', 'deposit', 'withdraw'],
        },
        amount: Number,
        currency: {
          type: String,
          default: 'BTC',
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt & updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
