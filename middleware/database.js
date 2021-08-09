import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';
const uri = `mongodb+srv://admin:${process.env.MONGO_DB_PASS}@convo.b647v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  await client.connect();
  req.dbClient = client;
  req.db = client.db('convo');
  req.dbkeys = Object.keys(client);
  return next();
}
const middleware = nextConnect();
middleware.use(database);
export default middleware;
