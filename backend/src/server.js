require('dotenv').config();

const app = require('./app');
const port = process.env.PORT || 3000;

const connectDB = require('./config/db');
connectDB();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
