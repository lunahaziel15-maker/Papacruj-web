"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Streamdown } from "streamdown";

const WhatsAppIcon = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, display: "block" }}
  >
    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.758.458 3.473 1.328 4.988L2 22l5.188-1.359a9.927 9.927 0 0 0 4.843 1.258h.004c5.515 0 9.968-4.453 9.968-9.969A9.93 9.93 0 0 0 19.08 4.92 9.914 9.914 0 0 0 12.031 2zm5.816 14.254c-.246.691-1.434 1.32-1.992 1.402-.512.075-1.156.109-1.867-.117-.434-.137-.988-.32-1.703-.629-2.996-1.293-4.953-4.309-5.102-4.508-.148-.199-1.219-1.621-1.219-3.094 0-1.472.77-2.195 1.043-2.496.274-.301.598-.375.797-.375.199 0 .398.004.574.012.184.008.43-.07.672.512.246.597.844 2.058.918 2.207.074.148.125.324.023.523-.097.199-.148.324-.297.496-.148.176-.312.391-.445.524-.148.148-.305.312-.133.609.176.301.778 1.281 1.668 2.074 1.148 1.024 2.113 1.34 2.414 1.489.301.148.477.125.652-.074.176-.2.746-.871.945-1.172.199-.301.398-.25.672-.148.273.097 1.742.82 2.043.968.301.153.5.227.574.352.074.125.074.723-.172 1.414z" />
  </svg>
);

const GeminiSparkle = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ flexShrink: 0 }}
  >
    <defs>
      <linearGradient id="geminiChatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="45%" stopColor="#8B5CF6" />
        <stop offset="80%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path
      d="M14 2C14 9.5 18.5 14 26 14C18.5 14 14 18.5 14 26C14 18.5 9.5 14 2 14C9.5 14 14 9.5 14 2Z"
      fill="url(#geminiChatGrad)"
    />
  </svg>
);

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hola. Soy el asistente inteligente de Papacruj. Pregúntame por nuestros sabores artesanales, precios o métodos de envío." },
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

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages([...next, { role: "assistant" as const, content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok || !res.body) {
        const msg = res.status === 429 ? "Has superado el límite de velocidad. Por favor, espera un minuto e intenta de nuevo." : "Lo siento, ha ocurrido un error de conexión. Intenta de nuevo.";
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
      setMessages([...next, { role: "assistant", content: "Sin conexión con el servidor. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes geminiFluidFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes sparkleRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.18); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .gemini-widget-border {
          position: relative;
          border-radius: 28px;
          padding: 2.5px;
          background: linear-gradient(120deg, #3B82F6, #8B5CF6, #EC4899, #06B6D4, #3B82F6);
          background-size: 300% 300%;
          animation: geminiFluidFlow 4s ease infinite;
          box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.35);
        }
        .gemini-fluid-title {
          background: linear-gradient(120deg, #3B82F6, #8B5CF6, #EC4899, #06B6D4, #3B82F6);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: geminiFluidFlow 4s ease infinite;
        }
        .sparkle-spin {
          animation: sparkleRotate 2.5s linear infinite;
        }
      `}</style>

      {/* Botón flotante con fondo blanco y borde fluido */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Abrir asistente de IA"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 90,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid rgba(139, 92, 246, 0.35)",
          background: "#FFFFFF",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(59, 130, 246, 0.25)",
        }}
      >
        {open ? (
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#3B82F6" }}>✕</span>
        ) : (
          <GeminiSparkle size={28} className="sparkle-spin" />
        )}
      </motion.button>

      {open && (
        <div style={{ position: "fixed", bottom: "5.75rem", right: "1.5rem", zIndex: 90, width: "min(400px, calc(100vw - 2.5rem))" }} className="gemini-widget-border">
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "26px",
              height: "min(540px, 72vh)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(17,24,39,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <GeminiSparkle size={22} />
                <span style={{ fontWeight: 800, fontSize: "1rem" }} className="gemini-fluid-title">
                  Papacruj Intelligence
                </span>
              </div>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4B5563", background: "rgba(59, 130, 246, 0.1)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
                AI Assistant
              </span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.91rem", backgroundColor: "#F8FAFC" }}>
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                    backgroundColor: m.role === "user" ? "#2563EB" : "#FFFFFF",
                    color: m.role === "user" ? "#FFF" : "#1F2937",
                    padding: "0.75rem 1rem",
                    borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    lineHeight: 1.55,
                    boxShadow: m.role === "user" ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "0 2px 8px rgba(17,24,39,0.05)",
                    border: m.role === "assistant" ? "1px solid rgba(229, 231, 235, 1)" : "none",
                  }}
                >
                  {m.role === "assistant" ? <Streamdown>{m.content || "Generando respuesta..."}</Streamdown> : m.content}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              style={{ display: "flex", gap: "0.5rem", padding: "0.85rem 1rem", borderTop: "1px solid rgba(17,24,39,0.08)", backgroundColor: "#FFFFFF" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta sobre sabores, precios o paquetes..."
                style={{ flex: 1, border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "9999px", padding: "0.65rem 1.1rem", fontSize: "0.9rem", outline: "none", color: "#111827", backgroundColor: "#F9FAFB" }}
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                style={{
                  background: "linear-gradient(120deg, #2563EB, #7C3AED, #EC4899)",
                  backgroundSize: "200% 200%",
                  color: "#FFF",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0 1.25rem",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  opacity: loading ? 0.6 : 1,
                  boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)"
                }}
              >
                Enviar
              </motion.button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const CURRICULUM = [
  {
    module: "Evento 01",
    title: "Degustaciones y Activaciones en León",
    duration: "Todo el año",
    topics: "Llevamos nuestra barra crujiente de chips de taro con salsas negras, chamoy y toppings artesanales a tus reuniones y eventos privados."
  },
  {
    module: "Evento 02",
    title: "Paquetes para Fiestas y Reuniones",
    duration: "Pedidos desde 20 bolsas",
    topics: "Surtido personalizado con nuestros 4 sabores estrella (Adobadas, Especie con Crema, Salsa Negra y Habanero Limón)."
  },
  {
    module: "Evento 03",
    title: "Distribución y Mayoreo para Negocios",
    duration: "Entregas semanales",
    topics: "Abastecimiento directo para cafeterías, tiendas gourmet, gimnasios y bares en León, Guanajuato y todo México."
  }
];

const PRODUCTS = [
  {
    id: "adobadas",
    name: "Adobadas",
    shortName: "ADOBADAS",
    category: "Chips de taro · 100 gr",
    unitPrice: 50,
    price: "$50",
    bgColor: "#800020",
    accentColor: "#A31D32",
    imageSrc: "/adobadas.jpeg",
    description: "Un adobo clásico con toda la personalidad de Papacruj. Ricas, intensamente rojas, picositas y sumamente crujientes.",
    details: ["Chips de Taro", "100 gr de Crunch", "Adobo Tradicional"]
  },
  {
    id: "especias-crema",
    name: "Especie con Crema",
    shortName: "CREMA",
    category: "Chips de taro · 100 gr",
    unitPrice: 50,
    price: "$50",
    bgColor: "#B45309",
    accentColor: "#D97706",
    imageSrc: "/especie-crema.png",
    description: "La combinación perfecta y suave de especias selectas con notas cremosas que se funden en tu paladar en cada bocado.",
    details: ["Chips de Taro", "100 gr de Crunch", "Toque Cremoso"]
  },
  {
    id: "salsa-negra",
    name: "Salsa Negra",
    shortName: "SALSA NEGRA",
    category: "Chips de taro · 100 gr",
    unitPrice: 50,
    price: "$50",
    bgColor: "#262626",
    accentColor: "#737373",
    imageSrc: "/salsa-negra.jpeg",
    description: "Chips de taro naturales con un toque profundo y crujiente de salsas negras artesanales. Una experiencia audaz y llena de sabor.",
    details: ["Chips de Taro", "100 gr de Crunch", "Salsa Negra Artesanal"]
  },
  {
    id: "habanero-limon",
    name: "Habanero Limón",
    shortName: "HABANERO",
    category: "Chips de taro · 100 gr",
    unitPrice: 50,
    price: "$50",
    bgColor: "#C2410C",
    accentColor: "#EA580C",
    imageSrc: "/habanero-limon.jpeg",
    description: "El picante inconfundible del chile habanero realzado con la frescura ácida del limón natural. ¡Para los amantes del buen picor!",
    details: ["Chips de Taro", "100 gr de Crunch", "Habanero & Limón"]
  }
];

const REVIEWS = [
  { name: "Andrea Morales", role: "León, Guanajuato", quote: "Las de Habanero Limón tienen el toque exacto de picor y acidez. Se acabaron en 5 minutos en la reunión.", avatar: "👩🏻", rating: 5 },
  { name: "Carlos Mendoza", role: "Cliente frecuente", quote: "Mucho más ligeras que las papas comerciales y con un crunch increíble. Las de Salsa Negra son mis favoritas.", avatar: "👨🏽", rating: 5 },
  { name: "Sofía Ramírez", role: "CDMX · Envío Nacional", quote: "Pedí una caja surtida hasta Ciudad de México y llegaron intactas y súper crujientes.", avatar: "👩🏼", rating: 5 }
];

const FAQS = [
  { q: "¿Hacen envíos a todo México y León, Gto.?", a: "¡Sí! Realizamos entregas locales rápidas en León y envíos nacionales seguros a todo el país." },
  { q: "¿De qué tamaño son las bolsas?", a: "Cada bolsa contiene 100 gramos de crujientes y deliciosas chips de taro artesanales." },
  { q: "¿Cuáles son los métodos de pago aceptados?", a: "Aceptamos transferencias bancarias (BBVA / Santander), pagos en efectivo al recibir y tarjetas mediante enlace seguro." },
  { q: "¿Tienen precios especiales para mayoreo o eventos?", a: "¡Claro que sí! Contamos con paquetes especiales para fiestas, reuniones o si deseas revender en tu negocio." }
];

const ProductCard = React.memo(function ProductCard({
  product,
  onSelectProduct,
}: {
  product: (typeof PRODUCTS)[0];
  onSelectProduct: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTouchStart = () => {
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsHovered(false), 200);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        setIsHovered(false);
        onSelectProduct();
      }}
      style={{
        backgroundColor: isHovered ? product.bgColor : "#F9FAFB",
        color: isHovered ? "#FFFFFF" : "#111827",
        backgroundImage: isHovered
          ? "radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 65%)"
          : "none",
        boxShadow: isHovered
          ? `0 16px 32px -10px ${product.bgColor}55`
          : "0 6px 18px rgba(17, 24, 39, 0.04)",
        transform: isHovered ? "translateY(-6px)" : "translateY(0px)",
        transition: "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        borderRadius: "28px",
        padding: "1.75rem",
        cursor: "pointer",
        border: isHovered ? "1px solid rgba(255, 255, 255, 0.35)" : "1px solid rgba(17, 24, 39, 0.08)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "340px",
        willChange: "transform, background-color",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>
          100 GR
        </span>
        <span
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            display: "inline-block",
            backgroundColor: isHovered ? "#FFFFFF" : product.bgColor,
            transition: "background-color 0.2s ease",
          }}
        />
      </div>

      <div
        style={{
          height: "185px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0.25rem 0",
          transform: isHovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      >
        <img
          src={product.imageSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: "12px",
          }}
        />
      </div>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "0.75rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {product.name}
          </h4>
          <p style={{ fontSize: "0.78rem", opacity: 0.8, marginTop: "0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {product.details[2]}
          </p>
        </div>
        <span style={{ fontSize: "1.05rem", fontWeight: 800, flexShrink: 0 }}>{product.price}</span>
      </div>
    </div>
  );
});

export default function PromptMasterPage() {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const heroRotateX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 26 });
  const heroRotateY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 26 });

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [openCurriculum, setOpenCurriculum] = useState<number | null>(0);

  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [expandedModalProduct, setExpandedModalProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobileOrTablet = typeof window !== "undefined" && ("ontouchstart" in window || window.innerWidth < 1024);
    const getMobileScale = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 0.0056 : 0.0075);

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileOrTablet,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobileOrTablet ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    let loadedModel: THREE.Object3D | null = null;
    let isDisposed = false;

    const loader = new GLTFLoader();
    loader.load(
      "/earth.glb",
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;
        loadedModel = model;
        const s = getMobileScale();
        model.scale.set(s, s, s);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  if ("roughness" in mat) (mat as any).roughness = 1.0;
                  if ("metalness" in mat) (mat as any).metalness = 0.0;
                });
              } else {
                if ("roughness" in mesh.material) (mesh.material as any).roughness = 1.0;
                if ("metalness" in mesh.material) (mesh.material as any).metalness = 0.0;
              }
            }
          }
        });

        globeGroup.add(model);
        renderer.render(scene, camera);
      },
      undefined,
      (error) => {
        console.error("Error cargando el modelo 3D earth.glb:", error);
      }
    );

    const handleResize = () => {
      if (!container || isDisposed) return;
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      if (loadedModel) {
        const s = getMobileScale();
        loadedModel.scale.set(s, s, s);
      }
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    let isDragging = false;
    let isHovered = false;
    let isVisible = false;
    let previousMousePosition = { x: 0, y: 0 };
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeaveContainer = () => {
      isHovered = false;
      isDragging = false;
    };

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;
      globeGroup.rotation.y += deltaX * 0.009;
      globeGroup.rotation.x += deltaY * 0.009;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      globeGroup.rotation.y += e.deltaY * 0.002;
    };

    const onWindowScroll = () => {
      if (!isVisible) return;
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      globeGroup.rotation.y += deltaScroll * 0.004;
    };

    const domElement = renderer.domElement;
    domElement.style.touchAction = "pan-y";
    domElement.addEventListener("mouseenter", onMouseEnter);
    domElement.addEventListener("mouseleave", onMouseLeaveContainer);
    domElement.addEventListener("mousedown", onMouseDown);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    domElement.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("scroll", onWindowScroll, { passive: true });

    let animationFrameId: number | null = null;
    let lastFrameTime = 0;
    const targetFrameInterval = isMobileOrTablet ? 33 : 16;

    const animate = (now: number) => {
      if (!isVisible || isDisposed) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      if (now - lastFrameTime < targetFrameInterval) return;
      lastFrameTime = now;

      if (!isHovered && !isDragging) {
        globeGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastScrollY = window.scrollY;
            if (animationFrameId === null && !isDisposed) {
              animationFrameId = requestAnimationFrame(animate);
            }
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      isDisposed = true;
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);

      domElement.removeEventListener("mouseenter", onMouseEnter);
      domElement.removeEventListener("mouseleave", onMouseLeaveContainer);
      domElement.removeEventListener("mousedown", onMouseDown);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("touchstart", onTouchStart);
      domElement.removeEventListener("touchmove", onTouchMove);
      domElement.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("scroll", onWindowScroll);

      if (loadedModel) {
        loadedModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else {
              mesh.material?.dispose();
            }
          }
        });
      }
      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroStageRef.current) return;
    const rect = heroStageRef.current.getBoundingClientRect();
    heroMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    heroMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  const scrollToEnvios = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("envios");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const totalPrice = selectedProduct.unitPrice * quantity;
  const whatsappMessage = encodeURIComponent(
    `¡Hola! Me interesa hacer un pedido de Papacruj (${quantity} bolsa(s) de ${selectedProduct.name} · Total: $${totalPrice}). ¿Me pueden dar información por favor?`
  );
  const whatsappUrl = `https://wa.me/524777269595?text=${whatsappMessage}`;

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#111827", fontFamily: "'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Inter:wght@400;500;600;700;800;900&display=swap');
        html { scroll-behavior: smooth; }
        ::selection { background-color: #800020; color: #FFFFFF; }
        @keyframes marqueeScroll {
          0% { transform: translate3d(0%, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .papacruj-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 24s linear infinite;
        }
        .papacruj-marquee-track:hover {
          animation-play-state: paused;
        }
        .hero-wa-btn {
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .hero-wa-btn {
            gap: 0.45rem !important;
          }
          .hero-wa-btn svg {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>

      {/* NAVBAR */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "#FFFFFF", borderBottom: "1px solid rgba(17, 24, 39, 0.08)" }}>
        <div style={{ maxWidth: "75rem", margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logopapa.png" alt="Papacruj Disfruta Ligero" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(17, 24, 39, 0.7)", flexWrap: "wrap" }}>
            <a href="#envios" onClick={scrollToEnvios} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Envíos</a>
            <a href="#catalogo" style={{ textDecoration: "none", color: "inherit" }}>Sabores</a>
            <a href="#historia" style={{ textDecoration: "none", color: "inherit" }}>Historia</a>
            <a href="#curriculum" style={{ textDecoration: "none", color: "inherit" }}>Eventos</a>
            <a href="#reviews" style={{ textDecoration: "none", color: "inherit" }}>Reseñas</a>
            <a href="#faq" style={{ textDecoration: "none", color: "inherit" }}>Preguntas</a>
          </nav>

          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{ backgroundColor: "#25D366", color: "#FFFFFF", border: "none", borderRadius: "9999px", padding: "0.55rem 1.35rem", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem", boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)", boxSizing: "border-box" }}
          >
            <WhatsAppIcon size={24} /> Hacer pedido →
          </motion.a>
        </div>
      </header>

      {/* ESCAPARATE PRINCIPAL */}
      <section
        id="productos"
        ref={heroStageRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{ padding: "2rem 1.5rem 4rem", maxWidth: "75rem", margin: "0 auto" }}
      >
        <div
          style={{
            backgroundColor: selectedProduct.bgColor,
            boxShadow: `0 20px 40px ${selectedProduct.bgColor}40`,
            transition: "background-color 0.3s ease",
            backgroundImage: `radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 60%)`,
            borderRadius: "32px",
            padding: "clamp(2rem, 5vw, 4rem)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.25)"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(5rem, 15vw, 13rem)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.14)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
              letterSpacing: "-0.04em",
              zIndex: 0
            }}
          >
            {selectedProduct.shortName}
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Papacruj
            </span>
            <div style={{ display: "flex", gap: "0.5rem", background: "rgba(0,0,0,0.3)", padding: "0.35rem 0.75rem", borderRadius: "999px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#FFF", opacity: 0.85 }}>Sabor seleccionado:</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFF" }}>{selectedProduct.name}</span>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: "0.5rem" }}>
                {selectedProduct.category}
              </div>
              <h3 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: "1rem" }}>
                {selectedProduct.name}
              </h3>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {selectedProduct.description}
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {selectedProduct.details.map((det, idx) => (
                  <span key={idx} style={{ backgroundColor: "rgba(0,0,0,0.28)", color: "#FFFFFF", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600 }}>
                    ✓ {det}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF" }}>Elige tu sabor:</span>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  {PRODUCTS.map((prod) => (
                    <motion.button
                      key={prod.id}
                      whileHover={{ scale: 1.18 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      onMouseEnter={() => setSelectedProduct(prod)}
                      onClick={() => setSelectedProduct(prod)}
                      title={prod.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: prod.bgColor,
                        border: selectedProduct.id === prod.id ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.45)",
                        cursor: "pointer",
                        boxShadow: selectedProduct.id === prod.id ? "0 0 12px rgba(255,255,255,0.9)" : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <motion.div
                style={{
                  rotateX: heroRotateX,
                  rotateY: heroRotateY,
                  width: "100%",
                  maxWidth: "360px",
                  boxSizing: "border-box",
                  background: "rgba(0, 0, 0, 0.38)",
                  borderRadius: "28px",
                  padding: "2rem",
                  border: "1px solid rgba(255,255,255,0.22)",
                  textAlign: "center",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.3)"
                }}
              >
                <div
                  onClick={() => setExpandedModalProduct(selectedProduct)}
                  title="Haz clic para ver detalle ampliado"
                  style={{ width: "100%", height: "260px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0.5rem 0 1rem 0", overflow: "hidden", borderRadius: "16px", cursor: "zoom-in", position: "relative" }}
                >
                  <img
                    src={selectedProduct.imageSrc}
                    alt={selectedProduct.name}
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "12px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.25rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)" }}>
                      {quantity === 1 ? "Precio por bolsa" : `Total (${quantity} bolsas)`}
                    </div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF" }}>
                      ${totalPrice}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.18)", padding: "0.4rem 0.8rem", borderRadius: "12px" }}>
                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", color: "#FFF", fontSize: "1.1rem", cursor: "pointer", fontWeight: 700, padding: "0 0.25rem" }}>−</motion.button>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFF", minWidth: "1rem", textAlign: "center" }}>{quantity}</span>
                    <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.85 }} onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", color: "#FFF", fontSize: "1.1rem", cursor: "pointer", fontWeight: 700, padding: "0 0.25rem" }}>+</motion.button>
                  </div>
                </div>

                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-wa-btn"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", boxSizing: "border-box", marginTop: "1.25rem", backgroundColor: "#25D366", color: "#FFFFFF", border: "none", borderRadius: "16px", padding: "0.85rem 1rem", fontWeight: 800, fontSize: "1rem", cursor: "pointer", textDecoration: "none", boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
                >
                  <WhatsAppIcon size={32} />
                  <span style={{ lineHeight: 1.2, textAlign: "left" }}>Hacer pedido por<br />WhatsApp →</span>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUESINA INFINITA HORIZONTAL */}
      <div style={{ overflow: "hidden", backgroundColor: "#111827", color: "#FFFFFF", padding: "1.1rem 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="papacruj-marquee-track">
          {[0, 1].map((loopIdx) => (
            <div key={loopIdx} style={{ display: "flex", alignItems: "center", gap: "2.5rem", paddingRight: "2.5rem", fontSize: "1.15rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <span>PAPACRUJ</span>
              <span style={{ color: "#800020" }}>✦</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", textTransform: "none", fontSize: "1.35rem" }}>Disfruta ligero</span>
              <span style={{ color: "#800020" }}>✦</span>
              <span>CHIPS DE TARO ARTESANALES</span>
              <span style={{ color: "#800020" }}>✦</span>
              <span>LEÓN, GUANAJUATO</span>
              <span style={{ color: "#800020" }}>✦</span>
              <span>ENVÍOS A TODO MÉXICO</span>
              <span style={{ color: "#800020" }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* CUADRÍCULA DE SABORES */}
      <section id="catalogo" style={{ padding: "5rem 1.5rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#800020", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Colección Completa
            </span>
            <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginTop: "0.25rem", lineHeight: 1.1 }}>
              Explora los <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>4 sabores</span>
            </h2>
          </div>
          <p style={{ fontSize: "0.9rem", color: "rgba(17,24,39,0.6)", maxWidth: "24rem" }}>
            Toca cualquier bolsa para cambiar el color del sabor y ver su ficha completa.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
          {PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={() => {
                setSelectedProduct(prod);
                setExpandedModalProduct(prod);
              }}
            />
          ))}
        </div>
      </section>

      {/* VISTA EXPANDIDA DE DETALLE DE PRODUCTO */}
      <AnimatePresence>
        {expandedModalProduct && (
          <motion.div
            key="detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedModalProduct(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              backgroundColor: "rgba(17, 24, 39, 0.82)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem"
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "56rem",
                backgroundColor: expandedModalProduct.bgColor,
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
                position: "relative"
              }}
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExpandedModalProduct(null)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  zIndex: 10,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#FFFFFF",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                ✕
              </motion.button>

              <div style={{ padding: "3rem 2rem 2rem", position: "relative", textAlign: "center", overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "clamp(4rem, 12vw, 8.5rem)",
                    fontWeight: 900,
                    color: "rgba(255,255,255,0.16)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none"
                  }}
                >
                  {expandedModalProduct.shortName}
                </div>

                <img
                  src={expandedModalProduct.imageSrc}
                  alt={expandedModalProduct.name}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "240px",
                    objectFit: "contain",
                    borderRadius: "16px"
                  }}
                />
              </div>

              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: "2rem 2.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1.5rem"
                }}
              >
                <div style={{ maxWidth: "32rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: expandedModalProduct.bgColor, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {expandedModalProduct.category}
                  </span>
                  <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#111827", marginTop: "0.25rem" }}>
                    {expandedModalProduct.name} — {expandedModalProduct.price}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "rgba(17,24,39,0.7)", lineHeight: 1.6, marginTop: "0.5rem" }}>
                    {expandedModalProduct.description}
                  </p>
                </div>

                <motion.a
                  href={`https://wa.me/524777269595?text=${encodeURIComponent(`¡Hola! Quiero pedir Papacruj sabor ${expandedModalProduct.name} (${expandedModalProduct.price} c/u).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    padding: "0.85rem 1.75rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)"
                  }}
                >
                  <WhatsAppIcon size={28} /> Pedir este sabor →
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EVENTOS Y MAYOREO SECTION */}
      <section id="curriculum" style={{ padding: "5rem 1.5rem", maxWidth: "60rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Papacruj en tus <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>eventos</span>
          </h2>
          <p style={{ color: "rgba(17, 24, 39, 0.6)", marginTop: "0.5rem", fontSize: "1rem" }}>
            Opciones para reuniones, fiestas y distribución comercial en León y todo México.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {CURRICULUM.map((item, idx) => {
            const isOpen = openCurriculum === idx;
            return (
              <div
                key={item.module}
                onClick={() => setOpenCurriculum(isOpen ? null : idx)}
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(17, 24, 39, 0.08)",
                  borderRadius: "20px",
                  padding: "1.5rem 2rem",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#800020", backgroundColor: "rgba(128, 0, 32, 0.1)", padding: "0.3rem 0.75rem", borderRadius: "8px" }}>
                      {item.module}
                    </span>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>{item.title}</h3>
                      <p style={{ fontSize: "0.8rem", color: "rgba(17, 24, 39, 0.5)", marginTop: "0.2rem" }}>{item.duration}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.25rem", color: "#800020", fontWeight: 700 }}>{isOpen ? "−" : "+"}</span>
                </div>

                {isOpen && (
                  <p style={{ fontSize: "0.9rem", color: "rgba(17, 24, 39, 0.75)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "1rem" }}>
                    {item.topics}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={{ padding: "5rem 1.5rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "45rem", margin: "0 auto 3rem" }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Lo que dicen nuestros <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>clientes</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.06)", borderRadius: "24px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            >
              <p style={{ fontSize: "0.95rem", color: "rgba(17, 24, 39, 0.8)", lineHeight: 1.6, fontStyle: "italic" }}>
                "{rev.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "2rem" }}>
                <span style={{ fontSize: "2rem", backgroundColor: "#E5E7EB", width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "9999px" }}>{rev.avatar}</span>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827" }}>{rev.name}</h4>
                  <p style={{ fontSize: "0.75rem", color: "rgba(17, 24, 39, 0.5)" }}>{rev.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faq" style={{ padding: "5rem 1.5rem", maxWidth: "55rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Preguntas <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>sobre envíos y pedidos</span>
          </h2>
          <p style={{ color: "rgba(17, 24, 39, 0.6)", marginTop: "0.5rem" }}>Todo lo que necesitas saber sobre entregas en León, Gto. y envíos nacionales.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openAccordion === idx;
            return (
              <div
                key={faq.q}
                onClick={() => setOpenAccordion(isOpen ? null : idx)}
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid rgba(17,24,39,0.06)",
                  borderRadius: "20px",
                  padding: "1.5rem 2rem",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827" }}>{faq.q}</h3>
                  <span style={{ fontSize: "1.25rem", color: "#800020", fontWeight: 700 }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <p style={{ fontSize: "0.9rem", color: "rgba(17, 24, 39, 0.7)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "1rem" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION & GLOBO 3D */}
      <section id="envios" style={{ padding: "3rem 1.5rem 6rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.08)", borderRadius: "40px", padding: "clamp(2.5rem, 5vw, 4rem)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div>
            <h2 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Pide tus <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>Papacruj</span> hoy
            </h2>
            <p style={{ color: "rgba(17, 24, 39, 0.65)", fontSize: "1rem", lineHeight: 1.6, marginTop: "1rem" }}>
              Envíos rápidos a domicilio en León, Guanajuato y envíos nacionales seguros a todo México. Disfruta de tus chips de taro favoritas crujientes y con el mejor sabor artesanal.
            </p>

            <div style={{ marginTop: "2rem" }}>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", backgroundColor: "#25D366", color: "#FFFFFF", borderRadius: "9999px", padding: "0.85rem 2rem", fontSize: "1.05rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 16px rgba(37, 211, 102, 0.35)", boxSizing: "border-box" }}
              >
                <WhatsAppIcon size={34} /> Hacer pedido por WhatsApp →
              </motion.a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2.5rem", fontSize: "0.85rem", color: "rgba(17, 24, 39, 0.75)" }}>
              <div>✓ Envíos seguros y rápidos en León, Gto. y nacionales a todo México</div>
              <div>✓ Atención personalizada por WhatsApp</div>
              <div>✓ Pagos fáciles y seguros</div>
            </div>
          </div>

          <div style={{ width: "100%", height: "320px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", overflow: "hidden", cursor: "grab" }}>
            <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS / HISTORIA */}
      <section
        id="historia"
        style={{ padding: "4rem 1.5rem 7rem", maxWidth: "60rem", margin: "0 auto", textAlign: "left" }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            color: "#111827",
            border: "1px solid rgba(128, 0, 32, 0.15)",
            borderRadius: "36px",
            padding: "clamp(2.5rem, 5vw, 4.5rem)",
            boxShadow: "0 25px 60px rgba(128, 0, 32, 0.08)",
            backgroundImage: "radial-gradient(circle at top right, rgba(128, 0, 32, 0.05), transparent 70%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(128, 0, 32, 0.08)", border: "1px solid rgba(128, 0, 32, 0.2)", borderRadius: "9999px", padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8rem", fontWeight: 700, color: "#800020", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            <span style={{ backgroundColor: "#800020", width: "8px", height: "8px", borderRadius: "50%", display: "inline-block", boxShadow: "0 0 10px rgba(128,0,32,0.4)" }} />
            Sobre Nosotros
          </div>
          
          <h2 style={{ fontSize: "clamp(2.5rem, 5.5vw, 3.8rem)", fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "2.5rem" }}>
            Dos amigas. <br />
            Una idea. <br />
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020", textShadow: "0 0 25px rgba(128,0,32,0.15)" }}>Mucho crunch.</span>
          </h2>

          <div style={{ fontSize: "clamp(1.15rem, 2.2vw, 1.4rem)", fontFamily: "'Playfair Display', serif", color: "#800020", lineHeight: 1.5, marginBottom: "2rem", fontWeight: 600 }}>
            PAPACRUJ nació entre dos amigas que queríamos crear una opción diferente para disfrutar el antojo.
          </div>

          <div style={{ fontSize: "1.05rem", color: "rgba(17, 24, 39, 0.75)", lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p>
              Somos una marca joven, auténtica y con mucha personalidad. Queremos acompañarte a la escuela, a una tarde con amigos, a tus viajes, a tus películas y a esos momentos en los que simplemente se te antoja algo rico.
            </p>
            <p>
              Nuestros chips de taro tienen 0 mg de grasas trans, 0 mg de colesterol, son altos en fibra, bajos en sodio y no contienen conservadores artificiales. Y hay algo que tenemos muy claro: disfrutar una opción más ligera también debe saber delicioso.
            </p>
            <p>
              Cuidamos nuestros sabores y cada detalle de la marca para que pruebes PAPACRUJ por curiosidad y vuelvas por su sabor.
            </p>
          </div>

          <div style={{ marginTop: "2.5rem", fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)", fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020", fontWeight: 700, borderTop: "1px solid rgba(128, 0, 32, 0.15)", paddingTop: "2rem" }}>
            Porque disfrutar y cuidarte pueden ir juntos.
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(17,24,39,0.08)", padding: "5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: "75rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
          <div>
            <img src="/logopapa.png" alt="Papacruj Disfruta Ligero" style={{ height: "44px", width: "auto", objectFit: "contain" }} />
            <p style={{ fontSize: "0.85rem", color: "rgba(17,24,39,0.6)", lineHeight: 1.6, marginTop: "1rem" }}>
              Chips de taro artesanales en León, Guanajuato y envíos a todo México. Para ese antojo, ese plan y ese «una más».
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Explorar</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(17,24,39,0.6)" }}>
              <li><a href="#envios" onClick={scrollToEnvios} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Envíos</a></li>
              <li><a href="#catalogo" style={{ textDecoration: "none", color: "inherit" }}>Sabores</a></li>
              <li><a href="#historia" style={{ textDecoration: "none", color: "inherit" }}>Historia</a></li>
              <li><a href="#curriculum" style={{ textDecoration: "none", color: "inherit" }}>Eventos</a></li>
              <li><a href="#reviews" style={{ textDecoration: "none", color: "inherit" }}>Reseñas</a></li>
              <li><a href="#faq" style={{ textDecoration: "none", color: "inherit" }}>FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Redes Sociales</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "rgba(17,24,39,0.6)" }}>
              <li><a href="#" style={{ textDecoration: "none", color: "inherit" }}>Instagram →</a></li>
              <li><a href="#" style={{ textDecoration: "none", color: "inherit" }}>TikTok →</a></li>
              <li><a href="#" style={{ textDecoration: "none", color: "inherit" }}>Facebook →</a></li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: "75rem", margin: "0 auto", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "rgba(17,24,39,0.45)", flexWrap: "wrap", gap: "1rem" }}>
          <p>© 2026 Papacruj. Todos los derechos reservados.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Política de Privacidad</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Términos de Servicio</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}