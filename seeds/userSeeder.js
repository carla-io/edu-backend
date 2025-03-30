const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const User = require('../models/user');
const connectDB = require('../config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Seed users function
const seedUsers = async (count = 100) => {
    try {
        // Connect to database using your existing connection method
        await connectDB();

        // Clear existing users
        await User.deleteMany({});

        const users = [];

        for (let i = 0; i < count; i++) {
            const name = await generateUniqueUsername();
            const email = await generateUniqueEmail();
            
            // Generate a strong password
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash('StrongPassword123!', salt);

            // Random profile picture 
            const profilePicture = {
                public_id: faker.string.uuid(),
                url: faker.image.avatarGitHub()
            };

            // Randomly select grade level
            const gradeLevels = [
                'Junior High School',
                'Senior High School',
                'College'
            ];

            const user = {
                name,
                email,
                password,
                profilePicture,
                role: Math.random() < 0.1 ? 'admin' : 'user', // 10% chance of being an admin
                gradeLevel: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
                isVerified: Math.random() < 0.7, // 70% chance of being verified
                createdAt: faker.date.past()
            };

            users.push(user);
        }

        // Insert users
        await User.insertMany(users);

        console.log(`Successfully seeded ${count} users`);

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

// Function to generate a unique username
const generateUniqueUsername = async () => {
    let username;
    let isUnique = false;

    while (!isUnique) {
        username = faker.internet.userName().toLowerCase();
        const existingUser = await User.findOne({ name: username });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return username;
};

// Function to generate a unique email
const generateUniqueEmail = async () => {
    let email;
    let isUnique = false;

    while (!isUnique) {
        email = faker.internet.email().toLowerCase();
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return email;
};

// If run directly
if (require.main === module) {
    seedUsers().catch(console.error);
}

module.exports = seedUsers;