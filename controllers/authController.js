
// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cloudinary = require('../config/cloudinary');
// const crypto = require('crypto');
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS
//   }
// });


// // Registration Controller
// const register = async (req, res) => {
//   const { name, email, password, gradeLevel } = req.body;

//   try {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) return res.status(400).json({ message: 'User already exists' });

//       const hashedPassword = await bcrypt.hash(password, 10);

//       let profilePicture = { public_id: '', url: '' };
//       if (req.file) {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//               folder: 'profile',
//               width: 150,
//               crop: 'scale',
//           });
//           profilePicture = { public_id: result.public_id, url: result.secure_url };
//       }

//       const user = await User.create({
//           name,
//           email,
//           password: hashedPassword,
//           gradeLevel,
//           role: 'user',
//           profilePicture,
//           isVerified: false
//       });

//       // ✅ Generate verification token
//       const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

//       const verificationLink = `http://localhost:4000/api/auth/verify-email?token=${verificationToken}`;

//       const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: user.email, // ✅ Use the registered user's email
//         subject: "Email Verification",
//         text: `Hello ${user.name}, please verify your email by clicking on this link: ${verificationLink}`
//       };
      

      
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error:", error);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       });

//       res.status(201).json({
//           message: "User registered! Please check your email to verify.",
//           user: {
//               id: user._id,
//               name: user.name,
//               email: user.email,
//               gradeLevel: user.gradeLevel,
//               role: user.role,
//               profilePicture: user.profilePicture
//           }
//       });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };
// // Login Controller
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'User not found' });

//         if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email before logging in.' });

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

//         res.status(200).json({
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 gradeLevel: user.gradeLevel,
//                 role: user.role,
//                 profilePicture: user.profilePicture,
//             },
//             token,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Get user details from token
// const user = async (req, res) => {
//     try {
//         const { token } = req.body;
//         if (!token) return res.status(401).json({ message: 'No token provided' });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select('-password');

//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update Profile
// const updateProfile = async (req, res) => {
//     try {
//         const { name, email, gradeLevel } = req.body;
//         const userId = req.params.id;

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Upload new profile picture if provided
//         let profilePicture = user.profilePicture;
//         if (req.file) {
//             if (profilePicture?.public_id) {
//                 await cloudinary.uploader.destroy(profilePicture.public_id); // Remove old image if exists
//             }
//             const result = await cloudinary.uploader.upload(req.file.path, {
//                 folder: 'profile',
//                 width: 150,
//                 crop: 'scale',
//             });
//             profilePicture = { public_id: result.public_id, url: result.secure_url };
//         }
        

//         // Update user fields
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.gradeLevel = gradeLevel || user.gradeLevel;
//         user.profilePicture = profilePicture;

//         await user.save();

//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findOne({ email: decoded.email });

//       if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//       user.isVerified = true;
//       await user.save();

//       res.json({ message: "Email verified successfully! You can now log in." });
//   } catch (error) {
//       res.status(400).json({ message: "Invalid or expired token" });
//   }
// };

// const getUserRegistrationsOverTime = async (req, res) => {
//     try {
//       const registrations = await User.aggregate([
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
  
//       res.status(200).json({ data: registrations });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving user registration data', error });
//     }
//   };

//   const getGradeLevelDistribution = async (req, res) => {
//     try {
//       const distribution = await User.aggregate([
//         {
//           $group: {
//             _id: "$gradeLevel",
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
  
//       res.status(200).json({ data: distribution });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving grade level distribution', error });
//     }
//   };

//   const getAllUsers = async (req, res) => {
//     try {
//       const users = await User.find({ role: 'user' }).select('-password'); // Exclude password field
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving users', error });
//     }
//   };


//   const DeleteUser = async (req, res) => {  
//     try {
//         const userId = req.params.id;
//         await User.findByIdAndDelete(userId);
//         res.status(200).json({ message: 'User deleted successfully' });
//       } catch (error) {
//         res.status(500).json({ message: 'Error deleting user', error });
//       }
//   };

//   const requestPasswordReset = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // ✅ Generate a reset token
//         const resetToken = crypto.randomBytes(32).toString('hex');
//         const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

//         // ✅ Store token and expiration in the DB
//         user.resetPasswordToken = resetTokenHash;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         await user.save();

//         // ✅ Construct reset URL
//         const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

//         // ✅ Send Email
//         const mailOptions = {
//             from: `"Your App" <${process.env.GMAIL_USER}>`,
//             to: user.email,
//             subject: "Password Reset Request",
//             html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password.</p>`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ message: 'Password reset link sent to your email.' });
//     } catch (error) {
//         console.error('Error sending password reset email:', error);
//         res.status(500).json({ message: 'Error processing password reset request', error });
//     }
// };
  

// // Reset Password
// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({ message: 'Invalid or missing new password.' });
//   }

//   try {
//       const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

//       const user = await User.findOne({
//           resetPasswordToken: resetTokenHash,
//           resetPasswordExpires: { $gt: Date.now() }
//       });

//       if (!user) {
//           return res.status(400).json({ message: 'Invalid or expired token' });
//       }

//       // ✅ Update password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
//       await user.save();

//       res.status(200).json({ message: 'Password has been reset successfully.' });
//   } catch (error) {
//       console.error('Error resetting password:', error);
//       res.status(500).json({ message: 'Error resetting password', error: error.message });
//   }
// };

// const sendGraphEmail = async (req, res) => {
//   try {
//     const { email, image } = req.body;
//     if (!image) {
//       return res.status(400).json({ message: "No graph image provided" });
//     }

//     // Upload image to Cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(image, {
//       folder: "graph_images",
//     });

//     if (!uploadResponse.secure_url) {
//       return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
//     }

//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to: email,
//       subject: "Your Requested Graph",
//       text: "Please find the graph link below:",
//       html: `<p>Please find your requested graph below:</p><br><a href="${uploadResponse.secure_url}" target="_blank">View Graph</a>`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return res.status(500).json({ message: "Failed to send email" });
//       }
//       res.status(200).json({ message: "Graph sent successfully!", info });
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };




// module.exports = { register, 
//     login, 
//     user, 
//     updateProfile, 
//     DeleteUser,  
//     verifyEmail,  
//     getUserRegistrationsOverTime,  
//     getGradeLevelDistribution, 
//     getAllUsers,
//     requestPasswordReset,
//     resetPassword,
//     sendGraphEmail};


// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cloudinary = require('../config/cloudinary');
// const crypto = require('crypto');
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//       user: process.env.GMAIL_USER,
//       pass: process.env.GMAIL_PASS
//   }
// });


// // Registration Controller
// const register = async (req, res) => {
//   const { name, email, password, gradeLevel } = req.body;

//   try {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) return res.status(400).json({ message: 'User already exists' });

//       const hashedPassword = await bcrypt.hash(password, 10);

//       let profilePicture = { public_id: '', url: '' };
//       if (req.file) {
//           const result = await cloudinary.uploader.upload(req.file.path, {
//               folder: 'profile',
//               width: 150,
//               crop: 'scale',
//           });
//           profilePicture = { public_id: result.public_id, url: result.secure_url };
//       }

//       const user = await User.create({
//           name,
//           email,
//           password: hashedPassword,
//           gradeLevel,
//           role: 'user',
//           profilePicture,
//           isVerified: false
//       });

//       // ✅ Generate verification token
//       const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

//       const verificationLink = `http://localhost:4000/api/auth/verify-email?token=${verificationToken}`;

//       const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: user.email, // ✅ Use the registered user's email
//         subject: "Email Verification",
//         text: `Hello ${user.name}, please verify your email by clicking on this link: ${verificationLink}`
//       };
      

      
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error("Error:", error);
//         } else {
//           console.log("Email sent:", info.response);
//         }
//       });

//       res.status(201).json({
//           message: "User registered! Please check your email to verify.",
//           user: {
//               id: user._id,
//               name: user.name,
//               email: user.email,
//               gradeLevel: user.gradeLevel,
//               role: user.role,
//               profilePicture: user.profilePicture
//           }
//       });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };
// // Login Controller
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: 'User not found' });

//         if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email before logging in.' });

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

//         res.status(200).json({
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 gradeLevel: user.gradeLevel,
//                 role: user.role,
//                 profilePicture: user.profilePicture,
//             },
//             token,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Get user details from token
// const user = async (req, res) => {
//     try {
//         const { token } = req.body;
//         if (!token) return res.status(401).json({ message: 'No token provided' });

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id).select('-password');

//         if (!user) return res.status(404).json({ message: 'User not found' });

//         res.status(200).json({ user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update Profile
// const updateProfile = async (req, res) => {
//     try {
//         const { name, email, gradeLevel } = req.body;
//         const userId = req.params.id;

//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // Upload new profile picture if provided
//         let profilePicture = user.profilePicture;
//         if (req.file) {
//             if (profilePicture?.public_id) {
//                 await cloudinary.uploader.destroy(profilePicture.public_id); // Remove old image if exists
//             }
//             const result = await cloudinary.uploader.upload(req.file.path, {
//                 folder: 'profile',
//                 width: 150,
//                 crop: 'scale',
//             });
//             profilePicture = { public_id: result.public_id, url: result.secure_url };
//         }
        

//         // Update user fields
//         user.name = name || user.name;
//         user.email = email || user.email;
//         user.gradeLevel = gradeLevel || user.gradeLevel;
//         user.profilePicture = profilePicture;

//         await user.save();

//         res.status(200).json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findOne({ email: decoded.email });

//       if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//       user.isVerified = true;
//       await user.save();

//       res.json({ message: "Email verified successfully! You can now log in." });
//   } catch (error) {
//       res.status(400).json({ message: "Invalid or expired token" });
//   }
// };

// const getUserRegistrationsOverTime = async (req, res) => {
//     try {
//       const registrations = await User.aggregate([
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
  
//       res.status(200).json({ data: registrations });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving user registration data', error });
//     }
//   };

//   const getGradeLevelDistribution = async (req, res) => {
//     try {
//       const distribution = await User.aggregate([
//         {
//           $group: {
//             _id: "$gradeLevel",
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);
  
//       res.status(200).json({ data: distribution });
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving grade level distribution', error });
//     }
//   };

//   const getAllUsers = async (req, res) => {
//     try {
//       const users = await User.find({ role: 'user' }).select('-password'); // Exclude password field
//       res.status(200).json(users);
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving users', error });
//     }
//   };


//   const DeleteUser = async (req, res) => {  
//     try {
//         const userId = req.params.id;
//         await User.findByIdAndDelete(userId);
//         res.status(200).json({ message: 'User deleted successfully' });
//       } catch (error) {
//         res.status(500).json({ message: 'Error deleting user', error });
//       }
//   };

//   const requestPasswordReset = async (req, res) => {
//     const { email } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         // ✅ Generate a reset token
//         const resetToken = crypto.randomBytes(32).toString('hex');
//         const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

//         // ✅ Store token and expiration in the DB
//         user.resetPasswordToken = resetTokenHash;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         await user.save();

//         // ✅ Construct reset URL
//         const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

//         // ✅ Send Email
//         const mailOptions = {
//             from: `"Your App" <${process.env.GMAIL_USER}>`,
//             to: user.email,
//             subject: "Password Reset Request",
//             html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password.</p>`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ message: 'Password reset link sent to your email.' });
//     } catch (error) {
//         console.error('Error sending password reset email:', error);
//         res.status(500).json({ message: 'Error processing password reset request', error });
//     }
// };
  

// // Reset Password
// const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   if (!newPassword || newPassword.length < 6) {
//       return res.status(400).json({ message: 'Invalid or missing new password.' });
//   }

//   try {
//       const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

//       const user = await User.findOne({
//           resetPasswordToken: resetTokenHash,
//           resetPasswordExpires: { $gt: Date.now() }
//       });

//       if (!user) {
//           return res.status(400).json({ message: 'Invalid or expired token' });
//       }

//       // ✅ Update password
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       user.password = hashedPassword;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;
//       await user.save();

//       res.status(200).json({ message: 'Password has been reset successfully.' });
//   } catch (error) {
//       console.error('Error resetting password:', error);
//       res.status(500).json({ message: 'Error resetting password', error: error.message });
//   }
// };





// module.exports = { register, 
//     login, 
//     user, 
//     updateProfile, 
//     DeleteUser,  
//     verifyEmail,  
//     getUserRegistrationsOverTime,  
//     getGradeLevelDistribution, 
//     getAllUsers,
//     requestPasswordReset,
//     resetPassword};

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const { arch } = require('process');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
  }
});


// Registration Controller
const register = async (req, res) => {
  const { name, email, password, gradeLevel } = req.body;

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      let profilePicture = { public_id: '', url: '' };
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: 'profile',
              width: 150,
              crop: 'scale',
          });
          profilePicture = { public_id: result.public_id, url: result.secure_url };
      }

      const user = await User.create({
          name,
          email,
          password: hashedPassword,
          gradeLevel,
          role: 'user',
          profilePicture,
          isVerified: false
      });

      // ✅ Generate verification token
      const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      const verificationLink = `http://localhost:4000/api/auth/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email, // ✅ Use the registered user's email
        subject: "Email Verification",
        text: `Hello ${user.name}, please verify your email by clicking on this link: ${verificationLink}`
      };
      

      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.status(201).json({
          message: "User registered! Please check your email to verify.",
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
              gradeLevel: user.gradeLevel,
              role: user.role,
              profilePicture: user.profilePicture
          }
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email before logging in.' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gradeLevel: user.gradeLevel,
                role: user.role,
                profilePicture: user.profilePicture,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get user details from token
const user = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, gradeLevel } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Upload new profile picture if provided
        let profilePicture = user.profilePicture;
        if (req.file) {
            if (profilePicture?.public_id) {
                await cloudinary.uploader.destroy(profilePicture.public_id); // Remove old image if exists
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile',
                width: 150,
                crop: 'scale',
            });
            profilePicture = { public_id: result.public_id, url: result.secure_url };
        }
        

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.gradeLevel = gradeLevel || user.gradeLevel;
        user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });

      if (!user) return res.status(400).json({ message: "Invalid or expired token" });

      user.isVerified = true;
      await user.save();

      res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
  }
};

const getUserRegistrationsOverTime = async (req, res) => {
    try {
      const registrations = await User.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
  
      res.status(200).json({ data: registrations });
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user registration data', error });
    }
  };

  const getGradeLevelDistribution = async (req, res) => {
    try {
        const distribution = await User.aggregate([
            {
                $group: {
                    _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, gradeLevel: "$gradeLevel" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.date",
                    grades: { $push: { gradeLevel: "$_id.gradeLevel", count: "$count" } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedData = distribution.map(entry => {
            let row = { date: entry._id };
            entry.grades.forEach(grade => {
                row[grade.gradeLevel] = grade.count;
            });
            return row;
        });

        res.status(200).json({ data: formattedData });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving grade level distribution", error });
    }
};


  const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }).select('-password'); // Exclude password field
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  };


  const DeleteUser = async (req, res) => {  
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
      }
  };

  const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // ✅ Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // ✅ Store token and expiration in the DB
        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // ✅ Construct reset URL
        const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

        // ✅ Send Email
        const mailOptions = {
            from: `"Your App" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click <a href="${resetURL}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ message: 'Error processing password reset request', error });
    }
};
  

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Invalid or missing new password.' });
  }

  try {
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

      const user = await User.findOne({
          resetPasswordToken: resetTokenHash,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired token' });
      }

      // ✅ Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

const sendGraphEmail = async (req, res) => {
  try {
    const { email, image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No graph image provided" });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "graph_images",
    });

    if (!uploadResponse.secure_url) {
      return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Requested Graph",
      text: "Please find the graph link below:",
      html: `<p>Please find your requested graph below:</p><br><a href="${uploadResponse.secure_url}" target="_blank">View Graph</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
      }
      res.status(200).json({ message: "Graph sent successfully!", info });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const archiveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and update the isArchived field
    const user = await User.findByIdAndUpdate(userId, { isArchived: true }, { new: true });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User account archived successfully", data: user });
} catch (error) {
    console.error("Error archiving user:", error);
    res.status(500).json({ success: false, message: "Server error", error });
}
}

const restoreUser = async (req, res) => {

  try {
    const { userId } = req.params;

    // Find the user and restore the account by setting isArchived to false
    const user = await User.findByIdAndUpdate(userId, { isArchived: false }, { new: true });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User account restored successfully", data: user });
} catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ success: false, message: "Server error", error });
}

}

const getActiveUsers = async (req, res) => {
  try {
      const users = await User.find({ isArchived: false });

      res.json({ success: true, data: users });
  } catch (error) {
      console.error("Error fetching active users:", error);
      res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all archived users
const getArchivedUsers = async (req, res) => {
  try {
      const users = await User.find({ isArchived: true });

      res.json({ success: true, data: users });
  } catch (error) {
      console.error("Error fetching archived users:", error);
      res.status(500).json({ success: false, message: "Server error", error });
  }
};




module.exports = { register, 
    login, 
    user, 
    updateProfile, 
    DeleteUser,  
    verifyEmail,  
    getUserRegistrationsOverTime,  
    getGradeLevelDistribution, 
    getAllUsers,
    requestPasswordReset,
    resetPassword,
    sendGraphEmail,
  archiveUser,
  restoreUser,
  getActiveUsers,
  getArchivedUsers};