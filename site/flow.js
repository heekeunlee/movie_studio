// 제작 공정 흐름도 (n8n 식 노드 그래프) + 에피소드 보드
// studio.js 가 state 를 적용할 때마다 보내는 "studio:state" 이벤트만 따른다. 노드 색은 meta.json 기록에서 나온다.

(() => {
const NW = 172, NH = 88;
// 배치만 여기서 정한다. 단계·산출물·도구·되돌림 관계는 state.json(crew.json) 이 원본이다.
const POS = {
  research: [40, 86], script: [252, 86], check: [464, 86], shotlist: [676, 86], prompts: [888, 86],
  keyframes: [40, 300], clips: [252, 300], objects: [146, 410], audio: [146, 520],
  edit: [500, 410], color: [712, 410], qa: [924, 410],
  package: [40, 700], publish: [252, 700], done: [676, 700],
  analyst: [960, 700],
};
const GATE = { gate1: [1150, 130], gate2: [1170, 454] }; // 마름모 중심
const GR = 36;
const PLATFORMS = [
  { id: "yt", label: "YouTube Shorts", emoji: "▶", x: 470, y: 688 },
  { id: "ig", label: "Instagram Reels", emoji: "◎", x: 470, y: 752 },
];
const FRAMES = {
  plan: [16, 24, 1248, 176], make: [16, 236, 436, 396], post: [468, 236, 796, 396],
  release: [16, 666, 844, 180], feedback: [876, 666, 388, 180],
};
const MODEL = { opus: "Opus", sonnet: "Sonnet", haiku: "Haiku" };
const ST_LABEL = { done: "완료", working: "작업 중", waiting: "대기 중", retry: "재작업", failed: "실패", skipped: "건너뜀", pending: "대기" };

const svg = document.getElementById("flow");
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const kst = (iso) => { const d = new Date(Date.parse(iso) + 9 * 3600e3); return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`; };

let S = null, selected = null, wasDemo = false;

/* ---------- 상태 해석 ---------- */

function stageStatus(ep, id) {
  if (!ep) return "pending";
  const ids = S.stages.map((x) => x.id);
  const idx = ids.indexOf(id), cur = ids.indexOf(ep.stage);
  if (id === ep.stage) return ep.stage === "done" ? "done" : ep.status;
  const rec = ep.stageLog?.[id];
  if (idx < cur) return rec ? (rec.status === "failed" ? "failed" : "done") : "skipped";
  return rec ? rec.status : "pending";
}

/* ---------- 기하 ---------- */

const box = (id) => {
  if (GATE[id]) { const [cx, cy] = GATE[id]; return { l: [cx - GR, cy], r: [cx + GR, cy], t: [cx, cy - GR], b: [cx, cy + GR], cx, cy }; }
  const p = PLATFORMS.find((x) => x.id === id);
  const [x, y, w, h] = p ? [p.x, p.y, 150, 40] : [...POS[id], NW, NH];
  return { l: [x, y + h / 2], r: [x + w, y + h / 2], t: [x + w / 2, y], b: [x + w / 2, y + h], cx: x + w / 2, cy: y + h / 2 };
};
const curve = ([x1, y1], [x2, y2]) => { const k = Math.max(30, Math.abs(x2 - x1) * 0.5); return `M${x1},${y1} C${x1 + k},${y1} ${x2 - k},${y2} ${x2},${y2}`; };
// 꺾은선 + 둥근 모서리
function elbow(pts, r = 10) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], [nx, ny] = pts[i + 1];
    const a = Math.min(r, Math.hypot(x - px, y - py) / 2), b = Math.min(r, Math.hypot(nx - x, ny - y) / 2);
    const ux = Math.sign(x - px), uy = Math.sign(y - py), vx = Math.sign(nx - x), vy = Math.sign(ny - y);
    d += ` L${x - ux * a},${y - uy * a} Q${x},${y} ${x + vx * b},${y + vy * b}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx},${ly}`;
}

function edgeList() {
  const g1 = box("gate1"), g2 = box("gate2");
  const trunk1 = (to, laneX) => { const t = box(to); return elbow([g1.b, [g1.cx, 222], [28, 222], [28, t.cy], [laneX ?? t.l[0], t.cy]]); };
  return [
    ["research", "script"], ["script", "check"], ["check", "shotlist"], ["shotlist", "prompts"], ["prompts", "gate1"],
    ["gate1", "keyframes", trunk1("keyframes")], ["gate1", "objects", trunk1("objects")], ["gate1", "audio", trunk1("audio")],
    ["keyframes", "clips"], ["clips", "edit"], ["objects", "edit"], ["audio", "edit"],
    ["edit", "color"], ["color", "qa"], ["qa", "gate2"],
    ["gate2", "package", elbow([g2.b, [g2.cx, 652], [28, 652], [28, box("package").cy], box("package").l])],
    ["package", "publish"], ["publish", "yt"], ["publish", "ig"], ["yt", "done"], ["ig", "done"],
  ].map(([a, b, d]) => ({ a, b, d: d ?? curve(box(a).r, box(b).l) }));
}

function loopPath(from, to) {
  const f = box(from), t = box(to);
  if (from === "check") return { d: elbow([f.t, [f.cx, 64], [t.cx, 64], t.t]), at: [(f.cx + t.cx) / 2, 64] };
  if (from === "qa") return { d: elbow([f.t, [f.cx, 284], [t.cx, 284], t.t]), at: [(f.cx + t.cx) / 2 + 120, 284] };
  return { d: elbow([f.r, [1272, f.cy], [1272, 10], [t.cx, 10], t.t]), at: [700, 10] }; // analyst → research
}

/* ---------- 그리기 ---------- */

function nodeSVG(stage, ep) {
  const st = stageStatus(ep, stage.id);
  const tries = ep?.retries?.[stage.id] ?? 0;
  const rec = ep?.stageLog?.[stage.id];
  const tip = `${stage.label} — ${ST_LABEL[st] ?? st}${rec?.note ? `\n${rec.note}` : ""}${rec?.at ? `\n${kst(rec.at)} KST` : ""}`;
  const cls = `node st-${st}${stage.optional ? " optional" : ""}${ep && ep.stage === stage.id ? " current" : ""}`;

  if (stage.gate) {
    const [cx, cy] = GATE[stage.id];
    return `<g class="${cls} gate"><title>${esc(tip)}</title>
      <polygon points="${cx},${cy - GR} ${cx + GR},${cy} ${cx},${cy + GR} ${cx - GR},${cy}" class="body"/>
      <text x="${cx}" y="${cy + 6}" class="gi">${st === "waiting" ? "🔔" : st === "done" ? "✓" : "👤"}</text>
      <text x="${cx}" y="${cy - GR - 26}" class="lbl c">${esc(stage.label)}</text>
      <text x="${cx}" y="${cy - GR - 10}" class="sub c">대표 결정${stage.tools.length ? " · " + esc(stage.tools.join(", ")) : ""}</text></g>`;
  }
  const [x, y] = POS[stage.id];
  if (stage.id === "done") {
    return `<g class="${cls}"><title>${esc(tip)}</title><rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12" class="body"/>
      <text x="${x + NW / 2}" y="${y + 40}" class="lbl c">🎉 ${esc(stage.label)}</text>
      <text x="${x + NW / 2}" y="${y + 62}" class="sub c">${ep?.links?.youtube ? "링크 등록됨" : "공개 링크는 meta.json links"}</text></g>`;
  }
  const ag = S.agents.find((a) => a.id === stage.agent) ?? {};
  return `<g class="${cls}"><title>${esc(tip)}</title>
    <rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12" class="body"/>
    <rect x="${x + 10}" y="${y + 10}" width="30" height="30" rx="8" fill="${ag.color ?? "#666"}" class="tile"/>
    <text x="${x + 25}" y="${y + 31}" class="emo">${ag.emoji ?? "•"}</text>
    <text x="${x + 48}" y="${y + 23}" class="lbl">${esc(stage.label)}${stage.optional ? " <tspan class='opt'>선택</tspan>" : ""}</text>
    <text x="${x + 48}" y="${y + 39}" class="sub">${esc(ag.name ?? "")}</text>
    <text x="${x + 10}" y="${y + 59}" class="out">📄 ${esc(stage.out)}</text>
    ${chips([MODEL[ag.model] ?? ag.model, ...stage.tools], x + 10, y + 68)}
    ${badge(st, tries, x + NW - 4, y + 4)}</g>`;
}

function chips(list, x, y) {
  let cx = x, out = "";
  list.filter(Boolean).forEach((t, i) => {
    const w = Math.min(150, 8 + [...t].reduce((n, ch) => n + (ch.charCodeAt(0) > 255 ? 9.5 : 5.6), 0));
    if (cx + w > x + NW - 16) return;
    out += `<rect x="${cx}" y="${y}" width="${w}" height="14" rx="7" class="chip${i === 0 ? " model" : ""}"/><text x="${cx + w / 2}" y="${y + 10.5}" class="chipt">${esc(t)}</text>`;
    cx += w + 4;
  });
  return out;
}

function badge(st, tries, x, y) {
  const mark = { done: "✓", working: "●", waiting: "!", retry: `↺${tries || ""}`, failed: "✕", skipped: "–" }[st];
  if (!mark) return "";
  return `<g class="badge b-${st}"><circle cx="${x}" cy="${y}" r="10"/><text x="${x}" y="${y + 4}">${mark}</text></g>`;
}

function render() {
  if (!S) return;
  const ep = S.episodes.find((e) => e.id === selected) ?? null;
  const stById = Object.fromEntries(S.stages.map((s) => [s.id, s]));
  const statusOf = (id) => {
    if (id === "yt" || id === "ig") return stageStatus(ep, "done") === "done" ? "done" : "pending";
    if (id === "analyst") { const a = S.agents.find((x) => x.id === "analyst"); return a?.status === "working" ? "working" : "pending"; }
    return stageStatus(ep, id);
  };
  const live = (st) => ["done", "skipped"].includes(st);

  let h = `<defs>
    <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker>
    <marker id="ah-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah-on"/></marker>
    <marker id="ah-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah-loop"/></marker></defs>`;

  for (const step of S.steps) {
    const f = FRAMES[step.id]; if (!f) continue;
    const [x, y, w, hh] = f;
    h += `<g class="frame fr-${step.id}"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="14"/>
      <text x="${x + 18}" y="${y + 24}" class="ft">${esc(step.title)}</text>
      <text x="${x + 18 + 10 + step.title.length * 9.5}" y="${y + 24}" class="fs">${esc(step.sub)}</text></g>`;
  }

  // 연결선: 앞 단계가 끝났으면 진하게, 지금 일이 넘어가는 선은 흐르게
  for (const e of edgeList()) {
    const sa = statusOf(e.a), sb = statusOf(e.b);
    const on = live(sa) && sb !== "pending";
    const flowing = live(sa) && ["working", "waiting", "retry"].includes(sb);
    const opt = e.a === "objects" || e.b === "objects";
    h += `<path d="${e.d}" class="edge${on ? " on" : ""}${flowing ? " flowing" : ""}${opt ? " opt" : ""}" marker-end="url(#${on ? "ah-on" : "ah"})"/>`;
  }
  h += `<path d="${curve(box("done").r, box("analyst").l)}" class="edge data" marker-end="url(#ah)"/>
    <text x="${(box("done").r[0] + box("analyst").l[0]) / 2}" y="${box("done").cy - 10}" class="elbl">조회수·유지율</text>`;

  for (const lp of S.loops) {
    const { d, at } = loopPath(lp.from, lp.to);
    const n = lp.from === "check" ? (ep?.retries?.script ?? 0) : lp.from === "qa" ? (ep?.retries?.clips ?? 0) + (ep?.retries?.keyframes ?? 0) : 0;
    h += `<path d="${d}" class="edge loop${n ? " used" : ""}" marker-end="url(#ah-loop)"/>`;
    const txt = lp.label + (n ? ` · ${n}회 발생` : "");
    const w = 18 + [...txt].reduce((k, ch) => k + (ch.charCodeAt(0) > 255 ? 11 : 6.2), 0);
    h += `<rect x="${at[0] - w / 2}" y="${at[1] - 9}" width="${w}" height="18" rx="9" class="lpill"/><text x="${at[0]}" y="${at[1] + 4}" class="ltxt">${esc(txt)}</text>`;
  }

  for (const s of S.stages) h += nodeSVG(s, ep);

  for (const p of PLATFORMS) {
    const st = statusOf(p.id);
    h += `<g class="node plat st-${st}"><rect x="${p.x}" y="${p.y}" width="150" height="40" rx="20" class="body"/>
      <text x="${p.x + 75}" y="${p.y + 25}" class="sub c">${p.emoji} ${p.label}</text></g>`;
  }
  const an = S.agents.find((a) => a.id === "analyst");
  if (an) {
    const [x, y] = POS.analyst, st = statusOf("analyst");
    h += `<g class="node st-${st}"><title>${esc(an.note || "주간 리포트: reports/weekly/")}</title>
      <rect x="${x}" y="${y}" width="${NW}" height="${NH}" rx="12" class="body"/>
      <rect x="${x + 10}" y="${y + 10}" width="30" height="30" rx="8" fill="${an.color}"/><text x="${x + 25}" y="${y + 31}" class="emo">${an.emoji}</text>
      <text x="${x + 48}" y="${y + 23}" class="lbl">주간 분석</text><text x="${x + 48}" y="${y + 39}" class="sub">${esc(an.name)}</text>
      <text x="${x + 10}" y="${y + 59}" class="out">📄 reports/weekly/</text>${chips([MODEL[an.model], "YouTube Analytics"], x + 10, y + 68)}</g>`;
  }
  svg.innerHTML = h;
  renderSummary(ep, stById);
}

function renderSummary(ep, stById) {
  const el = $("flowSum");
  if (!ep) {
    const p = S.plan.find((x) => x.id === selected);
    el.innerHTML = p ? `<b>${esc(p.id)} · ${esc(p.title)}</b> — 아직 시작 전입니다. <code>/produce-episode ${esc(p.id)}</code> 로 시작합니다.` : "에피소드를 고르세요.";
    return;
  }
  const ids = S.stages.map((s) => s.id);
  const cur = stById[ep.stage];
  const nextStage = ep.status === "done" ? S.stages.slice(ids.indexOf(ep.stage) + 1).find((s) => !s.optional) : null;
  const who = (s) => s?.gate ? "👤 대표" : (() => { const a = S.agents.find((x) => x.id === s?.agent); return a ? `${a.emoji} ${a.name}` : ""; })();
  const doneN = S.stages.filter((s) => ["done", "skipped"].includes(stageStatus(ep, s.id))).length;
  el.innerHTML = `<b>${esc(ep.id)} · ${esc(ep.title)}</b>
    <span class="pill st-${esc(ep.stage === "done" ? "done" : ep.status)}">${esc(cur?.label)} ${esc(ST_LABEL[ep.status] ?? ep.status)}</span>
    ${nextStage ? `<span class="muted">다음 → ${esc(nextStage.label)} (${esc(who(nextStage))})</span>` : ep.stage !== "done" ? `<span class="muted">담당 ${esc(who(cur))}</span>` : ""}
    <span class="muted">· ${doneN}/${S.stages.length} 단계 · ${esc(ep.note)}</span>`;
}

function renderBoard() {
  if (!S) return;
  const byId = Object.fromEntries(S.episodes.map((e) => [e.id, e]));
  // 데모 편은 같은 제목의 기획 카드 자리에 보인다 (카드에 DEMO 표시)
  const demo = byId.demo;
  const ids = [...new Set([...S.plan.map((p) => p.id), ...S.episodes.filter((e) => e.id !== "demo").map((e) => e.id)])];
  $("board").innerHTML = ids.map((pid) => {
    const p = S.plan.find((x) => x.id === pid) ?? {};
    const e = demo && demo.title === p.title ? demo : byId[pid];
    const id = e?.id ?? pid;
    const label = e ? (S.stages.find((s) => s.id === e.stage)?.label ?? e.stage) : "시작 전";
    const st = e ? (e.stage === "done" ? "done" : e.status) : "pending";
    const segs = S.stages.map((s) => `<i class="st-${stageStatus(e, s.id)}" title="${esc(s.label)}"></i>`).join("");
    return `<button class="ecard${id === selected ? " sel" : ""}" data-id="${esc(id)}">
      <span class="eno">${esc(pid.toUpperCase())}${id === "demo" ? " · DEMO" : ""}</span>
      <span class="etitle">${esc(e?.title ?? p.title)}</span>
      <span class="eline">${esc(p.lastLine ?? "")}</span>
      <span class="estrip">${segs}</span>
      <span class="est"><span class="dot2 st-${esc(st)}"></span>${esc(label)}${e ? ` ${esc(ST_LABEL[e.status] ?? "")}` : ""}</span></button>`;
  }).join("");
}

$("board").addEventListener("click", (ev) => {
  const b = ev.target.closest(".ecard"); if (!b) return;
  selected = b.dataset.id; render(); renderBoard();
});

window.addEventListener("studio:state", (ev) => {
  S = ev.detail;
  const demo = S.episodes.some((e) => e.id === "demo");
  if (demo) selected = "demo";
  else if (wasDemo || !selected || (!S.episodes.some((e) => e.id === selected) && !S.plan.some((p) => p.id === selected)))
    selected = (S.episodes.find((e) => e.stage !== "done") ?? S.episodes[0] ?? S.plan[0])?.id ?? null;
  wasDemo = demo;
  render(); renderBoard();
});
})();
