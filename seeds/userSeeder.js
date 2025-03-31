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
        const usedNames = new Set();
        const usedEmails = new Set();

        for (let i = 0; i < count; i++) {
            let name, email;

            // Generate unique username
            do {
                name = faker.internet.userName().toLowerCase();
            } while (usedNames.has(name));
            usedNames.add(name);

            // Generate unique email
            do {
                email = faker.internet.email().toLowerCase();
            } while (usedEmails.has(email));
            usedEmails.add(email);
            
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
                isArchived: Math.random() < 0.2, // 20% chance of being archived
                createdAt: faker.date.past()
            };

            users.push(user);
        }

        // Insert users
        await User.insertMany(users);

        console.log(`Successfully seeded ${count} users`);
        console.log(`Active users: ${users.filter(user => !user.isArchived).length}`);
        console.log(`Archived users: ${users.filter(user => user.isArchived).length}`);

        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

// If run directly
if (require.main === module) {
    seedUsers().catch(console.error);
}

module.exports = seedUsers;