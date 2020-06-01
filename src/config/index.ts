const config = {
  secret: process.env.SESSION_SECRET,
  database: {
    connectStr: process.env.MONGODB_URI,
  },
};

export default config;
