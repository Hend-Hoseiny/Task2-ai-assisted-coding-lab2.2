import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    movieCode: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    note: { type: String },
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// compound unique index to prevent the same user rating the same movie twice
// use sparse so anonymous (no ratedBy) ratings are not included in the index
ratingSchema.index({ movieCode: 1, ratedBy: 1 }, { unique: true, sparse: true });

export const Rating = mongoose.model('Rating', ratingSchema);
