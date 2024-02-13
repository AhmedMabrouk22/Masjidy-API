module.exports = (lng, lat) => {
  const point = {
    type: "Point",
    coordinates: [lng, lat],
  };
  return point;
};
