const Event = require("./event.model");

exports.createEvent = async (req, res) => {
  const { description, date, time, duration } = req.body;

  try {
    const event = new Event({
      description,
      date,
      time,
      duration: duration || 1,
    });

    await event.save();
    res.status(201).json({ status: "success", data: event });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ status: "success", data: events });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.participateEvent = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { participantes: userId } },
      { new: true }
    );

    if (!updatedEvent)
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });

    res.status(200).json({ status: "success", data: updatedEvent });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.hour) {
      updates.time = updates.hour;
      delete updates.hour;
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!updatedEvent)
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    res.status(200).json({ status: "success", data: updatedEvent });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event)
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    res.status(200).json({ status: "success", message: "Eliminado" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
