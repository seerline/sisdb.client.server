export default {
  port: 3000,
  mongoUrl: 'mongodb://localhost:27017/project_db',
  redises: [
    {
      host: 'localhost',
      port: 6379,
    },
    {
      host: 'localhost',
      port: 16379,
    },
  ],
}
