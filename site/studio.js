/* QUIET FRAMES 픽셀 스튜디오
 *
 * state.json 하나만 읽어서 그린다 (pipeline/build-state.mjs 가 만든다).
 * 스프라이트는 ai_crew 오피스와 같은 12×16 규격을 쓴다.
 *
 * 상태와 연출
 *   working  자기 방 책상에 앉아 일한다. 모니터가 켜지고 말풍선에 진행 메모가 뜬다.
 *   retry    책상에서 다시 만든다. 말풍선이 빨갛다.
 *   done     방금 끝냈다(30분). 일어나서 방 안을 돌아다닌다.
 *   idle     방 안을 돌아다니거나 복도 커피머신에 다녀온다.
 *
 * 필름 릴 🎞 = 에피소드 한 편. 단계가 바뀌면 앞 단계 담당자가 릴을 들고
 * 다음 담당자 책상까지 걸어가 건넨다. 승인 게이트에서는 복도 끝 대표 우편함에 놓이고 벨이 울린다.
 *
 * 데모 모드만 지어낸 진행이며, 상단 배너로 표시한다.
 */

const LW = 480, LH = 284, S = 3;
const RW = 156, RH = 118, WALL = 22;
const CORR_Y = 142, SPEED = 30;

const SPRITE = [
  "............", "....HHHH....", "...HHHHHH...", "...HSSSSH...",
  "...SSSSSS...", "...SESSES...", "...SSSSSS...", "....SSSS....",
  ".....SS.....", "..CCCCCCCC..", ".CCCCCCCCCC.", ".SCCCCCCCCS.",
  ".SCCCCCCCCS.", "..CCDDDDCC..", "..PPP..PPP..", "..PPP..PPP..",
];
const LEGS_A = ["..PPP..PPP..", "..PPP..PPP.."];
const LEGS_B = ["...PPPPPP...", "..PPP...PP.."];
const FACE_SIDE = "....SEES....";
const SKINS = ["#E8B98A", "#D9A274", "#F1C9A0", "#B9825A"];
const HAIRS = ["#2A2018", "#5A3A2A", "#4A4A52", "#201A14", "#3B2B33", "#7A5230"];
const EYE = "#241812", PANTS = "#39404F";

const ROOM_STYLE = {
  writers: { wall: "#5B4B6B", floor: "#8A6E52", plank: "#7C6249" },
  stage:   { wall: "#2C2F3A", floor: "#4A4E5C", plank: "#42465300" },
  sound:   { wall: "#3E5560", floor: "#6B6257", plank: "#5F574D" },
  edit:    { wall: "#3A3550", floor: "#5C5470", plank: "#544D66" },
  screen:  { wall: "#4A1F24", floor: "#6E2B32", plank: "#64262D" },
  release: { wall: "#2F5A45", floor: "#8C7A5E", plank: "#7E6E54" },
};

/* ---------------- 공통 ---------------- */

const cv = document.getElementById("studio");
cv.width = LW * S; cv.height = LH * S;
const ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;

const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1, 7), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const kstHour = () => { const n = new Date(Date.now() + 9 * 3600e3); return n.getUTCHours() + n.getUTCMinutes() / 60; };
const kstHM = (iso) => { const d = new Date(Date.parse(iso) + 9 * 3600e3); return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`; };

/* ---------------- 배치 ---------------- */

let STATE = null;
let ROOMS = {};          // id → { id, name, emoji, x, y, top }
let ACTORS = {};         // agentId → actor
const MAILBOX = { x: 16, y: CORR_Y + 2 };
const COFFEE = { x: 462, y: CORR_Y + 2 };

function layoutRooms(rooms) {
  ROOMS = {};
  rooms.forEach((r, i) => {
    const col = i % 3, row = (i / 3) | 0;
    ROOMS[r.id] = { ...r, x: 4 + col * (RW + 4), y: row ? CORR_Y + 20 : 4, top: row === 0 };
  });
}

const doorOf = (r) => ({
  x: r.x + 18,
  inY: r.top ? r.y + RH - 12 : r.y + WALL + 8,
});

function deskOf(agentId) {
  const a = STATE.agents.find((g) => g.id === agentId);
  const mates = STATE.agents.filter((g) => g.room === a.room);
  const i = mates.indexOf(a), n = mates.length, r = ROOMS[a.room];
  const span = RW - 48 - 24;
  const x = n === 1 ? r.x + 40 + span / 2 : r.x + 40 + (i * span) / (n - 1);
  return { x: Math.round(x), y: r.y + 44 };
}
const seatOf = (id) => { const d = deskOf(id); return { x: d.x + 6, y: d.y - 14 }; };

function roomAt(p) {
  for (const r of Object.values(ROOMS))
    if (p.x >= r.x && p.x <= r.x + RW && p.y >= r.y && p.y <= r.y + RH) return r;
  return null; // 복도
}

// 방 → 문 → 복도 → 문 → 방. 같은 방이면 바로 간다.
function route(from, to) {
  const a = roomAt(from), b = roomAt(to);
  if (a && b && a.id === b.id) return [to];
  const pts = [];
  if (a) { const d = doorOf(a); pts.push({ x: d.x, y: d.inY }, { x: d.x, y: CORR_Y }); }
  if (b) { const d = doorOf(b); pts.push({ x: d.x, y: CORR_Y }, { x: d.x, y: d.inY }); }
  else pts.push({ x: to.x, y: CORR_Y });
  pts.push(to);
  return pts;
}

function wanderPoint(roomId) {
  const r = ROOMS[roomId];
  return { x: rand(r.x + 30, r.x + RW - 16), y: rand(r.y + 62, r.y + RH - 22) };
}

/* ---------------- 배우 ---------------- */

function makeActor(a, i) {
  const p = wanderPoint(a.room);
  return {
    id: a.id, a, x: p.x, y: p.y, face: 1, phase: 0,
    hair: HAIRS[i % HAIRS.length], skin: SKINS[(i * 3) % SKINS.length],
    status: "idle", note: "", queue: [], seated: false,
    nextWander: performance.now() / 1000 + rand(1, 5),
    bubble: null, bubbleUntil: 0, nextBubble: 0,
  };
}

function walkTo(act, to) { route(act, to).forEach((p) => act.queue.push({ to: p })); }
function then(act, fn) { act.queue.push({ fn }); }

function say(act, text, dur = 4, tone = "plain") {
  act.bubble = { text, tone };
  act.bubbleUntil = performance.now() / 1000 + dur;
}

function updateActor(act, dt, t) {
  // 1) 심부름(릴 전달 등)이 최우선
  if (act.queue.length) {
    act.seated = false;
    const step = act.queue[0];
    if (step.fn) { act.queue.shift(); step.fn(); return; }
    const dx = step.to.x - act.x, dy = step.to.y - act.y, d = Math.hypot(dx, dy);
    if (d < 1) { act.x = step.to.x; act.y = step.to.y; act.queue.shift(); return; }
    const k = Math.min(1, (SPEED * dt) / d);
    act.x += dx * k; act.y += dy * k;
    if (Math.abs(dx) > 0.3) act.face = dx > 0 ? 1 : -1;
    act.phase += dt * 8;
    return;
  }
  // 2) 일하는 중이면 자기 자리로
  if (act.status === "working" || act.status === "retry") {
    const s = seatOf(act.id);
    if (Math.hypot(s.x - act.x, s.y - act.y) > 1) { walkTo(act, s); then(act, () => (act.seated = true)); return; }
    act.seated = true;
    if (t > act.nextBubble) {
      act.nextBubble = t + rand(6, 10);
      const txt = act.status === "retry" ? "다시 만드는 중…" : (act.note || "작업 중");
      say(act, txt, 4.5, act.status === "retry" ? "bad" : "plain");
    }
    return;
  }
  // 3) 쉬는 중: 방 안을 걷거나 커피를 마시러 간다
  act.seated = false;
  if (t > act.nextWander) {
    act.nextWander = t + rand(4, 9);
    if (Math.random() < 0.12) {
      const back = wanderPoint(act.a.room);
      walkTo(act, { x: COFFEE.x - 10, y: COFFEE.y });
      then(act, () => say(act, "☕", 2.5));
      walkTo(act, back);
    } else {
      walkTo(act, wanderPoint(act.a.room));
      if (act.status === "done" && Math.random() < 0.35) then(act, () => say(act, "완료 ✓", 2.5, "ok"));
      else if (Math.random() < 0.08) then(act, () => say(act, pick(["…", "흠", "♪"]), 2));
    }
  }
}

/* ---------------- 필름 릴 ---------------- */

// holder: 배우 id (들고 걷는 중) / 위치 고정은 at
const REEL = { show: false, holder: null, at: null, ep: null };
let lastEp = null; // { id, stage, agent }

function reelRestingSpot(ep) {
  if (!ep) return null;
  const st = STATE.stages.find((s) => s.id === ep.stage);
  if (st?.gate && ep.status === "waiting") return { ...MAILBOX };
  if (ep.stage === "done") { const r = ROOMS.release; return { x: r.x + RW - 20, y: r.y + 30 }; }
  if (!ep.agent || ep.agent === "boss") return { ...MAILBOX };
  const d = deskOf(ep.agent);
  return { x: d.x + 16, y: d.y - 4 };
}

function handoff(prev, ep) {
  const target = reelRestingSpot(ep);
  const giver = prev.agent && prev.agent !== "boss" ? ACTORS[prev.agent] : null;
  const taker = ep.agent && ep.agent !== "boss" ? ACTORS[ep.agent] : null;

  if (giver && giver.id !== ep.agent) {
    // 앞 담당자가 릴을 들고 가서 놓고 돌아온다
    const home = giver.status === "working" ? seatOf(giver.id) : wanderPoint(giver.a.room);
    giver.queue = [];
    then(giver, () => { REEL.holder = giver.id; say(giver, "넘길게요!", 2); });
    walkTo(giver, { x: target.x - 8, y: target.y + 6 });
    then(giver, () => { REEL.holder = null; REEL.at = target; if (taker) say(taker, "받았어요", 2, "ok"); });
    walkTo(giver, home);
  } else if (!giver && taker) {
    // 승인 뒤: 다음 담당자가 우편함에서 릴을 가져간다
    taker.queue = [];
    walkTo(taker, { x: MAILBOX.x + 10, y: MAILBOX.y });
    then(taker, () => { REEL.holder = taker.id; say(taker, "승인 났다!", 2, "ok"); });
    walkTo(taker, seatOf(taker.id));
    then(taker, () => { REEL.holder = null; REEL.at = target; });
  } else {
    REEL.at = target;
  }
}

/* ---------------- 상태 반영 ---------------- */

function primaryEpisode(s) {
  return s.episodes.find((e) => e.stage !== "done") ?? s.episodes[0] ?? null;
}

function applyState(s) {
  const first = !STATE;
  STATE = s;
  if (first) {
    layoutRooms(s.rooms);
    s.agents.forEach((a, i) => (ACTORS[a.id] = makeActor(a, i)));
  }
  for (const a of s.agents) {
    const act = ACTORS[a.id];
    const was = act.status;
    act.a = a; act.status = a.status; act.note = a.note || "";
    if (was !== "done" && a.status === "done" && !first) say(act, "완료 ✓", 3, "ok");
    if (first && (a.status === "working" || a.status === "retry")) {
      const p = seatOf(a.id); act.x = p.x; act.y = p.y; act.seated = true;
    }
  }
  const ep = primaryEpisode(s);
  REEL.show = !!ep; REEL.ep = ep;
  if (ep && !first && lastEp && lastEp.id === ep.id && (lastEp.stage !== ep.stage || lastEp.agent !== ep.agent)) handoff(lastEp, ep);
  else if (ep && !REEL.holder) REEL.at = reelRestingSpot(ep);
  lastEp = ep && { id: ep.id, stage: ep.stage, agent: ep.agent };
  renderPanels();
}

/* ---------------- 그리기: 방 ---------------- */

const anyWorking = (ids) => ids.some((id) => ["working", "retry"].includes(ACTORS[id]?.status));
const roomAgents = (rid) => STATE.agents.filter((a) => a.room === rid).map((a) => a.id);

function drawRoom(r, t) {
  const st = ROOM_STYLE[r.id] ?? ROOM_STYLE.writers;
  px(r.x, r.y, RW, WALL, st.wall);
  px(r.x, r.y + WALL - 2, RW, 2, shade(st.wall, 0.7));
  px(r.x, r.y + WALL, RW, RH - WALL, st.floor);
  for (let yy = r.y + WALL + 8; yy < r.y + RH; yy += 8) px(r.x, yy, RW, 1, st.plank);

  // 테두리 + 문
  const dark = "#121018";
  px(r.x - 1, r.y - 1, RW + 2, 1, dark); px(r.x - 1, r.y + RH, RW + 2, 1, dark);
  px(r.x - 1, r.y, 1, RH, dark); px(r.x + RW, r.y, 1, RH, dark);
  const d = doorOf(r);
  if (r.top) px(d.x - 7, r.y + RH - 1, 14, 3, "#A08060");
  else { px(d.x - 7, r.y - 1, 14, WALL, "#6B4A2E"); px(d.x - 6, r.y, 12, WALL - 2, "#7E5A3A"); px(d.x + 3, r.y + 10, 2, 2, "#E2C27A"); }

  // 방 이름표
  ctx.font = "6px -apple-system, 'Apple SD Gothic Neo', sans-serif";
  ctx.textBaseline = "top";
  const label = `${r.emoji} ${r.name}`;
  const lw = ctx.measureText(label).width + 6;
  const lx = r.top ? r.x + 4 : r.x + 30;
  px(lx, r.y + 3, lw, 9, "rgba(0,0,0,.35)");
  ctx.fillStyle = "#F4EEDC"; ctx.fillText(label, lx + 3, r.y + 4.5);

  const busy = anyWorking(roomAgents(r.id));
  ({ writers: drawWriters, stage: drawStageSet, sound: drawSound, edit: drawEdit, screen: drawScreen, release: drawRelease }[r.id] ?? (() => {}))(r, t, busy);
}

function drawWriters(r, t, busy) {
  const x = r.x + 70, y = r.y + 3;
  px(x, y, 80, 17, "#EDEBE4"); px(x, y + 16, 80, 1, "#9A968C");
  const ep = REEL.ep;
  ctx.font = "5px -apple-system, sans-serif"; ctx.fillStyle = "#2B2B33";
  ctx.fillText(ep ? `${ep.id} · ${ep.title}` : "다음 주제 회의", x + 3, y + 2);
  for (let i = 0; i < 3; i++) px(x + 3, y + 9 + i * 2.5, 30 + ((i * 17 + (busy ? (t * 6) | 0 : 0)) % 40), 1, "#6C7A9C");
  // 책장
  px(r.x + RW - 16, r.y + 60, 12, 40, "#5A3E28");
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) px(r.x + RW - 14 + j * 3.5, r.y + 63 + i * 9, 2, 6, ["#C0504D", "#4F81BD", "#9BBB59", "#F2C14E"][(i + j) % 4]);
}

function drawStageSet(r, t, busy) {
  // 배경 천(시클로라마)과 미니 세트: 책상·화분 — 채널의 무대를 축소한 것
  px(r.x + 64, r.y + 2, 88, 19, "#1B1D24");
  px(r.x + 92, r.y + 86, 40, 3, "#8A6E52"); px(r.x + 94, r.y + 89, 2, 10, "#6B5540"); px(r.x + 128, r.y + 89, 2, 10, "#6B5540");
  px(r.x + 100, r.y + 80, 10, 6, "#30343F"); px(r.x + 101, r.y + 81, 8, 4, busy ? "#9EC5FF" : "#3D4250");
  px(r.x + 120, r.y + 79, 5, 7, "#8B5A3C"); px(r.x + 118, r.y + 73, 9, 6, "#4E8A3E"); px(r.x + 121, r.y + 70, 3, 4, "#62A84C");
  // 소프트박스
  px(r.x + 138, r.y + 62, 12, 10, busy ? "#FFF6D8" : "#B9B3A2"); px(r.x + 143, r.y + 72, 2, 30, "#2A2A2A");
  // 카메라 + 삼각대 + REC
  px(r.x + 70, r.y + 84, 12, 8, "#1E1E22"); px(r.x + 82, r.y + 86, 4, 4, "#3A3A44");
  px(r.x + 75, r.y + 92, 2, 12, "#2A2A2A"); px(r.x + 70, r.y + 103, 12, 1, "#2A2A2A");
  if (busy && ((t * 2) | 0) % 2) px(r.x + 72, r.y + 85, 2, 2, "#FF3B30");
}

function drawSound(r, t, busy) {
  for (let i = 0; i < 10; i++) for (let j = 0; j < 2; j++)
    px(r.x + 60 + i * 9, r.y + 3 + j * 9, 8, 8, (i + j) % 2 ? "#4A6470" : "#557380");
  // 파형 모니터
  const mx = r.x + 100, my = r.y + 58;
  px(mx, my, 40, 18, "#11161A");
  for (let i = 0; i < 36; i++) {
    const h = busy ? 2 + Math.abs(Math.sin(t * 6 + i * 0.7)) * 6 : 1;
    px(mx + 2 + i, my + 9 - h / 2, 1, h, "#4ADE80");
  }
  // 마이크
  px(r.x + 70, r.y + 76, 4, 6, "#2C2C30"); px(r.x + 71, r.y + 82, 2, 20, "#3A3A3A"); px(r.x + 66, r.y + 101, 10, 1, "#3A3A3A");
}

function drawEdit(r, t, busy) {
  const x = r.x + 70, y = r.y + 4;
  px(x, y, 82, 16, "#0F0E14");
  const cols = ["#E07B5F", "#5FA8E0", "#E0C35F", "#8FD18A", "#C08AE0"];
  for (let i = 0; i < 5; i++) px(x + 3 + i * 15, y + 5, 13, 3, cols[i % 5]);
  for (let i = 0; i < 4; i++) px(x + 3 + i * 19, y + 10, 17, 2, "#3C9D8F");
  const ph = busy ? (t * 12) % 76 : 30;
  px(x + 3 + ph, y + 2, 1, 12, "#FF5A5A");
}

function drawScreen(r, t, busy) {
  const x = r.x + 68, y = r.y + 2;
  px(x, y, 84, 19, "#0B0B0E");
  if (busy) {
    const g = ctx.createLinearGradient(x, 0, x + 84, 0);
    const k = (Math.sin(t * 1.3) + 1) / 2;
    g.addColorStop(0, `rgb(${40 + k * 40},${50 + k * 30},${90})`); g.addColorStop(1, `rgb(${120},${80 + k * 40},${60})`);
    ctx.fillStyle = g; ctx.fillRect(x + 2, y + 2, 80, 15);
    if (((t * 8) | 0) % 9 === 0) px(x + 2, y + 2, 80, 15, "rgba(255,255,255,.15)");
  }
  // 객석
  for (let row = 0; row < 2; row++) for (let i = 0; i < 6; i++) {
    px(r.x + 48 + i * 16, r.y + 80 + row * 14, 12, 4, "#8E2F38"); px(r.x + 48 + i * 16, r.y + 84 + row * 14, 12, 3, "#5E1E24");
  }
}

function drawRelease(r, t, busy) {
  const x = r.x + 80, y = r.y + 3;
  px(x, y, 40, 17, "#F2EFE6");
  const eps = STATE.episodes.slice().reverse().slice(-8);
  eps.forEach((e, i) => { const h = Math.max(1, Math.round(e.progress * 12)); px(x + 2 + i * 5, y + 14 - h, 3, h, e.stage === "done" ? "#3C8D2F" : "#C9A23A"); });
  // 공개 카운터
  px(r.x + 122, r.y + 3, 30, 17, "#1B1B22");
  ctx.font = "bold 7px -apple-system, sans-serif"; ctx.fillStyle = "#FF4E45";
  ctx.fillText("▶", r.x + 125, r.y + 6);
  ctx.fillStyle = "#F4F4F4"; ctx.fillText(String(STATE.totals.published), r.x + 135, r.y + 6);
}

function drawCorridor(t) {
  px(0, CORR_Y - 20, LW, 40, "#3A3644");
  for (let x = 0; x < LW; x += 16) px(x, CORR_Y - 20, 8, 40, "#3E3A49");
  // 대표 우편함
  px(MAILBOX.x - 8, CORR_Y - 12, 18, 20, "#6B4A2E"); px(MAILBOX.x - 6, CORR_Y - 10, 14, 6, "#2A1E14");
  ctx.font = "5px -apple-system, sans-serif"; ctx.fillStyle = "#F4EEDC"; ctx.fillText("대표", MAILBOX.x - 5, CORR_Y + 1);
  if (STATE.gate && ((t * 2.5) | 0) % 2) { ctx.font = "8px sans-serif"; ctx.fillText("🔔", MAILBOX.x + 10, CORR_Y - 18); }
  // 커피머신
  px(COFFEE.x, CORR_Y - 14, 12, 20, "#2B2B30"); px(COFFEE.x + 2, CORR_Y - 12, 8, 5, "#5A5A66"); px(COFFEE.x + 4, CORR_Y - 2, 4, 3, "#E9E4D8");
  // 화분
  for (const x of [160, 320]) { px(x - 3, CORR_Y - 6, 6, 6, "#8B5A3C"); px(x - 5, CORR_Y - 13, 10, 8, "#4E8A3E"); }
}

/* ---------------- 그리기: 사람·소품 ---------------- */

function drawSprite(act) {
  const map = { H: act.hair, S: act.skin, E: EYE, C: act.a.color, D: shade(act.a.color, 0.72), P: PANTS };
  const walking = act.queue.length > 0;
  const rows = SPRITE.slice();
  if (walking) { const L = (act.phase | 0) % 2 ? LEGS_B : LEGS_A; rows[14] = L[0]; rows[15] = L[1]; rows[5] = FACE_SIDE; }
  const n = act.seated ? 14 : 16;
  const x = Math.round(act.x), y = Math.round(act.y);
  for (let r = 0; r < n; r++) for (let c = 0; c < 12; c++) {
    const ch = rows[r][c];
    if (ch !== ".") px(x + (act.face < 0 ? 11 - c : c), y + r, 1, 1, map[ch]);
  }
}

function drawDesk(id, t) {
  const d = deskOf(id), act = ACTORS[id];
  const on = act.seated && (act.status === "working" || act.status === "retry");
  px(d.x, d.y, 24, 3, "#9A7650"); px(d.x, d.y + 3, 24, 7, "#7A5A3A");
  px(d.x + 1, d.y + 10, 2, 4, "#5A4028"); px(d.x + 21, d.y + 10, 2, 4, "#5A4028");
  // 모니터(뒷면이 보이는 쪽은 인물 옆에 둔다)
  px(d.x + 1, d.y - 8, 6, 8, "#26262E");
  if (on) px(d.x + 2, d.y - 7, 4, 6, act.status === "retry" ? "#FF8A80" : "#9EC5FF");
  if (on && ((t * 6) | 0) % 2) px(d.x + 9, d.y - 1, 3, 1, act.skin); // 타이핑하는 손
  ctx.font = "5px sans-serif"; ctx.fillText(act.a.emoji, d.x + 10, d.y + 3.5);
}

function drawReel(x, y) {
  x = Math.round(x); y = Math.round(y);
  px(x + 1, y, 5, 7, "#2A2A30"); px(x, y + 1, 7, 5, "#2A2A30");
  px(x + 3, y + 3, 1, 1, "#C9C9D2"); px(x + 2, y + 1, 1, 1, "#8C8C99"); px(x + 4, y + 5, 1, 1, "#8C8C99");
  px(x + 1, y + 3, 1, 1, "#8C8C99"); px(x + 5, y + 3, 1, 1, "#8C8C99");
}

function drawBubble(act, t) {
  if (!act.bubble || t > act.bubbleUntil) return;
  let text = act.bubble.text;
  if (text.length > 22) text = text.slice(0, 21) + "…";
  ctx.font = "5.5px -apple-system, 'Apple SD Gothic Neo', sans-serif";
  const w = Math.ceil(ctx.measureText(text).width) + 6, h = 9;
  const x = Math.max(2, Math.min(LW - w - 2, act.x + 6 - w / 2)), y = act.y - 12;
  const bg = { plain: "#FFFDF6", ok: "#E3F9E5", bad: "#FFE1DE" }[act.bubble.tone];
  px(x, y, w, h, bg); px(x - 1, y + 1, 1, h - 2, bg); px(x + w, y + 1, 1, h - 2, bg);
  px(act.x + 5, y + h, 2, 2, bg);
  ctx.fillStyle = "#2A2533"; ctx.textBaseline = "top"; ctx.fillText(text, x + 3, y + 1.5);
}

/* ---------------- 루프 ---------------- */

let lastT = performance.now() / 1000;
function frame() {
  const t = performance.now() / 1000, dt = Math.min(0.1, t - lastT); lastT = t;
  ctx.setTransform(S, 0, 0, S, 0, 0);
  px(0, 0, LW, LH, "#0C0B10");
  if (!STATE) { requestAnimationFrame(frame); return; }

  for (const act of Object.values(ACTORS)) updateActor(act, dt, t);

  drawCorridor(t);
  for (const r of Object.values(ROOMS)) drawRoom(r, t);

  const acts = Object.values(ACTORS);
  acts.filter((a) => a.seated).forEach(drawSprite);           // 앉은 사람은 책상 뒤
  STATE.agents.forEach((a) => drawDesk(a.id, t));
  acts.filter((a) => !a.seated).sort((p, q) => p.y - q.y).forEach(drawSprite);

  if (REEL.show) {
    const h = REEL.holder && ACTORS[REEL.holder];
    if (h) drawReel(h.x + 9, h.y + 7);
    else if (REEL.at) drawReel(REEL.at.x, REEL.at.y);
  }

  // 밤에는 조명을 낮춘다 (실제 한국 시각)
  const hr = kstHour();
  if (hr < 6 || hr >= 20) px(0, 0, LW, LH, "rgba(8,10,30,.28)");

  acts.forEach((a) => drawBubble(a, t));
  requestAnimationFrame(frame);
}

/* ---------------- 옆 패널 ---------------- */

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function renderPanels() {
  const s = STATE;
  $("title").textContent = s.studioTitle;
  $("sub").textContent = DEMO.on ? "데모 재생 중" :
    `제작 중 ${s.totals.inProgress}편 · 공개 ${s.totals.published}편 · 갱신 ${kstHM(s.generatedAt)} KST`;

  const label = (id) => s.stages.find((x) => x.id === id)?.label ?? id;
  $("eps").innerHTML = s.episodes.length ? s.episodes.slice(0, 6).map((e) => `
    <div class="ep">
      <div class="row"><span class="t">${esc(e.id)} · ${esc(e.title)}</span><span class="s">${esc(label(e.stage))}</span></div>
      <div class="s">${esc(e.note)}</div>
      <div class="bar"><i style="width:${Math.round(e.progress * 100)}%"></i></div>
    </div>`).join("") : `<p class="empty">아직 에피소드가 없습니다.</p>`;

  const st = { working: "작업 중", retry: "재작업", done: "방금 완료", idle: "대기" };
  $("crew").innerHTML = s.agents.map((a) =>
    `<div title="${esc(st[a.status])}${a.note ? " — " + esc(a.note) : ""}"><span class="dot ${a.status}"></span><span class="n">${a.emoji} ${esc(a.name)}</span></div>`).join("");

  $("log").innerHTML = s.log.length ? s.log.slice(0, 10).map((h) =>
    `<li><span class="when">${kstHM(h.at)}</span><span>${esc(h.who)} · ${esc(label(h.stage))} ${h.status === "done" ? "완료" : h.status === "working" ? "시작" : esc(h.status)}<br><span class="s" style="color:var(--muted)">${esc(h.note)}</span></span></li>`).join("")
    : `<li class="empty">기록 없음</li>`;

  const b = $("banner");
  if (DEMO.on) { b.className = "demo"; b.textContent = "데모 재생 중 — 실제 진행 아님"; }
  else if (s.gate) { b.className = "gate"; b.textContent = `🔔 ${s.gate.ep} 「${s.gate.title}」 ${s.gate.label} 대기 — 대표 확인 필요`; }
  else { b.className = ""; b.textContent = ""; }
}

/* ---------------- 데이터 ---------------- */

let REAL = null;
async function load() {
  try {
    const r = await fetch(`state.json?ts=${Date.now()}`, { cache: "no-store" });
    REAL = await r.json();
    if (!DEMO.on) applyState(REAL);
  } catch (e) { $("sub").textContent = "state.json 을 불러오지 못했습니다"; }
}

// 데모: 한 편이 처음부터 공개까지 가는 과정을 지어내서 재생한다 (배너로 표시)
const DEMO = { on: false, i: 0, timer: null };
function demoState() {
  const stages = REAL.stages.filter((x) => x.id !== "objects");
  const cur = stages[DEMO.i % stages.length];
  const prev = stages[(DEMO.i - 1 + stages.length) % stages.length];
  const agentOf = (sid) => ({ research: "scout", script: "writer", check: "checker", shotlist: "director", prompts: "dop",
    keyframes: "keyframe", clips: "animator", audio: "sound", edit: "editor", color: "colorist", qa: "critic",
    package: "packager", publish: "publisher" }[sid] ?? (sid.startsWith("gate") ? "boss" : null));
  const curAgent = agentOf(cur.id), prevAgent = agentOf(prev.id);
  const notes = { script: "첫 3초 훅 다듬는 중", check: "유사 광고 대조 중", shotlist: "컷 8개 · 48초", prompts: "ai 컷 6개 프롬프트",
    keyframes: "s03 손가락 재검사", clips: "클립 5/6", audio: "룸톤 + 폰 진동", edit: "문구 합성 중", color: "그레인·LUT 적용", qa: "프레임 96장 검사" };
  const ep = { id: "demo", title: "call mom.", stage: cur.id, agent: curAgent, status: cur.gate ? "waiting" : cur.id === "done" ? "done" : "working",
    note: cur.gate ? `${cur.label} 대기` : notes[cur.id] ?? cur.label, updatedAt: new Date().toISOString(), retries: {}, progress: DEMO.i / (stages.length - 1) };
  return {
    ...REAL,
    agents: REAL.agents.map((a) => ({ ...a,
      status: a.id === curAgent ? "working" : a.id === prevAgent ? "done" : "idle",
      note: a.id === curAgent ? ep.note : "" })),
    episodes: [ep], log: [],
    gate: cur.gate ? { ep: "demo", title: ep.title, label: cur.label } : null,
    totals: { inProgress: cur.id === "done" ? 0 : 1, published: cur.id === "done" ? 1 : 0 },
  };
}
$("demoBtn").addEventListener("click", () => {
  if (!REAL) return;
  DEMO.on = !DEMO.on;
  $("demoBtn").setAttribute("aria-pressed", String(DEMO.on));
  $("demoBtn").textContent = DEMO.on ? "실제 기록 보기" : "데모 재생";
  clearInterval(DEMO.timer);
  if (DEMO.on) {
    DEMO.i = 0; applyState(demoState());
    DEMO.timer = setInterval(() => { DEMO.i = (DEMO.i + 1) % (REAL.stages.length - 1); applyState(demoState()); }, 6000);
  } else applyState(REAL);
});

load();
setInterval(load, 20000);
requestAnimationFrame(frame);
