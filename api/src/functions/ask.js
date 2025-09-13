import { app } from "@azure/functions";

app.http("ask", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const { model = "sonar", messages = [] } = await request.json();
    return { jsonBody: { echo: { model, messages } } };
  }
});
