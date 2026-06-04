module.exports = function handler(req, res) {
  const EARLY_BIRD_CUTOFF = new Date("2026-09-30T23:59:59Z");
  const earlyBird = new Date() <= EARLY_BIRD_CUTOFF;
  res.status(200).json({ earlyBird, cutoff: EARLY_BIRD_CUTOFF });
};
