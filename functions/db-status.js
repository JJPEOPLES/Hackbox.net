// Netlify Function to check database status and demonstrate Neon DB usage
const { neon } = require('@netlify/neon');

exports.handler = async function(event, context) {
  try {
    // Create a SQL client using the NETLIFY_DATABASE_URL environment variable
    const sql = neon();
    
    // Query the database to check connection and get current timestamp
    const result = await sql`SELECT NOW() as current_time`;
    
    // Return the database status and timestamp
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Database connection successful",
        timestamp: new Date().toISOString(),
        database_time: result[0].current_time,
        status: "connected"
      })
    };
  } catch (error) {
    console.error("Database connection error:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error connecting to database", 
        error: error.message 
      })
    };
  }
};