const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iffco_project';

const UNITS = ["Aonla", "Phulpur", "Kalol", "Kandla", "Paradip"];
const DEPARTMENTS = ["Production", "Electrical", "Instrumentation", "Safety", "Quality Control", "Logistics"];

const FIRST_NAMES = [
    "Rajesh", "Amit", "Suresh", "Vikram", "Partha", "Ananya", "Deepak", "Sanjay", "Ramesh", "Sunita",
    "Preeti", "Arvind", "Manoj", "Karan", "Pankaj", "Rohan", "Vijay", "Aisha", "Rahul", "Neha",
    "Sandip", "Jiten", "Nikhil", "Divya", "Gaurav", "Harish", "Ishaan", "Ketan", "Lata", "Mohit",
    "Naveen", "Omkar", "Pooja", "Rajeev", "Sameer", "Tarun", "Umesh", "Varun", "Yash", "Zoya",
    "Abhay", "Bhupesh", "Chitra", "Dinesh", "Esha", "Girish", "Himanshu", "Inder", "Jyoti", "Kiran"
];

const LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Basu", "Deshmukh", "Singh", "Kumar", "Gupta", "Mehra", "Joshi",
    "Roy", "Nair", "Reddy", "Choudhury", "Das", "Sen", "Mishra", "Pandey", "Yadav", "Trivedi",
    "Shah", "Rao", "Iyer", "Gill", "Bose", "Jha", "Kulkarni", "Prasad", "Dubey", "Saxena",
    "Kapoor", "Bhat", "Chawla", "Dutta", "Grover", "Hegde", "Joshi", "Khanna", "Menon", "Pillai",
    "Rathore", "Sarin", "Talwar", "Venkatesh", "Wable", "Yadav", "Zaveri", "Acharya", "Banerjee",
    "Chatterjee"
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connection established.');

        // Clear existing users
        console.log('Clearing existing users...');
        await User.deleteMany({});
        console.log('Existing users cleared.');

        const defaultPassword = 'Iffco@2026';
        console.log(`Hashing default password "${defaultPassword}"...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        const usersToSeed = [];
        const usedEmails = new Set();
        const usedUsernames = new Set();

        for (let i = 0; i < 50; i++) {
            let firstName = FIRST_NAMES[i];
            let lastName = LAST_NAMES[i];
            let unit = UNITS[Math.floor(i / 10)]; // 10 users per unit
            let dept = DEPARTMENTS[i % DEPARTMENTS.length];

            // Local unit index (0 to 9)
            const uIdx = i % 10;
            let grade = 'Worker';

            if (uIdx === 0) grade = 'Unit Head';
            else if (uIdx === 1) {
                // Alternating executive grades
                const execGrades = ['DGM', 'JGM', 'GM'];
                grade = execGrades[Math.floor(i / 10) % execGrades.length];
            }
            else if (uIdx === 2) grade = 'Chief Manager';
            else if (uIdx === 3) grade = 'Senior Manager';
            else if (uIdx === 4) grade = 'Manager';
            else if (uIdx === 5) grade = 'Deputy Manager';
            else if (uIdx === 6 || uIdx === 7) grade = 'Assistant Manager';
            else grade = 'Worker';

            // Override specific records to match instructions snippet precisely
            // Rajesh Kumar Sharma (Unit Head - Aonla) -> Unit 0, idx 0
            if (i === 0) {
                firstName = "Rajesh Kumar";
                lastName = "Sharma";
                grade = "Unit Head";
                unit = "Aonla";
                dept = "Production";
            }
            // Suresh Chandra Verma (Worker, Electrical - Phulpur) -> Unit 1, idx 8 (Phulpur is index 10-19)
            if (i === 18) {
                firstName = "Suresh Chandra";
                lastName = "Verma";
                grade = "Worker";
                unit = "Phulpur";
                dept = "Electrical";
            }
            // Ananya Deshmukh (Manager, Quality Control - Kalol) -> Unit 2, idx 4 (Kalol index 20-29)
            if (i === 24) {
                firstName = "Ananya";
                lastName = "Deshmukh";
                grade = "Manager";
                unit = "Kalol";
                dept = "Quality Control";
            }
            // Vikram Singh Patel (Assistant Manager, Production - Kandla) -> Unit 3, idx 6 (Kandla index 30-39)
            if (i === 36) {
                firstName = "Vikram Singh";
                lastName = "Patel";
                grade = "Assistant Manager";
                unit = "Kandla";
                dept = "Production";
            }
            // Parthasarathy Basu (Chief Manager, Maintenance - Paradip) -> Unit 4, idx 2 (Paradip index 40-49)
            if (i === 42) {
                firstName = "Parthasarathy";
                lastName = "Basu";
                grade = "Chief Manager";
                unit = "Paradip";
                dept = "Electrical"; // Electrical/Maintenance context
            }

            const fullName = `${firstName} ${lastName}`;
            
            let username = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
            if (usedUsernames.has(username)) {
                username = `${username}${1000 + i}`;
            }
            usedUsernames.add(username);

            let email = `${firstName[0].toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@iffco.in`;
            if (usedEmails.has(email)) {
                email = `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}@iffco.in`;
            }
            if (usedEmails.has(email)) {
                email = `${firstName[0].toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}${1000 + i}@iffco.in`;
            }
            usedEmails.add(email);

            const empId = `IFFCO-${1000 + i}`;

            usersToSeed.push({
                username,
                email,
                password: hashedPassword,
                unit,
                grade,
                empId,
                department: dept,
                role: 'user'
            });
        }

        console.log(`Seeding ${usersToSeed.length} users...`);
        await User.insertMany(usersToSeed);
        console.log('Database seeded successfully!');

        // Display sample accounts
        console.log('\n--- SAMPLE SEEDED ACCOUNTS (Password: Iffco@2026) ---');
        const samples = [0, 18, 24, 36, 42];
        samples.forEach(idx => {
            const u = usersToSeed[idx];
            console.log(`Name: ${u.unit} | Grade: ${u.grade} | Dept: ${u.department} | Email: ${u.email} | Emp ID: ${u.empId}`);
        });

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
