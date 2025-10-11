import mongoose from 'mongoose';

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

// Static method to find or create user from Google profile
userSchema.statics.findOrCreateFromGoogle = async function(profile) {
  try {
    // Try to find existing user by Google ID first
    let user = await this.findOne({ googleId: profile.id });
    
    if (user) {
      // Update last login and return user
      await user.updateLastLogin();
      return user;
    }
    
    // Try to find existing user by email
    user = await this.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.authProvider = 'google';
      await user.save();
      await user.updateLastLogin();
      return user;
    }
    
    // Create new user
    const nameParts = profile.displayName ? profile.displayName.split(' ') : ['', ''];
    user = new this({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName || profile.emails[0].value,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
      authProvider: 'google'
    });
    
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Failed to find or create user: ${error.message}`);
  }
};

const User = mongoose.model('User', userSchema);

export default User;
