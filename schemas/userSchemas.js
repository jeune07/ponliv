const { z } = require('zod');

const UserRoles = z.enum(['student', 'parent', 'sponsor', 'school', 'seller', 'admin']);
const SchoolType = z.enum(['kindergarden', 'primary', 'secondary', 'university']);

const baseFields = {
  name: z.string().min(2).trim(),
email: z.string().email().trim(),
password: z.string().min(6).trim(),
address: z.string().min(3).trim(),
nif: z.string().regex(/^\d{10}$/, 'NIF must be exactly 10 digits'),
phoneNumber: z.string().regex(/^\d{8,15}$/, 'Phone number must be 8–15 digits'),
website: z.string().url().optional(),
createdAt: z.date().default(() => new Date())
};

const roleSchemas = {
  student: z.object({
    ...baseFields,
    role: z.literal('student')
  }).strict(),
  parent: z.object({
    ...baseFields,
    role: z.literal('parent'),
    children: z.array(z.string()).optional()
  }),
  sponsor: z.object({
    ...baseFields,
    role: z.literal('sponsor'),
    company: z.string().optional()
  }),
  school: z.object({
    ...baseFields,
    role: z.literal('school'),
    director: z.string().min(2),
    schoolType: SchoolType
  }),
  seller: z.object({
    ...baseFields,
    role: z.literal('seller')
  }),
  admin: z.object({
    ...baseFields,
    role: z.literal('admin')
  })
};

module.exports = {
  roleSchemas,
  UserRoles,
  SchoolType
};
