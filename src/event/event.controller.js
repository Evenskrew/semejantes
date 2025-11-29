const Event = require("./event.model");
const { User } = require("../user/user.model");

exports.createEvent = async (req, res) => {
  const { title, description, date, time, duration, place, requirements } =
    req.body;

  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.location);
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      duration,
      place,
      requirements,
      images: imageUrls,
      participantes: [],
    });
    res.status(201).json({ status: "success", data: event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ status: "success", data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    if (req.files && req.files.length > 0) {
      const newUrls = req.files.map((file) => file.location);
      updates.images = newUrls;
    }

    if (updates.hour) {
      updates.time = updates.hour;
      delete updates.hour;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

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

exports.generateCertificate = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const event = await Event.findById(id);
    if (!event || !event.participantes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "No participaste en este evento o no existe" });
    }
    res.status(200).json({
      status: "success",
      data: {
        title: event.title,
        date: event.date,
        place: event.place,
        hours: event.duration,
        message: "Certificado de participación validado.",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
