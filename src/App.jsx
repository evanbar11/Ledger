import { useState, useEffect, useRef } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');`;

const css = `
${FONTS}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #f5f2eb;
  --bg2: #ede9e0;
  --surface: #ffffff;
  --border: #d8d3c8;
  --border2: #c8c2b4;
  --ink: #1a1814;
  --ink2: #4a4640;
  --muted: #8a8278;
  --accent: #1a3a2a;
  --accent-light: #2d6048;
  --green: #1e7a3e;
  --green-bg: #e8f5ee;
  --red: #c0392b;
  --red-bg: #fde8e6;
  --gold: #b8860b;
  --gold-bg: #fdf6e3;
  --blue: #1a3a6a;
  --blue-bg: #e8eef8;
}
body { background: var(--bg); color: var(--ink); font-family: 'IBM Plex Sans', sans-serif; }
.app { display: flex; min-height: 100vh; }

/* Sidebar */
.sidebar {
  width: 200px; background: var(--accent); min-height: 100vh;
  padding: 0; position: sticky; top: 0; flex-shrink: 0;
  display: flex; flex-direction: column;
}
.logo {
  padding: 28px 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.logo-mark { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
.logo-sub { font-family: 'IBM Plex Mono', monospace; font-size: 9px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
.nav { padding: 16px 0; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 10px; padding: 11px 20px;
  cursor: pointer; font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,0.5); transition: all 0.15s;
  border-left: 2px solid transparent; letter-spacing: 0.2px;
}
.nav-item:hover { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); }
.nav-item.active { color: #fff; border-left-color: #7dd9a0; background: rgba(255,255,255,0.1); }
.nav-icon { font-size: 15px; opacity: 0.9; }
.sidebar-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.1); }
.disclaimer { font-size: 9px; color: rgba(255,255,255,0.25); line-height: 1.5; font-family: 'IBM Plex Mono', monospace; }

/* Main */
.main { flex: 1; padding: 36px 40px; overflow-y: auto; }
.page-header { margin-bottom: 28px; }
.page-title { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: var(--ink); letter-spacing: -1px; }
.page-sub { font-size: 13px; color: var(--muted); margin-top: 4px; font-family: 'IBM Plex Mono', monospace; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
.stat { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; }
.stat-label { font-family: 'IBM Plex Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
.stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: -1px; color: var(--ink); }
.stat-val.up { color: var(--green); }
.stat-val.down { color: var(--red); }
.stat-val.gold { color: var(--gold); }
.stat-delta { font-family: 'IBM Plex Mono', monospace; font-size: 11px; margin-top: 4px; }
.delta-up { color: var(--green); }
.delta-down { color: var(--red); }

/* Cards */
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 22px; }
.card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: -0.3px; color: var(--ink2); text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.gap-y { display: flex; flex-direction: column; gap: 14px; }

/* Holdings table */
.htable { width: 100%; border-collapse: collapse; }
.htable th { font-family: 'IBM Plex Mono', monospace; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); padding: 0 10px 10px; text-align: right; font-weight: 400; }
.htable th:first-child { text-align: left; }
.htable td { padding: 11px 10px; font-size: 13px; text-align: right; border-top: 1px solid var(--border); }
.htable td:first-child { text-align: left; }
.htable tr:hover td { background: var(--bg); }
.ticker { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: var(--accent); }
.co-name { font-size: 11px; color: var(--muted); margin-top: 1px; }
.mono { font-family: 'IBM Plex Mono', monospace; }
.up { color: var(--green); }
.down { color: var(--red); }
.tag {
  display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 9px;
  padding: 2px 7px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;
}
.tag-stock { background: var(--blue-bg); color: var(--blue); }
.tag-etf { background: var(--gold-bg); color: var(--gold); }
.tag-div { background: var(--green-bg); color: var(--green); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: 7px; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.15s;
  border: none; font-family: 'IBM Plex Sans', sans-serif; letter-spacing: 0.1px;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: var(--accent-light); }
.btn-ghost { background: transparent; color: var(--ink2); border: 1px solid var(--border); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-sm { padding: 6px 12px; font-size: 12px; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Search */
.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-input { flex: 1; }
input, select, textarea {
  width: 100%; background: var(--surface); border: 1px solid var(--border);
  border-radius: 7px; padding: 9px 14px; color: var(--ink);
  font-size: 13px; font-family: 'IBM Plex Sans', sans-serif;
  outline: none; transition: border-color 0.15s;
}
input:focus, select:focus, textarea:focus { border-color: var(--accent); }
select option { background: var(--surface); }
textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); display: block; margin-bottom: 5px; }
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* AI output */
.ai-output {
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
  padding: 18px; font-size: 13px; line-height: 1.75; color: var(--ink2);
  min-height: 100px; white-space: pre-wrap; font-family: 'IBM Plex Sans', sans-serif;
}
.ai-placeholder { color: var(--muted); font-style: italic; }
.loading-row { display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: 13px; }
.spinner {
  width: 16px; height: 16px; border: 2px solid var(--border);
  border-top-color: var(--accent); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Score ring */
.score-ring { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ring-val { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; letter-spacing: -2px; }
.ring-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }

/* Metric rows */
.metric-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.metric-row:last-child { border-bottom: none; }
.metric-label { color: var(--muted); font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
.metric-val { font-weight: 500; font-family: 'IBM Plex Mono', monospace; font-size: 12px; }

/* Pills */
.pill-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.pill {
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; border: 1px solid var(--border);
  color: var(--muted); background: var(--surface); font-family: 'IBM Plex Mono', monospace;
  letter-spacing: 0.3px;
}
.pill:hover { border-color: var(--accent); color: var(--accent); }
.pill.active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* Dividend table */
.div-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
.div-row:last-child { border-bottom: none; }
.div-ticker { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--accent); }
.div-name { font-size: 11px; color: var(--muted); }
.div-yield { font-family: 'IBM Plex Mono', monospace; font-size: 16px; font-weight: 500; color: var(--green); }
.div-info { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); text-align: right; }

/* Watchlist */
.watch-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
.watch-item:last-child { border-bottom: none; }

/* Alert pill */
.alert-bar {
  background: var(--gold-bg); border: 1px solid #e8d080;
  border-radius: 7px; padding: 10px 14px; font-size: 12px;
  color: var(--gold); font-family: 'IBM Plex Mono', monospace;
  margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
}

/* Chart tooltip */
.custom-tooltip { background: var(--ink); color: #fff; padding: 8px 12px; border-radius: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; }

/* Sector bar */
.sector-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.sector-label { font-size: 12px; color: var(--ink2); width: 120px; flex-shrink: 0; }
.sector-track { flex: 1; height: 6px; background: var(--bg2); border-radius: 3px; overflow: hidden; }
.sector-fill { height: 100%; border-radius: 3px; background: var(--accent); }
.sector-pct { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); width: 36px; text-align: right; }

.spacer { height: 14px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mt-3 { margin-top: 12px; }
.flex { display: flex; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }

.toast { position: fixed; bottom: 24px; right: 24px; background: var(--accent); color: #fff; padding: 11px 18px; border-radius: 7px; font-size: 13px; font-weight: 600; z-index: 200; animation: fadeUp 0.2s ease; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.modal-overlay { position: fixed; inset: 0; background: rgba(20,18,14,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(3px); }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 28px; width: 480px; max-width: 94vw; }
.modal-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 20px; }
.modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
`;

// --- Mock Data ---
const HOLDINGS = [
  { ticker: "AAPL", name: "Apple Inc.", type: "stock", shares: 45, avgCost: 161.20, price: 198.45, divYield: 0.51 },
  { ticker: "MSFT", name: "Microsoft Corp.", type: "stock", shares: 30, avgCost: 285.10, price: 420.18, divYield: 0.72 },
  { ticker: "VTI", name: "Vanguard Total Market", type: "etf", shares: 80, avgCost: 195.00, price: 242.30, divYield: 1.35 },
  { ticker: "SCHD", name: "Schwab US Dividend Equity", type: "etf", shares: 120, avgCost: 72.40, price: 81.55, divYield: 3.42 },
  { ticker: "JNJ", name: "Johnson & Johnson", type: "stock", shares: 25, avgCost: 148.60, price: 161.20, divYield: 3.08 },
  { ticker: "O", name: "Realty Income Corp.", type: "stock", shares: 60, avgCost: 52.10, price: 56.80, divYield: 5.61 },
  { ticker: "QQQ", name: "Invesco QQQ Trust", type: "etf", shares: 15, avgCost: 362.00, price: 478.90, divYield: 0.58 },
];

const PERF_DATA = [
  { m: "Jun", val: 82400 }, { m: "Jul", val: 85100 }, { m: "Aug", val: 83600 },
  { m: "Sep", val: 87200 }, { m: "Oct", val: 91400 }, { m: "Nov", val: 94800 },
  { m: "Dec", val: 98200 }, { m: "Jan", val: 101500 }, { m: "Feb", val: 99800 },
  { m: "Mar", val: 105200 }, { m: "Apr", val: 108700 }, { m: "May", val: 112340 },
];

const WATCHLIST = [
  { ticker: "NVDA", name: "NVIDIA Corp.", price: 1087.24, chg: +2.34, alert: 1000 },
  { ticker: "BRK.B", name: "Berkshire Hathaway B", price: 418.60, chg: -0.41, alert: null },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", price: 518.40, chg: +0.89, alert: 500 },
  { ticker: "AMZN", name: "Amazon.com Inc.", price: 193.60, chg: +1.12, alert: null },
];

const SECTORS = [
  { name: "Technology", pct: 38 }, { name: "Financials", pct: 12 },
  { name: "Healthcare", pct: 10 }, { name: "Real Estate", pct: 9 },
  { name: "ETF Blend", pct: 22 }, { name: "Other", pct: 9 },
];

const COLORS = ["#1a3a2a","#2d6048","#4a9068","#7db88a","#b0d4bb","#d8e9dc"];

const ANALYZE_TYPES = [
  { id: "fundamental", label: "Fundamental Analysis" },
  { id: "technical", label: "Technical Signals" },
  { id: "dividend", label: "Dividend Quality" },
  { id: "risk", label: "Risk Assessment" },
  { id: "compare", label: "Compare vs Peers" },
  { id: "thesis", label: "Investment Thesis" },
];

function fmt(n) { return n?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtK(n) { return n >= 1000 ? `$${(n/1000).toFixed(1)}K` : `$${fmt(n)}`; }

export default function App() {
  const [page, setPage] = useState("portfolio");
  const [ticker, setTicker] = useState("");
  const [analyzeType, setAnalyzeType] = useState("fundamental");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [holdings, setHoldings] = useState(() => {
    try {
      const saved = localStorage.getItem("ledger_holdings");
      return saved ? JSON.parse(saved) : HOLDINGS;
    } catch { return HOLDINGS; }
  });
  const [newHolding, setNewHolding] = useState({ ticker: "", name: "", type: "stock", shares: "", avgCost: "", price: "", divYield: "" });
  const [toast, setToast] = useState("");
  const [extraCtx, setExtraCtx] = useState("");

  // Save holdings to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem("ledger_holdings", JSON.stringify(holdings)); } catch {}
  }, [holdings]);

  const totalValue = holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const totalCost = holdings.reduce((s, h) => s + h.shares * h.avgCost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = ((totalGain / totalCost) * 100).toFixed(2);
  const annualDiv = holdings.reduce((s, h) => s + h.shares * h.price * (h.divYield / 100), 0);

  const pieData = holdings.map(h => ({ name: h.ticker, value: +(h.shares * h.price).toFixed(0) }));

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2200); }

  async function runAnalysis() {
    if (!ticker.trim()) return;
    setLoading(true); setAiOutput("");
    const prompts = {
      fundamental: `Provide a concise fundamental analysis of ${ticker.toUpperCase()} stock. Cover: P/E ratio context, revenue/earnings growth trend, balance sheet strength, competitive moat, and valuation (overvalued/fair/undervalued). Be direct and quantitative where possible. End with a bull case and bear case in 1 sentence each.`,
      technical: `Analyze ${ticker.toUpperCase()} from a technical analysis perspective. Cover: current trend (50/200 MA), RSI context, key support/resistance levels, recent volume trends, and any notable chart patterns. Give a short-term (1-4 weeks) and medium-term (3-6 months) outlook.`,
      dividend: `Analyze the dividend quality and sustainability of ${ticker.toUpperCase()}. Cover: current yield, payout ratio, dividend growth history (CAGR), free cash flow coverage, balance sheet safety, and whether the dividend is at risk or likely to grow. Rate it: Exceptional / Strong / Adequate / At Risk.`,
      risk: `Provide a risk assessment for ${ticker.toUpperCase()} as a stock holding. Cover: business/competitive risks, macro/sector risks, valuation risk, liquidity, concentration risk, and any regulatory or geopolitical exposure. Rate overall risk: Low / Medium / High / Speculative. Suggest position sizing guidance.`,
      compare: `Compare ${ticker.toUpperCase()} to its 2-3 closest publicly traded peers. Cover: relative valuation (P/E, EV/EBITDA), growth rates, margins, dividend yield, and market position. Conclude which is most attractive for a long-term investor and why.`,
      thesis: `Write a concise investment thesis for ${ticker.toUpperCase()} as if presenting to an investment committee. Structure: 1) Business overview (2 sentences), 2) Why now (catalyst), 3) Competitive advantage, 4) Financial snapshot, 5) Key risks, 6) Target price range and time horizon. Be specific and avoid generic statements.`,
    };
    const ctx = extraCtx ? `\nAdditional context from investor: ${extraCtx}` : "";
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a senior equity research analyst. Provide sharp, data-informed analysis. Be direct, avoid filler. Use numbers and comparisons. Always include a clear bottom line. Note: this is educational analysis, not financial advice.",
          messages: [{ role: "user", content: prompts[analyzeType] + ctx }]
        })
      });
      const data = await res.json();
      setAiOutput(data.content?.[0]?.text || "No response.");
    } catch { setAiOutput("Analysis failed. Please try again."); }
    setLoading(false);
  }

  function addHolding() {
    const h = { ...newHolding, shares: +newHolding.shares, avgCost: +newHolding.avgCost, price: +newHolding.price, divYield: +newHolding.divYield, ticker: newHolding.ticker.toUpperCase() };
    setHoldings([...holdings, h]);
    setShowAdd(false);
    setNewHolding({ ticker: "", name: "", type: "stock", shares: "", avgCost: "", price: "", divYield: "" });
    showToast("Position added");
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) return <div className="custom-tooltip">${payload[0].value.toLocaleString()}</div>;
    return null;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="app">
        <div className="sidebar">
          <div className="logo">
            <div className="logo-mark">LEDGER</div>
            <div className="logo-sub">Investor Terminal</div>
          </div>
          <nav className="nav">
            {[
              { id: "portfolio", icon: "◈", label: "Portfolio" },
              { id: "research", icon: "◎", label: "AI Research" },
              { id: "watchlist", icon: "◇", label: "Watchlist" },
              { id: "dividends", icon: "◆", label: "Dividends" },
              { id: "allocation", icon: "◉", label: "Allocation" },
            ].map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="disclaimer">For informational purposes only. Not financial advice. Always do your own research.</div>
          </div>
        </div>

        <div className="main">

          {/* ── PORTFOLIO ── */}
          {page === "portfolio" && <>
            <div className="page-header">
              <div className="page-title">Portfolio</div>
              <div className="page-sub">Last updated: May 24, 2026</div>
            </div>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-label">Total Value</div>
                <div className="stat-val">${(totalValue/1000).toFixed(1)}K</div>
                <div className="stat-delta delta-up">↑ All positions</div>
              </div>
              <div className="stat">
                <div className="stat-label">Total Gain/Loss</div>
                <div className={`stat-val ${totalGain >= 0 ? "up" : "down"}`}>${(totalGain/1000).toFixed(1)}K</div>
                <div className={`stat-delta ${totalGain >= 0 ? "delta-up" : "delta-down"}`}>{totalGain >= 0 ? "↑" : "↓"} {totalGainPct}% return</div>
              </div>
              <div className="stat">
                <div className="stat-label">Annual Dividends</div>
                <div className="stat-val gold">${(annualDiv/1000).toFixed(1)}K</div>
                <div className="stat-delta" style={{ color: "var(--gold)" }}>≈ ${(annualDiv/12).toFixed(0)}/mo</div>
              </div>
              <div className="stat">
                <div className="stat-label">Positions</div>
                <div className="stat-val">{holdings.length}</div>
                <div className="stat-delta" style={{ color: "var(--muted)" }}>{holdings.filter(h=>h.type==="stock").length} stocks · {holdings.filter(h=>h.type==="etf").length} ETFs</div>
              </div>
            </div>

            <div className="gap-y">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">Portfolio Performance (12M)</span>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={PERF_DATA}>
                    <defs>
                      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1a3a2a" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#1a3a2a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 10, fontFamily: "IBM Plex Mono", fill: "#8a8278" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="val" stroke="#1a3a2a" strokeWidth={2} fill="url(#pg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <div className="card-head">
                  <span className="card-title">Holdings</span>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add Position</button>
                </div>
                <table className="htable">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Type</th>
                      <th>Shares</th>
                      <th>Avg Cost</th>
                      <th>Price</th>
                      <th>Mkt Value</th>
                      <th>Gain/Loss</th>
                      <th>Yield</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map(h => {
                      const mv = h.shares * h.price;
                      const gl = mv - h.shares * h.avgCost;
                      const glPct = ((gl / (h.shares * h.avgCost)) * 100).toFixed(1);
                      return (
                        <tr key={h.ticker} style={{ cursor: "pointer" }} onClick={() => { setTicker(h.ticker); setPage("research"); }}>
                          <td><div className="ticker">{h.ticker}</div><div className="co-name">{h.name}</div></td>
                          <td><span className={`tag tag-${h.type === "etf" ? "etf" : h.divYield > 2 ? "div" : "stock"}`}>{h.type.toUpperCase()}</span></td>
                          <td className="mono">{h.shares}</td>
                          <td className="mono">${fmt(h.avgCost)}</td>
                          <td className="mono">${fmt(h.price)}</td>
                          <td className="mono">${fmt(mv)}</td>
                          <td className={`mono ${gl >= 0 ? "up" : "down"}`}>{gl >= 0 ? "+" : ""}${fmt(gl)} ({glPct}%)</td>
                          <td className="mono" style={{ color: "var(--gold)" }}>{h.divYield}%</td>
                          <td><button className="btn btn-ghost btn-sm" style={{ color: "var(--red)", borderColor: "transparent", padding: "4px 8px" }} onClick={e => { e.stopPropagation(); setHoldings(prev => prev.filter(x => x.ticker !== h.ticker)); showToast("Position removed"); }}>✕</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* ── AI RESEARCH ── */}
          {page === "research" && <>
            <div className="page-header">
              <div className="page-title">AI Research</div>
              <div className="page-sub">Powered by Claude — educational analysis only</div>
            </div>
            <div className="grid-2" style={{ alignItems: "start" }}>
              <div className="card">
                <div className="card-title mb-3">Analysis Settings</div>
                <div className="form-group">
                  <label>Ticker Symbol</label>
                  <input placeholder="e.g. AAPL, MSFT, VTI" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} />
                </div>
                <div className="form-group">
                  <label>Analysis Type</label>
                  <div className="pill-row">
                    {ANALYZE_TYPES.map(a => (
                      <div key={a.id} className={`pill ${analyzeType === a.id ? "active" : ""}`} onClick={() => setAnalyzeType(a.id)}>{a.label}</div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Context (optional)</label>
                  <textarea placeholder="e.g. I'm a long-term dividend investor, already hold 5% in tech, looking at a 10-year horizon..." value={extraCtx} onChange={e => setExtraCtx(e.target.value)} />
                </div>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={runAnalysis} disabled={!ticker.trim() || loading}>
                  {loading ? <><div className="spinner"/> Analyzing...</> : "◎ Run Analysis"}
                </button>
                <div className="spacer" />
                <div className="card-title mb-3">Your Holdings — Quick Analyze</div>
                {holdings.slice(0, 5).map(h => (
                  <div key={h.ticker} className="watch-item">
                    <div><span className="ticker" style={{ fontSize: 13 }}>{h.ticker}</span><span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{h.name}</span></div>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setTicker(h.ticker); runAnalysis(); }}>Analyze</button>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-head">
                  <span className="card-title">{ticker ? `${ticker} — ${ANALYZE_TYPES.find(a=>a.id===analyzeType)?.label}` : "Analysis Output"}</span>
                  {aiOutput && <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard.writeText(aiOutput); showToast("Copied"); }}>Copy</button>}
                </div>
                <div className="ai-output">
                  {loading ? <div className="loading-row"><div className="spinner"/>Generating analysis for {ticker}...</div>
                    : aiOutput ? aiOutput
                    : <span className="ai-placeholder">Enter a ticker and select an analysis type to get AI-powered equity research. Click any holding on the left for a quick analyze.</span>}
                </div>
              </div>
            </div>
          </>}

          {/* ── WATCHLIST ── */}
          {page === "watchlist" && <>
            <div className="page-header">
              <div className="page-title">Watchlist</div>
              <div className="page-sub">Stocks on your radar</div>
            </div>
            <div className="grid-2" style={{ alignItems: "start" }}>
              <div className="card">
                <div className="card-title mb-3">Watching</div>
                {WATCHLIST.map(w => (
                  <div key={w.ticker} className="watch-item">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="ticker">{w.ticker}</span>
                        <span className={`mono ${w.chg >= 0 ? "up" : "down"}`} style={{ fontSize: 12 }}>{w.chg >= 0 ? "▲" : "▼"} {Math.abs(w.chg)}%</span>
                        {w.alert && <span className="tag tag-stock">Alert ${w.alert}</span>}
                      </div>
                      <div className="co-name">{w.name}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                      <span className="mono" style={{ fontSize: 15, fontWeight: 600 }}>${fmt(w.price)}</span>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setTicker(w.ticker); setPage("research"); }}>Research</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-title mb-3">AI Watchlist Scan</div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>Get an AI overview of all watchlist names — which look most interesting right now and why.</p>
                <button className="btn btn-primary" style={{ width: "100%" }} onClick={async () => {
                  setLoading(true); setAiOutput("");
                  const names = WATCHLIST.map(w => w.ticker).join(", ");
                  try {
                    const res = await fetch("https://api.anthropic.com/v1/messages", {
                      method: "POST",
                      headers: { "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01" },
                      body: JSON.stringify({
                        model: "claude-sonnet-4-20250514", max_tokens: 1000,
                        system: "You are a senior equity research analyst. Be sharp and direct. Educational only, not financial advice.",
                        messages: [{ role: "user", content: `Briefly review these watchlist tickers: ${names}. For each, give: current narrative (1 sentence), what to watch for (1 sentence), and a simple verdict: BUY THE DIP / WAIT / AVOID for a long-term investor. Be concise and direct.` }]
                      })
                    });
                    const data = await res.json();
                    setAiOutput(data.content?.[0]?.text || "");
                    setPage("research");
                  } catch { setAiOutput("Failed."); }
                  setLoading(false);
                }} disabled={loading}>
                  {loading ? <><div className="spinner"/>Scanning...</> : "◎ Scan All Watchlist"}
                </button>
              </div>
            </div>
          </>}

          {/* ── DIVIDENDS ── */}
          {page === "dividends" && <>
            <div className="page-header">
              <div className="page-title">Dividends</div>
              <div className="page-sub">Income tracking across your portfolio</div>
            </div>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-label">Annual Income</div>
                <div className="stat-val gold">${(annualDiv).toFixed(0)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Monthly Avg</div>
                <div className="stat-val">${(annualDiv/12).toFixed(0)}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Blended Yield</div>
                <div className="stat-val gold">{((annualDiv/totalValue)*100).toFixed(2)}%</div>
              </div>
              <div className="stat">
                <div className="stat-label">Div Positions</div>
                <div className="stat-val">{holdings.filter(h=>h.divYield>0).length}</div>
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-title mb-3">Dividend Holdings</div>
                {[...holdings].filter(h=>h.divYield > 0).sort((a,b) => b.divYield - a.divYield).map(h => {
                  const annual = h.shares * h.price * (h.divYield / 100);
                  return (
                    <div key={h.ticker} className="div-row">
                      <div>
                        <div className="div-ticker">{h.ticker}</div>
                        <div className="div-name">{h.name}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div className="div-yield">{h.divYield}%</div>
                        <div className="div-info">${annual.toFixed(0)}/yr · ${(annual/12).toFixed(0)}/mo</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="card">
                <div className="card-title mb-3">AI Dividend Analysis</div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.6 }}>Get an AI review of your dividend portfolio — sustainability, growth outlook, and gaps to fill.</p>
                <button className="btn btn-primary" style={{ width: "100%", marginBottom: 14 }} onClick={async () => {
                  setLoading(true); setAiOutput("");
                  const divHoldings = holdings.filter(h => h.divYield > 0).map(h => `${h.ticker} (yield: ${h.divYield}%)`).join(", ");
                  try {
                    const res = await fetch("https://api.anthropic.com/v1/messages", {
                      method: "POST", headers: { "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01" },
                      body: JSON.stringify({
                        model: "claude-sonnet-4-20250514", max_tokens: 1000,
                        system: "You are a dividend investment specialist. Be specific and direct. Educational only.",
                        messages: [{ role: "user", content: `Analyze this dividend portfolio: ${divHoldings}. Cover: 1) Overall income sustainability, 2) Dividend growth outlook for each position, 3) Portfolio concentration risks, 4) Gaps or suggested additions to improve income quality. Be direct and specific.` }]
                      })
                    });
                    const data = await res.json();
                    setAiOutput(data.content?.[0]?.text || "");
                    setPage("research");
                  } catch { setAiOutput("Failed."); }
                  setLoading(false);
                }} disabled={loading}>
                  {loading ? <><div className="spinner"/>Analyzing...</> : "◆ Analyze Dividend Portfolio"}
                </button>
                <div className="card-title mb-3" style={{ marginTop: 8 }}>Income Calendar</div>
                {["January", "April", "July", "October"].map(q => (
                  <div key={q} className="metric-row">
                    <span className="metric-label">{q} (est.)</span>
                    <span className="metric-val" style={{ color: "var(--gold)" }}>${(annualDiv / 4).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {/* ── ALLOCATION ── */}
          {page === "allocation" && <>
            <div className="page-header">
              <div className="page-title">Allocation</div>
              <div className="page-sub">Portfolio composition and risk analysis</div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-title mb-3">Holdings Breakdown</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={2}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 8 }}>
                  {pieData.map((d, i) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length] }} />
                      <span className="mono">{d.name}</span>
                      <span style={{ color: "var(--muted)" }}>{((d.value / totalValue) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="gap-y">
                <div className="card">
                  <div className="card-title mb-3">Sector Exposure</div>
                  {SECTORS.map(s => (
                    <div key={s.name} className="sector-row">
                      <span className="sector-label">{s.name}</span>
                      <div className="sector-track"><div className="sector-fill" style={{ width: `${s.pct}%` }} /></div>
                      <span className="sector-pct">{s.pct}%</span>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title mb-3">AI Portfolio Review</div>
                  <button className="btn btn-primary" style={{ width: "100%" }} onClick={async () => {
                    setLoading(true); setAiOutput("");
                    const summary = holdings.map(h => `${h.ticker} (${((h.shares*h.price/totalValue)*100).toFixed(1)}%)`).join(", ");
                    try {
                      const res = await fetch("https://api.anthropic.com/v1/messages", {
                        method: "POST", headers: { "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
            "anthropic-version": "2023-06-01" },
                        body: JSON.stringify({
                          model: "claude-sonnet-4-20250514", max_tokens: 1000,
                          system: "You are a portfolio risk analyst. Be specific and direct. Educational only.",
                          messages: [{ role: "user", content: `Review this portfolio allocation: ${summary}. Cover: 1) Concentration risks, 2) Diversification quality, 3) Missing asset classes or sectors, 4) Overlap between ETFs and individual stocks, 5) One key rebalancing suggestion. Total value ~$${(totalValue/1000).toFixed(0)}K.` }]
                        })
                      });
                      const data = await res.json();
                      setAiOutput(data.content?.[0]?.text || "");
                      setPage("research");
                    } catch { setAiOutput("Failed."); }
                    setLoading(false);
                  }} disabled={loading}>
                    {loading ? <><div className="spinner"/>Reviewing...</> : "◉ Review My Allocation"}
                  </button>
                </div>
              </div>
            </div>
          </>}

        </div>
      </div>

      {/* Add Position Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add Position</div>
            <div className="form-row">
              <div className="form-group"><label>Ticker</label><input placeholder="AAPL" value={newHolding.ticker} onChange={e => setNewHolding({...newHolding, ticker: e.target.value})} /></div>
              <div className="form-group"><label>Type</label><select value={newHolding.type} onChange={e => setNewHolding({...newHolding, type: e.target.value})}><option value="stock">Stock</option><option value="etf">ETF</option></select></div>
            </div>
            <div className="form-group"><label>Company Name</label><input placeholder="Apple Inc." value={newHolding.name} onChange={e => setNewHolding({...newHolding, name: e.target.value})} /></div>
            <div className="form-row">
              <div className="form-group"><label>Shares</label><input type="number" placeholder="10" value={newHolding.shares} onChange={e => setNewHolding({...newHolding, shares: e.target.value})} /></div>
              <div className="form-group"><label>Avg Cost ($)</label><input type="number" placeholder="150.00" value={newHolding.avgCost} onChange={e => setNewHolding({...newHolding, avgCost: e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Current Price ($)</label><input type="number" placeholder="198.00" value={newHolding.price} onChange={e => setNewHolding({...newHolding, price: e.target.value})} /></div>
              <div className="form-group"><label>Div Yield (%)</label><input type="number" placeholder="0.51" step="0.01" value={newHolding.divYield} onChange={e => setNewHolding({...newHolding, divYield: e.target.value})} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addHolding} disabled={!newHolding.ticker || !newHolding.shares}>Add Position</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </>
  );
}
