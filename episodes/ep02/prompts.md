# ep02 — left up. · 프롬프트 v2 (촬영감독 · 연속성 우선)

- 기준: `shotlist.json`(8컷 = 7 + END · 47.5s) · `script.md` · `check.md` · `bible/`(style·room·character·banned). 이야기·컷·시간 배분은 **그대로**. 바뀐 것은 "이미지를 어떻게 만들어 서로 잇는가"뿐이다. 이전 판: `prompts.v1.md`
- 도구: 힉스필드 웹. 이미지 = **Nano Banana 2**(이번 주 1K 무제한, 1클릭 1장, 9:16, `+`로 참조 이미지 여러 장 첨부, 이미지 첨부 + "keep everything identical, change only …" 편집). 영상 = **Kling 3.0**(첫/끝 프레임, 크레딧 소모 → 시도 최소화).
- 블록마다 **첨부(+ 순서대로) → 붙여 넣을 프롬프트 → 저장 파일명**. 코드 블록 안 문장은 고치지 않는다. 프롬프트에 "reference image 1/2"라고 쓴 번호 = 첨부 순서.
- 저장: `episodes/ep02/keyframes/`, `episodes/ep02/clips/`. 1K 결과(예: 768×1376)를 그대로 저장, 1080×1920 업스케일은 편집 단계에서 일괄.
- 얼굴 0(C3① 역광 실루엣만). `ref-character.png`는 없다 → 어디에도 첨부하지 않는다.
- 네거티브 칸이 없으므로 금지 사항은 프롬프트 끝 `No …` 문장에 넣었다. Kling 네거티브 칸에는 §5 공통 네거티브를 붙인다.

---

## 0. 생성 체인 (부모 → 자식, 위에서부터 만든다)

```
ref-room.png (고정 · 확정본)
├─ K01d  밤 앰버 마스터 ............ 새 생성 [ref-room]          ★ 별 7개 배치의 원본
│   ├─ K01g  야광 판 ................ 편집기 수작업 [K01d]
│   ├─ K03b  낮, 손이 들린 별에 ...... 새 생성 [K01d + ref-room]
│   │   ├─ K03e  별이 떨어진 순간 .... AI 편집 [K03b]
│   │   │   └─ K03c  별 뒷면 겹겹 테이프 새 생성 [K03e]    ★ 별 뒷면·테이프의 원본 (5회 실패 → 실물)
│   │   │       ├─ K05  새벽 화분 위 별 새 생성 [K03c + ref-room]
│   │   │       │   └─ K05m 아침 ........ AI 편집 [K05]
│   │   │       │       └─ K05e 별 사라짐 AI 편집 [K05m]
│   │   │       └─ K06a 노을 책상 ....... 새 생성 [K03c + ref-room]
│   │   │           ├─ K06e 테이프 붙음 . AI 편집 [K06a]
│   │   │           └─ K06s 시트 인서트 . AI 편집 [K06a 크롭]
│   │   └─ K06d  노을, 옛 별 + 새 별 .. AI 편집 [K03b]           ★ 새 별 위치의 원본
│   │       └─ K06b  엄지로 누름 ...... AI 편집 [K06d]
│   ├─ K07d  앰버, 별 8개 ............ AI 편집 [K01d + K06d] → 패치 합성
│   │   └─ K07g  야광 판 8개 .......... 편집기 수작업 [K01g.psd + K07d]
│   └─ K04  밤 와이드 ................ 새 생성 [ref-room + K01d]
│       └─ K04g  야광 판 .............. 편집기 수작업 [K04]
├─ K02a  낮, 상자 → 책상 ............. AI 편집 [ref-room]          (방을 새로 그리지 않는다)
│   └─ K02t  위로 확장(천장) .......... AI 편집/아웃페인트 [K02a + K01d]
├─ K03a  역광 실루엣 ................. 새 생성 [ref-room]
└─ K04c  시계 매크로 ................. 새 생성 [ref-room]
```

**만드는 순서**: K01d → K03b → K03e → K03c → K06d → K06b → K07d → K02a → K02t → K03a → K04 → K04c → K05 → K05m → K05e → K06a → K06e → K06s → (편집기) K01g → K07g → K04g → (영상) C3b → C3a → C5 → C6a → C6c

- 원칙: **카메라 앵글이 같으면 새로 그리지 않고 부모를 편집한다.** 앵글이 바뀌는 판만 새 생성, 그때도 부모를 반드시 첨부한다.
- 부모가 통과 체크를 통과하기 전에는 자식을 만들지 않는다. 부모를 다시 뽑으면 그 아래 자식도 다시 만든다.

**합계**
| 종류 | 개수 | 목록 |
|---|---|---|
| 새 생성 (Nano Banana, 참조 첨부) | 8 | K01d, K03b, K03c, K03a, K04, K04c, K05, K06a |
| AI 편집 (Nano Banana, 부모 첨부) | 10 | K02a, K02t, K03e, K05m, K05e, K06e, K06s, K06d, K06b, K07d |
| 편집기 수작업 (생성 0) | 3 | K01g, K04g, K07g |
| 영상 (Kling 3.0) | 5 | C3a, C3b, C5, C6a, C6c |
| 폴백 (실패할 때만) | — | 정리 편집(시계·침대 지우기), K02c + C2 영상, C3d 영상, C6c2 영상, K03c 실물 매크로 |

- v1 대비: 새 생성 9 → 8 (K02a를 ref-room 편집으로), AI 편집 6 → 10 (영상 끝 프레임 K03e·K05e·K06e 추가 — 이미지는 이번 주 무료, 대신 영상 재시도를 줄인다). 영상 5개 그대로.
- 재시도 한도: 이미지는 무료지만 시간 기준으로 판당 최대 6회(K03c 5회 → 실물). 영상은 **컷당 최대 2회**, 그다음은 폴백.

---

## 1. 연속성 고정 문장 (그대로 재사용 — 아래 블록에 이미 들어 있다)

> 같은 대상은 **항상 같은 영어 문장**으로 부른다. 블록을 고쳐 쓸 일이 생기면 여기 문장을 복사해 쓴다.

**ROOM** (방이 보이는 판, ref-room 첨부와 함께 — ref-room에서 직접 확인한 소품)
```
the same room as the reference photo: worn honey-colored wooden desk in front of a tall white double-casement window with sheer white curtains on a thin rod, brass articulated desk lamp with a dome shade, dark red-brown wooden stem and round wooden base at the left end of the desk, pilea (Chinese money plant) with round coin-shaped leaves in a cream speckled ceramic pot at the right end of the desk, white walls, plain flat white ceiling with no fixtures
```
- ref-room에는 이 밖에 은색 노트북, 검은 직사각형 탁상 디지털 시계(빈 회색 화면, 노트북과 화분 사이), 오른쪽 벽의 회색 린넨 1인 침대·짙은 회색 베개, 왼쪽 나무 책장, 창 아래 흰 라디에이터, 창턱의 테라코타 화분 2개, 꿀색 나무 마루, 회색 담요가 걸린 나무 의자가 있다. **시계·침대는 ROOM 문장에 일부러 넣지 않았다**(넣으면 따라 나온다). 필요한 판에서만 따로 부른다.

**STARS-7** (천장 배치 — K01d가 원본)
```
seven small palm-sized rounded five-point plastic glow-in-the-dark stars, faded yellowish-white with darker discolored edges, matte and unlit, stuck to the plain flat white ceiling above the desk: two large, three medium and two small, scattered irregularly with uneven gaps, not a constellation, not a line, not a shape; the star directly above the pilea has one point peeling slightly off the ceiling
```
**OLD STAR** (별 하나)
```
a small palm-sized rounded five-point plastic glow-in-the-dark star, faded yellowish-white with darker discolored edges, matte and unlit
```
**NEW STAR**
```
one new small palm-sized rounded five-point plastic glow-in-the-dark star, clean pale green-white, crisp and new, matte and unlit
```
**TAPE** (옛 별 뒷면 — K03c가 원본)
```
its back covered with overlapping layers of old plain unprinted tape: a clear tape strip gone slightly cloudy, a yellowed crinkled paper masking tape strip across it, and one more translucent matte tape piece over both, edges lifting, dust and tiny white ceiling-paint flakes stuck in the old adhesive
```
**HAND** (두 손일 때는 `a man's two hands, plain grey t-shirt sleeves, …`로 복수형만 바꾼다)
```
a man's hand, plain grey t-shirt sleeve, no rings, no watch, no bracelet, short clean nails, natural skin, five normal fingers
```
**LIGHT** (시간대는 빛으로만. 광원 방향 고정: 낮·새벽·노을 = 창, 밤 앰버 = 책상 왼쪽 스탠드)
| 키 | 문장 | 쓰는 판 |
|---|---|---|
| NIGHT-AMBER | `night, the only light is the warm amber glow of the brass desk lamp, light rising from the lower left, the window behind the sheer curtains dark blue-black` | K01d, K07d |
| NIGHT-DARK | `night, desk lamp off, room in deep shadow, only soft cool blue-white street light from outside comes through the sheer curtains` | K04 (K04c는 축약) |
| DAY | `bright neutral overcast daylight from the tall window, soft and even, no direct sunbeams` | K02a, K02t, K03a(역광), K03b, K03e, K03c |
| DAWN | `early dawn, soft blue-grey light from the window, low contrast, no direct sun` | K05 |
| MORNING | `soft neutral morning daylight from the window` | K05m, K05e |
| SUNSET | `warm orange sunset light coming low through the sheer white curtains, long soft shadows` | K06a, K06e, K06s, K06d, K06b |

**NO** (모든 이미지 블록 끝 — banned.md + 별로 오인되는 빛 차단)
```
No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window.
```
**접미사** (렌즈 표기는 컷별 유지 — 대표 결정 3)
- 고정(C1·C4·C7): `vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text`
- 표준: `vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text` — 렌즈 부분만 K03b 35mm f/2 · K03c 100mm macro f/2.8 · K04c macro f/2 · K05 50mm f/1.8

**배치 약속** (모든 판이 따른다)
- 들린 별 = **화분(pilea) 바로 위** 천장 → C5에서 화분 흙 위로 떨어진다.
- 새 별 = 옛 별의 **손바닥 하나 거리 왼쪽**. 올려다보는 판(K03b 계열)은 **프레임 위쪽 = 창 벽**(커튼 봉이 위 가장자리)으로 고정 → 프레임 왼쪽 = 방의 왼쪽 = K01d에서도 왼쪽. 그래서 K03b에서 별 왼쪽은 비워 둔다.
- 별 개수: C1·C2·C4 = 7 → C5 낙하 → C6 옛 별 복구 + 새 별 → C7 = 8(들렸던 별은 이제 평평) → 루프 C1 = 7(들린 별, "그가 오기 전").
- 시계는 이 편에 정확히 3회(C2 틸트 1 + C4 인서트 2). K01d·K04·K05·K06·K07에는 보이면 안 된다.
- 안전 영역: 별·손·문구는 상단~중앙. 하단 25%·우측 15% 비움. C4·C7 화분은 프레임 높이 70% 선 위(1376px 기준 y ≤ 960).

---

## 2. 통과 체크 공통 (모든 판)

**버릴 것(공통)**: 글자·숫자·로고·라벨·바코드 / 벽시계·천장 선풍기·천장 조명·화재감지기 / 줄조명·꼬마전구·점광원(별로 읽힌다) / 기타·악기 / 얼굴 / 손가락 개수·관절 이상, 손톱이 별을 관통 / 별이 빛나거나 레이·반짝임 / 별자리·줄·하트 배치 / 창밖 별하늘 / 하단 25%·우측 15%에 핵심 피사체.

**연속성 체크(부모 대비)** — 결과를 부모와 나란히 놓고, 편집 판은 편집기에서 부모 위에 50% 불투명도(또는 Difference)로 겹쳐 본다.
| 항목 | 확인 |
|---|---|
| 별 | 개수, 크기 3종(대2·중3·소2), 서로의 위치, 들린 별 = 화분 위, 옛 별 누런 흰색 / 새 별 연둣빛 흰색 |
| 스탠드 | 놋쇠 돔 갓 + 적갈색 나무 기둥 + 둥근 나무 받침, 책상 **왼쪽** 끝 |
| 화분 | 동전 모양 둥근 잎 pilea, 크림색 반점 도자기 화분, 책상 **오른쪽** 끝, 새잎·꽃 없음 |
| 책상·천장 | 꿀색 낡은 나무 책상 / 조명기구 없는 평평한 흰 천장 |
| 손 | 회색 무지 티셔츠 소매, 반지·시계·팔찌 없음, 짧고 깨끗한 손톱 |
| 빛 방향 | 낮·새벽·노을 = 창 쪽(올려다보는 판은 프레임 위쪽), 밤 앰버 = 왼쪽 아래 스탠드 |

**정리 편집(폴백, 판당 최대 2회)** — 새 생성 결과가 좋은데 시계·침대·잡물 하나만 걸릴 때 다시 뽑지 말고 그 결과를 첨부해:
```
Keep everything identical to the attached image — same camera, framing, light, objects and star positions. Change only: remove the small black desk clock (and anything else listed here: ___), filling the space with what would naturally be behind it. No text.
```

---

## 3. 키프레임 (만드는 순서대로)

### ① K01d · C1·C7 마스터 (밤, 앰버) → `keyframes/K01d.png`
- 첨부: `assets/library/ref-room.png`
- 이 편의 마스터. 별 7개의 위치·크기가 여기서 정해지고 K01g·K07d·K07g·K03b·K04·K02t가 따른다. 예산 6.
```
Same room as the reference photo, same furniture, materials and colors: worn honey-colored wooden desk in front of a tall white double-casement window with sheer white curtains on a thin rod, brass articulated desk lamp with a dome shade, dark red-brown wooden stem and round wooden base at the left end of the desk, pilea (Chinese money plant) with round coin-shaped leaves in a cream speckled ceramic pot at the right end of the desk, white walls, plain flat white ceiling with no fixtures. Night, the only light is the warm amber glow of the brass desk lamp, light rising from the lower left, the window behind the sheer curtains dark blue-black. Camera: static wide shot on a tripod at standing chest height, just behind the left end of the desk, facing the window wall, tilted up about 35 degrees toward the line where the window wall meets the ceiling. The upper two thirds of the frame is the plain flat white ceiling, below it the curtain rod and the tops of the sheer curtains. Lower third: the lit brass dome shade of the lamp at the bottom-left edge washing amber light up the wall and across the ceiling; the pilea leaves as a dark silhouette against the curtains, center-right, about one third up from the bottom of the frame; the desk surface stays just below the bottom edge. On the ceiling: seven small palm-sized rounded five-point plastic glow-in-the-dark stars, faded yellowish-white with darker discolored edges, matte and unlit, stuck to the plain flat white ceiling above the desk: two large, three medium and two small, scattered irregularly with uneven gaps, not a constellation, not a line, not a shape; the star directly above the pilea has one point peeling slightly off the ceiling. The stars are not glowing; under the lamp they read as pale plastic. Laptop closed, no desk clock in frame, no bed in frame, no person. No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window. vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text
```
- 통과 체크(부모 ref-room 대비): 스탠드가 같은 놋쇠 돔 갓·나무 기둥 / 화분이 같은 pilea·크림 화분, 프레임 아래에서 30% 이상 위, 우측 15% 밖 / 커튼·커튼 봉이 같은 흰 시어 커튼 / 별 정확히 7개(대2·중3·소2), 들린 별이 화분 바로 위, 별 왼쪽에 손바닥 하나 들어갈 빈 천장 / 별이 빛나지 않음 / **책상·스탠드가 프레임 안 → 침대에서 올려다보는 시점이 아님** / 시계·침대 안 보임(보이면 §2 정리 편집).

### ② K03b · C3②④ 첫 프레임 (낮, 손끝이 들린 별에) → `keyframes/K03b.png`
- 첨부: ① `keyframes/K01d.png` ② `assets/library/ref-room.png`
- K03e·K03c·K06d·K06b의 부모. 예산 6.
```
Bright neutral overcast daylight from the tall window, soft and even, no direct sunbeams. Close-up looking straight up at the plain flat white ceiling of the room in reference image 2, right under the star that sits directly above the pilea in reference image 1, the star with one point peeling off. The top edge of the frame is the window wall: the thin curtain rod and the tops of the sheer white curtains, so the daylight comes from the top of the frame. The star: a small palm-sized rounded five-point plastic glow-in-the-dark star, faded yellowish-white with darker discolored edges, matte and unlit, its peeling point bent slightly toward the camera. A man's hand, plain grey t-shirt sleeve, no rings, no watch, no bracelet, short clean nails, natural skin, five normal fingers, reaching up from the bottom of the frame, the thumbnail catching the peeling point of the star. One other old star of the same kind softly out of focus to the right of center. Hand and star in the upper-center of the frame; plain empty ceiling to the left of the star. No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(K01d 대비): 별 색·모양·크기가 K01d 별과 같음(누런 흰색, 둥근 5각) / 위 가장자리에 커튼 봉·커튼 끝(빛이 위에서) / 별 왼쪽 빈 천장 / 소매 회색 무지, 반지·시계 없음 / 얼굴·머리 없음.

### ③ K03e · C3b 끝 프레임 (별이 막 떨어진 순간) → `keyframes/K03e.png`
- 첨부: `keyframes/K03b.png` (AI 편집)
```
Keep everything identical to the attached image — same camera, framing, ceiling, curtain rod, light, hand, sleeve and the other star. Change only: the star has just been peeled off the ceiling and is held between the thumb and index finger a few centimeters below its spot, still showing its front; a faint pale outline mark on the ceiling where it was. Five normal fingers. No text, no letters, no logos, no string lights, no fairy lights, no visible face.
```
- 통과 체크(K03b 대비, 50% 겹침): 손·소매·다른 별·천장 그대로, 바뀐 건 별 위치뿐 / 별이 휘거나 찢어지지 않음.

### ④ K03c · C3③ 핵심 매크로 (별 뒷면 겹겹 테이프) → `keyframes/K03c.png`
- 첨부: `keyframes/K03e.png`
- 별 뒷면·테이프의 원본. K05·K06a가 이걸 첨부한다. **예산 5 → 실패 시 실물 매크로**(대표 결정 1).
```
The same star and the same hand as in the reference image, a moment later, in macro: the star has been peeled off the ceiling and is turned over between the thumb and index finger to show its back. The star: a small palm-sized rounded five-point plastic glow-in-the-dark star, faded yellowish-white with darker discolored edges, matte and unlit, same size and color as in the reference, its five rounded points clearly visible, its back covered with overlapping layers of old plain unprinted tape: a clear tape strip gone slightly cloudy, a yellowed crinkled paper masking tape strip across it, and one more translucent matte tape piece over both, edges lifting, dust and tiny white ceiling-paint flakes stuck in the old adhesive. A man's hand, plain grey t-shirt sleeve, no rings, no watch, no bracelet, short clean nails, natural skin, five normal fingers. The star fills the upper-center of the frame; behind it the plain white ceiling soft and out of focus, the same bright neutral daylight from the top of the frame. No text, no letters, no numbers, no logos, no watermark, no printed tape, no pattern on the tape. No string lights, no fairy lights, no bokeh lights, no visible face. vertical 9:16, shot on a mirrorless camera, 100mm macro lens, f/2.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(K03e 대비): 별 색·크기·꼭짓점 5개 / 손·소매 같음 / 테이프가 **서로 다른 3종 · 다른 시기**로 읽힘(투명 탁해짐 + 누런 종이 + 반투명 무광) / 테이프에 인쇄·무늬 없음.
- **실물 대체 시**: 야광별 1개 + 투명·종이(마스킹)·반투명 무광 테이프 3종을 겹쳐 붙이고 먼지를 살짝 묻힌다. 손은 회색 무지 티셔츠, 반지·시계 빼고, 흰 천장(또는 흰 종이) 앞 밝은 창빛, 폰 매크로 9:16. 별 앞면 색은 편집에서 K03b 별 색(누런 흰색)에 맞춰 그레이딩. 그 사진을 `K03c.png`로 저장 — 아래 K05·K06a는 똑같이 이 파일을 첨부한다.

### ⑤ K06d · C6 마지막 홀드 + C6c 끝 프레임 (노을, 옛 별 + 새 별) → `keyframes/K06d.png`
- 첨부: `keyframes/K03b.png` (AI 편집 — 같은 앵글이라 새로 그리지 않는다)
- 새 별 위치의 원본. K07d가 이걸 따른다.
```
Keep the same camera, framing, ceiling, curtain rod at the top edge and star position as the attached image. Change: (1) the light becomes warm orange sunset light coming low through the sheer white curtains, long soft shadows, from the top of the frame; (2) no hand, no arm, no sleeve; (3) the old star lies pressed flat in its place, no peeling point; (4) a hand-width to the LEFT of the old star, add one new small palm-sized rounded five-point plastic glow-in-the-dark star, clean pale green-white, crisp and new, matte and unlit, the same size as the old one. The other out-of-focus star stays where it is. Nothing else changes. No text, no letters, no logos, no ceiling fan, no ceiling light fixture, no string lights, no fairy lights, no glowing dots, no glow on the stars.
```
- 한 번에 안 되면 2단계: ⓐ (1)(2)(3)만 → 저장 후 그 결과를 첨부해 ⓑ (4)만.
- 통과 체크(K03b 대비, 50% 겹침): 옛 별 위치·크기 동일 / 새 별이 **왼쪽**, 옛 별보다 눈에 띄게 하얗고 선명 / 두 별 모두 빛나지 않음 / 커튼 봉 위치 동일.

### ⑥ K06b · C6c 첫 프레임 (엄지로 옛 별을 누름) → `keyframes/K06b.png`
- 첨부: `keyframes/K06d.png` (AI 편집)
```
Keep everything identical to the attached image — same camera, framing, sunset light, ceiling and the old star. Change only: remove the new pale star so that spot is plain ceiling, and a man's hand, plain grey t-shirt sleeve, no rings, no watch, no bracelet, short clean nails, natural skin, five normal fingers, enters from the bottom of the frame, the thumb pressing the old star flat against the ceiling. No text, no logos, no string lights, no fairy lights, no visible face.
```
- 통과 체크(K06d 대비): 옛 별 위치 동일, 새 별 자리 빈 천장 / 손·소매가 K03b 손과 같은 사람으로 보임.
- 손이 이상하면 폴백: K03b를 첨부해 "warm orange sunset light, the thumb presses the star flat" 리라이트(K03b엔 이미 손이 있다).

### ⑦ K07d · C7 앰버 판 (별 8개) → `keyframes/K07d.png`
- 첨부: ① `keyframes/K01d.png` ② `keyframes/K06d.png`
- **C7은 새 생성 금지.** K01d 편집 + 패치 합성으로만.
```
Keep everything identical to reference image 1 — same camera, framing, amber lamp light, curtains, pilea and every star. Change only: (1) the star directly above the pilea now lies flat against the ceiling, no peeling point; (2) a hand-width to the left of that star, add one new small palm-sized rounded five-point plastic glow-in-the-dark star, clean pale green-white, crisp and new, matte and unlit, the same size as that star, placed beside it the same way as in reference image 2. The other six stars stay exactly as they are. No text, no logos, no ceiling fan, no ceiling light fixture, no string lights, no fairy lights, no glowing dots, no glow on the stars.
```
- **패치 합성(필수)**: 편집기에서 K01d 위에 결과를 올리고, 새 별 + 들린 별 둘레만 남기는 부드러운 마스크로 잘라 붙여 `K07d.png`로 저장 → 나머지 픽셀은 100% K01d.
- 통과 체크(K01d 대비, Difference): 차이가 **새 별 자리 + 들린 별 끝** 두 곳뿐 / 새 별이 왼쪽(K06d와 같은 쪽) / 새 별이 빛나거나 너무 큼 → 버림.

### ⑧ K02a · C2 틸트 시작 (낮, 상자 → 책상) → `keyframes/K02a.png`
- 첨부: `assets/library/ref-room.png` (AI 편집 — 방을 새로 그리지 않는다)
- C2의 시계 1회는 이 판에 있다(빈 회색 화면, 숫자 합성 없음).
```
Keep everything identical to the attached image — same camera, framing, room, desk, lamp, laptop, desk clock, pilea, bed, curtains and daylight. Change only: (1) add two or three plain unmarked brown cardboard moving boxes sealed with plain brown tape on the floor in the lower part of the frame, next to the wooden chair; (2) the brass desk lamp is switched off; (3) the laptop screen is plain blank light grey; (4) remove the books lying on the left corner of the desk so the desk looks half-empty. The desk clock screen stays blank grey with no digits. Bright neutral overcast daylight from the tall window, soft and even, no direct sunbeams. No text, no letters, no numbers, no logos, no labels, no barcodes on the boxes or tape. No wall clock, no ceiling fan, no ceiling light fixture, no string lights, no fairy lights, no guitar or musical instruments, no person.
```
- 통과 체크(ref-room 대비, 50% 겹침): 상자 외 가구 위치 동일 / 스탠드 꺼짐 / 상자·테이프 무지 / 시계 화면 빈칸 / 화분 상태 중립.

### ⑨ K02t · C2 가상 틸트용 세로 긴 판 → `keyframes/K02t.png`
- 첨부: ① `keyframes/K02a.png` (아웃페인트/캔버스 확장 원본) ② `keyframes/K01d.png` (별 배치 참고 — 첨부가 안 되면 생략)
- 위로 세로 약 1.9배. 한 번에 안 되면 두 번에 나눠 확장. 원본 K02a 영역은 건드리지 않는다.
```
Extend the attached image upward into one tall continuous vertical frame, keeping the original image unchanged at the bottom: the white wall, the curtain rod and the tops of the sheer white curtains continue up to a plain flat white ceiling with no fixtures, in the same bright neutral overcast daylight. On the ceiling: seven small palm-sized rounded five-point plastic glow-in-the-dark stars, faded yellowish-white with darker discolored edges, matte and unlit, stuck to the plain flat white ceiling above the desk: two large, three medium and two small, scattered irregularly with uneven gaps, not a constellation, not a line, not a shape; the star directly above the pilea has one point peeling slightly off the ceiling; arranged like the stars in reference image 2, barely noticeable in daylight. Same lens perspective, continuous light, no seam. No text, no letters, no logos, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no glowing dots, no starry sky in the window.
```
- 통과 체크(K02a·K01d 대비): 이음새 없음, 창·커튼이 하나로 이어짐 / 별 7개, 대략 K01d 배치, 들린 별이 화분 위 / 천장 조명기구 없음.
- 아웃페인트를 못 쓰면 → §6 폴백 K02c + C2 영상.

### ⑩ K03a · C3① 실루엣 (낮, 의자에 올라섬) → `keyframes/K03a.png`
- 첨부: `assets/library/ref-room.png`
```
Same room as the reference photo, same furniture, materials and colors: worn honey-colored wooden desk in front of a tall white double-casement window with sheer white curtains on a thin rod, brass articulated desk lamp with a dome shade, dark red-brown wooden stem and round wooden base at the left end of the desk, pilea (Chinese money plant) with round coin-shaped leaves in a cream speckled ceramic pot at the right end of the desk, white walls, plain flat white ceiling with no fixtures. Bright neutral overcast daylight, strong backlight from the tall window through the sheer curtains. Camera at chest height inside the room, facing the window. A young man in a plain grey t-shirt with no print steps up onto the wooden chair in front of the desk, framed from the knees up, his head in the upper third of the frame, one arm starting to reach toward the ceiling above the pilea. He is a dark silhouette against the window; his face is completely in shadow with no facial features visible. No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(ref-room 대비): 창·커튼·스탠드·화분이 같은 방 / 의자가 책상 앞(별은 책상 위) / **눈·코·입이 보이면 버림** / 티셔츠 프린트 없음.

### ⑪ K04 · C4 와이드 (밤, 별이 사그라든 뒤) → `keyframes/K04.png`
- 첨부: ① `assets/library/ref-room.png` ② `keyframes/K01d.png`
- 이 판 = 거의 꺼진 상태. 빛나는 판(K04g)은 편집기로.
```
Same room as reference image 1, same furniture, materials and colors: worn honey-colored wooden desk in front of a tall white double-casement window with sheer white curtains on a thin rod, brass articulated desk lamp with a dome shade, dark red-brown wooden stem and round wooden base at the left end of the desk, pilea (Chinese money plant) with round coin-shaped leaves in a cream speckled ceramic pot at the right end of the desk, white walls, plain flat white ceiling with no fixtures. Night, desk lamp off, room in deep shadow, only soft cool blue-white street light from outside comes through the sheer curtains; the pilea is the only object catching that light, a soft cool glow on its round leaves. Camera: static wide shot on a tripod at standing chest height from the corner by the foot of the bed, looking diagonally across the room toward the window wall and the desk, wider than reference image 2, tilted up so the plain flat white ceiling fills the upper half of the frame and the low bed drops out below the bottom edge. The window and the desk in the lower-middle, the brass lamp switched off and dark, laptop closed, the pilea in the center about one third up from the bottom of the frame. On the ceiling, the same arrangement as in reference image 2: seven small palm-sized rounded five-point plastic glow-in-the-dark stars, faded yellowish-white with darker discolored edges, matte and unlit, stuck to the plain flat white ceiling above the desk: two large, three medium and two small, scattered irregularly with uneven gaps, not a constellation, not a line, not a shape; the star directly above the pilea has one point peeling slightly off the ceiling; here only faint pale shapes in the dark, not glowing. Bed out of frame, desk clock lost in shadow and not visible, no person. No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window. vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text
```
- 통과 체크(ref-room·K01d 대비): 같은 스탠드·화분·커튼 / 창빛을 크게 받는 건 화분뿐 / 별 7개, 들린 별이 화분 위(배치는 근사 허용) / 침대·시계 안 보임(보이면 §2 정리 편집) / 화분 y ≤ 70% 선 / 창밖 별하늘 없음.

### ⑫ K04c · C4 시계 인서트 ×2 → `keyframes/K04c.png`
- 첨부: `assets/library/ref-room.png` (시계가 작으면 시계 주변만 잘라 첨부해도 된다)
- 숫자 `11:41 PM` / `12:03 AM`은 편집 합성. 1장으로 두 인서트.
```
Night, macro close-up of the same small black rectangular digital desk clock as in the reference photo, standing on the worn honey-colored wooden desk; its screen glows with a dim cool blank light and shows nothing, no digits; the cream speckled ceramic pot of the pilea soft and out of focus at the right side; the rest of the room dark. Screen in the center of the frame. No text, no letters, no numbers, no digits, no logos, no watermark, no analog clock hands. No wall clock, no string lights, no fairy lights, no glowing dots, no bokeh lights. vertical 9:16, shot on a mirrorless camera, macro lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(ref-room 대비): 같은 검은 직사각형 시계·꿀색 책상 / 숫자·브랜드 각인 없음 / 화면이 중앙(하단 25% 밖).

### ⑬ K05 · C5 (새벽, 화분 흙 위에 떨어진 별) → `keyframes/K05.png`
- 첨부: ① `keyframes/K03c.png` ② `assets/library/ref-room.png`
```
Early dawn, soft blue-grey light from the window behind the plant, low contrast, no direct sun. Slightly high-angle close-up of the pilea (Chinese money plant) with round coin-shaped leaves in its cream speckled ceramic pot on the worn honey-colored wooden desk, the same plant and pot as in reference image 2. On the dark soil lies the same star as in reference image 1, face down with its back facing up: a small palm-sized rounded five-point plastic glow-in-the-dark star, faded yellowish-white with darker discolored edges, matte and unlit, its back covered with overlapping layers of old plain unprinted tape: a clear tape strip gone slightly cloudy, a yellowed crinkled paper masking tape strip across it, and one more translucent matte tape piece over both, edges lifting, dust and tiny white ceiling-paint flakes stuck in the old adhesive; the tape layers look the same as in reference image 1. A few soil crumbs on it. Leaves neutral, no new growth, no flowers. Pot and star in the center-upper part of the frame. No hands. No text, no letters, no numbers, no logos, no watermark, no printed tape. No desk clock, no string lights, no fairy lights, no glowing dots, no bokeh lights. vertical 9:16, shot on a mirrorless camera, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(K03c·ref-room 대비): 테이프 3종의 순서·색이 K03c와 같음 / 같은 pilea·크림 화분·꿀색 책상 / 빛이 창 쪽(화분 뒤)에서 / 새잎·꽃 없음 / 별이 흙에 박히지 않음 / 시계 없음.

### ⑭ K05m · C5 아침 판 (리라이트) → `keyframes/K05m.png`
- 첨부: `keyframes/K05.png` (AI 편집)
```
Keep everything identical to the attached image — same camera, framing, plant, pot, soil, the star and its tape, the soil crumbs. Change only the light: soft neutral morning daylight from the window instead of the blue dawn light. No text, no logos.
```
- 통과 체크(K05 대비, 50% 겹침): 별·부스러기·잎 위치 불변, 빛만 바뀜.

### ⑮ K05e · C5 끝 프레임 (별을 집어 간 뒤) → `keyframes/K05e.png`
- 첨부: `keyframes/K05m.png` (AI 편집)
```
Keep everything identical to the attached image — same camera, framing, morning light, plant, pot and soil. Change only: the star is gone from the soil; a few small soil crumbs lie where it was. No hand. No text, no logos.
```
- 통과 체크(K05m 대비): 별 자리만 비고 나머지 불변.

### ⑯ K06a · C6a 첫 프레임 (노을, 책상 위 한 겹 더) → `keyframes/K06a.png`
- 첨부: ① `keyframes/K03c.png` ② `assets/library/ref-room.png`
```
Warm orange sunset light coming low through the sheer white curtains, long soft shadows. Slightly high-angle close-up of the worn honey-colored wooden desk from reference image 2. On the desk: a small plain unmarked paper bag; a fresh backing sheet of new small palm-sized rounded five-point plastic glow-in-the-dark stars, clean pale green-white, crisp and new, matte and unlit; and the same old star as in reference image 1 lying with its back facing up: a small palm-sized rounded five-point plastic glow-in-the-dark star, faded yellowish-white with darker discolored edges, matte and unlit, its back covered with overlapping layers of old plain unprinted tape: a clear tape strip gone slightly cloudy, a yellowed crinkled paper masking tape strip across it, and one more translucent matte tape piece over both, edges lifting, dust and tiny white ceiling-paint flakes stuck in the old adhesive. A man's two hands, plain grey t-shirt sleeves, no rings, no watch, no bracelet, short clean nails, natural skin, five normal fingers each, holding a freshly torn strip of clear tape just above the old star. Hands and star in the upper-center of the frame. Plain unmarked bag and sheet. No text, no letters, no numbers, no logos, no barcode, no price tag, no watermark. No desk clock, no string lights, no fairy lights, no glowing dots, no bokeh lights, no visible face. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 통과 체크(K03c 대비): 옛 별 테이프 3종 동일 / 새 별 시트가 연둣빛 흰색(누렇지 않음) / 새 테이프는 얇고 투명 / 봉투·시트 무지 / 손·소매 동일 규격.

### ⑰ K06e · C6a 끝 프레임 (테이프가 붙은 뒤) → `keyframes/K06e.png`
- 첨부: `keyframes/K06a.png` (AI 편집)
```
Keep everything identical to the attached image — same camera, framing, sunset light, desk, paper bag, star sheet, old star and hands. Change only: the fresh clear tape strip is now pressed flat across the back of the old star, over the old tape layers, the right thumb resting on it; the other hand rests on the desk. Five normal fingers on each hand. No text, no logos, no barcode.
```
- 통과 체크(K06a 대비): 봉투·시트·별 위치 불변 / 새 테이프가 옛 테이프 위 한 겹으로 보임.

### ⑱ K06s · C6 인서트 (시트에 별 하나 빠진 자리) → `keyframes/K06s.png`
- 준비: 편집기에서 K06a의 별 시트 부분만 9:16으로 잘라 `keyframes/K06s_crop.png` 저장.
- 첨부: `keyframes/K06s_crop.png` (AI 편집)
```
Keep the exact same image, light and camera. Change only: no hands; one star is missing from the sheet of pale green-white plastic glow-in-the-dark stars, leaving an empty star-shaped gap in the plain backing sheet. Plain unmarked sheet, no text, no logo, no barcode.
```
- 통과 체크(크롭 대비): 빈자리 하나, 별 모양 / 시트 무지.

---

## 4. 야광 판 — 무료 편집기 수작업 (기본, 생성 0)

> Photopea(브라우저) 또는 GIMP. 메뉴는 Photopea 기준. 야광 판은 합성이 **검수 기준**이다(shotlist rules).
> 목표 값(8비트, 스포이트): **천장 바탕 6~10** · **별 중심 22~64, 별마다 다르게** · 블룸 ≤ 별 크기 1.5배 · 레이·스파이크·플레어·Outer Glow·Lens Flare **금지**.
> 연속성 규칙: 별 매트는 **원본 판의 별 윤곽을 그대로 따라** 그린다(새로 배치 금지). K01g의 매트 7개는 K07g에서 그대로 재사용 → C1/C7 별이 픽셀 단위로 같다.

### K01g · C1 어둠 판 → `keyframes/K01g.png` + `keyframes/K01g.psd`
- 원본: `K01d.png`
1. K01d 열기 → 레이어 복제, 이름 `dark`.
2. `Image > Adjustments > Exposure` **-5.0**.
3. `Hue/Saturation` 채도 **-60** · `Color Balance`(Midtones) 파랑 **+10**, 초록 **+3**.
4. 스탠드 끄기: 전구·갓 안쪽 밝은 부분을 `#060708` 부드러운 브러시로. 벽·천장의 앰버 잔광은 같은 색 큰 브러시 불투명도 30%로 눌러 천장 바탕 **6~10**.
5. 창빛 한 줄: 새 레이어(`Screen`), `#7F93A8`, 2~3px 부드러운 브러시로 pilea 잎·화분 테두리의 **창 쪽 윤곽만** 한 줄. 불투명도 40~60%. (C7 공용)
6. 별 매트: `dark` 불투명도 30%로 내려 별을 보이게 → 새 레이어 그룹 `stars`에 펜 도구로 **별 7개를 각각 별도 레이어**로 따라 그림 → `dark` 100% 복귀.
7. 채움 `#B9E3A8`, 별마다 중심 값 **64 / 54 / 46 / 38 / 32 / 26 / 22**(레이어 불투명도로 조절). 가장 밝은 별 = 큰 별 중 하나(들린 별 아님), 가장 흐린 별 = 작은 별. 레이어 이름 `s1_64` … `s7_22`.
8. 블룸: `stars` 그룹 복제 → 병합 → `Gaussian Blur` 반경 = 별 폭의 약 1/4 → `Screen` 35%. 번짐 > 별 1.5배면 반경 축소.
9. `Add Noise` 1~2% Monochromatic.
10. 스포이트 확인 → `K01g.psd` 저장 → `K01g.png` 내보내기.

### K07g · C7 어둠 판 (별 8개) → `keyframes/K07g.png`
- 원본: `K01g.psd` + 위치 기준 `K07d.png`
1. `K01g.psd` → **다른 이름으로** `K07g.psd`. 기존 레이어는 건드리지 않는다(들린 별 끝의 미세한 차이는 어둠 속이라 무시).
2. K07d.png를 맨 위에 30% → 새 별 윤곽을 새 레이어 `s8_new`로 → K07d 레이어 삭제.
3. 채움 `#C6F0B4`, 중심 값 **90~100**(가장 밝은 옛 별 × 1.4~1.6). 그 이상 금지.
4. 블룸 = K01g와 같은 설정 → `K07g.png`.
5. 검사: K01g.png와 Difference → **새 별 자리 외 차이 0**.

### K04g · C4 빛나는 판 → `keyframes/K04g.png`
- 원본: `K04.png` (이미 어두운 판 — 노출 내림 없음)
1. 천장 바탕 > 10이면 Exposure로 6~10까지만(pilea 창빛은 마스크로 보호).
2. K01g 6~8단계와 같게: **K04의 희미한 별 7개 윤곽**을 따라 매트 → `#B9E3A8`, 22~64 제각각 → 블룸 `Screen` 35%.
3. `K04g.png`. K04와 Difference → 별 자리 외 차이 없음.

### 폴백 — AI 편집 (편집기를 못 쓸 때만, 판당 최대 2회)
- K01g: `K01d.png` 첨부
```
Keep the exact same composition, camera position and every object in place. Only change the light: the desk lamp is switched off and the room is almost completely dark; the seven plastic stars on the ceiling stay exactly where they are with the same shapes and sizes and emit a very faint pale green phosphorescent glow, each star a slightly different faint brightness, no halos, no rays, no sparkle; the ceiling is barely visible; a thin line of cool street light from the window touches only the edge of the pilea leaves. No ceiling fan, no ceiling light fixture, no string lights, no fairy lights, no extra glowing dots, plain flat white ceiling, no stars outside the ceiling, no text.
```
- K07g: `K01g.png` 첨부
```
Keep the exact same image. Only change: add one more faint glowing plastic star a hand-width to the left of the star above the pilea, in the same position as the new star in the reference; it glows slightly brighter and greener than the seven old ones but is still soft and dim, no rays. Nothing else changes. No string lights, no fairy lights, no extra glowing dots, no text.
```
- K04g: `K04.png` 첨부
```
Keep the exact same image, camera and every object in place. Only change: the seven ceiling stars, in exactly the same positions and shapes, glow faintly pale green, soft and dim, each slightly different in brightness, no rays, no halos. No ceiling fan, no ceiling light fixture, no string lights, no fairy lights, no extra glowing dots, plain flat white ceiling, no text.
```
- 버릴 것: 네온처럼 밝음 / 별 개수·위치·모양 변화 / 별자리 재배치 / 창밖 별하늘 / 천장이 밤하늘처럼 보임 / 스탠드 전구가 켜져 있음 / 별 외의 점광원. **2회 실패 → 편집기 방법.**

---

## 5. 영상 (Kling 3.0, image → video)

> 카메라 움직임 1 + 피사체 움직임 1. 생성 5초, 필요한 길이만 편집에서 사용. **컷당 최대 2회**, 실패하면 폴백. 끝 프레임을 지정한 컷은 시작·끝이 이미 통과 체크를 거친 판이라 연속성이 보장된다.
> **Kling 네거티브 칸(공통)**:
```
text, letters, numbers, logo, watermark, extra fingers, missing fingers, fused fingers, deformed hands, rings, wristwatch, face, ceiling fan, ceiling light fixture, string lights, fairy lights, glowing dots, sparkles, lens flare, star rays, neon glow, cartoon, CGI, 3d render, oversaturated
```
> **버릴 것(공통)**: 손가락 이상·별 관통 / 글자·인쇄 생성 / 별이 빛나거나 반짝임 / 손이 닿지 않은 별이 움직임·깜빡임 / 별 재배치 / 천장 기구 등장 / 얼굴 / 컷 안에서 시간대 빛이 바뀜 / 소매 색·반지 등 손 규격이 바뀜.

### C3b · 별 떼기 (1.5s 사용, C3④에 역재생 재사용) → `clips/C3b.mp4`
- 첫 프레임 `K03b.png` · 끝 프레임 `K03e.png`
```
Static low-angle camera looking straight up at the ceiling in bright neutral daylight. The thumbnail slides under the peeling point of the faded plastic star and slowly peels it off the ceiling; the star comes away between his thumb and index finger and stays rigid. The other star on the ceiling stays perfectly still. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 별이 휘거나 찢어짐 / 천장 페인트가 크게 뜯김.

### C3a · 실루엣 올라섬 (1.5s 사용) → `clips/C3a.mp4`
- 첫 프레임 `K03a.png` · 끝 프레임 없음
```
Static camera. Backlit by the bright window, he steps up onto the wooden chair in one motion and straightens up, one arm rising toward the ceiling; his face stays completely dark in silhouette and he does not turn toward the camera. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 돌아서 얼굴이 밝아짐 / 의자가 흔들려 위험해 보임.

### C5 · 별 집어 올리기 (3.0s 사용) → `clips/C5.mp4`
- 첫 프레임 `K05m.png` · 끝 프레임 `K05e.png`
```
Very slow push-in. Two fingers of a hand in a plain grey t-shirt sleeve enter from above, pick up the face-down plastic star from the soil and lift it out of the frame; a few soil crumbs fall from it back onto the soil. The plant stays still. vertical 9:16, shot on a mirrorless camera, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 집는 순간 별 형태 붕괴 / 흙이 튀거나 거꾸로 / 잎이 크게 흔들림. 2회 실패 → 집기 직전에서 자르고 C6로 연결(샷리스트 대응안).

### C6a · 옛 별 뒷면에 테이프 한 겹 (3.0s 사용) → `clips/C6a.mp4`
- 첫 프레임 `K06a.png` · 끝 프레임 `K06e.png`
```
Nearly static high-angle camera in warm sunset light. The two hands lower the torn strip of clear tape and press it flat across the back of the old star, over the old layers of tape, then one thumb smooths it once. The paper bag and the star sheet do not move. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 투명 테이프가 사라지거나 손가락 관통.

### C6c · 옛 별 누르고 그 옆에 새 별 (3.5s 사용) → `clips/C6c.mp4`
- 첫 프레임 `K06b.png` · 끝 프레임 `K06d.png`
```
Static low-angle camera looking straight up at the ceiling in warm sunset light. The thumb presses the old star flat and the hand moves away, then the hand comes back holding a new pale star and presses it onto the ceiling just to the left of the old one, and leaves the frame. The other stars stay still. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 새 별이 손 없이 나타남(마법) / 새 별이 오른쪽에 붙음. 2회 실패 → §6 C6c 2분할.

---

## 6. 폴백 (실패할 때만)

**K02c + C2 영상** (K02t 아웃페인트 불가·납작해 보일 때)
- K02c → `keyframes/K02c.png` · 첨부: ① `K02a.png` ② `K01d.png`
```
The same room as reference image 1 in the same bright neutral overcast daylight, the camera now tilted up from the desk: the top of the window with the sheer white curtains on a thin rod at the bottom of the frame, the white wall rising to a plain flat white ceiling with no fixtures that fills the upper two thirds. On the ceiling: seven small palm-sized rounded five-point plastic glow-in-the-dark stars, faded yellowish-white with darker discolored edges, matte and unlit, stuck to the plain flat white ceiling above the desk: two large, three medium and two small, scattered irregularly with uneven gaps, not a constellation, not a line, not a shape; the star directly above the pilea has one point peeling slightly off the ceiling; arranged like the stars in reference image 2, barely noticeable in daylight. No text, no letters, no numbers, no logos, no watermark. No wall clock, no ceiling fan, no ceiling light fixture, no smoke detector, no string lights, no fairy lights, no LED strips, no glowing dots, no bokeh lights, no guitar or musical instruments, no visible face. No moon, no planets, no stars outside the ceiling, no starry sky in the window. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- C2 → `clips/C2.mp4` · 첫 `K02a.png` · 끝 `K02c.png` · 5.5s 사용
```
Slow smooth tilt up from the plain moving boxes on the floor, past the desk with the pilea and the window, to the plain flat white ceiling with the faded plastic stars. Nothing in the room moves. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

**C3d · 별 다시 붙이기** (C3b 역재생이 부자연스러울 때) → `clips/C3d.mp4` · 첫 `K03e.png` · 끝 `K03b.png` · 1.5s
```
Static low-angle camera looking straight up in bright neutral daylight. The fingers press the faded plastic star back onto its spot on the ceiling and the thumb holds it flat for a moment. The other star stays still. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

**C6c 2분할** (C6c 2회 실패 시)
- C6c1 옛 별 누르기 = C3④ 클립(C3b 역재생 또는 C3d)을 노을 그레이딩해 재사용. 생성 없음.
- C6c2 → `clips/C6c2.mp4` · 첫 `K06d.png` · 2s
```
Static low-angle camera looking straight up in warm sunset light. A hand in a plain grey t-shirt sleeve enters from below and the thumb presses the new pale star firmly onto the ceiling to the left of the old one, then the hand leaves the frame. The stars do not move. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

---

## 7. 연속성이 끊겨도 되는 곳 (컷이 덮어 준다 — 맞추느라 시간 쓰지 않는다)

| 경계 | 달라지는 것 | 왜 안전한가 |
|---|---|---|
| C1(K01d) → C2(K02a) | 밤 → 낮, 노트북 닫힘 → 열림, 시계 안 보임 → 보임, 카메라 위치 | 시간대 점프 컷. 별 배치만 근사(K02t는 K01d 참고) |
| C2 ↔ C1·C4·C7 | 별의 정확한 위치 | 앵글이 달라 비교 불가, 낮엔 별이 거의 안 보임 |
| C3①(K03a) → C3②(K03b) | 의자 담요, 방 배경 | 실루엣 → 올려다보는 클로즈업, 배경이 천장뿐 |
| C3②→③(K03c) | 천장 배경 | 매크로라 흐린 흰 바탕뿐(실물 대체 시도 동일) |
| C4(K04) vs C1(K01d) | 카메라 위치, 별 배치 세부 | "더 넓은 다른 앵글"이 샷리스트 결정. 별은 희미한 형체, K04g 매트는 K04 자기 별을 따름 |
| K01d·K04·K05·K06 의 시계 | 시계가 프레임 밖/어둠 속 | 시계 3회 규칙을 위한 의도적 배치 |
| C5 → C6(K06a) | 종이봉투·새 별 시트 등장 | 그날 저녁 사 온 물건(이야기 그대로) |
| C6 → C7 | 노을 → 밤, 클로즈업 → 와이드 | 시간 점프. 대신 새 별 **왼쪽** 약속은 지킨다 |
| C7 → C1 루프 | 별 8개(들린 별 평평) → 7개(들린 별) | 의도된 루프: 첫 컷 = "그가 오기 전" |

**절대 끊기면 안 되는 곳**: C1↔C7(K01d↔K07d, K01g↔K07g — Difference 검사), K04↔K04g, K05↔K05m↔K05e, K03b↔K03e↔K03c(같은 별·같은 손), K06a↔K06e, K06b↔K06d, K03c 테이프 ↔ K05·K06a 테이프, K06d 새 별 쪽 ↔ K07d.

---

## 8. 편집 조립 메모 (editor 담당 — 영상 생성 없는 부분)

> 24fps. 노출 램프는 **화면 전체에 커브 하나**만. 별마다 다른 마스크·키프레임 금지. 램프 뒤 별은 깜빡이거나 밝아지지 않는다.

**C1 · 훅 (3.5s)** — `K01d`, `K01g`
| 시간 | 화면 | 처리 |
|---|---|---|
| 0.0–0.6s | K01d | 고정 |
| 0.6s | — | 하드컷 + '딸깍' |
| 0.6–1.0s | 순검정 | 10프레임, 늘리지 않는다 |
| 1.0–2.5s | K01g + 램프 | Levels 입력 블랙 포인트만 키: 1.0s=72 → 1.3s=60 → 2.3s=22 → 2.5s=0 (선형, 화이트 255·감마 1.0 고정) |
| 2.5–3.5s | K01g | 정지 홀드 |
- AI 폴백 판이라 별 값이 22~64가 아니면: 1.0s = 가장 밝은 별+8, 1.3s = 가장 밝은 별−4, 2.3s = 가장 흐린 별. 키 4개를 **프리셋 저장**.

**C7 · 엔딩/루프 (6.5s)** — `K07d`, `K07g`
- 0.0–1.0s K07d → 1.0s 하드컷 + '딸깍' → 1.0–1.4s 순검정 → 1.4–2.9s K07g + C1 프리셋(키 +0.4s: 1.4=72, 1.7=60, 2.7=22, 2.9=0, 새 별이 가장 먼저) → 2.9–6.5s 홀드 → END(`Someone needed stars here before I did.`, 0.3s 페이드 인, 2.5s 이상) → C1 루프.

**C4 · 시간 경과 (7.0s)** — `K04c`, `K04g`, `K04`
- 0.0–0.5s K04c + `11:41 PM` → 0.5–3.0s K04g→K04 크로스페이드(7개 동시에 고르게) → 3.0–3.3s K04 → 3.3–3.8s K04c + `12:03 AM` → 3.8–4.8s 디졸브 → 4.8–7.0s K04g→K04(둘째 밤: 103% 리프레임 + 커튼 쪽 조금 더 차갑게). 째깍·알람음 없음, 먼 차 소리 1회. 크롭 후 화분 70% 선 위 확인.

**나머지**
| 컷 | 소스 | 처리 |
|---|---|---|
| C2 (5.5s) | K02t | 아래→위 가상 틸트(이즈 인/아웃, 스케일 102→100%), 시계 숫자 합성 없음 |
| C3③ (2.5s) | K03c | 컷 온 액션, 푸시인 100→104%, 마지막 1s 정지 |
| C3④ (1.5s) | C3b 역재생 | 마지막 6프레임 정지(엄지 누름). 부자연스러우면 C3d |
| C5 0–3s | K05 → K05m | 크로스페이드 3s + 푸시인 100→103%. 3–6s = C5.mp4 |
| C6 3–4s | K06s | 1s 스틸 인서트 |
| C6 7.5–9s | K06d | 1.5s 홀드 (C6c 끝 프레임과 같은 판) |
- 그레인·LUT·비네팅은 `pipeline/finish.sh`로 전 컷 동일.

---

## 대표 결정 사항

> **2026-10-28 대표 답변(기획 승인):** 1번 허용 — AI 5회 실패 시 K03c 실물 매크로 촬영. 2번은 힉스필드 구독 때 대표가 확인. 3번은 ep01 결정(렌즈별 표기 유지)대로 지금 블록 그대로 쓴다.

1. **K03c 실물 매크로 대체** — 허용(AI 5회 실패 시). 방법은 §3 ④.
2. **힉스필드 기능 확인** — (a) Kling 3.0 첫/끝 프레임: 있음(이번 판은 C3b·C5·C6a·C6c에 끝 프레임 사용). (b) 아웃페인트/캔버스 확장: K02t에 필요 — 없으면 K02c + C2 영상 폴백(이미지 +1, 영상 +1).
3. **렌즈 표기** — 컷별 렌즈 유지(K03b 35mm f/2 · K03c 100mm macro f/2.8 · K04c macro f/2 · K05 50mm f/1.8 · C1·C4·C7 24mm f/2.8 고정).
