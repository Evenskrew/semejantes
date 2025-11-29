const Event = require("../event/event.model");
const { User } = require("../user/user.model");

async function calculateStats(startDate, endDate) {
  const events = await Event.find({
    date: { $gte: startDate, $lte: endDate },
  });

  let totalHours = 0;
  let uniqueVolunteers = new Set();

  events.forEach((ev) => {
    if (ev.duration && ev.participantes) {
      totalHours += ev.duration * ev.participantes.length;
      ev.participantes.forEach((p) => uniqueVolunteers.add(p));
    }
  });

  return {
    totalEvents: events.length,
    totalHoursContributed: totalHours,
    totalVolunteersParticipated: uniqueVolunteers.size,
  };
}

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month)
      return res.status(400).json({ message: "Requiere ?year=YYYY&month=MM" });

    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const end = `${year}-${month.toString().padStart(2, "0")}-31`;

    const stats = await calculateStats(start, end);

    res.status(200).json({
      status: "success",
      period: "Monthly",
      date: `${year}-${month}`,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnnualReport = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: "Requiere ?year=YYYY" });

    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const stats = await calculateStats(start, end);

    res.status(200).json({
      status: "success",
      period: "Annual",
      year: year,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
