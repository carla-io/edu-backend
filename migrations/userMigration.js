const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user'); // Adjust the path as needed
const connectDB = require('../config/db'); // Adjust the path as needed

// Load environment variables
dotenv.config();

const migrateUsers = async () => {
    try {
        // Connect to database
        await connectDB();

        // Update all existing users to add isArchived field
        const result = await User.updateMany(
            { isArchived: { $exists: false } }, // Only update documents without isArchived
            { $set: { isArchived: false } } // Set default to false
        );

        console.log(`Migration completed. ${result.modifiedCount} users updated.`);

        // Optionally, randomly archive some users for testing
        const usersToArchive = await User.aggregate([
            { $match: { isArchived: false } },
            { $sample: { size: Math.floor(result.modifiedCount * 0.2) } } // Archive 20% of users
        ]);

        for (let user of usersToArchive) {
            await User.findByIdAndUpdate(user._id, { isArchived: true });
        }

        console.log(`Randomly archived ${usersToArchive.length} users for testing.`);

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

// If run directly
if (require.main === module) {
    migrateUsers().catch(console.error);
}

module.exports = migrateUsers;