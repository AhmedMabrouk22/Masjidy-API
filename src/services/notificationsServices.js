const { Notifications, Masjid, Sheikh } = require("./../models/index");

/**
 * Retrieves notifications from the database including related Masjid and Sheikh information.
 *
 * @return {Array} The array of notifications retrieved from the database
 */
exports.getNotifications = async () => {
  try {
    const notifications = await Notifications.findAll({
      attributes: [],
      include: [
        {
          model: Masjid,
          attributes: ["id", "name"],
        },
        {
          model: Sheikh,
          attributes: ["id", "name"],
        },
      ],
    });

    return notifications;
  } catch (error) {
    throw error;
  }
};
