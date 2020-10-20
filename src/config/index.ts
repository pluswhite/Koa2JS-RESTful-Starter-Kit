export interface Database {
  connectStr: string;
}

export interface AppConfig {
  secret: string;
  database: Database;
}

const config: AppConfig = {
  secret: process.env.SESSION_SECRET,
  database: {
    connectStr: process.env.MONGODB_URI,
  },
};

export default config;
