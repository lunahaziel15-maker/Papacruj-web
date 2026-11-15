"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

// TARJETA PROFESIONAL CON CAMBIO DE COLOR INMEDIATO AL PASAR EL CURSOR (HOVER)
function TiltProductCard({
  product,
  onHoverSelect,
  onClickOpen,
  isSelected,
}: {
  product: (typeof PRODUCTS)[0];
  onHoverSelect: () => void;
  onClickOpen: () => void;
  isSelected: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 320, damping: 26 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 320, damping: 26 });

  const isActive = isHovered || isSelected;

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverSelect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClickOpen}
      animate={{
        y: isHovered ? -10 : 0,
        scale: isHovered ? 1.03 : 1,
        backgroundColor: isActive ? product.bgColor : "#F9FAFB",
        color: isActive ? "#FFFFFF" : "#111827",
        boxShadow: isActive
          ? `0 24px 48px -12px ${product.bgColor}66`
          : "0 10px 28px rgba(17, 24, 39, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        backgroundImage: isActive
          ? "radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 65%)"
          : "none",
        borderRadius: "28px",
        padding: "1.75rem",
        cursor: "pointer",
        border: isActive ? "1px solid rgba(255, 255, 255, 0.35)" : "1px solid rgba(17, 24, 39, 0.08)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "340px",
      }}
    >
      {/* Cabecera de la tarjeta */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.8 }}>
          100 GR
        </span>
        <motion.span
          animate={{
            scale: isActive ? 1.25 : 1,
            backgroundColor: isActive ? "#FFFFFF" : product.bgColor,
          }}
          transition={{ duration: 0.25 }}
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
      </div>

      {/* Imagen flotante del producto */}
      <motion.div
        animate={{
          y: isHovered ? -6 : 0,
          scale: isHovered ? 1.07 : 1,
          rotate: isHovered ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        style={{
          height: "185px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateZ(30px)",
          margin: "0.25rem 0",
        }}
      >
        <img
          src={product.imageSrc}
          alt={product.name}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            filter: isActive
              ? "drop-shadow(0 20px 26px rgba(0,0,0,0.42))"
              : "drop-shadow(0 12px 18px rgba(0,0,0,0.18))",
            transition: "filter 0.28s ease",
          }}
        />
      </motion.div>

      {/* Pie de tarjeta con nombre, descripción y precio */}
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
    </motion.div>
  );
}

export default function PromptMasterPage() {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const heroRotateX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [14, -14]), { stiffness: 220, damping: 22 });
  const heroRotateY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 220, damping: 22 });

  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [openCurriculum, setOpenCurriculum] = useState<number | null>(0);

  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [expandedModalProduct, setExpandedModalProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [userQuery, setUserQuery] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");
  const fullPlaceholder = "Pregúntale lo que sea: proteína, calorías, dips, recetas...";

  const [chefStatus, setChefStatus] = useState<"Listo" | "Procesando consulta culinaria..." | "¡Listo!">("Listo");
  const [aiResponse, setAiResponse] = useState<{
    type: "recipe" | "macros" | "answer";
    title: string;
    subtitle?: string;
    content?: string;
    macrosData?: { calories: string; protein: string; carbs: string; fats: string };
    ingredients?: string[];
    steps?: string[];
  } | null>(null);

  const mountRef = useRef<HTMLDivElement | null>(null);

  // Precarga instantánea de las 4 imágenes de productos en memoria
  useEffect(() => {
    PRODUCTS.forEach((prod) => {
      const img = new Image();
      img.src = prod.imageSrc;
    });
  }, []);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullPlaceholder.length) {
        setPlaceholderText(fullPlaceholder.substring(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, []);

  // RENDERIZADO 3D CON THREE.JS: CARGA earth.glb SIN REFLEJOS
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const loader = new GLTFLoader();
    loader.load(
      "/earth.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.0075, 0.0075, 0.0075);

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
      },
      undefined,
      (error) => {
        console.error("Error cargando el modelo 3D earth.glb:", error);
      }
    );

    let isDragging = false;
    let isHovered = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseEnter = () => { isHovered = true; };
    const onMouseLeaveContainer = () => {
      isHovered = false;
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      globeGroup.rotation.y += deltaX * 0.008;
      globeGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      globeGroup.rotation.y += e.deltaY * 0.002;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mouseenter", onMouseEnter);
    domElement.addEventListener("mouseleave", onMouseLeaveContainer);
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("wheel", onWheel, { passive: false });

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isHovered && !isDragging) {
        globeGroup.rotation.y += 0.0035;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mouseenter", onMouseEnter);
      domElement.removeEventListener("mouseleave", onMouseLeaveContainer);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("wheel", onWheel);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
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

  // IA REAL SIN NECESIDAD DE API KEY (POLLINATIONS AI)
  const handleAskChef = async () => {
    const queryToUse = userQuery.trim() || "Dame una receta creativa y deliciosa para preparar mis Papacruj";
    setChefStatus("Procesando consulta culinaria...");
    setAiResponse(null);

    const systemPrompt = `Eres "Papacruj Chef", el asistente culinario y nutricional oficial de Papacruj.
Datos reales de Papacruj:
- Producto: Chips artesanales de taro (malanga) crujientes, ligeras y libres de gluten.
- Presentación: Bolsas de 100 gramos a $50 MXN cada una.
- 4 Sabores: Adobadas, Especie con Crema, Salsa Negra y Habanero Limón.
- Ubicación y envíos: Entregas rápidas a domicilio en León, Guanajuato y envíos nacionales seguros a todo México.
- Pedidos: WhatsApp +52 477 726 9595.
- Macros aproximados por porción de 50g de chips de taro: 250 kcal, 4.0g proteína, 32.0g carbohidratos, 11.5g grasas, alto contenido en fibra.

Responde en español de forma apetitosa, clara y verídica. Devuelve ÚNICAMENTE un objeto JSON válido (sin texto adicional ni bloques markdown) usando exactamente una de estas 3 estructuras:
1) Si pide receta, botana preparada, dip o maridaje:
{"type":"recipe","title":"Nombre de la receta","subtitle":"Tiempo de preparación: X minutos","ingredients":["Ingrediente 1","Ingrediente 2"],"steps":["Paso 1","Paso 2"]}
2) Si pregunta por calorías, proteína, macros, carbohidratos o dieta:
{"type":"macros","title":"Desglose Nutricional (Porción de 50g)","content":"Explicación breve sobre los beneficios del taro y sus macros.","macrosData":{"calories":"250 kcal","protein":"4.0 g","carbs":"32.0 g","fats":"11.5 g"}}
3) Para cualquier otra consulta sobre sabores, envíos, precios, ingredientes o consejos:
{"type":"answer","title":"Respuesta de Papacruj Chef","content":"Tu respuesta completa aquí."}`;

    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: queryToUse }
          ],
          model: "openai",
          jsonMode: true
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la IA");
      }

      const rawText = await response.text();
      const cleanedJson = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanedJson);

      setChefStatus("¡Listo!");
      setAiResponse(parsed);
    } catch (error) {
      setChefStatus("¡Listo!");
      setAiResponse({
        type: "answer",
        title: "Papacruj Chef",
        content: `Sobre "${queryToUse}": Nuestras chips de taro Papacruj (100g a $50 MXN) son crujientes, ligeras y sin gluten. Puedes disfrutarlas solas en cualquiera de nuestros 4 sabores (Adobadas, Especie con Crema, Salsa Negra y Habanero Limón) o acompañarlas con limón, salsas negras y guacamole fresco. Hacemos envíos rápidos en León, Gto. y a todo México.`,
      });
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
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .papacruj-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 22s linear infinite;
        }
        .papacruj-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* NAVBAR */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(255, 255, 255, 0.92)", borderBottom: "1px solid rgba(17, 24, 39, 0.08)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: "75rem", margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logopapa.png" alt="Papacruj Disfruta Ligero" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
          </a>

          <nav style={{ display: "flex", alignItems: "center", gap: "2rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(17, 24, 39, 0.7)" }}>
            <a href="#envios" onClick={scrollToEnvios} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>Envíos</a>
            <a href="#catalogo" style={{ textDecoration: "none", color: "inherit" }}>Sabores</a>
            <a href="#curriculum" style={{ textDecoration: "none", color: "inherit" }}>Eventos</a>
            <a href="#reviews" style={{ textDecoration: "none", color: "inherit" }}>Reseñas</a>
            <a href="#faq" style={{ textDecoration: "none", color: "inherit" }}>Preguntas</a>
          </nav>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "#25D366", color: "#FFFFFF", border: "none", borderRadius: "9999px", padding: "0.4rem 1.25rem", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)", boxSizing: "border-box" }}
          >
            <img src="/whatsapp.png" alt="WhatsApp" style={{ width: "34px", height: "34px", objectFit: "contain" }} /> Hacer pedido →
          </motion.a>
        </div>
      </header>

      {/* ESCAPARATE PRINCIPAL CON TILT 3D Y CAMBIO INSTANTÁNEO */}
      <section
        id="productos"
        ref={heroStageRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{ padding: "2rem 1.5rem 4rem", maxWidth: "75rem", margin: "0 auto", perspective: "1200px" }}
      >
        <motion.div
          animate={{
            backgroundColor: selectedProduct.bgColor,
            boxShadow: `0 25px 50px ${selectedProduct.bgColor}44`
          }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            backgroundImage: `radial-gradient(circle at top right, rgba(255,255,255,0.22), transparent 60%)`,
            borderRadius: "32px",
            padding: "clamp(2rem, 5vw, 4rem)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.25)"
          }}
        >
          <motion.div
            key={`bg-word-${selectedProduct.id}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 0.14, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(5rem, 15vw, 13rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              userSelect: "none",
              letterSpacing: "-0.04em",
              zIndex: 0
            }}
          >
            {selectedProduct.shortName}
          </motion.div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Papacruj
            </span>
            <div style={{ display: "flex", gap: "0.5rem", background: "rgba(0,0,0,0.25)", padding: "0.35rem 0.75rem", borderRadius: "999px", backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#FFF", opacity: 0.8 }}>Sabor seleccionado:</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FFF" }}>{selectedProduct.name}</span>
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.85)", fontWeight: 700, marginBottom: "0.5rem" }}>
                {selectedProduct.category}
              </div>
              <motion.h3
                key={`title-${selectedProduct.id}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: "1rem" }}
              >
                {selectedProduct.name}
              </motion.h3>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: "2rem" }}>
                {selectedProduct.description}
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
                {selectedProduct.details.map((det, idx) => (
                  <span key={idx} style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#FFFFFF", padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, backdropFilter: "blur(8px)" }}>
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
                      onMouseEnter={() => setSelectedProduct(prod)}
                      onClick={() => setSelectedProduct(prod)}
                      title={prod.name}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: prod.bgColor,
                        border: selectedProduct.id === prod.id ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        boxShadow: selectedProduct.id === prod.id ? "0 0 15px rgba(255,255,255,0.9)" : "none"
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
                  transformStyle: "preserve-3d",
                  width: "100%",
                  maxWidth: "360px",
                  boxSizing: "border-box",
                  background: "rgba(0, 0, 0, 0.3)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "28px",
                  padding: "2rem",
                  border: "1px solid rgba(255,255,255,0.2)",
                  textAlign: "center",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
                }}
              >
                <div
                  onClick={() => setExpandedModalProduct(selectedProduct)}
                  title="Haz clic para ver detalle ampliado"
                  style={{ width: "100%", height: "260px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0.5rem 0 1rem 0", overflow: "hidden", borderRadius: "16px", cursor: "zoom-in", position: "relative" }}
                >
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={selectedProduct.id}
                      src={selectedProduct.imageSrc}
                      alt={selectedProduct.name}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96, position: "absolute" }}
                      whileHover={{ scale: 1.08, rotate: -2 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", filter: "drop-shadow(0 18px 25px rgba(0,0,0,0.55))" }}
                    />
                  </AnimatePresence>
                </div>

                {/* PRECIO DINÁMICO SEGÚN CANTIDAD */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.25rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                      {quantity === 1 ? "Precio por bolsa" : `Total (${quantity} bolsas)`}
                    </div>
                    <motion.div
                      key={totalPrice}
                      initial={{ scale: 0.92, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.18 }}
                      style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF" }}
                    >
                      ${totalPrice}
                    </motion.div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(255,255,255,0.15)", padding: "0.4rem 0.8rem", borderRadius: "12px" }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "none", border: "none", color: "#FFF", fontSize: "1rem", cursor: "pointer", fontWeight: 700 }}>−</button>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFF", minWidth: "1rem", textAlign: "center" }}>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} style={{ background: "none", border: "none", color: "#FFF", fontSize: "1rem", cursor: "pointer", fontWeight: 700 }}>+</button>
                  </div>
                </div>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.65rem", width: "100%", boxSizing: "border-box", marginTop: "1.25rem", backgroundColor: "#25D366", color: "#FFFFFF", border: "none", borderRadius: "16px", padding: "0.75rem 1rem", fontWeight: 800, fontSize: "1rem", cursor: "pointer", textDecoration: "none", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                >
                  <img src="/whatsapp.png" alt="WhatsApp" style={{ width: "44px", height: "44px", objectFit: "contain" }} /> Hacer pedido por WhatsApp →
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
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

      {/* CUADRÍCULA DE SABORES CON CAMBIO DE COLOR INMEDIATO EN HOVER */}
      <section id="catalogo" style={{ padding: "5rem 1.5rem", maxWidth: "75rem", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}
        >
          <div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#800020", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Colección Completa
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", marginTop: "0.25rem" }}>
              Explora los <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>4 sabores</span>
            </h2>
          </div>
          <p style={{ fontSize: "0.9rem", color: "rgba(17,24,39,0.6)", maxWidth: "24rem" }}>
            Pasa el cursor sobre cada bolsa para cambiar el color del sabor o haz clic para ver su ficha completa.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", perspective: "1000px" }}>
          {PRODUCTS.map((prod) => (
            <TiltProductCard
              key={prod.id}
              product={prod}
              isSelected={selectedProduct.id === prod.id}
              onHoverSelect={() => setSelectedProduct(prod)}
              onClickOpen={() => {
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
              backgroundColor: "rgba(17, 24, 39, 0.72)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem"
            }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: "56rem",
                backgroundColor: expandedModalProduct.bgColor,
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                position: "relative"
              }}
            >
              <button
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
                  backgroundColor: "rgba(0,0,0,0.35)",
                  color: "#FFFFFF",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                ✕
              </button>

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

                <motion.img
                  initial={{ y: 20, rotate: -6, scale: 0.9 }}
                  animate={{ y: 0, rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  src={expandedModalProduct.imageSrc}
                  alt={expandedModalProduct.name}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "240px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 22px 28px rgba(0,0,0,0.5))"
                  }}
                />
              </div>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
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

                <a
                  href={`https://wa.me/524777269595?text=${encodeURIComponent(`¡Hola! Quiero pedir Papacruj sabor ${expandedModalProduct.name} (${expandedModalProduct.price} c/u).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#25D366",
                    color: "#FFFFFF",
                    padding: "0.9rem 1.75rem",
                    borderRadius: "9999px",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)"
                  }}
                >
                  Pedir este sabor →
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION (PAPACRUJ CHEF) */}
      <section style={{ position: "relative", padding: "5rem 1.5rem 6rem", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translate(-50%, -50%)", width: "650px", height: "450px", backgroundColor: "rgba(128, 0, 32, 0.12)", filter: "blur(110px)", borderRadius: "9999px", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "55rem", margin: "0 auto", position: "relative", zIndex: 10 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F9FAFB", border: "1px solid rgba(17, 24, 39, 0.08)", borderRadius: "9999px", padding: "0.35rem 1rem", marginBottom: "1.5rem", fontSize: "0.8125rem", color: "#374151" }}>
            <span style={{ backgroundColor: "#800020", width: "0.5rem", height: "0.5rem", borderRadius: "9999px", display: "inline-block", boxShadow: "0 0 10px #800020" }} />
            Papacruj Chef IA Multitarea Avanzada
          </div>

          <h1 style={{ fontSize: "clamp(3.2rem, 7vw, 5.5rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>Papacruj</span><br />
            Disfruta ligero.
          </h1>

          <p style={{ fontSize: "1.125rem", color: "rgba(17, 24, 39, 0.65)", maxWidth: "38rem", margin: "1.5rem auto 0", lineHeight: 1.6 }}>
            Para ese antojo, ese plan y ese «una más». Tu asistente culinario entrenado con recetas reales de botana mexicana y macros.
          </p>

          {/* PAPACRUJ CHEF INTERACTIVO */}
          <div style={{ marginTop: "3.5rem", backgroundColor: "#F9FAFB", border: "1px solid rgba(17, 24, 39, 0.08)", borderRadius: "24px", padding: "1.5rem", textAlign: "left", boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                🥔 Papacruj Chef Entrenado
              </span>
              <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", backgroundColor: "rgba(128, 0, 32, 0.12)", color: "#800020", borderRadius: "999px", fontWeight: 600 }}>
                {chefStatus}
              </span>
            </div>

            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder={placeholderText}
              style={{ width: "100%", height: "90px", backgroundColor: "#FFFFFF", border: "1px solid rgba(17, 24, 39, 0.12)", borderRadius: "12px", padding: "1rem", color: "#111827", fontSize: "0.95rem", resize: "none", outline: "none", boxSizing: "border-box" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span onClick={() => setUserQuery("Receta con salsa maggi y limón")} style={{ fontSize: "0.75rem", backgroundColor: "#E5E7EB", padding: "0.25rem 0.75rem", borderRadius: "8px", color: "#374151", cursor: "pointer" }}>+ Estilo salsas negras</span>
                <span onClick={() => setUserQuery("Receta con cueritos y chamoy")} style={{ fontSize: "0.75rem", backgroundColor: "#E5E7EB", padding: "0.25rem 0.75rem", borderRadius: "8px", color: "#374151", cursor: "pointer" }}>+ Con cueritos</span>
                <span onClick={() => setUserQuery("Cuántas calorías y proteína tiene")} style={{ fontSize: "0.75rem", backgroundColor: "#E5E7EB", padding: "0.25rem 0.75rem", borderRadius: "8px", color: "#374151", cursor: "pointer" }}>+ Calorías / macros</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAskChef}
                style={{ backgroundColor: "#800020", color: "#FFFFFF", border: "none", borderRadius: "12px", padding: "0.625rem 1.5rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 4px 12px rgba(128, 0, 32, 0.3)" }}
              >
                Preguntar a la IA →
              </motion.button>
            </div>

            <AnimatePresence>
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    marginTop: "1.5rem",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(128, 0, 32, 0.4)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    fontFamily: "'Playfair Display', serif",
                    color: "#111827",
                    lineHeight: 1.7
                  }}
                >
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#800020", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {aiResponse.type === "recipe" ? "🍽️" : aiResponse.type === "macros" ? "📊" : "💡"} {aiResponse.title}
                  </div>

                  {aiResponse.subtitle && (
                    <div style={{ fontSize: "0.9rem", color: "rgba(17, 24, 39, 0.6)", marginBottom: "1.25rem", fontStyle: "italic" }}>
                      ⏱️ {aiResponse.subtitle}
                    </div>
                  )}

                  {aiResponse.content && (
                    <p style={{ fontSize: "1rem", color: "rgba(17, 24, 39, 0.85)", margin: "0.5rem 0 1rem 0", lineHeight: 1.6 }}>
                      {aiResponse.content}
                    </p>
                  )}

                  {aiResponse.macrosData && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "1rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
                      <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.06)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(17,24,39,0.6)" }}>Calorías</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#800020", marginTop: "0.2rem" }}>{aiResponse.macrosData.calories}</div>
                      </div>
                      <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.06)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(17,24,39,0.6)" }}>Proteína</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginTop: "0.2rem" }}>{aiResponse.macrosData.protein}</div>
                      </div>
                      <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.06)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(17,24,39,0.6)" }}>Carbohidratos</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginTop: "0.2rem" }}>{aiResponse.macrosData.carbs}</div>
                      </div>
                      <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.06)", padding: "1rem", borderRadius: "12px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "rgba(17,24,39,0.6)" }}>Grasas</div>
                        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111827", marginTop: "0.2rem" }}>{aiResponse.macrosData.fats}</div>
                      </div>
                    </div>
                  )}

                  {aiResponse.ingredients && (
                    <>
                      <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem", marginTop: "1rem" }}>
                        Ingredientes:
                      </div>
                      <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1.25rem 0", color: "rgba(17, 24, 39, 0.8)", fontSize: "0.95rem" }}>
                        {aiResponse.ingredients.map((ing, i) => (
                          <li key={i} style={{ marginBottom: "0.3rem" }}>{ing}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {aiResponse.steps && (
                    <>
                      <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>
                        Preparación paso a paso:
                      </div>
                      <ol style={{ paddingLeft: "1.25rem", margin: 0, color: "rgba(17, 24, 39, 0.8)", fontSize: "0.95rem" }}>
                        {aiResponse.steps.map((step, i) => (
                          <li key={i} style={{ marginBottom: "0.5rem" }}>{step}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* EVENTOS Y MAYOREO SECTION */}
      <section id="curriculum" style={{ padding: "5rem 1.5rem", maxWidth: "60rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>
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
              <motion.div
                key={item.module}
                whileHover={{ x: 6 }}
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

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: "0.9rem", color: "rgba(17, 24, 39, 0.75)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "1rem" }}
                    >
                      {item.topics}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" style={{ padding: "5rem 1.5rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "45rem", margin: "0 auto 3rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>
            Lo que dicen nuestros <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>clientes</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {REVIEWS.map((rev) => (
            <motion.div
              key={rev.name}
              whileHover={{ y: -6 }}
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQS SECTION */}
      <section id="faq" style={{ padding: "5rem 1.5rem", maxWidth: "55rem", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em" }}>
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
                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ fontSize: "0.9rem", color: "rgba(17, 24, 39, 0.7)", lineHeight: 1.6, marginTop: "1rem", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "1rem" }}
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION & GLOBO 3D (SECCIÓN ENVÍOS CENTRADA) */}
      <section id="envios" style={{ padding: "3rem 1.5rem 6rem", maxWidth: "75rem", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#F9FAFB", border: "1px solid rgba(17,24,39,0.08)", borderRadius: "40px", padding: "clamp(2.5rem, 5vw, 4rem)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div>
            <h2 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Pide tus <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", color: "#800020" }}>Papacruj</span> hoy
            </h2>
            <p style={{ color: "rgba(17, 24, 39, 0.65)", fontSize: "1rem", lineHeight: 1.6, marginTop: "1rem" }}>
              Envíos rápidos a domicilio en León, Guanajuato y envíos nacionales seguros a todo México. Disfruta de tus chips de taro favoritas crujientes y con el mejor sabor artesanal.
            </p>

            <div style={{ marginTop: "2rem" }}>
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem", backgroundColor: "#25D366", color: "#FFFFFF", borderRadius: "9999px", padding: "0.75rem 2.25rem", fontSize: "1rem", fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 16px rgba(37, 211, 102, 0.35)", boxSizing: "border-box" }}
              >
                <img src="/whatsapp.png" alt="WhatsApp" style={{ width: "44px", height: "44px", objectFit: "contain" }} /> Hacer pedido por WhatsApp →
              </motion.a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2.5rem", fontSize: "0.85rem", color: "rgba(17, 24, 39, 0.75)" }}>
              <div>✓ Envíos seguros y rápidos en León, Gto. y nacionales a todo México</div>
              <div>✓ Atención personalizada por WhatsApp</div>
              <div>✓ Pagos fáciles y seguros</div>
            </div>
          </div>

          {/* CONTENEDOR THREE.JS */}
          <div style={{ width: "100%", height: "420px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", overflow: "hidden", cursor: "grab" }}>
            <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
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

        <div style={{ maxWidth: "75rem", margin: "0 auto", borderTop: "1px solid rgba(17,24,39,0.06)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "rgba(17,24,39,0.45)" }}>
          <p>© 2026 Papacruj. Todos los derechos reservados.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Política de Privacidad</a>
            <a href="#" style={{ textDecoration: "none", color: "inherit" }}>Términos de Servicio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}