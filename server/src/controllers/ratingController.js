import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createSchema = Joi.object({
  movieCode: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  note: Joi.string().allow('', null),
  ratedBy: Joi.string().hex().length(24)
});

// GET /api/ratings
// TODO: implement per README.md section 2.
export async function getAllRatings(req, res, next) {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json({ ratings });
  } catch (err) { next(err); }
}

// GET /api/ratings/:id
// TODO: implement per README.md section 2.
export async function getRating(req, res, next) {
  try {
    const doc = await Rating.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Rating not found' });
    res.json({ rating: doc });
  } catch (err) { next(err); }
}

// POST /api/ratings
// TODO: implement per README.md section 2.
export async function createRating(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const doc = await Rating.create(value);
    res.status(201).json({ rating: doc });
  } catch (err) { next(err); }
}

// GET /api/ratings/summary?movieCode=MV101
// TODO: implement per README.md section 3.
export async function getRatingSummary(req, res, next) {
  try {
    const { movieCode } = req.query;
    if (!movieCode) return res.status(400).json({ message: 'movieCode is required' });

    const agg = await Rating.aggregate([
      { $match: { movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 }
        }
      }
    ]);

    if (!agg || agg.length === 0) {
      return res.json({ movieCode, averageRating: 0, ratingCount: 0 });
    }

    const { averageRating, ratingCount } = agg[0];
    // If averageRating is a whole number like 4.0, it will compare equal to 4 in tests.
    return res.json({ movieCode, averageRating, ratingCount });
  } catch (err) { next(err); }
}
