import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: "Invalid email format"
    },
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required:true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      // Password is required only for local auth users
      return this.authProvider === 'local';
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  pendingGoogleLink: {
    token: { type: String },
    googleId: { type: String },
    expiresAt: { type: Date }
  },

  // tokenVersion used for simple token revocation: increment to invalidate all issued JWTs
  tokenVersion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

function validateEmail(email){
  try{
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }catch{
    return false;
  }
};

function validatePassword(password){
  try{
      // At least 8 characters, one uppercase, one lowercase, one number, one special character
      if(!password) return true;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(password);
  }catch{
      return false;
  }
};

// Public representation helper
// showEmail = false by default; controllers can pass true when returning profile to owner
userSchema.methods.toPublic = function(showEmail = false) {
  return {
    id: this._id,
    name: this.name,
    firstName: this.firstName,
    lastName: this.lastName,
    profilePicture: this.profilePicture,
    authProvider: this.authProvider,
    isActive: this.isActive,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
    email: showEmail ? this.email : undefined
  };
};

// toJSON transform: remove sensitive/internal fields from any JSON serialization
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    // remove mongoose internals
    delete ret.__v;
    // remove sensitive / internal fields
    delete ret.pendingGoogleLink;
    delete ret.tokenVersion;
    delete ret.googleId;
    // alias _id to id for convenience
    if (ret._id) {
      ret.id = ret._id;
      delete ret._id;
    }
    return ret;
  }
});

// Static method to find or create user from Google profile
userSchema.statics.findOrCreateFromGoogle = async function(profile) {
  const email = profile?.emails?.[0]?.value;
  if (!email) throw new Error('Google profile missing email');
  const data = {
    email,
    name: profile.displayName || '',
    firstName: profile.name?.givenName || '',
    lastName: profile.name?.familyName || '',
    profilePicture: profile.photos?.[0]?.value || '',
    authProvider: 'google'
  };
  let user = await this.findOne({ email });
  if (!user) {
    user = await this.create(data);
  } else {
    // optional: update profile fields if needed (avoid overwriting sensitive fields)
    await this.updateOne({ _id: user._id }, { $set: data });
    user = await this.findById(user._id);
  }
  return user;
};

// Create pending link (returns token)
userSchema.statics.createPendingGoogleLink = async function(userId, googleId, ttlMinutes = 15) {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await this.updateOne({ _id: userId }, { $set: { pendingGoogleLink: { token, googleId, expiresAt } } });
  return token;
};

// Confirm pending link by token (returns user or null)
userSchema.statics.confirmPendingGoogleLink = async function(token) {
  if (!token) return null;
  const user = await this.findOne({ 'pendingGoogleLink.token': token });
  if (!user) return null;
  if (!user.pendingGoogleLink || user.pendingGoogleLink.expiresAt < new Date()) {
    // expired or invalid
    user.pendingGoogleLink = undefined;
    await user.save();
    return null;
  }
  user.googleId = user.pendingGoogleLink.googleId;
  user.pendingGoogleLink = undefined;
  await user.save();
  return user;
};

// Increment tokenVersion (revokes existing tokens)
userSchema.statics.incrementTokenVersion = async function(userId) {
  if (!userId) return null;
  return this.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } }, { new: true }).lean();
};

// Pre-save hook to validate and hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    // Validate plain password first
    if (!validatePassword(this.password)) {
      return next(new Error('Password must be at least 8 characters long, include uppercase, lowercase, number, and special character'));
    }
    // Hash password after validation
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});


const User = mongoose.model('User', userSchema);

export default User;
