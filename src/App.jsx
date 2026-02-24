import { useState, useEffect, useRef } from "react";

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  es: {
    title: "Sintonía Fiel",
    subtitle: "Discernimiento espiritual para tu música",
    placeholder: "Pega aquí la letra que quieres discernir...",
    genreLabel: "GÉNERO (opcional)",
    genrePlaceholder: "Ej: Reggaetón, Rock, Pop...",
    analyzeBtn: "Analizar ✦",
    lyricLabel: "LETRA DE LA CANCIÓN",
    loading1: "Analizando con discernimiento...",
    loading2: "Examinando la letra desde una perspectiva bíblica",
    retry: "Intentar de nuevo",
    backBtn: "← Analizar otra canción",
    tabs: { analisis: "📊 Análisis", puntos: "🔍 Puntos Ciegos", versiculo: "📖 Reflexión", alternativas: "🎧 Alternativas" },
    tableHeaders: { lenguaje: "Lenguaje", teologia: "Teología", impacto_emocional: "Impacto Emocional", valores: "Valores" },
    positivos: "✅ Aspectos Positivos",
    puntosCiegosTitle: "Puntos Ciegos Detectados",
    puntosCiegosSubtitle: "Frases que suenan bien pero merecen reflexión espiritual",
    noPuntosCiegos: "✅ No se detectaron puntos ciegos significativos",
    alternativasTitle: "Edifica tu Lista de Reproducción",
    alternativasSubtitle: "Si te gusta el ritmo de esta canción, prueba estas alternativas que edifican",
    settingsTitle: "Preferencias",
    darkMode: "Modo Oscuro",
    language: "Idioma",
    denomination: "Denominación",
    denomOptions: {
      evangelica: "Evangélica General",
      pentecostal: "Pentecostal / Carismática",
      bautista: "Bautista",
      reformada: "Reformada / Presbiteriana",
      catolica: "Católica",
    },
    semaforo: { VERDE: "Edificante", AMARILLO: "Requiere Discernimiento", ROJO: "No Recomendada" },
    tablaTitle: "Tabla de Valores",
    claro: "Claro",
    oscuro: "Oscuro",
  },
  en: {
    title: "Faithful Tune",
    subtitle: "Spiritual discernment for your music",
    placeholder: "Paste the lyrics you want to discern here...",
    genreLabel: "GENRE (optional)",
    genrePlaceholder: "E.g.: Reggaeton, Rock, Pop...",
    analyzeBtn: "Analyze ✦",
    lyricLabel: "SONG LYRICS",
    loading1: "Analyzing with discernment...",
    loading2: "Examining the lyrics from a biblical perspective",
    retry: "Try again",
    backBtn: "← Analyze another song",
    tabs: { analisis: "📊 Analysis", puntos: "🔍 Blind Spots", versiculo: "📖 Reflection", alternativas: "🎧 Alternatives" },
    tableHeaders: { lenguaje: "Language", teologia: "Theology", impacto_emocional: "Emotional Impact", valores: "Values" },
    positivos: "✅ Positive Aspects",
    puntosCiegosTitle: "Detected Blind Spots",
    puntosCiegosSubtitle: "Phrases that sound good but deserve spiritual reflection",
    noPuntosCiegos: "✅ No significant blind spots detected",
    alternativasTitle: "Build Your Playlist",
    alternativasSubtitle: "If you like this song's rhythm, try these uplifting alternatives",
    settingsTitle: "Preferences",
    darkMode: "Dark Mode",
    language: "Language",
    denomination: "Denomination",
    denomOptions: {
      evangelica: "General Evangelical",
      pentecostal: "Pentecostal / Charismatic",
      bautista: "Baptist",
      reformada: "Reformed / Presbyterian",
      catolica: "Catholic",
    },
    semaforo: { VERDE: "Uplifting", AMARILLO: "Requires Discernment", ROJO: "Not Recommended" },
    tablaTitle: "Values Table",
    claro: "Light",
    oscuro: "Dark",
  },
};

const DENOM_NOTES = {
  evangelica: "Desde una perspectiva evangélica general, con énfasis en la Biblia como autoridad suprema.",
  pentecostal: "Desde una perspectiva pentecostal/carismática, sensible a temas del Espíritu Santo y la santidad práctica.",
  bautista: "Desde una perspectiva bautista, con énfasis en la gracia, la fe personal y la autoridad bíblica.",
  reformada: "Desde una perspectiva reformada/presbiteriana, con énfasis en la soberanía de Dios y la teología del pacto.",
  catolica: "Desde una perspectiva católica, con referencia a la Tradición, el Magisterio y la Sagrada Escritura.",
};

const SEMAFORO_CONFIG = {
  VERDE: { color: "#22c55e", bg: "#f0fdf4", pastel: "#bbf7d0" },
  AMARILLO: { color: "#f59e0b", bg: "#fffbeb", pastel: "#fde68a" },
  ROJO: { color: "#ef4444", bg: "#fef2f2", pastel: "#fecaca" },
};

const LIGHT = {
  bg: "linear-gradient(160deg, #EFF6FF 0%, #F0FDF4 50%, #FEF9C3 100%)",
  card: "#ffffff", cardBorder: "#E2E8F0", cardShadow: "0 8px 40px rgba(0,0,0,0.07)",
  text: "#1E293B", textSoft: "#64748B", textMuted: "#94A3B8",
  tabBg: "#F1F5F9", tabColor: "#64748B", tabActiveBg: "#1E293B", tabActiveColor: "#ffffff",
  inputBg: "#F8FAFC", inputBorder: "#E2E8F0", rowBg: "#F8FAFC", divider: "#F1F5F9",
  navBg: "rgba(255,255,255,0.85)",
};
const DARK = {
  bg: "linear-gradient(160deg, #0f172a 0%, #0d1f1a 50%, #1a1600 100%)",
  card: "#1E293B", cardBorder: "#334155", cardShadow: "0 8px 40px rgba(0,0,0,0.4)",
  text: "#F1F5F9", textSoft: "#94A3B8", textMuted: "#64748B",
  tabBg: "#0F172A", tabColor: "#94A3B8", tabActiveBg: "#F1F5F9", tabActiveColor: "#1E293B",
  inputBg: "#0F172A", inputBorder: "#334155", rowBg: "#0F172A", divider: "#334155",
  navBg: "rgba(15,23,42,0.90)",
};

function RadialProgress({ value, color, th }) {
  const r = 54, circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = () => { cur += 2; if (cur <= value) { setAnim(cur); requestAnimationFrame(step); } else setAnim(value); };
    requestAnimationFrame(step);
  }, [value]);
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ flexShrink: 0 }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke={th.cardBorder} strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={circ - (anim / 100) * circ}
        strokeLinecap="round" transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dashoffset 0.1s linear" }} />
      <text x="65" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill={th.text} fontFamily="'Playfair Display', serif">{anim}</text>
      <text x="65" y="78" textAnchor="middle" fontSize="10" fill={th.textMuted} fontFamily="'Lato', sans-serif">/ 100</text>
    </svg>
  );
}

function SettingsPanel({ open, onClose, prefs, setPrefs }) {
  const dark = prefs.dark;
  const th = dark ? DARK : LIGHT;
  const t = T[prefs.lang];
  const set = (k, v) => setPrefs(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: open ? "flex" : "none" }}>
      <div onClick={onClose} style={{ flex: 1, background: "rgba(0,0,0,0.45)" }} />
      <div style={{ width: "310px", background: th.card, borderLeft: `1px solid ${th.cardBorder}`, padding: "28px 22px", overflowY: "auto", animation: open ? "slideInRight 0.28s ease" : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: th.text }}>⚙️ {t.settingsTitle}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: th.textMuted }}>✕</button>
        </div>

        {/* Dark mode */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontFamily: "'Lato'", fontSize: "11px", fontWeight: "700", color: th.textMuted, letterSpacing: "0.1em", display: "block", marginBottom: "10px" }}>
            {t.darkMode.toUpperCase()}
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[[false, "☀️", t.claro], [true, "🌙", t.oscuro]].map(([val, icon, label]) => (
              <button key={String(val)} onClick={() => set("dark", val)} style={{
                flex: 1, padding: "10px", borderRadius: "10px", border: `2px solid`,
                borderColor: prefs.dark === val ? "#3B82F6" : th.cardBorder,
                background: prefs.dark === val ? (dark ? "#1e3a5f" : "#EFF6FF") : th.inputBg,
                cursor: "pointer", fontFamily: "'Lato'", fontSize: "13px", fontWeight: "700",
                color: prefs.dark === val ? "#3B82F6" : th.textSoft, transition: "all 0.2s"
              }}>{icon} {label}</button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontFamily: "'Lato'", fontSize: "11px", fontWeight: "700", color: th.textMuted, letterSpacing: "0.1em", display: "block", marginBottom: "10px" }}>
            {t.language.toUpperCase()}
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[["es","🇪🇸","Español"],["en","🇺🇸","English"]].map(([val, flag, label]) => (
              <button key={val} onClick={() => set("lang", val)} style={{
                flex: 1, padding: "10px", borderRadius: "10px", border: "2px solid",
                borderColor: prefs.lang === val ? "#10B981" : th.cardBorder,
                background: prefs.lang === val ? (dark ? "#052e16" : "#F0FDF4") : th.inputBg,
                cursor: "pointer", fontFamily: "'Lato'", fontSize: "13px", fontWeight: "700",
                color: prefs.lang === val ? "#10B981" : th.textSoft, transition: "all 0.2s"
              }}>{flag} {label}</button>
            ))}
          </div>
        </div>

        {/* Denomination */}
        <div>
          <label style={{ fontFamily: "'Lato'", fontSize: "11px", fontWeight: "700", color: th.textMuted, letterSpacing: "0.1em", display: "block", marginBottom: "10px" }}>
            {t.denomination.toUpperCase()}
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {Object.entries(t.denomOptions).map(([val, label]) => (
              <button key={val} onClick={() => set("denom", val)} style={{
                padding: "11px 14px", borderRadius: "10px", border: "2px solid",
                borderColor: prefs.denom === val ? "#8B5CF6" : th.cardBorder,
                background: prefs.denom === val ? (dark ? "#2e1065" : "#F5F3FF") : th.inputBg,
                cursor: "pointer", fontFamily: "'Lato'", fontSize: "13px", fontWeight: "600",
                color: prefs.denom === val ? "#7C3AED" : th.textSoft, textAlign: "left", transition: "all 0.2s"
              }}>{prefs.denom === val ? "✦ " : ""}{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ data, prefs }) {
  const th = prefs.dark ? DARK : LIGHT;
  const t = T[prefs.lang];
  const sem = SEMAFORO_CONFIG[data.semaforo] || SEMAFORO_CONFIG.AMARILLO;
  const [tab, setTab] = useState("analisis");
  const semEmoji = { VERDE: "🟢", AMARILLO: "🟡", ROJO: "🔴" }[data.semaforo] || "⚪";
  const semLabel = t.semaforo[data.semaforo] || data.semaforo;

  return (
    <div style={{ animation: "fadeSlideUp 0.6s ease forwards" }}>
      <div style={{
        background: prefs.dark ? `${sem.color}15` : sem.bg,
        border: `2px solid ${prefs.dark ? sem.color + "35" : sem.pastel}`,
        borderRadius: "20px", padding: "24px 28px", marginBottom: "18px",
        display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap"
      }}>
        <RadialProgress value={data.puntaje} color={sem.color} th={th} />
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: prefs.dark ? sem.color + "22" : sem.pastel, borderRadius: "999px", padding: "5px 14px", marginBottom: "10px" }}>
            <span>{semEmoji}</span>
            <span style={{ fontWeight: "700", color: sem.color, fontSize: "13px", fontFamily: "'Lato'" }}>{semLabel}</span>
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: th.text, marginBottom: "7px", lineHeight: "1.4" }}>"{data.resumen}"</p>
          <p style={{ fontFamily: "'Lato'", fontSize: "14px", color: th.textSoft, lineHeight: "1.6" }}>{data.semaforo_razon}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {Object.entries(t.tabs).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "9px 18px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontFamily: "'Lato'", fontSize: "13px", fontWeight: "600",
            background: tab === id ? th.tabActiveBg : th.tabBg,
            color: tab === id ? th.tabActiveColor : th.tabColor,
            transition: "all 0.2s"
          }}>{label}</button>
        ))}
      </div>

      <div style={{ background: th.card, borderRadius: "20px", padding: "26px", border: `1px solid ${th.cardBorder}`, boxShadow: th.cardShadow }}>

        {tab === "analisis" && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: th.text, marginBottom: "18px" }}>{t.tablaTitle}</h3>
            <div style={{ display: "grid", gap: "9px" }}>
              {Object.entries(data.tabla || {}).map(([key, val]) => {
                const good = ["Limpio","Correcta","Positivo","Sólidos","Clean","Correct","Positive","Solid"].some(v => val?.calificacion?.includes(v));
                const bad = ["Explícito","Errónea","Tóxico","Negativos","Ausentes","Explicit","Wrong","Toxic","Negative","Absent"].some(v => val?.calificacion?.includes(v));
                return (
                  <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr 2fr", gap: "12px", alignItems: "center", padding: "13px 16px", background: th.rowBg, borderRadius: "11px", border: `1px solid ${th.cardBorder}` }}>
                    <span style={{ fontFamily: "'Lato'", fontSize: "13px", fontWeight: "700", color: th.textSoft }}>{t.tableHeaders[key] || key}</span>
                    <span style={{ fontFamily: "'Lato'", fontSize: "12px", fontWeight: "700", padding: "3px 9px", borderRadius: "999px", textAlign: "center", background: good ? "#DCFCE7" : bad ? "#FEE2E2" : "#FEF9C3", color: good ? "#15803D" : bad ? "#DC2626" : "#A16207" }}>{val?.calificacion}</span>
                    <span style={{ fontFamily: "'Lato'", fontSize: "13px", color: th.textSoft, lineHeight: "1.5" }}>{val?.nota}</span>
                  </div>
                );
              })}
            </div>
            {data.positivos?.length > 0 && (
              <div style={{ marginTop: "22px" }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: th.text, marginBottom: "10px" }}>{t.positivos}</h4>
                {data.positivos.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: "9px", marginBottom: "7px" }}>
                    <span style={{ color: "#10B981" }}>●</span>
                    <p style={{ fontFamily: "'Lato'", fontSize: "14px", color: th.textSoft, lineHeight: "1.6", margin: 0 }}>{p}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "puntos" && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: th.text, marginBottom: "6px" }}>{t.puntosCiegosTitle}</h3>
            <p style={{ fontFamily: "'Lato'", fontSize: "13px", color: th.textMuted, marginBottom: "18px" }}>{t.puntosCiegosSubtitle}</p>
            {!data.puntos_ciegos?.length
              ? <p style={{ fontFamily: "'Lato'", color: "#10B981", textAlign: "center", padding: "20px" }}>{t.noPuntosCiegos}</p>
              : data.puntos_ciegos.map((pc, i) => (
                <div key={i} style={{ borderLeft: "4px solid #F59E0B", paddingLeft: "18px", marginBottom: "18px" }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: th.text, fontStyle: "italic", marginBottom: "6px" }}>"{pc.frase}"</p>
                  <p style={{ fontFamily: "'Lato'", fontSize: "13px", color: th.textSoft, lineHeight: "1.6", margin: 0 }}>{pc.explicacion}</p>
                </div>
              ))}
          </div>
        )}

        {tab === "versiculo" && (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "44px", marginBottom: "18px" }}>✝️</div>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontSize: "21px", color: th.text, lineHeight: "1.7", fontStyle: "italic", maxWidth: "520px", margin: "0 auto 14px", padding: 0, border: "none" }}>
              "{data.versiculo?.texto}"
            </blockquote>
            <p style={{ fontFamily: "'Lato'", fontSize: "14px", fontWeight: "700", color: th.textMuted, letterSpacing: "0.1em" }}>— {data.versiculo?.referencia}</p>
            {data.veredicto_final && (
              <div style={{ marginTop: "28px", background: th.rowBg, borderRadius: "14px", padding: "22px", textAlign: "left", border: `1px solid ${th.cardBorder}` }}>
                <p style={{ fontFamily: "'Lato'", fontSize: "14px", color: th.textSoft, lineHeight: "1.8", margin: 0 }}>💬 {data.veredicto_final}</p>
              </div>
            )}
          </div>
        )}

        {tab === "alternativas" && (
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", color: th.text, marginBottom: "6px" }}>{t.alternativasTitle}</h3>
            <p style={{ fontFamily: "'Lato'", fontSize: "13px", color: th.textMuted, marginBottom: "18px" }}>{t.alternativasSubtitle}</p>
            {data.alternativas?.map((alt, i) => (
              <div key={i} style={{ background: th.rowBg, borderRadius: "13px", padding: "16px 18px", border: `1px solid ${th.cardBorder}`, display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, #BFDBFE, #A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontWeight: "700", fontSize: "17px", color: "#1E40AF", flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <p style={{ fontFamily: "'Lato'", fontWeight: "700", fontSize: "14px", color: th.text, margin: "0 0 3px" }}>{alt.artista} — <span style={{ fontStyle: "italic" }}>"{alt.cancion}"</span></p>
                  <p style={{ fontFamily: "'Lato'", fontSize: "12px", color: th.textSoft, margin: 0 }}>{alt.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [prefs, setPrefs] = useState({ dark: false, lang: "es", denom: "evangelica" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [letra, setLetra] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const th = prefs.dark ? DARK : LIGHT;
  const t = T[prefs.lang];

  const systemPrompt = `Eres el motor de análisis de "Sintonía Fiel". ${DENOM_NOTES[prefs.denom]} Responde en: ${prefs.lang === "es" ? "Español" : "English"}.

Analiza la letra y responde ÚNICAMENTE con un JSON válido (sin markdown, sin texto extra):
{"resumen":"...","semaforo":"VERDE|AMARILLO|ROJO","semaforo_razon":"...","puntaje":0-100,"tabla":{"lenguaje":{"calificacion":"Limpio|Moderado|Explícito","nota":"..."},"teologia":{"calificacion":"Correcta|Mezclada|Errónea|N/A","nota":"..."},"impacto_emocional":{"calificacion":"Positivo|Melancólico|Tóxico|Romántico","nota":"..."},"valores":{"calificacion":"Sólidos|Parciales|Ausentes|Negativos","nota":"..."}},"puntos_ciegos":[{"frase":"...","explicacion":"..."}],"positivos":["..."],"versiculo":{"texto":"...","referencia":"..."},"alternativas":[{"artista":"...","cancion":"...","descripcion":"..."}],"veredicto_final":"..."}`;

  const analyze = async () => {
    if (!letra.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{ role: "user", content: genero ? `Género: ${genero}\n\nLetra:\n${letra}` : `Letra:\n${letra}` }]
        })
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(`API ${res.status}: ${e?.error?.message || res.statusText}`); }
      const data = await res.json();
      const text = data.content?.filter(c => c.type === "text").map(c => c.text).join("").trim();
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in response");
      setResult(JSON.parse(match[0]));
    } catch (e) { setError(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: th.bg, fontFamily: "'Lato', sans-serif", transition: "background 0.4s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus, input:focus { outline: none; }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideInRight { from { transform:translateX(100%); } to { transform:translateX(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: ${th.cardBorder}; border-radius: 3px; }
      `}</style>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} prefs={prefs} setPrefs={setPrefs} />

      {/* Navbar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: th.navBg, backdropFilter: "blur(14px)", borderBottom: `1px solid ${th.cardBorder}`, padding: "11px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>✝️</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "19px", fontWeight: "700", color: th.text }}>{t.title}</span>
        </div>
        <button onClick={() => setSettingsOpen(true)} style={{ background: th.rowBg, border: `1px solid ${th.cardBorder}`, borderRadius: "9px", padding: "7px 13px", cursor: "pointer", fontFamily: "'Lato'", fontSize: "13px", fontWeight: "700", color: th.textSoft, display: "flex", alignItems: "center", gap: "6px" }}>
          ⚙️ {t.settingsTitle}
          <span style={{ background: "#8B5CF6", color: "white", borderRadius: "999px", padding: "1px 7px", fontSize: "10px", fontWeight: "700" }}>
            {prefs.lang === "es" ? "ES" : "EN"} · {prefs.dark ? "🌙" : "☀️"}
          </span>
        </button>
      </div>

      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "36px 18px 80px" }}>

        {!result && !loading && (
          <div style={{ textAlign: "center", marginBottom: "36px", animation: "fadeSlideUp 0.7s ease forwards" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "34px", fontWeight: "700", color: th.text, letterSpacing: "-0.02em", marginBottom: "8px" }}>{t.title}</h1>
            <p style={{ fontSize: "15px", color: th.textSoft }}>{t.subtitle}</p>
            <div style={{ width: "56px", height: "3px", background: "linear-gradient(90deg, #3B82F6, #10B981)", borderRadius: "999px", margin: "12px auto 14px" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: prefs.dark ? "#2e1065" : "#F5F3FF", borderRadius: "999px", padding: "5px 14px", border: "1px solid #DDD6FE" }}>
              <span style={{ fontSize: "12px" }}>🕊️</span>
              <span style={{ fontFamily: "'Lato'", fontSize: "12px", fontWeight: "700", color: "#7C3AED" }}>{T[prefs.lang].denomOptions[prefs.denom]}</span>
            </div>
          </div>
        )}

        {!loading && !result && (
          <div style={{ animation: "fadeSlideUp 0.7s ease 0.1s both" }}>
            <div style={{ background: th.card, borderRadius: "22px", padding: "28px", boxShadow: th.cardShadow, border: `1px solid ${th.cardBorder}`, marginBottom: "14px" }}>
              <label style={{ display: "block", fontWeight: "700", fontSize: "11px", color: th.textMuted, letterSpacing: "0.1em", marginBottom: "11px" }}>{t.lyricLabel}</label>
              <textarea ref={textareaRef} value={letra} onChange={e => setLetra(e.target.value)} placeholder={t.placeholder} rows={10}
                style={{ width: "100%", border: "none", resize: "vertical", fontFamily: "'Lato'", fontSize: "15px", color: th.text, lineHeight: "1.8", background: "transparent" }} />
              <div style={{ borderTop: `1px solid ${th.divider}`, paddingTop: "18px", marginTop: "18px", display: "flex", gap: "11px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "170px" }}>
                  <label style={{ display: "block", fontWeight: "700", fontSize: "11px", color: th.textMuted, letterSpacing: "0.1em", marginBottom: "5px" }}>{t.genreLabel}</label>
                  <input value={genero} onChange={e => setGenero(e.target.value)} placeholder={t.genrePlaceholder}
                    style={{ width: "100%", border: `1px solid ${th.inputBorder}`, borderRadius: "9px", padding: "9px 13px", fontFamily: "'Lato'", fontSize: "14px", color: th.text, background: th.inputBg }} />
                </div>
                <button onClick={analyze} disabled={!letra.trim()} style={{
                  padding: "11px 26px", borderRadius: "11px", border: "none",
                  background: letra.trim() ? "linear-gradient(135deg, #1E293B, #334155)" : th.inputBg,
                  color: letra.trim() ? "white" : th.textMuted,
                  fontFamily: "'Lato'", fontSize: "14px", fontWeight: "700",
                  cursor: letra.trim() ? "pointer" : "not-allowed", transition: "all 0.2s",
                  boxShadow: letra.trim() ? "0 4px 14px rgba(30,41,59,0.28)" : "none"
                }}>{t.analyzeBtn}</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: "9px", justifyContent: "center", flexWrap: "wrap" }}>
              {[["VERDE","🟢"],["AMARILLO","🟡"],["ROJO","🔴"]].map(([k, emoji]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 13px", borderRadius: "999px", background: th.card, border: `1px solid ${th.cardBorder}` }}>
                  <span style={{ fontSize: "11px" }}>{emoji}</span>
                  <span style={{ fontFamily: "'Lato'", fontSize: "11px", fontWeight: "700", color: SEMAFORO_CONFIG[k].color }}>{k.charAt(0) + k.slice(1).toLowerCase()}</span>
                  <span style={{ fontFamily: "'Lato'", fontSize: "11px", color: th.textMuted }}>— {t.semaforo[k]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeSlideUp 0.4s ease forwards" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: `4px solid ${th.cardBorder}`, borderTop: `4px solid ${th.text}`, margin: "0 auto 22px", animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "21px", color: th.text, marginBottom: "7px" }}>{t.loading1}</p>
            <p style={{ fontFamily: "'Lato'", fontSize: "13px", color: th.textMuted }}>{t.loading2}</p>
          </div>
        )}

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "14px", padding: "18px", marginBottom: "18px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Lato'", color: "#DC2626", marginBottom: "10px" }}>{error}</p>
            <button onClick={() => { setError(null); setResult(null); }} style={{ padding: "7px 18px", borderRadius: "7px", border: "none", background: "#1E293B", color: "white", fontFamily: "'Lato'", cursor: "pointer" }}>{t.retry}</button>
          </div>
        )}

        {result && !loading && (
          <div>
            <ResultCard data={result} prefs={prefs} />
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <button onClick={() => { setResult(null); setLetra(""); setGenero(""); setError(null); }}
                style={{ padding: "11px 26px", borderRadius: "11px", border: `2px solid ${th.cardBorder}`, background: th.card, fontFamily: "'Lato'", fontSize: "13px", fontWeight: "700", color: th.textSoft, cursor: "pointer" }}>
                {t.backBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
