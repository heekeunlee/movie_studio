#!/usr/bin/env node
// episodes/*/meta.json + crew.json → site/state.json
// 오피스 화면은 이 파일만 읽는다. 여기서 만들어내는 값은 전부 실제 기록에서 나온다.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
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
}));

const log = episodes
  .flatMap((e) => e.history.map((h) => ({ ...h, ep: e.id, title: e.title, who: nameOf(h.agent) })))
  .sort((a, b) => b.at.localeCompare(a.at)).slice(0, 15);

const gate = episodes.find((e) => crew.stages[stageIdx[e.stage]]?.gate && e.status === "waiting") ?? null;

const state = {
  generatedAt: new Date().toISOString(),
  studioTitle: crew.studioTitle,
  rooms: crew.rooms,
  stages: crew.stages.map(({ id, label, room, gate }) => ({ id, label, room, gate: !!gate })),
  agents, episodes: eps, log,
  gate: gate && { ep: gate.id, title: gate.title, label: crew.stages[stageIdx[gate.stage]].label },
  totals: { published: episodes.filter((e) => e.stage === "done").length, inProgress: episodes.filter((e) => e.stage !== "done").length },
};
writeFileSync(join(ROOT, "site", "state.json"), JSON.stringify(state, null, 2) + "\n");
console.log(`state.json: 에피소드 ${eps.length} · 작업 중 ${agents.filter((a) => a.status === "working").length}명`);
