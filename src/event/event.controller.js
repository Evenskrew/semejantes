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
    const events = await Event.find().sort({ date: -1 });

    res.status(200).json({ status: "success", data: events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.participateEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

    const alreadyJoined = event.participantes.some(
      (p) => String(p) === String(userId)
    );

    if (alreadyJoined) {
      return res
        .status(400)
        .json({ status: "fail", message: "Ya estás inscrito en este evento." });
    }

    event.participantes.push(userId);
    await event.save();

    const user = await User.findByPk(userId);
    if (user) {
      await user.increment("hoursContributed", { by: event.duration || 0 });
    }

    res.status(200).json({
      status: "success",
      message: "Inscripción exitosa. Horas registradas.",
      data: event,
    });
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

exports.leaveEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

    const isParticipant = event.participantes.some(
      (p) => String(p) === String(userId)
    );

    if (!isParticipant) {
      return res
        .status(400)
        .json({ status: "fail", message: "No estás inscrito en este evento." });
    }

    event.participantes.pull(userId);
    await event.save();

    const user = await User.findByPk(userId);
    if (user) {
      await user.decrement("hoursContributed", { by: event.duration || 0 });
    }

    res.status(200).json({
      status: "success",
      message: "Has abandonado el evento correctamente.",
      data: event,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
