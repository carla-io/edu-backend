
// const express = require('express');
// const router = express.Router();
// const upload = require("../utils/multer");
// const { register, 
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
//     sendGraphEmail } = require('../controllers/authController');

// router.post('/register', upload.single('profilePicture'),  register);
// router.post('/login',  login);
// router.post('/user', user);
// router.put('/update-profile/:id', upload.single('profilePicture'), updateProfile);
// router.get("/verify-email", verifyEmail); 
// router.get('/registrations-over-time', getUserRegistrationsOverTime);
// router.get('/grade-level-distribution', getGradeLevelDistribution);
// router.get('/get-all-users', getAllUsers);
// router.delete('/delete-user/:id', DeleteUser);
// router.post('/request-password-reset', requestPasswordReset);
// router.post('/reset-password/:token', resetPassword);
// router.post("/send-graph-email", upload.single("graph"), sendGraphEmail);

// module.exports = router;










const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const { register, 
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
    sendGraphEmail, archiveUser, restoreUser, getActiveUsers, getArchivedUsers} = require('../controllers/authController');

router.post('/register', upload.single('profilePicture'),  register);
router.post('/login',  login);
router.post('/user', user);
router.put('/update-profile/:id', upload.single('profilePicture'), updateProfile);
router.get("/verify-email", verifyEmail); 
router.get('/registrations-over-time', getUserRegistrationsOverTime);
router.get('/grade-level-distribution', getGradeLevelDistribution);
router.get('/get-all-users', getAllUsers);
router.delete('/delete-user/:id', DeleteUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post("/send-graph-email", upload.single("graph"), sendGraphEmail);
// Archive a user account
router.put("/archive/:userId", archiveUser);
// Restore an archived user account
router.put("/restore/:userId", restoreUser);
// Get all active users
router.get("/active", getActiveUsers);
// Get all archived users
router.get("/archived", getArchivedUsers);


module.exports = router;