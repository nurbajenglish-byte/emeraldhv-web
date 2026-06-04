exports.handler = async function(event, context) {
  const EARLY_BIRD_CUTOFF = new Date("2026-09-30T23:59:59Z");
  const earlyBird = new Date() <= EARLY_BIRD_CUTOFF;
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ earlyBird, cutoff: EARLY_BIRD_CUTOFF })
  };
};
