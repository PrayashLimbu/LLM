import { app } from "@azure/functions";

app.http("ask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { model = "sonar", messages = [] } = await request.json();
      const apiKey = process.env.PERPLEXITY_API_KEY;
      const baseUrl = process.env.PERPLEXITY_BASE_URL || "https://api.perplexity.ai";

      if (!apiKey) {
        return { status: 500, jsonBody: { error: "Missing PERPLEXITY_API_KEY" } };
      }

      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages })
      });

      const data = await resp.json();
      return {
        status: resp.ok ? 200 : resp.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      };
    } catch (err) {
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Proxy error", details: String(err) })
      };
    }
  }
});
