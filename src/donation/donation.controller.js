const Donation = require("./donation.model");

exports.createDonation = async (req, res) => {
  try {
    const { itemName, type } = req.body;

    const donation = await Donation.create({
      itemName,
      type,
      available: true,
    });

    res.status(201).json({ status: "success", data: donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.deliveredTo) {
      updates.available = false;
    }

    const donation = await Donation.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!donation)
      return res.status(404).json({ message: "Donación no encontrada" });
    res.status(200).json({ status: "success", data: donation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const filter = req.query.available
      ? { available: req.query.available === "true" }
      : {};
    const donations = await Donation.find(filter);
    res.status(200).json({ status: "success", data: donations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation) {
      return res.status(404).json({ message: "Donación no encontrada" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Donación eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
