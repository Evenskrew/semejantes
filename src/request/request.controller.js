const Request = require("./request.model");

exports.createRequest = async (req, res) => {
  try {
    const isCoordinator = req.user.role === "Coordinator";
    const status = isCoordinator ? "approved" : "pending";
    const resolutionData = isCoordinator
      ? { resolvedBy: req.user.id, resolutionDate: new Date() }
      : {};

    const newReq = await Request.create({
      ...req.body,
      applicantId: req.user.id,
      status,
      ...resolutionData,
    });

    res.status(201).json({ status: "success", data: newReq });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resolveRequest = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const request = await Request.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolvedBy: req.user.id,
        resolutionDate: new Date(),
      },
      { new: true }
    );

    if (!request)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    console.log(`Notificación: Solicitud ${request._id} ha sido ${status}`);

    res.status(200).json({ status: "success", data: request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const filter =
      req.user.role === "Coordinator" ? {} : { applicantId: req.user.id };
    const requests = await Request.find(filter);
    res.status(200).json({ status: "success", data: requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
