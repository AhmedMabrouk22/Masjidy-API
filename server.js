const dotenv = require("./src/config/environment");
const sequelize = require("./src/config/db");
const app = require("./src/config/app");

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection");
  })
  .catch((err) => {
    console.log(err.message);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});
