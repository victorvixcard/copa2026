import { useState, useEffect, useCallback, useRef } from "react";

// ─── DADOS DO ÁLBUM ──────────────────────────────────────────────────────────
// Ordem real do álbum FIFA World Cup 2026 (a validar com álbum físico)
const mk = (id, label, code, qty) => ({
  id, label, code,
  stickers: Array.from({length: qty}, (_, i) => ({ id: `${code}-${i+1}`, name: `${code}-${i+1}` }))
});

const ALBUM_DATA = [
  mk("FWC", "FIFA World Cup 2026", "FWC", 20),
  mk("MAS", "Mascotes", "MAS", 8),
  mk("ALG", "Argélia",              "ALG", 20),
  mk("ARG", "Argentina",            "ARG", 20),
  mk("AUS", "Austrália",            "AUS", 20),
  mk("AUT", "Áustria",              "AUT", 20),
  mk("BEL", "Bélgica",              "BEL", 20),
  mk("BIH", "Bósnia e Herzegovina", "BIH", 20),
  mk("BRA", "Brasil",               "BRA", 20),
  mk("CAN", "Canadá",               "CAN", 20),
  mk("CIV", "Costa do Marfim",      "CIV", 20),
  mk("COD", "Congo DR",             "COD", 20),
  mk("COL", "Colômbia",             "COL", 20),
  mk("CPV", "Cabo Verde",           "CPV", 20),
  mk("CRO", "Croácia",              "CRO", 20),
  mk("CUW", "Curaçao",              "CUW", 20),
  mk("CZE", "República Tcheca",     "CZE", 20),
  mk("ECU", "Equador",              "ECU", 20),
  mk("EGY", "Egito",                "EGY", 20),
  mk("ENG", "Inglaterra",           "ENG", 20),
  mk("ESP", "Espanha",              "ESP", 20),
  mk("FRA", "França",               "FRA", 20),
  mk("GER", "Alemanha",             "GER", 20),
  mk("GHA", "Gana",                 "GHA", 20),
  mk("HAI", "Haiti",                "HAI", 20),
  mk("IRN", "Irã",                  "IRN", 20),
  mk("IRQ", "Iraque",               "IRQ", 20),
  mk("JOR", "Jordânia",             "JOR", 20),
  mk("JPN", "Japão",                "JPN", 20),
  mk("KOR", "Coreia do Sul",        "KOR", 20),
  mk("KSA", "Arábia Saudita",       "KSA", 20),
  mk("MAR", "Marrocos",             "MAR", 20),
  mk("MEX", "México",               "MEX", 20),
  mk("NED", "Holanda",              "NED", 20),
  mk("NOR", "Noruega",              "NOR", 20),
  mk("NZL", "Nova Zelândia",        "NZL", 20),
  mk("PAN", "Panamá",               "PAN", 20),
  mk("PAR", "Paraguai",             "PAR", 20),
  mk("POR", "Portugal",             "POR", 20),
  mk("QAT", "Qatar",                "QAT", 20),
  mk("RSA", "África do Sul",        "RSA", 20),
  mk("SCO", "Escócia",              "SCO", 20),
  mk("SEN", "Senegal",              "SEN", 20),
  mk("SUI", "Suíça",                "SUI", 20),
  mk("SWE", "Suécia",               "SWE", 20),
  mk("TUN", "Tunísia",              "TUN", 20),
  mk("TUR", "Turquia",              "TUR", 20),
  mk("URU", "Uruguai",              "URU", 20),
  mk("USA", "Estados Unidos",       "USA", 20),
  mk("UZB", "Uzbequistão",          "UZB", 20),
  mk("HIS", "História da Copa",     "HIS", 12),
  mk("EXT", "Figurinhas Extras",    "EXT", 12),
];

const TOTAL = ALBUM_DATA.reduce((sum, s) => sum + s.stickers.length, 0);
const STATUS = { MISSING: 0, HAVE: 1, REPEATED: 2 };

// ─── STORAGE ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "meualbum2026_v1";
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ─── CORES ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0f1e",
  surface: "#111827",
  surfaceUp: "#1a2438",
  border: "#1f2d47",
  green: "#16a34a",
  greenLight: "#22c55e",
  gold: "#f59e0b",
  goldLight: "#fbbf24",
  text: "#f1f5f9",
  muted: "#64748b",
  accent: "#3b82f6",
};

// ─── COMPONENTE FIGURINHA ────────────────────────────────────────────────────
function Sticker({ stickerId, status, onTap }) {
  const bg =
    status === STATUS.HAVE ? C.green :
    status === STATUS.REPEATED ? C.gold :
    C.surfaceUp;
  const textColor =
    status === STATUS.HAVE ? "#fff" :
    status === STATUS.REPEATED ? "#000" :
    C.muted;
  const border =
    status === STATUS.HAVE ? C.greenLight :
    status === STATUS.REPEATED ? C.goldLight :
    C.border;

  const label = stickerId.includes("-") ? stickerId.split("-")[1] : stickerId;
  const prefix = stickerId.includes("-") ? stickerId.split("-")[0] : "";

  return (
    <button
      onClick={() => onTap(stickerId)}
      style={{
        background: bg,
        border: `2px solid ${border}`,
        borderRadius: 10,
        padding: "6px 4px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
        transition: "all 0.12s ease",
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {status === STATUS.REPEATED && (
        <span style={{
          position: "absolute", top: 2, right: 3,
          fontSize: 9, fontWeight: 800, color: "#000", lineHeight: 1
        }}>×2</span>
      )}
      <span style={{ fontSize: 9, color: status === STATUS.MISSING ? C.muted : textColor, fontWeight: 600, lineHeight: 1 }}>{prefix}</span>
      <span style={{ fontSize: 14, color: textColor, fontWeight: 800, lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

// ─── SEÇÃO DO ÁLBUM ──────────────────────────────────────────────────────────
function AlbumSection({ section, stateMap, onTap, highlight }) {
  const have = section.stickers.filter(s => stateMap[s.id] === STATUS.HAVE).length;
  const rep = section.stickers.filter(s => stateMap[s.id] === STATUS.REPEATED).length;
  const total = section.stickers.length;
  const pct = Math.round(((have + rep) / total) * 100);

  return (
    <div style={{
      background: C.surface,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      marginBottom: 12,
      overflow: "hidden",
    }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{section.label}</span>
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 700,
              background: C.surfaceUp, color: C.muted,
              borderRadius: 6, padding: "2px 6px"
            }}>{section.code}</span>
          </div>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
            {have + rep}/{total}
          </span>
        </div>
        <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: pct === 100 ? C.greenLight : C.green,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.greenLight }}>✓ {have} tenho</span>
          <span style={{ fontSize: 10, color: C.goldLight }}>↑ {rep} repetidas</span>
          <span style={{ fontSize: 10, color: C.muted }}>{total - have - rep} faltam</span>
        </div>
      </div>
      <div style={{
        padding: 10,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(54px, 1fr))",
        gap: 6,
      }}>
        {section.stickers.map(s => (
          <div key={s.id} style={{
            outline: highlight === s.id ? `3px solid ${C.accent}` : "none",
            borderRadius: 10,
            transition: "outline 0.2s",
          }}>
            <Sticker
              stickerId={s.id}
              status={stateMap[s.id] ?? STATUS.MISSING}
              onTap={onTap}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [stickerState, setStickerState] = useState(loadState);
  const [view, setView] = useState("album");
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [quickInput, setQuickInput] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [shareText, setShareText] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => { saveState(stickerState); }, [stickerState]);

  const tap = useCallback((id) => {
    setStickerState(prev => {
      const cur = prev[id] ?? STATUS.MISSING;
      const next = (cur + 1) % 3;
      return { ...prev, [id]: next };
    });
  }, []);

  const haveCount = Object.values(stickerState).filter(v => v === STATUS.HAVE).length;
  const repCount = Object.values(stickerState).filter(v => v === STATUS.REPEATED).length;
  const missingCount = TOTAL - haveCount - repCount;
  const pct = Math.round(((haveCount + repCount) / TOTAL) * 100);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setHighlight(null); return; }
    const q = val.trim().toUpperCase();
    for (const sec of ALBUM_DATA) {
      const found = sec.stickers.find(s => s.id.toUpperCase() === q);
      if (found) {
        setHighlight(found.id);
        setTimeout(() => {
          sectionRefs.current[sec.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }
    }
    setHighlight(null);
  };

  const handleQuickInput = () => {
    const lines = quickInput.split(/[\n,]+/).map(l => l.trim().toUpperCase()).filter(Boolean);
    let count = 0;
    setStickerState(prev => {
      const next = { ...prev };
      for (const sec of ALBUM_DATA) {
        for (const s of sec.stickers) {
          if (lines.includes(s.id.toUpperCase())) {
            next[s.id] = STATUS.HAVE;
            count++;
          }
        }
      }
      return next;
    });
    setQuickInput("");
    setQuickOpen(false);
    showToast(`✅ ${count} figurinha${count !== 1 ? "s" : ""} marcada${count !== 1 ? "s" : ""}!`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const missingList = ALBUM_DATA.flatMap(sec =>
    sec.stickers.filter(s => (stickerState[s.id] ?? STATUS.MISSING) === STATUS.MISSING).map(s => s.id)
  );
  const repeatedList = ALBUM_DATA.flatMap(sec =>
    sec.stickers.filter(s => stickerState[s.id] === STATUS.REPEATED).map(s => s.id)
  );

  const handleShare = () => {
    const txt = `🏆 Meu Álbum 2026\n\n❌ Faltam (${missingList.length}):\n${missingList.join(", ")}\n\n🔁 Repetidas (${repeatedList.length}):\n${repeatedList.join(", ")}`;
    setShareText(txt);
  };

  const copyShare = () => {
    try {
      navigator.clipboard?.writeText(shareText);
      showToast("📋 Copiado!");
    } catch { showToast("Selecione e copie o texto!"); }
  };

  const waShare = () => {
    if (!shareText) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const resetAll = () => {
    if (window.confirm("Tem certeza? Isso vai apagar todo o progresso.")) {
      setStickerState({});
      showToast("🗑️ Álbum resetado.");
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* TOPBAR */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: `${C.surface}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "10px 14px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 900, background: `linear-gradient(135deg, ${C.greenLight}, ${C.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🏆 Meu Álbum 2026
          </span>
          <div style={{ background: C.surfaceUp, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 800, color: C.goldLight, border: `1px solid ${C.border}` }}>
            {pct}%
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[
            { label: "Tenho", val: haveCount, color: C.greenLight },
            { label: "Faltam", val: missingCount, color: C.muted },
            { label: "Repetidas", val: repCount, color: C.goldLight },
            { label: "Total", val: TOTAL, color: C.accent },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, background: C.surfaceUp, borderRadius: 10, padding: "6px 4px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: item.color }}>{item.val}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 6, background: C.border, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 99, transition: "width 0.4s ease", width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})` }} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="🔍 Buscar (ex: BRA-7)"
            style={{ flex: 1, background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }}
          />
          <button onClick={() => { setSearch(""); setHighlight(null); }}
            style={{ background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.muted, cursor: "pointer", fontSize: 13 }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {[
            { key: "album", label: "📖 Álbum" },
            { key: "missing", label: "❌ Faltam" },
            { key: "repeated", label: "🔁 Repet." },
          ].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700,
              cursor: "pointer", border: "none",
              background: view === tab.key ? C.green : C.surfaceUp,
              color: view === tab.key ? "#fff" : C.muted,
            }}>
              {tab.label}
            </button>
          ))}
          <button onClick={() => setQuickOpen(true)} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: C.accent, color: "#fff" }} title="Entrada rápida">⚡</button>
          <button onClick={handleShare} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 13, cursor: "pointer", background: C.surfaceUp, color: C.muted, border: `1px solid ${C.border}` }} title="Compartilhar">📤</button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ padding: "12px 12px 80px" }}>

        {view === "album" && ALBUM_DATA.map(section => (
          <div key={section.id} ref={el => sectionRefs.current[section.id] = el}>
            <AlbumSection section={section} stateMap={stickerState} onTap={tap} highlight={highlight} />
          </div>
        ))}

        {view === "missing" && (
          <div>
            <div style={{ marginBottom: 12, padding: "12px 14px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 2 }}>❌ Faltam {missingList.length} figurinhas</div>
              <div style={{ fontSize: 11, color: C.muted }}>Toque em qualquer figurinha para marcar como Tenho</div>
            </div>
            {missingList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.greenLight, fontSize: 16, fontWeight: 700 }}>🏆 Álbum completo!</div>
            ) : ALBUM_DATA.map(sec => {
              const items = sec.stickers.filter(s => (stickerState[s.id] ?? STATUS.MISSING) === STATUS.MISSING);
              if (!items.length) return null;
              return (
                <div key={sec.id} style={{ marginBottom: 10, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{sec.label}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{items.length} faltam</span>
                  </div>
                  <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map(s => (
                      <button key={s.id} onClick={() => tap(s.id)} style={{ background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", color: C.muted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "repeated" && (
          <div>
            <div style={{ marginBottom: 12, padding: "12px 14px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.goldLight, marginBottom: 2 }}>🔁 Repetidas: {repeatedList.length}</div>
              <div style={{ fontSize: 11, color: C.muted }}>Compartilhe no WhatsApp pra encontrar trocas!</div>
            </div>
            {repeatedList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 14 }}>Nenhuma repetida ainda.</div>
            ) : ALBUM_DATA.map(sec => {
              const items = sec.stickers.filter(s => stickerState[s.id] === STATUS.REPEATED);
              if (!items.length) return null;
              return (
                <div key={sec.id} style={{ marginBottom: 10, background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{sec.label}</span>
                    <span style={{ fontSize: 12, color: C.goldLight }}>{items.length} repetidas</span>
                  </div>
                  <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map(s => (
                      <button key={s.id} onClick={() => tap(s.id)} style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}66`, borderRadius: 8, padding: "4px 10px", color: C.goldLight, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        {s.id}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL ENTRADA RÁPIDA */}
      {quickOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setQuickOpen(false)}>
          <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxWidth: 500, border: `1px solid ${C.border}`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>⚡ Entrada Rápida</span>
              <button onClick={() => setQuickOpen(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>Cole os códigos (um por linha ou separado por vírgula):</p>
            <textarea
              value={quickInput}
              onChange={e => setQuickInput(e.target.value)}
              placeholder={"BRA-1\nBRA-2\nARG-5\nFRA-10"}
              rows={6}
              style={{ width: "100%", background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }}
              autoFocus
            />
            <button onClick={handleQuickInput} style={{ width: "100%", marginTop: 10, padding: "12px", background: C.green, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              ✓ Marcar como Tenho
            </button>
          </div>
        </div>
      )}

      {/* MODAL COMPARTILHAMENTO */}
      {shareText && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShareText(null)}>
          <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxWidth: 500, border: `1px solid ${C.border}`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>📤 Compartilhar</span>
              <button onClick={() => setShareText(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <textarea readOnly value={shareText} rows={8} style={{ width: "100%", background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 11, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={copyShare} style={{ flex: 1, padding: "12px", background: C.surfaceUp, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📋 Copiar</button>
              <button onClick={waShare} style={{ flex: 1, padding: "12px", background: "#25d366", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📱 WhatsApp</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: "#1a2438ee", backdropFilter: "blur(8px)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: C.text, zIndex: 200, whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}

      {/* FOOTER */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, padding: "8px 14px", display: "flex", justifyContent: "center" }}>
        <button onClick={resetAll} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
          🗑️ Resetar álbum
        </button>
      </div>
    </div>
  );
}