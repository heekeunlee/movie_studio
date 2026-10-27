#!/usr/bin/env node
// 에피소드 진행 상태 기록기. 에이전트는 단계를 시작·종료할 때 반드시 이걸 호출한다.
// 오피스 화면(site/state.json)은 여기서 남긴 기록만 보고 캐릭터를 움직인다 — 지어낸 상태는 없다.
//
//   node pipeline/stage.mjs new  ep01 "call mom."
//   node pipeline/stage.mjs set  ep01 shotlist working "컷 8개 구성 중"
//   node pipeline/stage.mjs set  ep01 shotlist done    "샷 리스트 완료"
//   node pipeline/stage.mjs show ep01
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const crew = JSON.parse(readFileSync(join(ROOT, "crew.json"), "utf8"));
const STATUSES = ["working", "done", "waiting", "failed", "retry"];

const metaPath = (ep) => join(ROOT, "episodes", ep, "meta.json");
const load = (ep) => JSON.parse(readFileSync(metaPath(ep), "utf8"));
const save = (ep, m) => writeFileSync(metaPath(ep), JSON.stringify(m, null, 2) + "\n");
const die = (msg) => { console.error(msg); process.exit(1); };

const [cmd, ep, ...rest] = process.argv.slice(2);
if (!cmd || !ep) die("사용법: stage.mjs new|set|show <ep> ...");

if (cmd === "new") {
  if (existsSync(metaPath(ep))) die(`${ep} 이미 있음`);
  mkdirSync(join(ROOT, "episodes", ep), { recursive: true });
  const now = new Date().toISOString();
  save(ep, {
    id: ep, title: rest[0] ?? ep, createdAt: now, updatedAt: now,
    stage: "research", status: "waiting", agent: "scout", note: "대기",
    retries: {}, links: {}, history: [],
  });
} else if (cmd === "set") {
  const [stage, status, note = ""] = rest;
  const def = crew.stages.find((s) => s.id === stage);
  if (!def) die(`알 수 없는 단계: ${stage} (crew.json stages 참고)`);
  if (!STATUSES.includes(status)) die(`상태는 ${STATUSES.join("|")} 중 하나`);
  const m = load(ep);
  const at = new Date().toISOString();
  if (status === "retry") m.retries[stage] = (m.retries[stage] ?? 0) + 1;
  Object.assign(m, { stage, status, agent: def.agent, note, updatedAt: at });
  m.history.push({ stage, status, agent: def.agent, note, at });
  save(ep, m);
} else if (cmd !== "show") die(`알 수 없는 명령: ${cmd}`);

const m = load(ep);
console.log(`${m.id} 「${m.title}」 ${m.stage} · ${m.status} · ${m.agent ?? "-"} — ${m.note}`);

// 오피스 상태 갱신 (2단계에서 생성기가 생기면 자동으로 이어진다)
const builder = join(ROOT, "pipeline", "build-state.mjs");
if (cmd !== "show" && existsSync(builder)) spawnSync(process.execPath, [builder], { stdio: "inherit" });
