export default () => ({
  database: {
    connectionString: process.env.CONNECTION_STRING,
  },
  server: {
    port: process.env.PORT,
  },
  secret: {
    JWTsecretKey: process.env.JWT_SECRET_KEY,
  },
});
