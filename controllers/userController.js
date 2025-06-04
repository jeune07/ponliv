const { userSchema, loginSchema} = require('../shemas/userSchema'); 
const userModel=require('../models/userModel');
const { success } = require('zod/v4');
const { error } = require('zod/v4/locales/ar.js');

exports.registerUser = async (req, res) => {
  try {
    const validUser = userSchema.parse(req.body);
    const newUser = await userModel.createUser(validUser);
    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error("Error in registerUser:", err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.loginUser= async (req,res)=>{
  try{
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
  return res.status(400).json({ error: parsed.error.errors });
}
    const validUser = loginSchema.parse(req.body);
    const user = await userModel.loginUser(validUser);
   if (!user || user.error) {
  return res.status(401).json({ success: false, error: user?.error || "Invalid credentials" });
}
    return res.status(200).json({ success: true, user });
  }catch(err){
    console.error("Error in loginUser:", err);
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    return res.status(500).json({ error: err.message });
  }

}

exports.updateUser = async (req, res) => {
  try {
    const validUser = userSchema.parse(req.body); 
    const userId = req.params.id;
    const updatedUser = await userModel.updateUser(userId, validUser);
    return res.status(200).json({ success: true, user: updatedUser });

  } catch (error) {
    console.error('Error in updateUser:', error);

    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userModel.deleteUser(userId);

    if (!deletedUser || deletedUser.error) {
      return res.status(404).json({ error: deletedUser?.error || "User not found" });
    }

    return res.status(200).json({ success: true, message: deletedUser.message });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};