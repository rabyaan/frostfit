const bcrypt = require('bcrypt');
const { query } = require('./src/lib/db');

async function createAdmin() {
    const adminName = 'Rabyaan';  // Admin's name
    const adminEmail = 'r@r.com';  // Admin's email
    const adminPassword = '123';  // Admin's plain-text password

    // Hash the password before storing it
    const saltRounds = 10;  // Number of rounds for salt generation
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    try {
        // Insert the new admin into the Admin table
        const result = await query(
            'INSERT INTO Admin (Name, Email, PasswordHash) VALUES (?, ?, ?)',
            [adminName, adminEmail, hashedPassword]
        );
        
        console.log('Admin created successfully:', result);
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

// Call the function to create an admin
createAdmin();
