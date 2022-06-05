import postgres from "./postgres";
import Logger from "./logger";
import bcrypt from "bcryptjs";

const dropDatabase = async () => {
  try {
    await postgres`DROP SCHEMA IF EXISTS public CASCADE`;
    await postgres`CREATE SCHEMA public`;
  } catch (err) {
    Logger.error("Error dropping database");
  }
};

const createTables = async () => {
  await postgres`CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR (80) NOT NULL, password VARCHAR (80) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL)`;
};

const addDummyData = async () => {
  let salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password", salt);
  await postgres`INSERT INTO users (name, password, email) VALUES('Chandra Panta', ${hashedPassword}, 'chandra@hotmail.com')`;
};

export default async () => {
  Logger.info("Starting to seed db");
  await dropDatabase();
  await createTables();
  await addDummyData();
  Logger.info("Done seeding db");
};
