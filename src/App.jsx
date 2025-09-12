import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const res = await fetch("/api/ask", { /* ... */ });
  const text = await res.text();
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = text ? (isJson ? JSON.parse(text) : { error: "Non-JSON response", raw: text }) : { error: `Empty response (status ${res.status})` };


  const ask = async () => {
    setLoading(true);
    setReply("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "sonar",
          messages: [{ role: "user", content: input }]
        })
      });
      const json = await res.json();
      const replyText = json?.choices?.?.message?.content ?? JSON.stringify(json, null, 2);
      setReply(replyText);
    } catch (e) {
      setReply(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>SWA + Perplexity</h1>
      <textarea
        rows={5}
        style={{ width: "100%" }}
        placeholder="Ask something…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={ask} disabled={loading || !input.trim()}>
          {loading ? "Asking…" : "Ask"}
        </button>
      </div>
      <pre style={{ marginTop: "1rem", background: "#f6f8fa", padding: "1rem", whiteSpace: "pre-wrap" }}>
        {reply}
      </pre>
    </main>
  );
}
