const dataBase = require("../database");

let createTables= async () => {
    try {
        //Newsletter Subscribers
        await dataBase.query(`
            CREATE TABLE newsletter_subscribers (
                newsletter_id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(40) NOT NULL UNIQUE
            );
        `)

        //Users
        await dataBase.query(`
            CREATE TABLE users (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(40) NOT NULL,
                email VARCHAR(40) NOT NULL UNIQUE,
                password_hash VARCHAR(60) NOT NULL
            );
        `)

        //Listings
        await dataBase.query(`
            CREATE TABLE listings (
                listings_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(50) NOT NULL,
                details TEXT NOT NULL,
                monthly_rent DECIMAL(7,2) NOT NULL,
                bedrooms INT NOT NULL,
                bathrooms INT NOT NULL,
                square_feet INT NOT NULL,
                address VARCHAR(50) NOT NULL,
                pet_policy BOOLEAN,
                contact_email VARCHAR(40),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
        `)

        //Listing Photos
        await dataBase.query(`
            CREATE TABLE listing_photos (
                listings_photos_id INT AUTO_INCREMENT PRIMARY KEY,
                listings_id INT NOT NULL,
                photo_url VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (listings_id) REFERENCES listings(listings_id) ON DELETE CASCADE
            );
        `)
    } catch (error) {
        console.log(`ERROR Creating Tables: ${error}`);
    } finally{
        dataBase.end();
    }
}

createTables();