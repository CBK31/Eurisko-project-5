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
  axiosApiInfo: {
    apiKey: process.env.AXIOS_API_KEY,
    senderEmail: process.env.SENDER_EMAIL,
  },
});
