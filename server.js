const dotenv = require("./src/config/environment");
const app = require("./src/config/app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});
