import crypto from "node:crypto";

export default async (request, context) => {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await request.json().catch(() => null);
  const shopifyCustomerId = body?.shopifyCustomerId;
  if (!shopifyCustomerId) {
    return new Response(
      JSON.stringify({ error: "Missing shopifyCustomerId" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const secretKey = context.env.GROWAVE_SECRET_KEY;
  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: "Missing secret key" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const signatureTimestamp = Math.floor(Date.now() / 1000);
  const raw = `${shopifyCustomerId}${signatureTimestamp}${secretKey}`;
  const signature = crypto.createHash("sha1").update(raw, "utf8").digest("hex");

  return new Response(
    JSON.stringify({ shopifyCustomerId, signatureTimestamp, signature }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};
