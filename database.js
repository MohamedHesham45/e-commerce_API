const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'ITians_DB'; 

let db;

const connectDB = async () => {
  if (db) {
    return db;
  }

  const client = new MongoClient(url); 
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to database: ${dbName}`);
  return db;
};

module.exports = connectDB;
