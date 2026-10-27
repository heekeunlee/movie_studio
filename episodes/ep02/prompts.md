# ep02 — left up. · 프롬프트 (촬영감독)

- 기준: `shotlist.json` (8컷 = 7 + END · 47.5s) / `bible/style.md` · `character.md` · `room.md` · `banned.md` · `originality.md` / `script.md` / `check.md` (FIX 반영 → PASS)
- 1단계(반자동): 아래 코드 블록을 **그대로 복사**해 힉스필드 웹에 붙인다. 블록 안 문장은 고치지 않는다.
- 저장 위치: `episodes/ep02/keyframes/`, `episodes/ep02/clips/` (기준 이미지만 `assets/library/`)
- 이 편의 사람은 **얼굴 0**. C3① 역광 실루엣 1.5초를 빼면 손·팔뚝(회색 무지 티셔츠 소매)만 나온다.

---

## 생성 순서 체크리스트 (위에서부터 차례로)

| # | 단계 | 개수 | 파일 | 통과 조건 |
|---|---|---|---|---|
| 0 | 기준 이미지 (**없을 때만**) | 0~2 | `assets/library/ref-character.png`, `ref-room.png` | ep01과 공용. 이미 있으면 건너뛴다. 대표 확인 후 고정 |
| 1 | 새 키프레임 (AI 생성) | 9 | `keyframes/K01d, K03c, K03b, K04, K02a, K03a, K04c, K05, K06a .png` | 각 블록의 "버릴 것" 통과 |
| 2 | 편집 판 | 9 | `keyframes/K01g, K07d, K07g, K04g, K02t, K05m, K06d, K06b, K06s .png` | 야광 판 3장(K01g·K07g·K04g)은 **무료 편집기에서 직접 만든다**(기본). 나머지 6장은 AI image-edit |
| 3 | 영상 (image→video) | 5 | `clips/C3a, C3b, C5, C6a, C6c .mp4` | 각 블록의 "버릴 것" 통과 |
| 4 | 영상 생성 안 함 | — | C1·C7(스틸 + 노출 램프), C2(가상 틸트), C3③·④, C4, C5 앞 3초, C6 인서트·홀드, END | 편집 담당 처리 — §4 조립 메모 |

- 합계: **이미지 생성 11장**(기준 2 — 없을 때만 + 새 키프레임 9) · **편집 9건**(그중 3건은 편집기 수작업 = 생성 비용 0) · **영상 5개**
- 폴백(실패할 때만): 영상 최대 +3(C2 틸트, C3d 다시 붙이기, C6c 2분할), 이미지 +1(K02c, 아웃페인트를 못 쓸 때)
- 순서 이유: 기준 → 마스터 → 편집 판 → 영상. 편집 판은 원본이, 영상은 첫/끝 프레임이 확정돼야 만든다.
- 1단계 안에서는 **K01d → K03c → K03b → K04**를 먼저 만든다(재사용이 많거나 위험이 큰 순서). K05·K06a는 K03c를 참조 이미지로 쓰므로 K03c 다음에.
- 재시도 예상(샷리스트 기준 평균 2.5회): 새 이미지 약 23회(K03c는 5회 예산), AI image-edit 6 × 2.5 ≈ 15회, 영상 약 13회(+폴백).

## 모든 블록 공통

**표준 접미사** (style.md):
```
vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
**고정 접미사** (C1·C4·C7 — 삼각대 고정 컷. check.md 수정안 5):
```
vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text
```
- 샷리스트 렌즈가 35mm f/1.8이 아닌 컷(K02a·K03b 35mm f/2, K03c 100mm 매크로 f/2.8, K04c 매크로 f/2, K05 50mm)은 접미사의 렌즈 부분**만** 바꿨다(ep01과 같은 방식).

**천장 네거티브** — 천장이 보이는 모든 판(K01d·K02t·K03b·K04·K06d·K07d, 영상 C3b·C6c)은 블록 안에 이미 들어 있다:
```
no ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars
```

**공통 네거티브** (네거티브 칸이 있는 모델이면 붙인다. 컷별 추가분은 각 블록에):
```
text, letters, numbers, writing, watermark, logo, brand name, barcode, printed tape, extra fingers, missing fingers, fused fingers, deformed hands, face, neon glow, lens flare, star rays, sparkles, glitter, cartoon, CGI, 3d render, oversaturated
```

**별 디자인 (모든 판 공통, 프롬프트에 반영됨)**: 작은 손바닥 크기의 둥근 모서리 5각 플라스틱 별, 크기 3종, 불규칙 배치(별자리·글자·하트 모양 금지). 옛 별 = 누런 흰색·가장자리 바램. 새 별 = 깨끗한 연한 연둣빛 흰색. 책상(화분) **바로 위**의 별 하나가 모서리가 들린 별이다(C2 → C3 → C5 낙하 → C6·C7 새 별은 그 옆).

**시계**: 이 편에 정확히 3회 — C2 틸트 속 1회(작고 안 읽힘) + C4 인서트 2회(K04c). **K01d·K04·K05·K06a·K07d에는 시계가 보이면 안 된다.**

**안전 영역**: 별·손·문구는 상단~중앙. **하단 25%·우측 15% 비움.** C4·C7 화분은 프레임 하단에서 30% 이상 위(세로 1920 기준 y ≤ 1340px).

**글자 없음**: 상자·종이봉투·별 시트·테이프는 모두 무지(plain, unmarked, no text, no logo). 실존 브랜드·작품명은 어디에도 쓰지 않는다.

---

## 0. 기준 이미지 (assets/library 에 없을 때만, 가장 먼저 — ep01 §0과 같은 문장)

> 2026-10-27 현재 `assets/library/`는 비어 있다. ep01과 공용이므로 한 번 만들면 이후 모든 편이 쓴다.
> 이 편에서 쓰임: `ref-room` = K01d·K02a·K04 참조(방 일관성). `ref-character` = 이 편에서는 거의 안 쓴다(K03a 실루엣의 체형·티셔츠 확인용, 첨부는 선택). 손 클로즈업에는 넣지 않는다.

### REF-1 · 주인공 → `assets/library/ref-character.png`
- 참조 이미지: 없음 (이 이미지가 앞으로의 기준이 된다)
- 4장 정도 뽑아 1장을 고른다. **실존 배우·유명인과 닮았으면 버린다** (character.md)
```
Portrait of a man in his mid-20s, short messy dark hair, tired eyes, plain grey t-shirt with no print or logo, natural skin texture with slight imperfections, neutral expression, chest-up framing, plain softly lit room background, soft window light, realistic photo, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 유명인과 닮음 / 모델처럼 매끈한 피부 / 티셔츠 프린트·로고 / 웃는 얼굴

### REF-2 · 방 → `assets/library/ref-room.png`
- 참조 이미지: 없음
```
Small apartment studio room, wooden desk by a window with sheer white curtains, open unbranded laptop with no logo, small digital desk clock with a blank unlit display, small potted plant on the desk, single bed with grey sheets, warm desk lamp, lived-in and slightly messy, bright neutral daylight, realistic photo, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: **벽시계·천장 선풍기**(banned 조합) / 노트북 로고 / 시계에 읽히는 숫자 / 화분이나 탁상 시계가 없음 / 책상과 침대가 한 프레임에 안 들어옴
- 이 편 추가 확인: 천장에 조명기구·선풍기가 없는 평평한 흰 천장이면 더 좋다(천장 컷 참조로 쓰기 때문)

---

## 1. 새 키프레임 (이미지 생성 9장)

> 참조 이미지 원칙: `ref-room`은 방 구성이 보이는 와이드(K01d·K02a·K04)에만. 손·별 클로즈업에는 넣지 않는다. **ref-room에 침대와 시계가 있으므로, K01d·K04 결과에 침대·시계가 따라 들어오면 버린다.**

### K01d · C1·C7 마스터 (밤, 앰버 판) → `keyframes/K01d.png`
- 참조: `ref-room`
- **이 편의 마스터 판.** 별 7개의 위치·크기·밝기 순서가 여기서 정해진다. K01g·K07d·K07g가 모두 이 이미지에서 나온다. 재시도 예산 4.
```
Night, small studio apartment, static wide shot from standing chest height in the corner beside a wooden desk, camera tilted up about 35 degrees toward where the white wall meets the plain flat white ceiling, the upper two thirds of the frame is ceiling with seven small palm-sized plastic five-point stars with rounded points, faded yellowish-white with discolored edges, stuck at irregular scattered positions in three different sizes, not a constellation, not a pattern, one star slightly lifted at one corner directly above the desk; lower third: the edge of the wooden desk with a small potted plant silhouette about one third of the way up from the bottom of the frame and a plain unbranded warm desk lamp at the bottom edge throwing amber light upward onto the wall and ceiling, the edge of a sheer white curtain at frame left, no clock visible, no bed in frame, no ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars, vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text
```
- 추가 네거티브: `clock, bed, person, hands, glowing stars, neon`
- 버릴 것: 천장 선풍기·조명기구 / 별이 7개가 아님, 별자리·하트·줄 맞춘 배치 / 별이 이미 빛남(이 판은 앰버빛 아래 '플라스틱'으로만 보여야 함) / 시계·침대가 보임 / **침대에서 올려다보는 시점처럼 보임(책상·스탠드가 프레임 안에 있어야 함)** / 화분이 하단 25% 안으로 내려감 / 들린 별이 책상 위가 아님

### K03c · C3③ 핵심 매크로 (낮, 별 뒷면 겹겹 테이프) → `keyframes/K03c.png`
- 참조: 없음
- **이 편의 전환 정보 컷.** 테이프가 "서로 다른 3종 · 다른 시기"로 읽혀야 한다. 재시도 예산 5. 이 결과가 K05·K06a 테이프 모양의 기준이 된다.
```
Macro close-up, bright neutral daylight, a man's thumb and index finger holding a small palm-sized faded yellowish plastic five-point star with rounded points turned over to show its back, the back is covered with several overlapping layers of old tape: a clear tape strip, a yellowed crinkled paper masking tape strip on top of it, and another cloudy tape piece over that, the edges lifting, dust and tiny white ceiling paint flakes stuck to the old adhesive, plain unprinted tape, no text, no logo, no writing, the star in the upper-center of the frame, white ceiling soft and out of focus in the background, vertical 9:16, shot on a mirrorless camera, 100mm macro lens, f/2.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `printed tape, letters on tape, brand tape, single clean tape, glossy new tape, extra fingers`
- 버릴 것: 테이프가 한 겹이거나 깨끗함 / 테이프에 글자·무늬·인쇄 / 별 모양이 뭉개짐(꼭지점 5개 확인) / 손가락 3개 이상 보이는데 개수가 이상함 / 손톱이 별을 뚫음
- 5회 실패 시: 실물 매크로 촬영으로 대체 → "대표 결정 사항" 1번

### K03b · C3②④ (낮, 손끝이 들린 별에 닿음) → `keyframes/K03b.png`
- 참조: 없음
- C3② 영상 첫 프레임 + K06d·K06b(노을 판)의 원본.
```
Bright neutral daylight, low angle looking straight up at a plain flat white ceiling, close-up of a man's hand with fingertips reaching a small palm-sized faded yellowish plastic five-point star with rounded points stuck to the ceiling, his thumbnail catching the lifted corner of the star, a plain grey t-shirt sleeve at the frame edge, another faded star softly out of focus nearby, hand and star in the upper-center of the frame, no ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `face, head, extra fingers, glowing stars`
- 버릴 것: 손가락 개수·관절 이상 / 손톱이 별을 관통 / 얼굴·머리가 들어옴 / 천장 조명기구

### K04 · C4 와이드 (밤, 별이 사그라든 뒤) → `keyframes/K04.png`
- 참조: `ref-room`
- 이 판 = 거의 꺼진 상태. 빛나는 판(K04g)은 §2에서 편집기로 만든다.
```
Night, dark small studio apartment, static wide shot from standing chest height in the room's far corner, wider than a corner view: the window wall with sheer white curtains, a wooden desk under the window with a small potted plant that alone catches a soft cool beam of street light from outside, the potted plant about one third of the way up from the bottom edge of the frame, the rest of the room in deep shadow, laptop closed, the plain flat white ceiling occupies the upper half of the frame with seven small palm-sized plastic five-point stars faintly visible as pale shapes at irregular positions, bed out of frame, no clock visible, no ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars, vertical 9:16, shot on a mirrorless camera, 24mm lens, f/2.8, static locked-off camera on a tripod, natural light, muted colors, film grain, photorealistic, no text
```
- 추가 네거티브: `clock, bed, person, glowing stars, starry sky in window, neon`
- 버릴 것: 침대가 보이거나 '누워서 보는' 시점 / 화분이 하단 25%에 걸림(y > 1340px) / 창밖에 별하늘 / 별이 이미 밝게 빛남 / 시계가 보임 / 화분 말고 다른 물체가 창빛을 크게 받음

### K02a · C2 틸트 시작 (낮, 이삿짐 상자 → 책상) → `keyframes/K02a.png`
- 참조: `ref-room`
```
Bright neutral daylight, small studio apartment just moved into, the floor with two or three plain unmarked cardboard moving boxes sealed with tape in the lower part of the frame, behind them a half-empty wooden desk by a window with sheer white curtains, an open unbranded laptop, a small digital desk clock seen from the side with its display too small to read, a small potted plant with neutral healthy leaves, camera at waist height, plain unmarked boxes, no text, no logo, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `shipping labels, printed boxes, brand logo, readable clock digits, person`
- 버릴 것: 상자에 글자·로고·바코드·운송장 / 시계 숫자가 읽힘 / 노트북 로고 / 화분이 시듦·꽃 핌

### K03a · C3① 실루엣 (낮, 의자에 올라섬) → `keyframes/K03a.png`
- 참조: 없음 (원하면 `ref-character`를 체형·티셔츠 확인용으로 첨부. 얼굴이 살아나면 즉시 빼고 다시)
```
Daylight, strong backlight from a window with sheer white curtains, silhouette of a young man in a plain grey t-shirt with no print stepping up onto a wooden desk chair in front of the desk, face completely dark in shadow with no facial features visible, body framed knees up, his head in the upper third of the frame, one arm starting to reach toward the ceiling, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `visible face, eyes, lit face, front light, t-shirt print`
- 버릴 것: **눈·코·입이 보임** / 티셔츠 프린트 / 의자가 책상 앞이 아님(별은 책상 위에 있다)

### K04c · C4 시계 인서트 ×2 → `keyframes/K04c.png`
- 참조: 없음
- 1장으로 두 인서트를 모두 쓴다. 숫자 `11:41 PM` / `12:03 AM`은 편집 합성.
```
Night, macro close-up of a small minimalist digital desk clock on a wooden desk in a dark room, its display panel lit with a dim blank glow and completely blank with no digits, display in the center of the frame, shallow depth of field, vertical 9:16, shot on a mirrorless camera, macro lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `digits, numbers, analog clock hands, brand name`
- 버릴 것: 숫자가 나옴 / 아날로그 시계 / 브랜드 각인 / 디스플레이가 하단 25%

### K05 · C5 (새벽, 화분 흙 위에 떨어진 별) → `keyframes/K05.png`
- 참조: `keyframes/K03c.png` (테이프 모양 맞춤)
```
Dawn, soft blue-grey light, slightly high angle close-up of a small potted plant on a wooden desk, on top of the dark soil lies a small palm-sized faded yellowish plastic five-point star with rounded points face down, its back with several overlapping layers of old clear tape and yellowed paper tape facing up, a few soil crumbs on it, plant leaves neutral, pot and star in the center-upper part of the frame, plain unprinted tape, vertical 9:16, shot on a mirrorless camera, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `flowers, new sprouts, printed tape, clock, hands`
- 버릴 것: 테이프 모양이 K03c와 딴판 / 새잎·꽃 / 별이 흙에 박힘 / 시계가 보임

### K06a · C6 앞부분 (노을, 책상 위 한 겹 더) → `keyframes/K06a.png`
- 참조: `keyframes/K03c.png` (옛 별 뒷면 테이프 맞춤)
```
Golden orange sunset light through sheer curtains, slightly high angle close-up of a wooden desk: a small plain unmarked paper bag, a fresh sheet of pale greenish-white plastic glow stars, and an old faded yellowish plastic five-point star lying face up showing its back with layered old tape, a man's two hands holding a freshly torn strip of clear tape just above the old star, hands and star in the upper-center of the frame, plain unmarked paper bag and sheet, no text, no logo, no barcode, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `printed bag, packaging text, barcode, price tag, extra fingers, clock`
- 버릴 것: 봉투·시트에 글자·로고·바코드 / 손가락 개수 이상 / 테이프가 두껍고 불투명(새 테이프는 투명) / 시트 별이 노랗게 바램(새 별은 연둣빛 흰색)

---

## 2. 편집 판 (9건)

> 원칙: 원본을 첨부하고 **구도·카메라·피사체 위치는 그대로**. 결과는 원본 위에 50% 불투명도로 겹쳐(또는 difference 블렌드) 어긋남을 확인한다. 어긋나면 버린다.
> 무료 편집기: 브라우저 **Photopea**(설치 없음, PSD 저장 가능) 또는 **GIMP**. 아래 메뉴 이름은 Photopea 기준.

### 2-A. 야광 판 — 편집기에서 직접 만들기 (기본 방법, 생성 비용 0)

> 샷리스트 rules: 야광 판은 합성이 **검수 기준**이다. AI image-edit은 별 개수·위치를 바꾸거나 네온처럼 빛내기 쉬워 폴백으로만 쓴다.
> 목표 수치(8비트 0~255, 스포이트로 확인): **천장 바탕 6~10** (IRE 2~4) · **별 7개 중심 22~64, 별마다 다르게** (IRE 8~25) · 블룸은 별 크기의 1.5배 이내 · 레이·스파이크·플레어 **없음**.

#### K01g · C1 어둠 판 → `keyframes/K01g.png` (+ 작업 파일 `keyframes/K01g.psd`)
- 원본: `keyframes/K01d.png`
1. K01d를 연다. 레이어를 복제하고 이름을 `dark`로.
2. **노출 -5스톱**: `Image > Adjustments > Exposure` → Exposure **-5.0**. (GIMP: `Colors > Exposure` -5)
3. **약간 푸르게·채도 낮게**: `Hue/Saturation` 채도 **-60**, `Color Balance`(Midtones) 파랑 **+10**, 초록 **+3**. 앰버 기운이 남으면 채도를 더 낮춘다.
4. **스탠드 끄기**: 프레임 아래 스탠드의 전구·갓 안쪽 밝은 부분을 브러시(색 `#060708`, 부드러운 가장자리)로 칠해 꺼진 전구로. 벽·천장에 남은 앰버 그라데이션은 큰 부드러운 브러시(같은 색, 불투명도 30%)로 눌러 천장 바탕이 **6~10**이 되게.
5. **창빛 한 줄**: 새 레이어(블렌드 `Screen`), 색 `#7F93A8`, 2~3px 부드러운 브러시로 화분 잎·화분 가장자리 중 **창 쪽 윤곽만** 한 줄 긋는다. 불투명도 40~60%. (C7과 같은 판이므로 여기서 한 번만 만든다.)
6. **별 매트 7개**: `dark` 레이어 불투명도를 잠깐 30%로 내려 K01d의 별이 보이게 한다. 새 레이어 `stars`에서 펜 도구(또는 Polygon/Custom Shape 별)로 **K01d 별 7개의 윤곽을 그대로** 따라 그린다(위치·크기·각도 = K01d. 새로 배치하지 않는다). `dark` 불투명도를 100%로 되돌린다.
7. **발광 채우기**: 별마다 색 `#B9E3A8`(채도 낮은 연둣빛)를 채우되 밝기를 다르게 — 7개 각각의 중심 값이 대략 **64 / 54 / 46 / 38 / 32 / 26 / 22**가 되도록 별 레이어별 불투명도(또는 채움색 명도)로 맞춘다. 가장 밝은 별 = 책상 위 들린 별이 **아닌** 아무 별(크기가 큰 쪽), 가장 흐린 별 = 작은 별. 어느 별이 몇인지 `K01g.psd` 레이어 이름에 적어 둔다(`s1_64` … `s7_22`).
8. **소프트 블룸**: `stars` 레이어를 복제 → `Filter > Blur > Gaussian Blur` 반경 = 별 폭의 약 **1/4**, 블렌드 `Screen`, 불투명도 **35%**. 번짐이 별 크기의 1.5배를 넘으면 반경을 줄인다. Outer Glow·Lens Flare·Star 필터는 쓰지 않는다.
9. 전체에 그레인 소량(`Filter > Noise > Add Noise` 1~2%, Monochromatic)으로 그린 매트가 매끈해 보이지 않게.
10. 스포이트 확인: 천장 바탕 6~10, 별 중심 22~64. `K01g.psd` 저장 → `K01g.png` 내보내기.

#### K07g · C7 어둠 판 (별 8개) → `keyframes/K07g.png`
- 원본: `keyframes/K01g.psd` (+ 위치 기준 `keyframes/K07d.png` — §2-B에서 먼저 만든다)
1. `K01g.psd`를 열고 **다른 이름으로** `K07g.psd` 저장. 기존 레이어는 하나도 건드리지 않는다.
2. K07d.png를 맨 위에 붙여 불투명도 30% → 새 별의 윤곽을 새 레이어 `s8_new`에 따라 그리고, K07d 레이어는 삭제.
3. 채움색은 조금 더 초록·하얗게 `#C6F0B4`, 중심 값 = 가장 밝은 옛 별 × **1.4~1.6** → 약 **90~100**. 그 이상 금지(마법처럼 튐).
4. 블룸은 K01g와 같은 설정(복제 → 같은 반경 블러 → Screen 35%).
5. `K07g.png` 내보내기. **K01g.png와 difference 블렌드로 겹쳐 새 별 자리 외에 아무 차이가 없어야 한다.**

#### K04g · C4 빛나는 판 → `keyframes/K04g.png`
- 원본: `keyframes/K04.png` (K04는 이미 어두운 판이므로 노출 내림은 하지 않는다)
1. K04를 연다. 천장 바탕이 10보다 밝으면 Exposure로 6~10까지만 내린다(화분 창빛은 마스크로 보호).
2. K01g의 6~8단계와 같다: K04의 희미한 별 7개 윤곽을 그대로 따라 매트 → `#B9E3A8` 채움, 중심 값 **22~64 제각각** → 블룸(Screen 35%).
3. `K04g.png` 내보내기. K04와 겹쳤을 때 **별 자리 외에 차이 없음**. (C4에서는 K04g → K04 크로스페이드로 별이 동시에 고르게 흐려진다.)

#### 야광 판 폴백 — AI image-edit (편집기를 쓸 수 없을 때만, 판당 최대 2회)
- K01g: 원본 `K01d.png` 첨부
```
Keep the exact same composition, camera position and every object in place. Only change the light: the desk lamp is switched off and the room is almost completely dark; the seven plastic stars on the ceiling stay exactly where they are with the same shapes and sizes and emit a very faint pale green phosphorescent glow, each star a slightly different faint brightness, no halos, no rays, no sparkle; the ceiling is barely visible; a thin line of cool street light from the window touches only the edge of the potted plant. No ceiling fan, no ceiling light fixture, plain flat white ceiling, no stars outside the ceiling, no text.
```
- K07g: 원본 `K01g.png` 첨부
```
Keep the exact same image. Only change: add one more faint glowing plastic star right next to the star above the desk, in the same position as in the reference; this eighth star glows slightly brighter and greener than the seven old ones but is still soft and dim, no rays. Nothing else changes. No text.
```
- K04g: 원본 `K04.png` 첨부
```
Keep the exact same image, camera and every object in place. Only change: the seven ceiling stars, in exactly the same positions and shapes, glow faintly pale green, soft and dim, each slightly different in brightness, no rays, no halos. No ceiling fan, no ceiling light fixture, plain flat white ceiling, no text.
```
- 버릴 것(AI 야광 판 공통): 별이 네온처럼 밝음 / 별 개수·위치·모양이 원본과 다름 / 별자리 모양으로 재배치 / 창밖에 진짜 별하늘 / 천장 선풍기·조명기구 / 천장이 아니라 밤하늘처럼 보임 / 스탠드 전구가 아직 켜져 있음. **2회 실패하면 바로 편집기 방법으로.**

### 2-B. AI image-edit (6건)

#### K07d · C7 앰버 판 (새 별 +1) → `keyframes/K07d.png`
- 원본: `keyframes/K01d.png`
- 새 별 위치 = 책상 위 들렸던 별의 **바로 옆**(K06d의 옛 별/새 별 상대 위치와 같은 쪽).
```
Keep the exact same image, camera, lighting and every object in place. Only change: add one new small palm-sized plastic five-point star with rounded points on the ceiling right next to the star above the desk; the new star is clean pale greenish-white and crisp, clearly whiter than the old faded yellowish stars. The seven old stars stay exactly as they are. No ceiling fan, no ceiling light fixture, plain flat white ceiling, no text.
```
- 검사: K01d와 **difference 블렌드** → 새 별 자리 외에 차이가 보이면(벽 무늬·화분·스탠드 변화) 버리거나, **패치 합성**: 편집기에서 K01d 위에 AI 결과를 올리고 새 별 둘레만 남기는 마스크로 잘라 붙인다(이 방법이면 나머지 픽셀은 100% K01d).
- 버릴 것: 옛 별이 움직이거나 사라짐 / 새 별이 빛남·너무 큼 / 다른 곳에 별 추가

#### K02t · C2 가상 틸트용 세로 긴 판 (위로 아웃페인트) → `keyframes/K02t.png`
- 원본: `keyframes/K02a.png`
- 캔버스 1080 × 약 3600(위로 약 1700px 확장). 한 번에 안 되면 약 850px씩 두 번. 원본 K02a 영역은 그대로 둔다.
```
Extend the image upward into one tall continuous vertical frame, keeping the original image unchanged at the bottom: the white wall above the desk and window continues up to a plain flat white ceiling in bright neutral daylight; on the ceiling seven small palm-sized faded yellowish plastic five-point stars with rounded points at irregular positions and three different sizes, barely noticeable in daylight, edges discolored; one star directly above the desk and potted plant is peeling with one corner lifted. Same lens perspective, continuous lighting, no seam. No ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars, no text.
```
- 버릴 것: 이음새·선 / 창·커튼이 위에서 끊기거나 두 개가 됨 / 별 7개가 아님·별자리 배치 / 들린 별이 책상 위가 아님 / 천장 조명기구
- 아웃페인트 기능을 못 쓰면: `K02c`(천장 끝 프레임)를 K02a를 참조로 새로 만들고 C2를 영상 폴백으로 만든다(§3 폴백 C2)

#### K05m · C5 아침 판 (리라이트) → `keyframes/K05m.png`
- 원본: `keyframes/K05.png`
```
Keep the exact same composition, camera and every object in place, including the star on the soil and its tape. Only change the light: soft neutral morning daylight instead of blue dawn light. No text.
```
- 버릴 것: 별·흙 부스러기 위치 변화 / 잎 모양 변화 / 새잎·꽃

#### K06d · C6 마지막 홀드 + C6c 끝 프레임 → `keyframes/K06d.png`
- 원본: `keyframes/K03b.png`
```
Keep the same low angle looking straight up at the ceiling and the same star positions. Change: warm orange sunset light, no hand, no arm, no sleeve; the old faded yellowish star is pressed flat back in its place, and right next to it a new clean pale greenish-white palm-sized plastic five-point star with rounded points, the new one visibly whiter and crisper. No ceiling fan, no ceiling light fixture, no lamp on the ceiling, plain flat white ceiling, no constellation pattern, no stars outside the ceiling, no text.
```
- 한 번에 안 되면 두 단계로: ① 노을 + 손 제거 + 옛 별 평평하게 → ② 새 별 추가
- 버릴 것: 새 별이 옛 별과 같은 색 / 별이 빛남 / 옛 별 위치가 K03b와 달라짐 / 새 별이 K07d와 반대쪽

#### K06b · C6c 첫 프레임 → `keyframes/K06b.png`
- 원본: `keyframes/K06d.png`
```
Keep the exact same image, light and camera. Change: remove the new pale star so only the old faded star remains, and a man's hand enters from the bottom of the frame pressing the old star flat with his thumb, plain grey t-shirt sleeve at the frame edge. No text.
```
- 손이 이상하게 나오면 폴백: 원본을 `K03b.png`로 바꿔 "warm orange sunset light, the thumb presses the star flat" 리라이트로 만든다(K03b에는 이미 손이 있다).
- 버릴 것: 손가락 개수 이상 / 엄지가 별을 관통 / 별 위치가 K06d와 다름

#### K06s · C6 인서트 (시트에 별 하나 빠진 자리) → `keyframes/K06s.png`
- 원본: `keyframes/K06a.png`
- 먼저 편집기에서 별 시트 부분만 9:16으로 잘라 1080×1920으로 키운다(`K06s_crop.png`, 힉스필드 업스케일이 있으면 사용). 그 이미지를 첨부:
```
Keep the exact same image and light. Change: no hands; one star is missing from the sheet of pale greenish-white plastic glow stars, leaving an empty star-shaped gap in the backing sheet. Plain unmarked sheet, no text, no logo, no barcode.
```
- 버릴 것: 시트에 글자 / 빈자리가 별 모양이 아님 / 두 개 이상 빠짐

---

## 3. 영상 (image → video, 5개)

> 원칙: 카메라 움직임 1개 + 피사체 움직임 1개. 짧게. 추천: 미세한 움직임·질감 = **Kling**, 사람 동작 = **Seedance** (힉스필드에서 쓸 수 있는 것 기준). 생성은 5초 기본, 쓰는 길이만 편집에서 자른다.
> **모든 영상 공통 — 버릴 것(reject if…)**
> - 손가락이 6개 이상·뭉개짐·붙음, 손톱이 별을 관통
> - 테이프·봉투·시트·상자에 글자·로고·인쇄가 생김
> - 별이 네온처럼 빛나거나 레이·플레어·반짝임이 생김
> - 손이 닿지 않은 별이 움직임·미끄러짐·깜빡임·늘어남
> - 별이 별자리·하트·글자 모양으로 재배치됨
> - 천장 선풍기·조명기구가 나타남
> - 얼굴이 보임(C3a는 검은 실루엣까지만 허용)
> - 컷 안에서 시간대 빛이 바뀜

### C3a · 실루엣 올라섬 (사용 1.5s) → `clips/C3a.mp4`
- 첫 프레임: `K03a` · 생성 5s → 1.5s 사용 · 추천: **Seedance** (사람 동작)
```
Static camera. Backlit by the bright window, he steps up onto the wooden desk chair in one motion and straightens up, one arm rising toward the ceiling; his face stays completely dark in silhouette. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `visible face, turning to camera, lit face`
- 추가로 버릴 것: 돌아서서 얼굴이 밝아짐 / 의자가 흔들려 넘어질 듯 보임(위험 연출)

### C3b · 별 떼기 (사용 1.5s) → `clips/C3b.mp4`
- 첫 프레임: `K03b` · 생성 5s → 1.5s 사용 · 추천: **Kling**
- C3④는 이 클립을 **역재생**해 재사용한다(§4). 그러니 별이 떨어지는 동안 별 모양이 유지되어야 한다.
```
Static low-angle camera looking straight up. The thumbnail slides under the lifted corner of the faded plastic star and slowly peels it off the ceiling, the star comes away between his fingers. The other stars on the ceiling stay perfectly still. No ceiling fan, no ceiling light fixture, plain flat white ceiling. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 별이 휘거나 찢어짐(플라스틱이다) / 천장 페인트가 크게 뜯김

### C5 · 별 집어 올리기 (사용 3.0s) → `clips/C5.mp4`
- 첫 프레임: `K05m` · 생성 5s → 3.0s 사용 · 추천: **Kling** (흙·질감)
```
Very slow push-in. Two fingers enter from above, pick up the face-down plastic star from the soil and lift it out of the frame, a few soil crumbs fall from it back onto the soil. The plant stays still. vertical 9:16, shot on a mirrorless camera, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 집는 순간 별 형태 붕괴 / 흙이 튀거나 거꾸로 떨어짐 / 잎이 크게 흔들림
- 실패 대비: 집어 들기 직전에서 자르고 C6 첫 프레임으로 연결(샷리스트 대응안)

### C6a · 옛 별 뒷면에 테이프 한 겹 더 (사용 3.0s) → `clips/C6a.mp4`
- 첫 프레임: `K06a` · 생성 5s → 3.0s 사용 · 추천: **Kling**
```
Nearly static high-angle camera. The two hands lower the torn strip of clear tape and press it flat across the back of the old star, over the old layers of tape, then one thumb smooths it once. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 투명 테이프가 사라지거나 손가락을 관통 / 봉투·시트에 글자 / 새 시트의 별이 움직임

### C6c · 옛 별 누르고 그 옆에 새 별 (사용 3.5s) → `clips/C6c.mp4`
- 첫 프레임: `K06b` · 끝 프레임: `K06d` · 생성 5s → 3.5s 사용 · 추천: **Kling (첫/끝 프레임)**
```
Static low-angle camera looking straight up at the ceiling in warm sunset light. The thumb presses the old star flat and the hand moves away, then the hand comes back holding a new pale star and presses it onto the ceiling right next to the old one, and leaves the frame. The other stars stay still. No ceiling fan, no ceiling light fixture, plain flat white ceiling. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가로 버릴 것: 새 별이 손 없이 저절로 나타남(마법) / 끝 위치가 K06d와 다름 / 별이 빛남
- 2회 실패 시 2분할(폴백 아래 C6c1·C6c2)

### 폴백 영상 (실패할 때만)

**C3d · 별 다시 붙이기** (C3b 역재생이 부자연스러울 때) → `clips/C3d.mp4` · 첫 프레임 `K03b` · 1.5s 사용 · Kling
```
Static low-angle camera looking straight up. The fingers press the faded plastic star back onto its spot on the ceiling and the thumb holds it flat for a moment. The other stars stay still. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

**C2 · 틸트 업** (K02t 가상 틸트가 납작해 보이거나 아웃페인트를 못 쓸 때) → `clips/C2.mp4` · 첫 프레임 `K02a` · 끝 프레임 `K02t` 맨 위 1080×1920 잘라낸 `keyframes/K02top.png`(또는 `K02c`) · 5.5s 사용 · Kling (첫/끝 프레임)
```
Slow smooth tilt up from the plain moving boxes on the floor, past the desk and the window, to the plain flat white ceiling with the faded plastic stars. Nothing in the room moves. No ceiling fan, no ceiling light fixture. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- `K02c`가 필요할 때(아웃페인트 불가): `K02a`를 참조로 첨부해 새로 생성 → `keyframes/K02c.png`
```
Bright neutral daylight, the same small studio apartment, camera tilted up from the desk: the top of the window with sheer white curtains at the bottom of the frame, the white wall rising to a plain flat white ceiling that fills the upper two thirds, seven small palm-sized faded yellowish plastic five-point stars with rounded points at irregular positions and three different sizes, barely noticeable in daylight, one star directly above the desk peeling with one corner lifted, no ceiling fan, no ceiling light fixture, no lamp on the ceiling, no smoke detector, plain flat white ceiling, no constellation pattern, no moon, no planets, no stars outside the ceiling, no window sky stars, vertical 9:16, shot on a mirrorless camera, 35mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

**C6c1 + C6c2 · 2분할** (C6c 2회 실패 시)
- C6c1 옛 별 누르기 = **C3④ 클립(C3b 역재생 또는 C3d)을 노을 그레이딩**해 재사용. 생성 없음.
- C6c2 새 별 누르기 → `clips/C6c2.mp4` · 첫 프레임 `K06d` · 2s 사용 · Kling
```
Static low-angle camera looking straight up in warm sunset light. A hand enters from below and the thumb presses the new pale star firmly onto the ceiling next to the old one, then the hand leaves the frame. The stars do not move. No ceiling fan, no ceiling light fixture, plain flat white ceiling. vertical 9:16, shot on a mirrorless camera, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```

---

## 4. 편집 조립 메모 (editor 담당 — 영상 생성 없는 부분)

> 24fps 기준. 시간은 각 컷 안의 시간(script.md 비트 시트 C1 0–3.5s, C4 16–23s, C7 38–44.5s).
> 노출 램프는 **화면 전체에 하나의 커브**만. 별마다 다른 마스크·키프레임 금지. 램프가 끝난 뒤 별은 깜빡이거나 밝아지지 않는다.

### C1 · 훅 (3.5s = 84프레임) — 소스 `K01d`, `K01g`
| 시간 | 프레임 | 화면 | 처리 |
|---|---|---|---|
| 0.0–0.6s | 0–13 | `K01d` 앰버 판 스틸 | 움직임 없음(고정) |
| 0.6s | 14 | — | **하드컷** + 스탠드 '딸깍' SFX |
| 0.6–1.0s | 14–23 | 순검정 | 0.4s (10프레임, 그 이상 늘리지 않는다) |
| 1.0–2.5s | 24–59 | `K01g` + 노출 램프 | 아래 커브 |
| 2.5–3.5s | 60–83 | `K01g` 그대로 | 정지 홀드(커브 = 원본) |

**노출 램프 커브 (Levels의 입력 블랙 포인트 1개만 키프레임, 입력 화이트 255·감마 1.0 고정, 8비트 0~255 기준)**

| 컷 안 시간 | 입력 블랙 포인트 | 화면에서 일어나는 일 |
|---|---|---|
| 1.0s | 72 | 모든 값이 72 미만 → 아직 완전한 검정(순검정과 이음새 없음) |
| 1.3s | 60 | 가장 밝은 별(64)이 막 문턱을 넘어 나타남 |
| 2.3s | 22 | 가장 흐린 별(22)이 마지막으로 나타남 — 7개 모두 |
| 2.5s | 0 | 천장 바탕(6~10)까지 드러나며 원본 판과 같아짐 → 끝 |

- 키프레임 사이 보간은 선형. DaVinci는 Lift/Offset, Premiere는 Levels/Lumetri 커브, ffmpeg는 `curves`/`colorlevels`로 같은 값을 재현한다.
- 판을 AI 폴백으로 만들어 별 값이 22~64가 아니면: 스포이트로 **가장 밝은 별·가장 흐린 별** 값을 재고, 1.3s 키 = 가장 밝은 별 값 − 4, 2.3s 키 = 가장 흐린 별 값으로 바꾼다. 1.0s 키는 가장 밝은 별 값 + 8.
- 이 램프 키프레임 4개를 **프리셋으로 저장**한다(C7에서 그대로 복사).

### C7 · 엔딩/루프 (6.5s = 156프레임) — 소스 `K07d`, `K07g`
| 시간 | 화면 | 처리 |
|---|---|---|
| 0.0–1.0s | `K07d` 앰버 판(별 8개, 새 별이 하얗게) | 고정 |
| 1.0s | — | 하드컷 + '딸깍' |
| 1.0–1.4s | 순검정 | 0.4s (10프레임) |
| 1.4–2.9s | `K07g` + **C1 프리셋 복사**(키 시간만 +0.4s: 1.4s=72, 1.7s=60, 2.7s=22, 2.9s=0) | 새 별(약 90~100)은 램프 시작부터 가장 먼저 보이고, 옛 일곱 개가 C1과 같은 순서로 따라온다 |
| 2.9–6.5s | `K07g` 홀드 | 화분 창빛 한 줄은 판에 들어 있음 |
- 루프 검사: K07d ↔ K01d, K07g ↔ K01g를 difference 블렌드 → 새 별 외 차이 0. 그레인·LUT·비네팅은 `pipeline/finish.sh`로 전 컷 동일.
- 그 뒤 END(검은 화면, `Someone needed stars here before I did.`, 0.3s 페이드 인, 2.5s 이상 유지) → C1로 루프. C7 끝·C1 시작 모두 '딸깍' 직전 앰버라 이음새가 자연스럽다.

### C4 · 시간 경과 (7.0s) — 소스 `K04`, `K04g`, `K04c`
| 시간 | 화면 | 처리 |
|---|---|---|
| 0.0–0.5s | `K04c` | 숫자 `11:41 PM` 합성(화면 중앙), 무음 |
| 0.5–3.3s | `K04g` → `K04` | 0.5–3.0s 크로스페이드 2.5s(별 7개가 **동시에 고르게** 흐려짐), 3.0–3.3s K04 홀드 |
| 3.3–3.8s | `K04c` | 숫자 `12:03 AM` 합성, 무음 |
| 3.8–7.0s | 다른 밤: `K04g` → `K04` | 3.8–4.8s 시계 판에서 K04g로 디졸브 1s, 4.8–7.0s K04g → K04 크로스페이드 2.2s(컷 끝에서 거의 꺼짐). 둘째 밤은 **3% 리프레임(103% 확대·살짝 이동) + 커튼 쪽을 조금 더 차갑게** 그레이딩해 다른 밤으로 읽히게 |
- 시계 째깍·알람음 없음. 먼 차 소리 1회.
- 화분이 크롭 후에도 y ≤ 1340px 인지 확인.

### 나머지 생성 없는 부분 (참고)
| 컷 | 소스 | 처리 |
|---|---|---|
| C2 (5.5s) | `K02t` | 아래→위 가상 틸트: 1080×1920 창을 K02t 맨 아래에서 맨 위까지 이동(이즈 인/아웃), 스케일 102→100%. 시계는 지나가기만(숫자 합성 없음) |
| C3③ (2.5s) | `K03c` | 컷 온 액션으로 진입, 푸시인 100→104%, 마지막 1s 정지 |
| C3④ (1.5s) | `C3b.mp4` 역재생 | 별이 제자리로 돌아감 + 마지막 6프레임 정지(엄지 누름). 부자연스러우면 `C3d.mp4` |
| C5 0–3s | `K05` → `K05m` | 크로스페이드 3s + 푸시인 100→103%. 3–6s는 `C5.mp4` |
| C6 3–4s | `K06s` | 1s 스틸 인서트 |
| C6 7.5–9s | `K06d` | 1.5s 홀드(손 빠진 뒤) — `C6c.mp4` 끝 프레임과 같은 판 |

---

## 대표 결정 사항 (생성 전에 정할 것)

1. **K03c 실물 매크로 대체 허용 여부** — 겹겹 테이프 매크로가 이 편의 전환 정보다. AI가 5회 안에 못 만들면 실물(야광별 1개 + 투명·종이·반투명 테이프 3종, 폰 매크로)로 1컷 찍는 것을 허용할지. 가장 싸고 확실하지만 이 컷만 실사 촬영이 된다(합성 콘텐츠 표시는 어차피 켠다).
2. **힉스필드 기능 확인** — (a) Kling 첫/끝 프레임: C6c에 필요(없으면 처음부터 2분할), (b) 아웃페인트/캔버스 확장: K02t에 필요(없으면 K02c + C2 영상 폴백, 생성 +2).
3. **렌즈 표기 치환** — ep01 결정 사항 1번과 같은 방식(접미사의 렌즈만 컷별 렌즈로 교체)을 이 편에도 적용했다. ep01에서 '글자 그대로 유지'로 정했다면 K02a·K03b·K03c·K04c·K05 블록의 렌즈를 `35mm lens, f/1.8`로 되돌린다.
