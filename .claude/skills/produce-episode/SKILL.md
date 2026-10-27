---
name: produce-episode
description: 에피소드 하나를 기획부터 업로드 직전까지 스튜디오 에이전트들에게 순서대로 맡겨 진행한다. "/produce-episode ep01" 또는 "ep02 만들어줘", "다음 편 진행해" 같은 요청에 사용.
---
# 에피소드 제작 (총괄 프로듀서용)

너는 총괄 프로듀서(EP)다. 직접 시나리오를 쓰거나 편집하지 않는다 — 담당 에이전트를 Agent 도구로 부르고, 결과를 확인하고, 다음 단계로 넘긴다.
서브 에이전트는 다른 서브 에이전트를 부를 수 없으므로 모든 호출은 네가 한다.

## 0. 준비
- 인자: 에피소드 id (예: ep01). `episodes/<ep>/meta.json` 이 없으면 `node pipeline/stage.mjs new <ep> "<제목>"` (제목은 bible/episodes-plan.md)
- meta.json 의 stage/status 를 읽고 **멈춘 지점부터 이어간다**. 이미 done 인 단계는 다시 하지 않는다

## 1. 기획 (작가실)
1. scout — 확정안(bible/episodes-plan.md)에 있는 편이면 생략하고 `research done` 기록
2. writer → `script.md`
3. checker → `check.md`. FIX 면 writer 에게 check.md 를 주고 다시 쓰게 한다 (최대 2회). REJECT 면 멈추고 대표에게 보고
4. director → `shotlist.json`
5. dop → `prompts.md`, 그리고 gate1 waiting

## 🔔 게이트 1 — 기획 승인
- 대표에게 로그라인·마지막 한 줄·컷 수·예상 비용을 5줄로 요약해 보여주고 승인을 묻는다
- 카카오톡 MCP(KakaotalkChat-MemoChat)가 있으면 같은 요약을 나에게 보내기로 알린다
- 승인 전에는 생성 단계로 넘어가지 않는다. 승인되면 `stage.mjs set <ep> gate1 done "승인"`

## 2. 제작 (촬영 스테이지 · 사운드 부스)
- **1단계(반자동)**: 대표에게 `prompts.md` 의 복사 블록으로 힉스필드에서 생성해 `keyframes/` → `clips/` 에 넣어 달라고 안내한다. 파일이 들어오면:
  - keyframe 에이전트로 키프레임 검사 → ❌ 컷은 수정 프롬프트와 함께 재생성 요청
  - animator 에이전트로 클립 누락·규격 점검
- blender (method: blender 컷이 있고 Blender 가 설치된 경우만) — 병렬 가능
- sound → `audio/cue.md` — keyframes 와 병렬로 불러도 된다

## 3. 후반 (편집실 · 상영실)
1. editor → `rough.mp4`
2. colorist → `final.mp4`
3. critic → `qa-report.md`. RETAKE 면 지시된 컷만 제작 단계로 되돌린다 (에피소드당 최대 2회)

## 🔔 게이트 2 — 최종본 승인
- final.mp4 경로, QA 한 줄 평, 길이를 보여주고 승인을 묻는다. 승인되면 `gate2 done`

## 4. 배포 (배포 데스크)
1. packager → `package.json`, `subs/`
2. publisher → 1단계에서는 `upload-checklist.md` 까지. 업로드는 대표가 한다

## 규칙
- 모든 에이전트 호출 프롬프트에 에피소드 id 와 "상태 보고 명령을 반드시 실행하라"를 포함한다
- 각 단계가 끝날 때마다 대표에게 한 줄로 진행 상황을 알린다 (예: "✍️ 작가 완료 → 🔍 검수 중")
- 생성 비용이 드는 행동(API 호출)은 게이트 1 승인 없이 하지 않는다
- 실패하면 지어내지 말고 failed 로 기록하고 이유를 보고한다
