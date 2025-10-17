import mongoose from 'mongoose';
import crypto from 'crypto';

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
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['google'],
    required: true,
    default: 'google'
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

const User = mongoose.model('User', userSchema);

export default User;
