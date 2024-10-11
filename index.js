const app = require('./app.js');
const { connectDB, closeDB } = require('./config/db.js');

const start = async () => {
  console.log('Starting Assignment Submission portal.');
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    console.log(process.env.MONGO_URI);
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await connectDB();

    process.on('SIGINT', () => closeDB())
    process.on('SIGTERM', ()=> closeDB());
  } catch (err) {
    console.error(err);
  }

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port 3000');
  });
};
start();

