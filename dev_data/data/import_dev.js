const axios = require("axios");
const fs = require("fs");

const Masjid = require("./../../src/models/masjidModel");

const url = "http://localhost:3000";

const masjids = JSON.parse(
  fs.readFileSync(`${__dirname}/masjid.json`, "utf-8")
);

function convertToFormData(obj) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(obj)) {
    formData.append(key, value);
  }

  return formData;
}

const importData = async () => {
  try {
    // login and get access token and refresh token
    const res = await axios.post(`${url}/api/v1/auth/login`, {
      email: "admin@admin.com",
      password: "123456789",
    });

    const accessToken = res.data.data.user.access_token;
    const refreshToken = res.data.data.user.refresh_token;

    // import data
    for (let i = 0; i < masjids.length; ++i) {
      const data = masjids[i];
      const formData = convertToFormData(data);
      await axios.post(`${url}/api/v1/masjids`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          access_token: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refreshToken}`,
        },
      });
      console.log("data imported");
    }
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Masjid.destroy({
      where: {},
    });
    console.log("masjids data deleted");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
