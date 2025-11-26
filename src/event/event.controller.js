const mongoose = require("mongoose");
const Event = require("./event.model");

exports.createEvent = async (req, res) => {
  const { description, date, duration } = req.body;

  const event = new Event({
    description,
    date,
    duration,
  });

  await event.save();

  res.status(201).json({ status: "success", data: event });
};

exports.getEvents = async (req, res) => {
  const events = await Event.find().populate(
    "participantes",
    "_id username email"
  );
  res.status(200).json({ status: "success", data: events });
};

exports.participateEvent = async (req, res) => {
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
};

exports.deleteEvent = async (req, res) => {
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
};

exports.updateEvent = async (req, res) => {
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
};
// Buscar como cambiar el try/catch
exports.addEventReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { postDescription } = req.body;
    const event = await Event.findById(id);

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Evento no encontrado" });
    }

    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate > now) {
      return res.status(400).json({
        status: "fail",
        message: "Solo se pueden editar eventos que ya ocurrieron",
      });
    }

    if (postDescription) event.postDescription = postDescription;

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
      event.postImages = (event.postImages || []).concat(imagePaths);
    }

    await event.save();

    res.status(200).json({
      status: "success",
      message: "Detalles del evento actualizados correctamente",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
