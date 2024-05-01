const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // title: { type: String, required: true },
    description: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;
