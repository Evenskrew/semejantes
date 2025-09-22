const mongoose = require("mongoose");
const Event = require("./event.model");

exports.createEvent = async (req, res) => {
  try {
    if (req.user.role !== "Coordinator") {
      return res.status(403).json({ status: "fail", message: "Not allowed" });
    }

    const { description, date, hour } = req.body;

    const event = new Event({
      description,
      date,
      hour,
    });

    await event.save();

    res.status(201).json({ status: "success", data: event });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate(
      "participantes",
      "_id username email"
    );
    res.status(200).json({ status: "success", data: events });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.participateEvent = async (req, res) => {
  try {
    if (req.user.role !== "Volunteer") {
      return res.status(403).json({
        status: "fail",
        message: "Solo Voluntarios deben inscribirse",
      });
    }

    const { id } = req.params;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        $addToSet: { participantes: req.user._id },
      },
      { new: true }
    ).populate("participantes", "username");

    if (!updatedEvent) {
      return res.status(404).json({
        status: "fail",
        message: "Evento no encontrado",
      });
    }

    res.status(200).json({ status: "success", data: updatedEvent });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== "Coordinator") {
      return res.status(403).json({ status: "fail", message: "Not allowed" });
    }

    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    if (req.user.role !== "Coordinator") {
      return res.status(403).json({ status: "fail", message: "Not allowed" });
    }

    const { id } = req.params;
    const { description, date, hour } = req.body;

    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (hour !== undefined) event.hour = hour;

    await event.save();

    res.status(200).json({ status: "success", data: event });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
