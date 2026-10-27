#!/usr/bin/env node
// episodes/*/meta.json + crew.json → site/state.json
// 오피스 화면은 이 파일만 읽는다. 여기서 만들어내는 값은 전부 실제 기록에서 나온다.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RECENT_MS = 30 * 60 * 1000; // 완료 후 30분 동안은 "방금 완료"로 보인다

const crew = JSON.parse(readFileSync(join(ROOT, "crew.json"), "utf8"));
const stageIdx = Object.fromEntries(crew.stages.map((s, i) => [s.id, i]));
const lastIdx = crew.stages.length - 1;

const epDir = join(ROOT, "episodes");
const episodes = (existsSync(epDir) ? readdirSync(epDir) : [])
  .filter((d) => existsSync(join(epDir, d, "meta.json")))
  .map((d) => JSON.parse(readFileSync(join(epDir, d, "meta.json"), "utf8")))
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

const now = Date.now();
const nameOf = (id) => id === "boss" ? "대표" : crew.agents.find((a) => a.id === id)?.name ?? id;

const agents = crew.agents.map((a) => {
  const active = episodes.find((e) => e.agent === a.id && (e.status === "working" || e.status === "retry"));
  if (active) return { ...a, status: active.status === "retry" ? "retry" : "working", ep: active.id, note: active.note };
  const last = episodes.flatMap((e) => e.history.filter((h) => h.agent === a.id).map((h) => ({ ...h, ep: e.id })))
    .sort((x, y) => y.at.localeCompare(x.at))[0];
  if (last && last.status === "done" && now - Date.parse(last.at) < RECENT_MS)
    return { ...a, status: "done", ep: last.ep, note: last.note };
  return { ...a, status: "idle", ep: null, note: "" };
});

const eps = episodes.map((e) => ({
  id: e.id, title: e.title, stage: e.stage, status: e.status, agent: e.agent, note: e.note,
  updatedAt: e.updatedAt, retries: e.retries,
  progress: e.stage === "done" ? 1 : (stageIdx[e.stage] + (e.status === "done" ? 1 : 0.5)) / lastIdx,
  links: e.links ?? {},
  // 단계별 마지막 기록 — 흐름도가 노드 색을 정하는 근거
  stageLog: Object.fromEntries(e.history.map((h) => [h.stage, { status: h.status, note: h.note, at: h.at }])),
}));

// bible/episodes-plan.md 표 → 에피소드 보드 (아직 시작 안 한 편도 보이게)
const planPath = join(ROOT, "bible", "episodes-plan.md");
const plan = (existsSync(planPath) ? readFileSync(planPath, "utf8") : "").split("\n")
  .map((l) => l.match(/^\|\s*(\d+)\s*\|([^|]+)\|([^|]+)\|([^|]+)\|/))
  .filter(Boolean)
  .map(([, n, title, logline, lastLine]) => ({ id: `ep${n.padStart(2, "0")}`, title: title.trim(), logline: logline.trim(), lastLine: lastLine.trim() }));

const log = episodes
  .flatMap((e) => e.history.map((h) => ({ ...h, ep: e.id, title: e.title, who: nameOf(h.agent) })))
  .sort((a, b) => b.at.localeCompare(a.at)).slice(0, 15);

const gate = episodes.find((e) => crew.stages[stageIdx[e.stage]]?.gate && e.status === "waiting") ?? null;

// 에피소드 보고서: episodes/<ep>/report.json + meta 기록(타임라인) → site/reports/<ep>.json, 목록은 index.json
const repDir = join(ROOT, "site", "reports");
mkdirSync(repDir, { recursive: true });
const reports = episodes
  .filter((e) => existsSync(join(epDir, e.id, "report.json")))
  .map((e) => {
    const r = JSON.parse(readFileSync(join(epDir, e.id, "report.json"), "utf8"));
    delete r.$comment;
    r.stage = e.stage; r.status = e.status;
    r.timeline = e.history.map((h) => ({ ...h, label: crew.stages[stageIdx[h.stage]]?.label ?? h.stage, who: nameOf(h.agent) }));
    writeFileSync(join(repDir, `${e.id}.json`), JSON.stringify(r, null, 2) + "\n");
    return { id: e.id, title: r.title, phase: r.phase, updatedAt: r.updatedAt, logline: r.logline };
  })
  .sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(join(repDir, "index.json"), JSON.stringify(reports, null, 2) + "\n");

const state = {
  generatedAt: new Date().toISOString(),
  studioTitle: crew.studioTitle,
  rooms: crew.rooms,
  stages: crew.stages.map(({ id, label, room, gate, agent, optional, out, tools }) =>
    ({ id, label, room, gate: !!gate, agent, optional: !!optional, out: out ?? "", tools: tools ?? [] })),
  steps: crew.steps ?? [], loops: crew.loops ?? [], plan, reports: reports.map((r) => r.id),
  agents, episodes: eps, log,
  gate: gate && { ep: gate.id, title: gate.title, label: crew.stages[stageIdx[gate.stage]].label },
  totals: { published: episodes.filter((e) => e.stage === "done").length, inProgress: episodes.filter((e) => e.stage !== "done").length },
};
writeFileSync(join(ROOT, "site", "state.json"), JSON.stringify(state, null, 2) + "\n");
console.log(`state.json: 에피소드 ${eps.length} · 작업 중 ${agents.filter((a) => a.status === "working").length}명`);
