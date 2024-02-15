module.exports = (data, obj) => {
  let object = {};
  for (const [key, value] of Object.entries(data)) {
    if (key in obj) {
      object[key] = value;
    }
  }
  return object;
};
