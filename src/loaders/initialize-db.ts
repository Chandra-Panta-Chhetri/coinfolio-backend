import postgres from "./postgres";
import Logger from "./logger";
import bcrypt from "bcryptjs";
import MarketsService from "../services/markets";
import { IMarketAssetIdMap, INamesToIds } from "../interfaces/IMarkets";

const dropDatabase = async () => {
  try {
    await postgres`DROP SCHEMA IF EXISTS public CASCADE`;
    await postgres`CREATE SCHEMA public`;
    Logger.info("All Tables dropped");
  } catch (err) {
    Logger.error("Error dropping database");
  }
};

const createTables = async () => {
  await postgres`CREATE TABLE users (id serial PRIMARY KEY, name VARCHAR (80) NOT NULL, password VARCHAR (80) NOT NULL, email VARCHAR (255) UNIQUE NOT NULL)`;
  await postgres`CREATE TABLE coincap_coinpaprika_id (coincap_id VARCHAR (80) PRIMARY KEY, coinpaprika_id VARCHAR (80))`;
  Logger.info("Tables created");
};

const createUsers = async () => {
  let salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password12", salt);
  await postgres`INSERT INTO users (name, password, email) VALUES('Chandra Panta', ${hashedPassword}, 'chandra@hotmail.com')`;
  Logger.info("Created users");
};

export const mapCoincapToCoinPaprika = async () => {
  const ms = new MarketsService();

  //get all coins from coincap
  let page = 1;
  let perPage = 2000;
  const coincapCoins = [];
  while (true) {
    let coincapRes = await ms.getAssets({ limit: perPage, offset: perPage * (page - 1) });
    if (coincapRes.length === 0) {
      break;
    }
    coincapCoins.push(...coincapRes);
    page += 1;
  }

  //get all coins from coinpaprika
  const coinPaprikaCoins = await ms.getCoinPaprikaAssets();

  //create dictionaries for both coins
  const coincapNameToIds: INamesToIds = {};
  for (let c of coincapCoins) {
    coincapNameToIds[c.name] = c.id;
  }
  const coinPaprikaNameToIds: INamesToIds = {};
  for (let c of coinPaprikaCoins) {
    coinPaprikaNameToIds[c.name] = c.id;
  }

  //merge dictionaries using symbols
  const idMaps: IMarketAssetIdMap[] = [];
  for (let name in coincapNameToIds) {
    idMaps.push({
      coincap_id: coincapNameToIds[name],
      coinpaprika_id: coinPaprikaNameToIds[name] || null
    });
  }

  //add to DB
  await postgres`INSERT INTO coincap_coinpaprika_id ${postgres(
    idMaps
  )} ON CONFLICT(coincap_id) DO UPDATE SET coinpaprika_id = EXCLUDED.coinpaprika_id`;
  Logger.info("Created coincap to coinpaprika mappings");
};

export default async () => {
  Logger.info("Starting to seed db");
  await dropDatabase();
  await createTables();
  await createUsers();
  await mapCoincapToCoinPaprika();
  Logger.info("Done seeding db");
};
