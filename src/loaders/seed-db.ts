import postgres from "./postgres";

const dropDatabase = async () => {
  try {
    await postgres.pool.query("DROP SCHEMA IF EXISTS public CASCADE");
    await postgres.pool.query("CREATE SCHEMA public");
  } catch (err) {
    console.log(err.message);
  }
};

const createTables = async () => {
  await postgres.pool.query(
    "CREATE TABLE users (userid serial PRIMARY KEY, fullname VARCHAR (80) NOT NULL, password VARCHAR (80) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL)"
  );
};

const addDummyData = async () => {
  await postgres.pool.query(
    "INSERT INTO users (fullName, password, email) VALUES($1, $2, $3)",
    ["Chandra Panta", "Password", "chandra.panta345@hotmail.com"]
  );
};

export default async () => {
  console.log("Starting to seed db");
  await dropDatabase();
  await createTables();
  await addDummyData();
  console.log("Done seeding db");
};
