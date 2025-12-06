import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js"
import { comparePassword, hashedPassword } from "../utilities/hashPassword.js";

export const updateProfile = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Email are required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findById(req.userId);

    // Compare old (current) password
    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashed = await hashedPassword(newPassword);
    user.password = hashed;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("Update Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV == 'production'?'none':'strict'
    })
    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await Task.deleteMany({ userId: req.userId });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("Delete Profile Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
