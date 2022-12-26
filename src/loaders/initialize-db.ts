import postgres from "./postgres";
import Logger from "./logger";
import bcrypt from "bcryptjs";
import MarketsService from "../services/markets";
import { IMarketAssetIdMap, INamesToIds } from "../interfaces/IMarkets";

const deleteAllTables = async () => {
  await postgres`DROP TABLE IF EXISTS portfolio_transaction`;
  await postgres`DROP TABLE IF EXISTS portfolio_asset`;
  await postgres`DROP TABLE IF EXISTS portfolio`;
  await postgres`DROP TABLE IF EXISTS users`;
  await postgres`DROP TABLE IF EXISTS coincap_coinpaprika_map`;
  await postgres`DROP TABLE IF EXISTS currency`;
  await postgres`DROP TYPE IF EXISTS transaction_type`;
  Logger.info("All tables deleted");
};

const createTables = async () => {
  await postgres`CREATE TYPE transaction_type AS ENUM ( 'buy', 'sell', 'transfer_in', 'transfer_out' )`;
  await postgres`CREATE TABLE currency ( "code" varchar(30) PRIMARY KEY )`;
  await postgres`CREATE TABLE coincap_coinpaprika_map ( "coincap_id" varchar(50) PRIMARY KEY, "coinpaprika_id" varchar(50) )`;
  await postgres`CREATE TABLE users ( "id" BIGSERIAL PRIMARY KEY, "name" varchar(80) NOT NULL, "password" varchar(80) NOT NULL, "email" varchar(255) NOT NULL UNIQUE )`;
  await postgres`CREATE TABLE portfolio ( "nickname" varchar(80) NOT NULL, "user" int NOT NULL, "id" int PRIMARY KEY, "is_deleted" boolean DEFAULT false )`;
  await postgres`CREATE TABLE portfolio_asset ( "portfolio" int NOT NULL, "id" int PRIMARY KEY, "coincap_id" varchar(80) NOT NULL, "total_invested" decimal DEFAULT 0, "total_holdings" decimal DEFAULT 0 )`;
  await postgres`CREATE TABLE portfolio_transaction ( "id" int PRIMARY KEY, "type" transaction_type NOT NULL, "quantity" decimal NOT NULL, "date" timestamp NOT NULL DEFAULT (now()), "price_per_usd" decimal NOT NULL, "notes" varchar(255), "asset" int NOT NULL )`;
  await postgres`ALTER TABLE portfolio ADD FOREIGN KEY ("user") REFERENCES "users" ("id")`;
  await postgres`ALTER TABLE portfolio_asset ADD FOREIGN KEY ("portfolio") REFERENCES "portfolio" ("id")`;
  await postgres`ALTER TABLE portfolio_asset ADD FOREIGN KEY ("coincap_id") REFERENCES "coincap_coinpaprika_map" ("coincap_id")`;
  await postgres`ALTER TABLE portfolio_transaction ADD FOREIGN KEY ("asset") REFERENCES "portfolio_asset" ("id")`;
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
    if (c.name.length !== 0) {
      coincapNameToIds[c.name] = c.id;
    }
  }
  const coinPaprikaNameToIds: INamesToIds = {};
  for (let c of coinPaprikaCoins) {
    if (c.is_active) {
      coinPaprikaNameToIds[c.name] = c.id;
    }
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
  await postgres`INSERT INTO coincap_coinpaprika_map ${postgres(idMaps)} ON CONFLICT(coincap_id) DO NOTHING`;
  Logger.info("Created coincap to coinpaprika mappings");
};

export default async () => {
  try {
    Logger.info("Initilizing DB " + new Date().toLocaleTimeString());
    await deleteAllTables();
    await createTables();
    await createUsers();
    await mapCoincapToCoinPaprika();
    Logger.info("Done initilizing DB " + new Date().toLocaleTimeString());
  } catch (err) {
    Logger.warn("Failed to initilize DB \n" + err);
  }
};
