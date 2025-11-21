const mongoose = require("mongoose");

// Helper to generate slug from title
const generateSlug = (title) => {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-')   // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  fullDescription: {
    type: String,
    default: '',
    trim: true,
  },
  experience: {
    type: String,
    default: '',
    trim: true,
  },
  type: {
    type: String,
    default: 'Full-time',
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate slug before saving
JobSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  this.updatedAt = Date.now();
  next();
});

// Ensure unique slug
JobSchema.pre('save', async function(next) {
  if (this.isModified('slug') || this.isNew) {
    let slug = this.slug;
    let counter = 1;
    while (await mongoose.model('Job').exists({ slug, _id: { $ne: this._id } })) {
      slug = `${this.slug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model("Job", JobSchema);
