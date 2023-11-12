import bcrypt from "bcryptjs";
import COINCAP_COINPAPRIKA_MAP from "../constants/coincap_coinpaprika_map";
import CURRENCIES from "../constants/currencies";
import TABLE_NAMES from "../constants/db-table-names";
import db from "./db";
import Logger from "./logger";

const deleteAllTables = async () => {
  await db.schema
    .dropTableIfExists(TABLE_NAMES.PORTFOLIO_TRANSACTIONS)
    .dropTableIfExists(TABLE_NAMES.PORTFOLIO)
    .dropTableIfExists(TABLE_NAMES.USERS)
    .dropTableIfExists(TABLE_NAMES.COINCAP_MAP)
    .dropTableIfExists(TABLE_NAMES.CURRENCY)
    .raw("DROP TYPE IF EXISTS transaction_type");
  Logger.info("All tables deleted");
};

const createTables = async () => {
  await db.schema
    .raw("CREATE TYPE transaction_type AS ENUM ( 'buy', 'sell', 'transfer_in', 'transfer_out' )")
    .createTable(TABLE_NAMES.CURRENCY, (table) => {
      table.string("code", 10).primary();
      table.string("coincap_id", 255).notNullable();
      table.string("currency_symbol", 10);
      table.string("icon_url", 255);
      table.string("full_name", 100);
    })
    .createTable(TABLE_NAMES.COINCAP_MAP, (table) => {
      table.string("coincap_id", 100).primary();
      table.string("coinpaprika_id", 100);
    })
    .createTable(TABLE_NAMES.USERS, (table) => {
      table.bigIncrements("id").primary();
      table.string("name", 80).notNullable();
      table.string("password", 80).notNullable();
      table.string("email", 255).notNullable().unique();
    })
    .createTable(TABLE_NAMES.PORTFOLIO, (table) => {
      table.string("nickname", 80).notNullable();
      table.bigint("user_id").notNullable();
      table.foreign("user_id").references("id").inTable(TABLE_NAMES.USERS);
      table.bigIncrements("id").primary();
      table.boolean("is_deleted").defaultTo(false);
    })
    .createTable(TABLE_NAMES.PORTFOLIO_TRANSACTIONS, (table) => {
      table.string("notes", 255);
      table.bigint("portfolio_id").notNullable();
      table.foreign("portfolio_id").references("id").inTable(TABLE_NAMES.PORTFOLIO);
      table.string("coincap_id", 100).notNullable();
      table.foreign("coincap_id").references("coincap_id").inTable(TABLE_NAMES.COINCAP_MAP);
      table.bigIncrements("id").primary();
      table.enu("type", null, { useNative: true, existingType: true, enumName: "transaction_type" });
      table.decimal("quantity", 20, 8).notNullable();
      table.timestamp("date").defaultTo(db.fn.now());
      table.decimal("price_per", 30, 15).notNullable();
      table.decimal("usd_rate", 30, 15).notNullable();
      table.string("currency_code", 10).notNullable();
      table.foreign("currency_code").references("code").inTable(TABLE_NAMES.CURRENCY);
    });
  Logger.info("Tables created");
};

const createUsers = async () => {
  let salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Password12", salt);
  await db(TABLE_NAMES.USERS).insert({
    name: "Chandra Panta",
    password: hashedPassword,
    email: "chandra@hotmail.com"
  });
  Logger.info("Created user");
};

export const populateCoincapCoinPaprikaMapTable = async () => {
  await db(TABLE_NAMES.COINCAP_MAP).insert(COINCAP_COINPAPRIKA_MAP).onConflict("coincap_id").ignore();
  Logger.info(`Populated ${TABLE_NAMES.COINCAP_MAP} table`);
};

export const populateCurrencyTable = async () => {
  await db(TABLE_NAMES.CURRENCY).insert(CURRENCIES).onConflict("code").ignore();
  Logger.info(`Populated ${TABLE_NAMES.CURRENCY} table`);
};

export default async () => {
  try {
    //Put inside same DB transaction
    Logger.info("Initilizing DB " + new Date().toLocaleTimeString());
    await deleteAllTables();
    await createTables();
    await createUsers();
    await populateCoincapCoinPaprikaMapTable();
    await populateCurrencyTable();
    Logger.info("Initialized DB " + new Date().toLocaleTimeString());
  } catch (err) {
    Logger.warn("Failed to initilize DB \n" + err);
  }
};
