import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";

// ─── DADOS DO ÁLBUM ──────────────────────────────────────────────────────────
// Ordem oficial do álbum Mundo das Figurinhas — Copa do Mundo 2026
const mkRange = (id, label, code, start, end) => ({
  id, label, code,
  stickers: Array.from({length: end - start + 1}, (_, i) => {
    const num = start + i;
    return { id: `${code}-${num}`, name: `${code}-${num}` };
  })
});

const mk = (id, label, code, qty) => mkRange(id, label, code, 1, qty);

const ALBUM_DATA = [
  // ── ABERTURA ──
  {
    id: "FWC", label: "FIFA World Cup 2026", code: "FWC",
    stickers: [
      { id: "FWC-0", name: "FWC-0" },
      ...Array.from({length: 20}, (_, i) => ({ id: `FWC-${i+1}`, name: `FWC-${i+1}` }))
    ]
  },

  // ── GRUPO A ──
  mk("MEX", "🇲🇽 México (Grupo A)",         "MEX", 20),
  mk("RSA", "🇿🇦 África do Sul (Grupo A)",  "RSA", 20),
  mk("KOR", "🇰🇷 Coreia do Sul (Grupo A)",  "KOR", 20),
  mk("CZE", "🇨🇿 República Tcheca (Grupo A)","CZE", 20),

  // ── GRUPO B ──
  mk("CAN", "🇨🇦 Canadá (Grupo B)",          "CAN", 20),
  mk("BIH", "🇧🇦 Bósnia (Grupo B)",          "BIH", 20),
  mk("QAT", "🇶🇦 Catar (Grupo B)",           "QAT", 20),
  mk("SUI", "🇨🇭 Suíça (Grupo B)",           "SUI", 20),

  // ── GRUPO C ──
  mk("BRA", "🇧🇷 Brasil (Grupo C)",          "BRA", 20),
  mk("MAR", "🇲🇦 Marrocos (Grupo C)",        "MAR", 20),
  mk("HAI", "🇭🇹 Haiti (Grupo C)",           "HAI", 20),
  mk("SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia (Grupo C)",         "SCO", 20),

  // ── GRUPO D ──
  mk("USA", "🇺🇸 Estados Unidos (Grupo D)",  "USA", 20),
  mk("PAR", "🇵🇾 Paraguai (Grupo D)",        "PAR", 20),
  mk("AUS", "🇦🇺 Austrália (Grupo D)",       "AUS", 20),
  mk("TUR", "🇹🇷 Turquia (Grupo D)",         "TUR", 20),

  // ── GRUPO E ──
  mk("GER", "🇩🇪 Alemanha (Grupo E)",        "GER", 20),
  mk("CUW", "🇨🇼 Curaçao (Grupo E)",         "CUW", 20),
  mk("CIV", "🇨🇮 Costa do Marfim (Grupo E)", "CIV", 20),
  mk("ECU", "🇪🇨 Equador (Grupo E)",         "ECU", 20),

  // ── GRUPO F ──
  mk("NED", "🇳🇱 Holanda (Grupo F)",         "NED", 20),
  mk("JPN", "🇯🇵 Japão (Grupo F)",           "JPN", 20),
  mk("SWE", "🇸🇪 Suécia (Grupo F)",          "SWE", 20),
  mk("TUN", "🇹🇳 Tunísia (Grupo F)",         "TUN", 20),

  // ── GRUPO G ──
  mk("BEL", "🇧🇪 Bélgica (Grupo G)",         "BEL", 20),
  mk("EGY", "🇪🇬 Egito (Grupo G)",           "EGY", 20),
  mk("IRN", "🇮🇷 Irã (Grupo G)",             "IRN", 20),
  mk("NZL", "🇳🇿 Nova Zelândia (Grupo G)",   "NZL", 20),

  // ── GRUPO H ──
  mk("ESP", "🇪🇸 Espanha (Grupo H)",         "ESP", 20),
  mk("CPV", "🇨🇻 Cabo Verde (Grupo H)",      "CPV", 20),
  mk("KSA", "🇸🇦 Arábia Saudita (Grupo H)",  "KSA", 20),
  mk("URU", "🇺🇾 Uruguai (Grupo H)",         "URU", 20),

  // ── GRUPO I ──
  mk("FRA", "🇫🇷 França (Grupo I)",          "FRA", 20),
  mk("SEN", "🇸🇳 Senegal (Grupo I)",         "SEN", 20),
  mk("IRQ", "🇮🇶 Iraque (Grupo I)",          "IRQ", 20),
  mk("NOR", "🇳🇴 Noruega (Grupo I)",         "NOR", 20),

  // ── GRUPO J ──
  mk("ARG", "🇦🇷 Argentina (Grupo J)",       "ARG", 20),
  mk("ALG", "🇩🇿 Argélia (Grupo J)",         "ALG", 20),
  mk("AUT", "🇦🇹 Áustria (Grupo J)",         "AUT", 20),
  mk("JOR", "🇯🇴 Jordânia (Grupo J)",        "JOR", 20),

  // ── GRUPO K ──
  mk("POR", "🇵🇹 Portugal (Grupo K)",        "POR", 20),
  mk("COD", "🇨🇩 Congo DR (Grupo K)",        "COD", 20),
  mk("UZB", "🇺🇿 Uzbequistão (Grupo K)",     "UZB", 20),
  mk("COL", "🇨🇴 Colômbia (Grupo K)",        "COL", 20),

  // ── GRUPO L ──
  mk("ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra (Grupo L)",       "ENG", 20),
  mk("CRO", "🇭🇷 Croácia (Grupo L)",         "CRO", 20),
  mk("GHA", "🇬🇭 Gana (Grupo L)",            "GHA", 20),
  mk("PAN", "🇵🇦 Panamá (Grupo L)",          "PAN", 20),

  // ── PÁGINAS FINAIS ──
  {
    id: "HIS", label: "🏆 FIFA World Cup History", code: "FWC-HIS",
    stickers: Array.from({length: 10}, (_, i) => ({ id: `FWCH-${i+1}`, name: `FWCH-${i+1}` }))
  },
  {
    id: "CC", label: "🥤 Coca-Cola Especiais", code: "CC",
    stickers: Array.from({length: 14}, (_, i) => ({ id: `CC-${i+1}`, name: `CC-${i+1}` }))
  },
];

const TOTAL = ALBUM_DATA.reduce((s, sec) => s + sec.stickers.length, 0);
const STATUS = { MISSING: 0, HAVE: 1, REPEATED: 2 };

const C = {
  bg: "#0a0f1e", surface: "#111827", surfaceUp: "#1a2438", border: "#1f2d47",
  green: "#16a34a", greenLight: "#22c55e", gold: "#f59e0b", goldLight: "#fbbf24",
  text: "#f1f5f9", muted: "#64748b", accent: "#3b82f6", red: "#ef4444",
};

const inp = (extra = {}) => ({
  width: "100%", background: C.surfaceUp, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: "12px 14px", color: C.text, fontSize: 14,
  outline: "none", boxSizing: "border-box", ...extra,
});

const btn = (bg, color = "#fff", extra = {}) => ({
  width: "100%", padding: "13px", background: bg, color, border: "none",
  borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer",
  transition: "opacity 0.15s", ...extra,
});

// ─── TELA DE AUTH ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login"); // login | register | forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [recoveredPass, setRecoveredPass] = useState(null);

  const showMsg = (text, isError = true) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 4000);
  };

  const handleLogin = async () => {
    if (!email || !password) return showMsg("Preencha email e senha.");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return showMsg("Email ou senha incorretos.");
    onLogin(data.user);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return showMsg("Preencha todos os campos.");
    if (password.length < 6) return showMsg("Senha deve ter ao menos 6 caracteres.");
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } }
    });
    setLoading(false);
    if (error) return showMsg(error.message.includes("already") ? "Email já cadastrado." : "Erro ao cadastrar.");
    showMsg("Cadastro realizado! Faça login.", false);
    setTab("login");
  };

  const handleForgot = async () => {
    if (!email) return showMsg("Digite seu email de cadastro.");
    setLoading(true);
    // Busca usuário pelo email e retorna a senha (fluxo simplificado conforme solicitado)
    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email.toLowerCase().trim())
      .single();
    setLoading(false);
    if (error || !data) return showMsg("Email não encontrado.");
    // Como senhas são hashed no Supabase (não reversível), enviamos reset por email
    await supabase.auth.resetPasswordForEmail(email);
    showMsg("Email com link de redefinição enviado! Verifique sua caixa de entrada.", false);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0, background: `linear-gradient(135deg, ${C.greenLight}, ${C.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Meu Álbum 2026
          </h1>
          <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Controle suas figurinhas da Copa</p>
        </div>

        {/* Card */}
        <div style={{ background: C.surface, borderRadius: 20, padding: 24, border: `1px solid ${C.border}` }}>
          {/* Tabs */}
          {tab !== "forgot" && (
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[["login", "Entrar"], ["register", "Cadastrar"]].map(([key, label]) => (
                <button key={key} onClick={() => { setTab(key); setMsg(null); }} style={{
                  flex: 1, padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", border: "none",
                  background: tab === key ? C.green : C.surfaceUp,
                  color: tab === key ? "#fff" : C.muted,
                }}>{label}</button>
              ))}
            </div>
          )}

          {/* Mensagem */}
          {msg && (
            <div style={{ background: msg.isError ? `${C.red}22` : `${C.green}22`, border: `1px solid ${msg.isError ? C.red : C.green}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: msg.isError ? "#fca5a5" : C.greenLight }}>
              {msg.text}
            </div>
          )}

          {/* Senha recuperada */}
          {recoveredPass && (
            <div style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}44`, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: C.goldLight }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Sua senha é:</div>
              <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900 }}>{recoveredPass}</div>
            </div>
          )}

          {/* LOGIN */}
          {tab === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp()} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <input style={inp()} placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              <button style={btn(C.green)} onClick={handleLogin} disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <button onClick={() => { setTab("forgot"); setMsg(null); setRecoveredPass(null); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                Esqueci minha senha
              </button>
            </div>
          )}

          {/* CADASTRO */}
          {tab === "register" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input style={inp()} placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
              <input style={inp()} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <input style={inp()} placeholder="Senha (mín. 6 caracteres)" type="password" value={password} onChange={e => setPassword(e.target.value)} />
              <button style={btn(C.accent)} onClick={handleRegister} disabled={loading}>
                {loading ? "Cadastrando..." : "Criar conta"}
              </button>
            </div>
          )}

          {/* ESQUECI SENHA */}
          {tab === "forgot" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4 }}>🔑 Recuperar senha</div>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Informe o email que você usou no cadastro:</p>
              <input style={inp()} placeholder="Seu email de cadastro" type="email" value={email} onChange={e => setEmail(e.target.value)} />
              <button style={btn(C.gold, "#000")} onClick={handleForgot} disabled={loading}>
                {loading ? "Verificando..." : "Recuperar senha"}
              </button>
              <button onClick={() => { setTab("login"); setMsg(null); setRecoveredPass(null); }} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAINEL ADMIN ─────────────────────────────────────────────────────────────
function AdminPanel({ onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) {
        // Para cada user, buscar contagem de figurinhas
        const enriched = await Promise.all(data.map(async (u) => {
          const { count: have } = await supabase.from("sticker_states").select("*", { count: "exact", head: true }).eq("user_id", u.id).eq("status", 1);
          const { count: rep } = await supabase.from("sticker_states").select("*", { count: "exact", head: true }).eq("user_id", u.id).eq("status", 2);
          return { ...u, have: have || 0, rep: rep || 0 };
        }));
        setUsers(enriched);
      }
      setLoading(false);
    };
    load();
  }, []);

  const pct = (have, rep) => Math.round(((have + rep) / TOTAL) * 100);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", color: C.muted, cursor: "pointer", fontSize: 13 }}>← Voltar</button>
        <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>👑 Super Admin</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.muted }}>{users.length} usuários</span>
      </div>
      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Carregando...</div>
        ) : users.map(u => (
          <div key={u.id} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, padding: "14px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{u.name || "Sem nome"}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{u.email}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.goldLight }}>{pct(u.have, u.rep)}%</div>
                {u.is_admin && <span style={{ fontSize: 10, background: `${C.gold}33`, color: C.goldLight, borderRadius: 6, padding: "2px 6px" }}>admin</span>}
              </div>
            </div>
            <div style={{ height: 4, background: C.border, borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ height: "100%", width: `${pct(u.have, u.rep)}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})`, borderRadius: 99 }} />
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
              <span style={{ color: C.greenLight }}>✓ {u.have} tenho</span>
              <span style={{ color: C.goldLight }}>↑ {u.rep} repetidas</span>
              <span style={{ color: C.muted }}>{TOTAL - u.have - u.rep} faltam</span>
              <span style={{ color: C.muted, marginLeft: "auto" }}>{new Date(u.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FIGURINHA ────────────────────────────────────────────────────────────────
function Sticker({ stickerId, status, onTap }) {
  const bg = status === STATUS.HAVE ? C.green : status === STATUS.REPEATED ? C.gold : C.surfaceUp;
  const textColor = status === STATUS.HAVE ? "#fff" : status === STATUS.REPEATED ? "#000" : C.muted;
  const border = status === STATUS.HAVE ? C.greenLight : status === STATUS.REPEATED ? C.goldLight : C.border;
  const label = stickerId.split("-")[1] || stickerId;
  const prefix = stickerId.split("-")[0] || "";

  return (
    <button onClick={() => onTap(stickerId)} style={{
      background: bg, border: `2px solid ${border}`, borderRadius: 10,
      padding: "6px 4px", cursor: "pointer", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", minHeight: 52,
      transition: "all 0.12s ease", userSelect: "none",
      WebkitTapHighlightColor: "transparent", touchAction: "manipulation",
      position: "relative", overflow: "hidden", width: "100%",
    }}>
      {status === STATUS.REPEATED && <span style={{ position: "absolute", top: 2, right: 3, fontSize: 9, fontWeight: 800, color: "#000" }}>×2</span>}
      <span style={{ fontSize: 9, color: status === STATUS.MISSING ? C.muted : textColor, fontWeight: 600, lineHeight: 1 }}>{prefix}</span>
      <span style={{ fontSize: 14, color: textColor, fontWeight: 800, lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

// ─── SEÇÃO ────────────────────────────────────────────────────────────────────
function AlbumSection({ section, stateMap, onTap, highlight }) {
  const have = section.stickers.filter(s => stateMap[s.id] === STATUS.HAVE).length;
  const rep = section.stickers.filter(s => stateMap[s.id] === STATUS.REPEATED).length;
  const total = section.stickers.length;
  const pct = Math.round(((have + rep) / total) * 100);

  return (
    <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, marginBottom: 12, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px 8px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.text }}>{section.label}</span>
            <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, background: C.surfaceUp, color: C.muted, borderRadius: 6, padding: "2px 6px" }}>{section.code}</span>
          </div>
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{have + rep}/{total}</span>
        </div>
        <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.greenLight : C.green, borderRadius: 99, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <span style={{ fontSize: 10, color: C.greenLight }}>✓ {have} tenho</span>
          <span style={{ fontSize: 10, color: C.goldLight }}>↑ {rep} repetidas</span>
          <span style={{ fontSize: 10, color: C.muted }}>{total - have - rep} faltam</span>
        </div>
      </div>
      <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(54px, 1fr))", gap: 6 }}>
        {section.stickers.map(s => (
          <div key={s.id} style={{ outline: highlight === s.id ? `3px solid ${C.accent}` : "none", borderRadius: 10 }}>
            <Sticker stickerId={s.id} status={stateMap[s.id] ?? STATUS.MISSING} onTap={onTap} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [stickerState, setStickerState] = useState({});
  const [dbLoading, setDbLoading] = useState(false);
  const [view, setView] = useState("album");
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(null);
  const [quickInput, setQuickInput] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [shareText, setShareText] = useState(null);
  const sectionRefs = useRef({});
  const saveTimer = useRef(null);

  // ── Verificar sessão ao carregar ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
        loadStickers(session.user.id);
      } else {
        setAuthLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user.id);
        loadStickers(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setStickerState({});
        setAuthLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data);
    setAuthLoading(false);
  };

  const loadStickers = async (userId) => {
    setDbLoading(true);
    const { data } = await supabase.from("sticker_states").select("sticker_id, status").eq("user_id", userId);
    if (data) {
      const map = {};
      data.forEach(r => { map[r.sticker_id] = r.status; });
      setStickerState(map);
    }
    setDbLoading(false);
  };

  // ── Salvar figurinha no banco (debounced) ──
  const saveSticker = useCallback(async (userId, stickerId, status) => {
    if (status === STATUS.MISSING) {
      await supabase.from("sticker_states").delete().eq("user_id", userId).eq("sticker_id", stickerId);
    } else {
      await supabase.from("sticker_states").upsert({ user_id: userId, sticker_id: stickerId, status, updated_at: new Date().toISOString() }, { onConflict: "user_id,sticker_id" });
    }
  }, []);

  const tap = useCallback((id) => {
    if (!user) return;
    setStickerState(prev => {
      const cur = prev[id] ?? STATUS.MISSING;
      const next = (cur + 1) % 3;
      const updated = { ...prev };
      if (next === STATUS.MISSING) delete updated[id];
      else updated[id] = next;
      // Salva no banco
      saveSticker(user.id, id, next);
      return updated;
    });
  }, [user, saveSticker]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Stats
  const haveCount = Object.values(stickerState).filter(v => v === STATUS.HAVE).length;
  const repCount = Object.values(stickerState).filter(v => v === STATUS.REPEATED).length;
  const pct = Math.round(((haveCount + repCount) / TOTAL) * 100);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setHighlight(null); return; }
    const q = val.trim().toUpperCase();
    for (const sec of ALBUM_DATA) {
      const found = sec.stickers.find(s => s.id.toUpperCase() === q);
      if (found) {
        setHighlight(found.id);
        setTimeout(() => sectionRefs.current[sec.id]?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
        return;
      }
    }
    setHighlight(null);
  };

  const handleQuickInput = async () => {
    const lines = quickInput.split(/[\n,]+/).map(l => l.trim().toUpperCase()).filter(Boolean);
    let count = 0;
    const toSave = [];
    setStickerState(prev => {
      const next = { ...prev };
      for (const sec of ALBUM_DATA) {
        for (const s of sec.stickers) {
          if (lines.includes(s.id.toUpperCase())) {
            next[s.id] = STATUS.HAVE;
            toSave.push(s.id);
            count++;
          }
        }
      }
      return next;
    });
    // Salvar no banco em batch
    if (user && toSave.length) {
      const rows = toSave.map(stickerId => ({ user_id: user.id, sticker_id: stickerId, status: STATUS.HAVE, updated_at: new Date().toISOString() }));
      await supabase.from("sticker_states").upsert(rows, { onConflict: "user_id,sticker_id" });
    }
    setQuickInput("");
    setQuickOpen(false);
    showToast(`✅ ${count} figurinha${count !== 1 ? "s" : ""} marcada${count !== 1 ? "s" : ""}!`);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const missingList = ALBUM_DATA.flatMap(sec => sec.stickers.filter(s => (stickerState[s.id] ?? STATUS.MISSING) === STATUS.MISSING).map(s => s.id));
  const repeatedList = ALBUM_DATA.flatMap(sec => sec.stickers.filter(s => stickerState[s.id] === STATUS.REPEATED).map(s => s.id));

  const handleShare = () => {
    setShareText(`🏆 Meu Álbum 2026\n\n❌ Faltam (${missingList.length}):\n${missingList.join(", ")}\n\n🔁 Repetidas (${repeatedList.length}):\n${repeatedList.join(", ")}`);
  };

  const handleReset = async () => {
    if (!window.confirm("Tem certeza que deseja resetar todo o álbum? Esta ação não pode ser desfeita.")) return;
    if (!user) return;
    await supabase.from("sticker_states").delete().eq("user_id", user.id);
    setStickerState({});
    showToast("🗑️ Álbum resetado.");
  };

  // ── Loading inicial ──
  if (authLoading) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🏆</div>
        <div style={{ color: C.muted, fontSize: 14 }}>Carregando...</div>
      </div>
    );
  }

  // ── Não logado ──
  if (!user) return <AuthScreen onLogin={(u) => { setUser(u); loadProfile(u.id); loadStickers(u.id); }} />;

  // ── Admin Panel ──
  if (showAdmin) return <AdminPanel onBack={() => setShowAdmin(false)} />;

  // ── App principal ──
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui, sans-serif" }}>

      {/* TOPBAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: `${C.surface}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 900, background: `linear-gradient(135deg, ${C.greenLight}, ${C.goldLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            🏆 Meu Álbum 2026
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {profile?.is_admin && (
              <button onClick={() => setShowAdmin(true)} style={{ background: `${C.gold}33`, border: `1px solid ${C.gold}44`, borderRadius: 8, padding: "4px 8px", color: C.goldLight, cursor: "pointer", fontSize: 11, fontWeight: 700 }}>
                👑 Admin
              </button>
            )}
            <div style={{ background: C.surfaceUp, borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 800, color: C.goldLight, border: `1px solid ${C.border}` }}>
              {pct}%
            </div>
            <button onClick={handleLogout} style={{ background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 8px", color: C.muted, cursor: "pointer", fontSize: 11 }}>
              Sair
            </button>
          </div>
        </div>

        {/* Nome do usuário */}
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>
          Olá, <span style={{ color: C.text, fontWeight: 600 }}>{profile?.name || user.email}</span>
          {dbLoading && <span style={{ marginLeft: 8, color: C.accent }}>• sincronizando...</span>}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {[
            { label: "Tenho", val: haveCount, color: C.greenLight },
            { label: "Faltam", val: TOTAL - haveCount - repCount, color: C.muted },
            { label: "Repetidas", val: repCount, color: C.goldLight },
            { label: "Total", val: TOTAL, color: C.accent },
          ].map(item => (
            <div key={item.label} style={{ flex: 1, background: C.surfaceUp, borderRadius: 10, padding: "6px 4px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: item.color }}>{item.val}</div>
              <div style={{ fontSize: 9, color: C.muted, fontWeight: 600 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: C.border, borderRadius: 99, overflow: "hidden", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 99, transition: "width 0.4s ease", width: `${pct}%`, background: `linear-gradient(90deg, ${C.green}, ${C.gold})` }} />
        </div>

        {/* Busca */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="🔍 Buscar (ex: BRA-7)"
            style={{ flex: 1, background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.text, fontSize: 13, outline: "none" }} />
          <button onClick={() => { setSearch(""); setHighlight(null); }}
            style={{ background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.muted, cursor: "pointer" }}>✕</button>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 6 }}>
          {[["album", "📖 Álbum"], ["missing", "❌ Faltam"], ["repeated", "🔁 Repet."]].map(([key, label]) => (
            <button key={key} onClick={() => setView(key)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700,
              cursor: "pointer", border: "none",
              background: view === key ? C.green : C.surfaceUp,
              color: view === key ? "#fff" : C.muted,
            }}>{label}</button>
          ))}
          <button onClick={() => setQuickOpen(true)} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", background: C.accent, color: "#fff" }}>⚡</button>
          <button onClick={handleShare} style={{ padding: "7px 12px", borderRadius: 10, fontSize: 13, cursor: "pointer", background: C.surfaceUp, color: C.muted, border: `1px solid ${C.border}` }}>📤</button>
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
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>❌ Faltam {missingList.length} figurinhas</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Toque para marcar como Tenho</div>
            </div>
            {missingList.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 0", color: C.greenLight, fontSize: 16, fontWeight: 700 }}>🏆 Álbum completo!</div>
              : ALBUM_DATA.map(sec => {
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
                })
            }
          </div>
        )}

        {view === "repeated" && (
          <div>
            <div style={{ marginBottom: 12, padding: "12px 14px", background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.goldLight }}>🔁 Repetidas: {repeatedList.length}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Compartilhe para encontrar trocas!</div>
            </div>
            {repeatedList.length === 0
              ? <div style={{ textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 14 }}>Nenhuma repetida ainda.</div>
              : ALBUM_DATA.map(sec => {
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
                })
            }
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
            <textarea value={quickInput} onChange={e => setQuickInput(e.target.value)}
              placeholder={"BRA-1\nBRA-2\nARG-5\nFRA-10"} rows={6} autoFocus
              style={{ width: "100%", background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
            <button onClick={handleQuickInput} style={{ width: "100%", marginTop: 10, padding: "12px", background: C.green, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
              ✓ Marcar como Tenho
            </button>
          </div>
        </div>
      )}

      {/* MODAL COMPARTILHAR */}
      {shareText && (
        <div style={{ position: "fixed", inset: 0, background: "#000a", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShareText(null)}>
          <div style={{ background: C.surface, borderRadius: "20px 20px 0 0", padding: 20, width: "100%", maxWidth: 500, border: `1px solid ${C.border}`, borderBottom: "none" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>📤 Compartilhar</span>
              <button onClick={() => setShareText(null)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <textarea readOnly value={shareText} rows={8} style={{ width: "100%", background: C.surfaceUp, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 11, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button onClick={() => { navigator.clipboard?.writeText(shareText); showToast("📋 Copiado!"); }} style={{ flex: 1, padding: "12px", background: C.surfaceUp, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📋 Copiar</button>
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")} style={{ flex: 1, padding: "12px", background: "#25d366", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📱 WhatsApp</button>
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
        <button onClick={handleReset} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
          🗑️ Resetar álbum
        </button>
      </div>
    </div>
  );
}