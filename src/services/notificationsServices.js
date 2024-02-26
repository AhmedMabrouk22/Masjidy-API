const { Notifications, Masjid, Sheikh } = require("./../models/index");

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
