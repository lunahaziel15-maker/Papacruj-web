"use client";

import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "¡Hola! 👋 Soy el asistente de **Papacruj**. Pregúntame por sabores, precios o envíos." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const msg = res.status === 429 ? "Vas muy rápido 😅, espera un minuto e intenta de nuevo." : "Ups, algo falló. Intenta de nuevo.";
        setMessages([...next, { role: "assistant", content: msg }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...next, { role: "assistant", content: acc }]);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: "Sin conexión. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir chat"
        style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 90, width: "60px", height: "60px", borderRadius: "50%", border: "none", backgroundColor: "#800020", color: "#FFF", fontSize: "1.6rem", cursor: "pointer", boxShadow: "0 8px 20px rgba(128,0,32,0.4)" }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{ position: "fixed", bottom: "5.5rem", right: "1.25rem", zIndex: 90, width: "min(380px, calc(100vw - 2.5rem))", height: "min(520px, 70vh)", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid rgba(17,24,39,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          <div style={{ backgroundColor: "#800020", color: "#FFF", padding: "0.9rem 1.25rem", fontWeight: 800 }}>
            Asistente Papacruj
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", backgroundColor: m.role === "user" ? "#800020" : "#F3F4F6", color: m.role === "user" ? "#FFF" : "#111827", padding: "0.6rem 0.9rem", borderRadius: "16px", lineHeight: 1.5 }}
              >
                {m.role === "assistant" ? <Streamdown>{m.content || "…"}</Streamdown> : m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            style={{ display: "flex", gap: "0.5rem", padding: "0.75rem", borderTop: "1px solid rgba(17,24,39,0.08)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, border: "1px solid rgba(17,24,39,0.15)", borderRadius: "9999px", padding: "0.6rem 1rem", fontSize: "0.9rem", outline: "none", color: "#111827" }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#800020", color: "#FFF", border: "none", borderRadius: "9999px", padding: "0 1.1rem", fontWeight: 700, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}