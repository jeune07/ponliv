const { z } = require('zod');
const { bookCondition } = require('./shareType'); 


exports.bookSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().min(10, 'Description must be longer'),
  author: z.string().min(2, 'Author is too short'),
  isbn: z.union([z.string().length(13), z.literal('')]).optional(),
  category: z.string().min(2),
  publishedYear: z.number().min(1900).max(new Date().getFullYear()),
  condition: bookCondition,
  coverImage: z.string().url().optional(),
  price: z.number().min(0),
  sellerId: z.string().min(1),
  isVerified: z.boolean().default(false),
  isIsbnProvided: z.boolean().default(false),
  schoolLevel: z.string().min(1).optional(),
  officialListReference: z.string().min(2).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

