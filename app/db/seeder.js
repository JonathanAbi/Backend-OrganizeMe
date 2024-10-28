const User = require('../api/auth/model')
const db = require('../db')

const users = [
    {
        username: "adminUser",
        email: "admin@example.com",
        password: "password123", 
        isVerified: true,
        tasks: [], 
    },
    {
        username: "testUser1",
        email: "testuser1@example.com",
        password: "password123",
        isVerified: false,
        otpCode: "123456", 
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        tasks: [],
    },
    {
        username: "testUser2",
        email: "testuser2@example.com",
        password: "password123",
        isVerified: true,
        tasks: [],
    },
];

async function seedUsers() {
    try {
        // Cek jumlah data dalam collection User
        const userCount = await User.countDocuments();

        // Jika ada lebih dari 1 dokumen, hentikan proses seeding
        if (userCount > 1) {
            console.log("Data seeding skipped: Users already exist in the collection.");
            return;
        }

        // Jika tidak ada data, lakukan seeding
        await User.insertMany(users);
        console.log('Data seeding completed for users');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        db.connection.close(); // Tutup koneksi setelah seeding
    }
}

seedUsers();