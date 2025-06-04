const {z} =require('zod');

const UserRoles= z.enum(['student','parent','sponsor','school','seller','admin']);
const SchoolType = z.enum(['kindergarden','primary','secondary', 'university']);
const bookCondition = z.enum(['new', 'used', 'acceptable']);

module.exports={UserRoles,SchoolType,bookCondition};