import dotenv from "dotenv";
dotenv.config();

export default {
  port: parseInt(process.env.PORT!),
  jwtSecret: process.env.JWT_SECRET!,
  api: {
    prefix: "/api"
  },
  env: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!),
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false
          }
        : undefined
  },
  logs: {
    level: process.env.LOG_LEVEL
  },
  newsAPI: {
    cryptoPanic: `https://cryptopanic.com/api/v1/posts/?auth_token=${process.env.CRYPTO_PANIC_KEY}&public=true`
  },
  eventsAPI: {
    coinMarketCal: "https://developers.coinmarketcal.com/v1",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "deflate, gzip",
      "x-api-key": process.env.COIN_MARKET_CAL_KEY!
    }
  },
  icons: {
    events: "https://d235dzzkn2ryki.cloudfront.net",
    markets: "https://assets.coincap.io/assets/icons"
  },
  marketsAPI: {
    coinCapGraphql: "https://graphql.coincap.io",
    headers: {
      "content-type": "application/json"
    },
    coinCap: "https://api.coincap.io/v2",
    coinPaprika: "https://api.coinpaprika.com/v1"
  }
};
