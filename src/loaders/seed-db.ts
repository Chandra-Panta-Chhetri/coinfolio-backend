import db from "./db";
import Logger from "./logger";
import bcrypt from "bcryptjs";
import MarketsService from "../services/markets";
import { IMarketAssetIdMap, INamesToIds } from "../interfaces/IMarkets";

const deleteAllTables = async () => {
  await db.schema
    .dropTableIfExists("portfolio_transaction")
    .dropTableIfExists("portfolio_asset")
    .dropTableIfExists("portfolio")
    .dropTableIfExists("users")
    .dropTableIfExists("coincap_coinpaprika_map")
    .dropTableIfExists("currency")
    .raw("DROP TYPE IF EXISTS transaction_type");
  Logger.info("All tables deleted");
};

const createTables = async () => {
  await db.schema
    .raw("CREATE TYPE transaction_type AS ENUM ( 'buy', 'sell', 'transfer_in', 'transfer_out' )")
    .createTable("currency", (table) => {
      table.string("code", 10).primary();
    })
    .createTable("coincap_coinpaprika_map", (table) => {
      table.string("coincap_id", 100).primary();
      table.string("coinpaprika_id", 100);
    })
    .createTable("users", (table) => {
      table.bigIncrements("id").primary();
      table.string("name", 80).notNullable();
      table.string("password", 80).notNullable();
      table.string("email", 255).notNullable().unique();
    })
    .createTable("portfolio", (table) => {
      table.string("nickname", 80).notNullable();
      table.bigint("user_id").notNullable();
      table.foreign("user_id").references("id").inTable("users");
      table.bigIncrements("id").primary();
      table.boolean("is_deleted").defaultTo(false);
    })
    .createTable("portfolio_asset", (table) => {
      table.bigint("portfolio_id").notNullable();
      table.foreign("portfolio_id").references("id").inTable("portfolio");
      table.string("coincap_id", 30).notNullable();
      table.foreign("coincap_id").references("coincap_id").inTable("coincap_coinpaprika_map");
      table.bigIncrements("id").primary();
      table.decimal("total_invested").defaultTo(0);
      table.decimal("total_holdings").defaultTo(0);
    })
    .createTable("portfolio_transaction", (table) => {
      table.string("notes", 255);
      table.bigint("asset_id").notNullable();
      table.foreign("asset_id").references("id").inTable("portfolio_asset");
      table.bigIncrements("id").primary();
      table.enu("type", null, { useNative: true, existingType: true, enumName: "transaction_type" });
      table.decimal("quantity").notNullable();
      table.timestamp("date").defaultTo(db.fn.now());
      table.decimal("price_per_usd").notNullable();
    });
  Logger.info("Tables created");
};

const createUsers = async () => {
  let salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password12", salt);
  await db("users").insert({
    name: "Chandra Panta",
    password: hashedPassword,
    email: "chandra@hotmail.com"
  });
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
  await db("coincap_coinpaprika_map").insert(idMaps).onConflict("coincap_id").ignore();
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
