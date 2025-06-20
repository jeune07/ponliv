const {z} =require('zod');
const {UserRoles,SchoolType} =require('./shareType');

//create user schemas 
const baseUserSchema = z.object({
    name:z.string().min(2,'name is to short'),
    email:z.string().email(),
    password:z.string().min(6, 'Password must be at least 6 characters long'),
    address:z.string().min(3),
    phoneNumber: z.string().min(8),
    nif:z.string().length(10, 'Nif must be 10 digits'),
    role: z.array(UserRoles),
    website: z.string().url().optional(),
    createdAt: z.date().default(() => new Date()),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
//conditional refinement : require only if schoolType only if role include shool
const userSchema = baseUserSchema.extend({
  schoolType: SchoolType.optional()
}).refine((data) => {
  if (data.role.includes('school')) {
    return data.schoolType !== undefined;
  }
  return true;
}, {
  message: 'schoolType is required for users with role "school"',
  path: ['schoolType']
});

module.exports={
    userSchema, baseUserSchema,loginSchema
}
