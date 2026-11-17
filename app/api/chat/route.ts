import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const maxDuration = 30;

// ---- Rate limit simple: 10 mensajes por minuto por IP ----
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const SYSTEM_PROMPT = `Eres el asistente virtual oficial de Papacruj, una marca artesanal de chips de taro de León, Guanajuato, con envíos a todo México.
REGLA ESTRICTA: NUNCA utilices emojis en tus respuestas bajo ninguna circunstancia. Mantén un tono formal, limpio y profesional.
Datos que debes usar:
- Cada bolsa es de 100 gr y cuesta $50.
- Sabores: Adobadas, Especie con Crema, Salsa Negra y Habanero Limón.
- Hay paquetes para fiestas y reuniones (desde 20 bolsas) y mayoreo para negocios.
- Pagos: transferencia (BBVA / Santander), efectivo al recibir y tarjeta por enlace seguro.
- Los pedidos se hacen por WhatsApp: 477 726 9595.
- Los chips tienen 0 mg de grasas trans, 0 mg de colesterol, son altos en fibra, bajos en sodio y sin conservadores artificiales.
Responde siempre en español, de forma breve, amable y clara. Si no sabes algo, invita al cliente a escribir por WhatsApp. No inventes precios ni promociones.`;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

    if (isRateLimited(ip)) {
      return new Response("Demasiadas peticiones, intenta en un minuto.", { status: 429 });
    }

    const body = await req.json();
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Limitamos el historial y el tamaño
    const messages = incoming.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content).slice(0, 1000),
    }));

    const result = streamText({
      model: groq("openai/gpt-oss-20b"), // <--- Usa "openai/gpt-oss-20b" o "openai/gpt-oss-120b"
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error en /api/chat:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}