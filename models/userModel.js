
const connectToDb= require('../db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { ca } = require('zod/v4/locales');


exports.createUser= async (userData)=>{
    const db=await connectToDb();
    //check if user already exists
     userData.email = userData.email.toLowerCase(); 
    const existingUser = await db.collection('users').findOne({email: userData.email });
    if( existingUser) {
        throw new Error('User already exists');
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    //insert user into database
    userData.createdAt = new Date();   
    userData.UserRoles = userData.UserRoles || ['user']; 
    userData.schoolType = userData.schoolType || null;  
    userData.address = userData.address || '';
    userData.phoneNumber = userData.phoneNumber || '';
    userData.nif = userData.nif || '';
    userData.website = userData.website || '';
    userData.name = userData.name || '';      
    const result =await db.collection('users').insertOne(userData);
    if (!result.acknowledged) {
        throw new Error('Failed to create user');
    }
    return {
        _id: result.insertedId, 
        email: userData.email, 
        createdAt: userData.createdAt
    };
};

exports.loginUser= async (userData)=>{
    try{
         
    const db=await connectToDb();
    const user = await db.collection('users').findOne({ email: userData.email });
    if (!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) {
        return null; 
    }    
    return { _id: user._id, email: user.email };     

    }catch(err){
        console.error("Error in loginUser:", err);
        if (err.name === 'ZodError') {
            return { error: err.errors };
        }
        return { error: err.message };
    }       

}

exports.getUserById = async(userId)=>{
    try{
        const db= await connectToDb();
        const user =await  db.collection('users').findOne({ _id:userId });
        if (!user){
            throw new Error('User not found');
        }
        return{
            _id: user._id,
            email: user.email,
            name: user.name,
            address: user.address,
            phoneNumber: user.phoneNumber,
            nif: user.nif,
            role: user.role,
            schoolType: user.schoolType,
            website: user.website,
            createdAt: user.createdAt
        }
    }catch(err){
        console.error("Error in getUserById:", err);
        if (err.name === 'ZodError') {
            return { error: err.errors };
        }
        return { error: err.message };
    }
}

exports.updateUser = async (userId, userData) => {
    try {
        const db = await connectToDb();
        const result = await db.collection('users').updateOne(
            { _id: userId },
            { $set: userData }
        );
        if (result.modifiedCount === 0) {
            throw new Error('User not found or no changes made');
        }
        return { message: 'User updated successfully' };
    } catch (err) {
        console.error("Error in updateUser:", err);
        if (err.name === 'ZodError') {
            return { error: err.errors };
        }
        return { error: err.message };
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const db = await connectToDb();
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            address: user.address,
            phoneNumber: user.phoneNumber,
            nif: user.nif,
            role: user.role,
            schoolType: user.schoolType,
            website: user.website,
            createdAt: user.createdAt
        };
    } catch (err) {
        console.error("Error in getUserByEmail:", err);
        if (err.name === 'ZodError') {
            return { error: err.errors };
        }
        return { error: err.message };
    }
};

exports.changeUserPassword = async (userId, newPassword) => {
    try {
        const db = await connectToDb();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const result = await db.collection('users').updateOne(
            { _id: userId },
            { $set: { password: hashedPassword } }
        );
        if (result.modifiedCount === 0) {
            throw new Error('User not found or no changes made');
        }
        return { message: 'Password changed successfully' };
    } catch (err) {
        console.error("Error in changeUserPassword:", err);
        if (err.name === 'ZodError') {
            return { error: err.errors };
        }
        return { error: err.message };
    }
};

// do not use this in production, use soft delete instead

exports.deleteUser = async (userId) => {
  try {
    const db = await connectToDb();

    const objectId = new ObjectId(userId);
    const user = await db.collection('users').findOne({ _id: objectId });
    if (!user) return null;

    const result = await db.collection('users').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  } catch (err) {
    console.error("Error in deleteUser:", err);
    if (err.name === 'ZodError') {
      return { error: err.errors };
    }
    return { error: err.message };
  }
};