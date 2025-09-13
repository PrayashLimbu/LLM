import { app } from "@azure/functions";

app.http("ask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const { model = "sonar", messages = [] } = await request.json();
      const apiKey = process.env.PERPLEXITY_API_KEY;

      if (!apiKey) {
        return { status: 500, jsonBody: { error: "Missing PERPLEXITY_API_KEY" } };
      }

      const resp = await fetch(`https://api.perplexity.ai/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages })
      });

      // Robust upstream parsing
      const raw = await resp.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : { error: "Empty response from upstream" };
      } catch {
        data = { error: "Non-JSON response from upstream", raw };
      }

      return {
        status: resp.ok ? 200 : resp.status,
        jsonBody: data
      };
    } catch (err) {
      return {
        status: 500,
        jsonBody: { error: "Proxy error", details: String(err) }
      };
    }
  }
});
