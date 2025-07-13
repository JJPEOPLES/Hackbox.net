// Netlify Function to handle user data in the Neon database
const { neon } = require('@netlify/neon');

exports.handler = async function(event, context) {
  // Create a SQL client using the NETLIFY_DATABASE_URL environment variable
  const sql = neon();
  
  // Get the HTTP method
  const httpMethod = event.httpMethod;
  
  try {
    // Create the users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        settings JSONB DEFAULT '{}'::jsonb
      )
    `;
    
    // Handle different HTTP methods
    if (httpMethod === 'GET') {
      // Get all users
      const users = await sql`SELECT id, username, last_login, settings FROM users ORDER BY id`;
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Users retrieved successfully",
          users: users
        })
      };
    } 
    else if (httpMethod === 'POST') {
      // Parse the request body
      const requestBody = JSON.parse(event.body);
      const { username, settings } = requestBody;
      
      if (!username) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Username is required" })
        };
      }
      
      // Insert a new user or update if exists
      const result = await sql`
        INSERT INTO users (username, settings, last_login)
        VALUES (${username}, ${settings || {}}, CURRENT_TIMESTAMP)
        ON CONFLICT (username) 
        DO UPDATE SET last_login = CURRENT_TIMESTAMP, settings = COALESCE(${settings}, users.settings)
        RETURNING id, username, last_login, settings
      `;
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "User data saved successfully",
          user: result[0]
        })
      };
    }
    else {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" })
      };
    }
  } catch (error) {
    console.error("Database error:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error processing user data", 
        error: error.message 
      })
    };
  }
};