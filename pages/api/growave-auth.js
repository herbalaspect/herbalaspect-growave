import crypto from "node:crypto";

export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .json({ error: "Method Not Allowed", allowed: ["POST"] });
    }

    const { shopifyCustomerId } = req.body || {};

    if (!shopifyCustomerId) {
      return res
        .status(400)
        .json({ error: "Missing shopifyCustomerId in request body" });
    }

    const secretKey = process.env.GROWAVE_SECRET_KEY;
    if (!secretKey) {
      // Misconfiguration on the server side
      return res
        .status(500)
        .json({ error: "Server misconfigured: missing GROWAVE_SECRET_KEY" });
    }

    const signatureTimestamp = Math.floor(Date.now() / 1000);
    const raw = `${shopifyCustomerId}${signatureTimestamp}${secretKey}`;
    const signature = crypto
      .createHash("sha1")
      .update(raw, "utf8")
      .digest("hex");

    return res.status(200).json({
      shopifyCustomerId,
      signatureTimestamp,
      signature,
    });
  } catch (err) {
    console.error("growave-auth error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
