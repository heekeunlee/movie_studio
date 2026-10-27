# ep01 — call mom. · 프롬프트 (촬영감독)

- 기준: `shotlist.json` (9컷 · 49.5s) / `bible/style.md` · `character.md` · `room.md` · `banned.md` / `check.md` (PASS 조건)
- 1단계(반자동): 아래 코드 블록을 **그대로 복사**해 힉스필드 웹에 붙인다. 블록 안 문장은 고치지 않는다.
- 결과물 저장 위치: `episodes/ep01/keyframes/`, `episodes/ep01/clips/` (기준 이미지만 `assets/library/`)

---

## 생성 순서 체크리스트 (위에서부터 차례로)

| # | 단계 | 개수 | 파일 | 통과 조건 |
|---|---|---|---|---|
| 1 | 기준 이미지 | 2 | `assets/library/ref-character.png`, `ref-room.png` | 대표 확인 후 **고정**. 이후 교체 금지 |
| 2 | 마스터 키프레임 (신규 구도) | 10 | `keyframes/K01, K02, K03, K04, K04c, K05a, K05b, K06, K07b, K07c .png` | 각 블록의 "버릴 것" 통과 |
| 3 | 편집 변형 (같은 구도, 원본에서 image-edit) | 4 | `keyframes/K01d, K01n, K04s, K04n .png` | 원본 위에 50% 겹쳐 구도 어긋남 없음 |
| 4 | 영상 (image→video) | 9 | `clips/C1, C2, C3, C5a, C5b, C6, C7a, C7b, C7c .mp4` | 각 블록의 "버릴 것" 통과 |
| 5 | 영상 생성 안 함 | — | C4(스틸 3장 디졸브), 시계 인서트 3회(K04c 스틸), C8(K01n 스틸), END(카드) | 편집 담당 처리 |

- 합계: **이미지 16장**(기준 2 + 신규 10 + 편집 변형 4) · **영상 9개**
- 순서 이유: 기준 이미지 → 마스터 → 변형 → 영상. 변형은 마스터가 확정돼야 만들 수 있고, 영상은 첫/끝 프레임 이미지가 확정돼야 만든다.
- 2단계 안에서는 **K01 → K04 → K06 → K07b**를 먼저 만든다(재사용이 많거나 위험이 큰 순서). 나머지는 순서 상관없음.
- 재시도 예상(평균 2.5회): 이미지 약 40회, 영상 약 23회.

## 모든 블록 공통

**표준 접미사** (style.md — 모든 이미지·영상 프롬프트 끝에 이미 붙어 있음):
```
vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 샷리스트 렌즈가 35mm가 아닌 컷(K02·K06·K07c = 50mm, K04 = 24mm f/2.8, K04c = 매크로)은 접미사의 `35mm lens, f/1.8` 부분**만** 그 렌즈로 바꿨다. 한 프롬프트 안에 렌즈가 두 개 들어가면 모델이 헷갈리기 때문이다. → 아래 "대표 결정 사항" 1번

**공통 네거티브** (네거티브 칸이 있는 모델이면 붙인다. 컷별 추가분은 각 블록에 있음):
```
text, letters, numbers, readable UI, app icons, notifications, watermark, logo, brand name, extra fingers, missing fingers, fused fingers, deformed hands, warped phone, cartoon, CGI, 3d render, oversaturated
```

**화면 안전 영역** (모든 키프레임 공통): 폰·핵심 피사체는 화면 **상단~중앙**에 둔다. **하단 25%와 우측 15%**는 비운다(플랫폼 UI 영역). 프롬프트에 이미 넣어 두었다. 결과물에서 다시 확인한다.

**모든 폰**은 켜져 있지만 아무것도 없는 어두운 화면으로 만든다. 뒷면은 로고 없는 무지 검정이다. 화면 글자(mom, 문자, 통화 기록, 시각, 통화 시간)는 **전부 편집에서 코너핀으로 합성**한다.

---

## 0. 기준 이미지 (가장 먼저 만들고 고정)

### REF-1 · 주인공 → `assets/library/ref-character.png`
- 참조 이미지: 없음 (이 이미지가 앞으로의 기준이 된다)
- 4장 정도 뽑아 1장을 고른다. **실존 배우·유명인과 닮았으면 버린다** (character.md)
```
Portrait of a man in his mid-20s, short messy dark hair, tired eyes, plain grey t-shirt with no print or logo, natural skin texture with slight imperfections, neutral expression, chest-up framing, plain softly lit room background, soft window light, realistic photo, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 유명인과 닮음 / 모델처럼 매끈한 피부 / 티셔츠 프린트·로고 / 웃는 얼굴

### REF-2 · 방 → `assets/library/ref-room.png`
- 참조 이미지: 없음
```
Small apartment studio room, wooden desk by a window with sheer white curtains, open unbranded laptop with no logo, small digital desk clock with a blank unlit display, small potted plant on the desk, single bed with grey sheets, warm desk lamp, lived-in and slightly messy, bright neutral daylight, realistic photo, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: **벽시계·천장 선풍기**(banned 조합) / 노트북 로고 / 시계에 읽히는 숫자 / 화분이나 탁상 시계가 없음 / 책상과 침대가 한 프레임에 안 들어옴

---

## 1. 키프레임 (이미지)

> 참조 이미지 원칙: 손·사물만 나오는 컷 = `ref-room`만 첨부. 사람 몸이 보이는 컷 = `ref-character` + `ref-room`. **C5b(K05b)에는 ref-character를 넣지 않는다**(얼굴이 생성되는 것을 막기 위해).

### K01 · C1 훅 (낮, 탑샷, 폰 화면 위) → `keyframes/K01.png`
- 참조: `ref-room`
- **루프 기준 구도**다. K01d·K01n이 모두 이 이미지에서 나온다. 먼저 확정한다.
```
Top-down close-up of a wooden desk by a window, a plain black smartphone with no logo lying face up in the upper-center of the frame, its screen lit as a plain dark blank screen with nothing on it, the edge of an open unbranded laptop at the side, a small potted plant with dry cracked soil and drooping leaves partially in the top-left corner, bright neutral daylight from frame left, bottom quarter of the frame is empty desk surface, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `hands, person`
- 버릴 것: 화면에 아이콘·글자·시계 / 폰이 하단 25%나 우측 15%에 걸침 / 흙이 젖어 보임

### K02 · C2 (낮, 타이핑 손 + 엎어진 폰) → `keyframes/K02.png`
- 참조: `ref-room`
```
High-angle close-up of a young man's hands typing on an unbranded laptop keyboard in the lower-center-left, a plain black smartphone lying face down on the wooden desk in the upper-left with a faint cool glow leaking from its edges, focus on the phone, the hands slightly soft, grey t-shirt sleeve edge, bright neutral daylight, vertical 9:16, shot on Canon R50, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 손가락 개수 이상 / 키캡에 읽히는 글자 / 폰 뒷면 로고

### K03 · C3 (늦은 오후, 어깨 너머 폰) → `keyframes/K03.png`
- 참조: `ref-character` + `ref-room`
```
Over-the-shoulder medium close-up from behind a young man in a plain grey t-shirt with short messy dark hair, his hand holding a plain black smartphone at chest height in the upper-center of the frame, screen angled toward camera and lit as a plain dark blank screen, thumb resting at the lower edge of the screen, a small potted plant with dry cracked soil and drooping leaves at the left frame edge, wooden desk, late afternoon neutral light, face not visible, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `face, eyes`
- 버릴 것: 화면이 정면이 아니라 코너핀 합성이 어려움 / 화면 위 내용 / 얼굴이 보임

### K04 · C4 마스터 (낮, 고정 와이드) → `keyframes/K04.png`
- 참조: `ref-character` + `ref-room`
- K04s·K04n의 원본이다. **사람·폰·시계·화분의 위치가 이후 그대로 고정된다.**
```
Locked-off medium wide shot of a small apartment room, wooden desk by a window with sheer white curtains, a young man in a plain grey t-shirt with short messy dark hair seen from behind and slightly to the side working at an unbranded laptop, a plain black smartphone lying face down on the desk, a small digital desk clock with an unreadable dim display and a small potted plant with drooping leaves in the upper-middle of the frame, bright neutral daylight, lower quarter of the frame is floor and desk legs, vertical 9:16, shot on Canon R50, 24mm lens, f/2.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `face, wall clock, ceiling fan`
- 버릴 것: 시계에 읽히는 숫자(편집에서 블러 가능하면 통과) / 벽시계·천장 선풍기 / 얼굴이 보임 / 사무실처럼 보임(모니터 여러 대, 파티션)

### K04c · 시계 인서트 (C4 ×2 + C6 ×1) → `keyframes/K04c.png`
- 참조: `ref-room`
- 1장만 만들고 낮/노을/밤 색은 편집 그레이드로 맞춘다. 숫자(2:14 PM / 6:40 PM / 11:52 PM)는 합성한다. 초 표시는 없다.
```
Macro close-up of a small minimalist digital desk clock on a wooden desk, its display panel softly lit but completely blank with no digits, display in the upper-center of the frame, potted plant leaves blurred in the background, neutral light, vertical 9:16, shot on Canon R50, macro lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `digits, numbers, analog clock hands, brand name`
- 버릴 것: 숫자가 나옴 / 아날로그 시계 / 브랜드 각인

### K05a · C5a (밤, 노트북 덮기) → `keyframes/K05a.png`
- 참조: `ref-room`
```
Night, close-up of a young man's hand resting on the top edge of an open unbranded laptop lid on a wooden desk, about to close it, cool laptop glow on the hand, warm amber desk lamp light, dark room, subject in the upper-center of the frame, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 노트북 화면 내용·로고 / 손가락 이상

### K05b · C5b (밤, 침대, 화면빛은 손에만) → `keyframes/K05b.png`
- 참조: `ref-room` **만** (ref-character 넣지 않음)
- check.md 조건: **눈·얼굴 클로즈업 절대 금지.** 화면빛은 손에만 닿는다.
```
Night, dark room, top-down medium close-up of a young man lying on a bed with grey sheets, framed from the chest down, plain grey t-shirt, two hands holding a plain black smartphone above the chest in the upper-center of the frame, the screen facing away from camera, cool blue screen light falling only on the hands and fingers, everything else in deep shadow, head and face completely out of frame, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `face, eyes, chin, mouth, head, lit face`
- 버릴 것: **얼굴·턱·눈이 조금이라도 보임** / 푸른빛이 가슴이나 얼굴까지 넓게 퍼짐 / 손가락 이상

### K06 · C6 + C7a (밤, 폰 익스트림 클로즈업) → `keyframes/K06.png`
- 참조: `ref-room`
- C6과 C7a 두 영상의 첫 프레임으로 쓴다.
```
Night, extreme close-up of a plain black smartphone held in one hand, the lit screen is a plain dark blank screen with nothing on it, filling the upper-center of the frame, the thumb resting just below the screen at its lower edge, cool screen glow on the thumb, background dark and out of focus, vertical 9:16, shot on Canon R50, 50mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 화면 위 내용·아이콘 / 엄지가 화면 가운데를 가림(합성할 통화 기록 행 위치) / 손가락 이상

### K07b · C7b (밤, 옆모습 1.5초 — 이 편의 유일한 얼굴) → `keyframes/K07b.png`
- 참조: `ref-character` + `ref-room`
```
Night, profile medium close-up of a man in his mid-20s with short messy dark hair in a plain grey t-shirt, sitting on the edge of a wooden desk, a plain black smartphone held to his ear, face half in shadow, warm amber desk lamp light from behind creating a soft rim, head placed in the upper third of the frame, quiet exhale, vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `frontal face, eye close-up, bright face, tears`
- 버릴 것: ref-character와 다른 사람 / **실존 인물 닮음** / 정면 얼굴 / 얼굴이 밝게 다 보임

### K07c · C7c (밤, 화분에 물 붓기) → `keyframes/K07c.png`
- 참조: `ref-room`
- 흙은 **아직 마른 상태**로 만든다. 젖는 과정은 영상이 만든다. K01n의 젖은 흙 색은 이 영상의 마지막 프레임에 맞춘다.
```
Night, close-up of a young man's hand tilting a clear glass cup over a small potted plant on a wooden desk, a thin stream of water just starting to fall onto dry cracked soil, drooping leaves, warm amber desk lamp light, pot in the upper-center of the frame, vertical 9:16, shot on Canon R50, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 컵 로고·무늬 / 물이 이미 흙을 다 적심 / 손가락 이상

---

## 2. 편집 변형 (image-edit — 원본을 첨부하고 바뀌는 점만 지시)

> 원칙: 원본 이미지를 첨부하고 **구도·피사체 위치·렌즈는 그대로** 둔다. 결과는 원본 위에 50% 불투명도로 겹쳐 어긋남을 확인한다. 어긋나면 버린다.

### K01d · C1 끝 프레임 (폰 엎어짐) → `keyframes/K01d.png`
- 원본: `keyframes/K01.png`
- C1 영상의 **끝 프레임**으로 쓴다(손이 폰을 뒤집는 동작을 안정시키기 위해). 샷리스트에는 따로 이름이 없던 키프레임이라 새로 추가했다. → "대표 결정 사항" 2번
```
Keep the exact same composition, camera angle, lighting and every object in place. Only change: the smartphone is now lying face down in the same position, showing its plain black back with no logo, screen not visible. No hands. Plant soil stays dry and cracked.
```

### K01n · C8 (밤, 루프 컷) → `keyframes/K01n.png`
- 원본: `keyframes/K01.png`
```
Keep the exact same composition, camera angle and every object in place. Change the time to night: the room is dark, lit only by a warm amber desk lamp from frame left, the phone stays face up with its screen lit as a plain dark blank screen glowing softly, the potted plant soil is now dark and wet, leaves still slightly drooping. No hands, no text.
```
- 버릴 것: 폰·화분·노트북 위치가 K01과 어긋남(루프가 튐) / 잎이 확 살아남(과장) / 화면 내용

### K04s · C4 노을 → `keyframes/K04s.png`
- 원본: `keyframes/K04.png`
```
Keep the exact same composition, camera angle, person pose and every object in place. Only change the light: warm orange sunset light coming through the sheer white curtains, long soft shadows, the drooping plant leaves catching the sunset light.
```

### K04n · C4 밤 → `keyframes/K04n.png`
- 원본: `keyframes/K04.png`
```
Keep the exact same composition, camera angle, person pose and every object in place. Only change the light: night, the window is dark, the room is lit only by a warm amber desk lamp and the cool blue glow of the laptop screen on the person. The phone stays face down.
```
- 버릴 것(K04s·K04n 공통): 사람 자세·폰·시계 위치가 바뀜 / 시계에 숫자가 생김 / 얼굴이 돌아봄

---

## 3. 영상 (image → video)

> 원칙: 카메라 움직임 1개 + 피사체 움직임 1개. 짧게 쓴다. 추천 모델: 미세한 움직임·질감 = **Kling**, 사람 동작 = **Seedance** (힉스필드에서 쓸 수 있는 것 기준). 첫/끝 프레임을 지정해야 하는 컷은 그 기능이 있는 모델을 쓴다.
> 생성 길이는 5초가 기본이다. 사용 길이보다 길면 편집에서 자른다.
> 모든 영상 공통으로 버릴 것: 화면에 글자·아이콘이 생김 / 손가락 개수 변화 / 폰이 휘거나 녹음 / 로고 등장 / 컷 안에서 조명 시간대가 바뀜

### C1 · 훅 (사용 3.0s) → `clips/C1.mp4`
- 첫 프레임: `K01` · 끝 프레임: `K01d` · 생성 5s → 앞 3.0s 사용 · 추천: Kling (첫/끝 프레임)
```
Static top-down camera. The phone vibrates on the wooden desk, then a hand enters from the top of the frame and flips the phone face down in one quick motion without looking, and the hand leaves the frame. The phone keeps buzzing face down. vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 손가락 6개 이상 / 뒤집는 동안 폰 모양 변형 / 손이 프레임 하단에서 들어옴 / 화면에 내용 생김
- 실패 대비: 뒤집기가 계속 깨지면 뒤집은 직후부터 쓰고 진동음으로 처리한다(샷리스트 대응안)

### C2 · 타이핑 (사용 5.0s) → `clips/C2.mp4`
- 첫 프레임: `K02` · 생성 5s · 추천: Kling
```
Very slow push-in. The hands keep typing steadily on the keyboard without stopping, while the face-down phone vibrates and a faint cool glow pulses from its edges. vertical 9:16, shot on Canon R50, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 손가락 뭉개짐(초점 밖이면 허용) / 폰이 저절로 뒤집힘 / 빛이 화면처럼 밝게 터짐

### C3 · 문자 (사용 7.0s) → `clips/C3.mp4`
- 첫 프레임: `K03` · 생성 10s(안 되면 5s 2개) → 7.0s 사용 · 추천: Kling
```
Nearly static over-the-shoulder camera. The phone stays almost still in his hand while the thumb makes small taps at the bottom of the blank screen, he pauses as if reading, then lowers the phone and sets it face down on the desk. vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 화면에 문자·키보드 UI가 생김 / 폰이 크게 흔들려 코너핀 트래킹 불가 / 얼굴이 보임
- 실패 대비: 내려놓는 부분이 깨지면 그 전에 잘라 C4로 넘긴다

### C5a · 노트북 덮기 (사용 2.5s) → `clips/C5a.mp4`
- 첫 프레임: `K05a` · 생성 5s → 2.5s 사용 · 추천: Kling
```
Static camera. The hand closes the laptop lid in one smooth motion and the cool laptop light disappears, leaving only the warm amber lamp. vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 뚜껑이 휘거나 관통함 / 덮은 뒤에도 빛이 남음

### C5b · 침대 스크롤 (사용 5.5s) → `clips/C5b.mp4`
- 첫 프레임: `K05b` · 생성 10s → 5.5s 사용(또는 5s를 0.9배속) · 추천: Kling
```
Slight handheld drift. The thumb slowly scrolls on the phone, cool blue screen light flickers softly on the hands only, the rest of the body stays in darkness. vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `face, eyes, head, lit face`
- 버릴 것: **얼굴·눈·턱이 프레임에 들어옴(check.md 위반 → 무조건 폐기)** / 카메라가 위로 틸트 / 화면이 카메라 쪽으로 돌아감

### C6 · 엄지 멈춤 (사용 3.0s + 시계 인서트 1.0s) → `clips/C6.mp4`
- 첫 프레임: `K06` · 생성 5s → 3.0s 사용 · 추천: Kling
- 시계 인서트 1.0s는 `K04c` 스틸을 밤 그레이드로 쓴다. 영상으로 만들지 않는다.
```
Micro handheld, nearly still. The thumb drifts slowly up toward the screen, stops just below its lower edge and hesitates without touching. vertical 9:16, shot on Canon R50, 50mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 화면에 통화 기록·아이콘 생김 / 엄지가 화면 가운데를 가림 / 폰이 크게 움직임

### C7a · 누르기 (사용 2.5s) → `clips/C7a.mp4`
- 첫 프레임: `K06` (재사용, 이미지 새로 만들지 않음) · 생성 5s → 2.5s 사용 · 추천: Kling
```
Micro handheld, nearly still. The thumb moves onto the lower part of the blank screen and taps once, then lifts away. The phone stays still. vertical 9:16, shot on Canon R50, 50mm lens, f/2, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 화면 색·밝기가 갑자기 바뀜(합성할 calling... → 00:01과 충돌) / 폰이 크게 흔들림

### C7b · 옆모습 (사용 1.5s) → `clips/C7b.mp4`
- 첫 프레임: `K07b` · 생성 5s → 1.5s 사용 · 추천: Seedance (사람)
```
Static camera. He holds the phone to his ear and lets out one short quiet exhale, shoulders lowering slightly, face stays half in shadow. vertical 9:16, shot on Canon R50, 35mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 추가 네거티브: `talking, smiling widely, crying, turning to camera`
- 버릴 것: 얼굴이 ref-character와 달라짐 / 카메라를 봄 / 입이 말하듯 움직임(대사 없음) / 얼굴이 밝아짐

### C7c · 물 주기 (사용 4.0s) → `clips/C7c.mp4`
- 첫 프레임: `K07c` · 생성 5s → 4.0s 사용 · 추천: Kling (물·흙 질감)
```
Static close-up. Water pours slowly from the glass onto the dry cracked soil and the soil darkens as it soaks the water in. vertical 9:16, shot on Canon R50, 50mm lens, f/1.8, shallow depth of field, natural light, muted colors, subtle handheld movement, film grain, photorealistic, no text
```
- 버릴 것: 물 흐름이 끊기거나 거꾸로 흐름 / 화분이 넘침 / 잎이 갑자기 살아남(과장 금지)
- 실패 대비: 흙이 물을 빨아들이는 마지막 1.5s만 쓴다

---

## 4. 영상 생성 없는 컷 (편집 담당 참고)

| 컷 | 소스 | 처리 |
|---|---|---|
| C4 (8.0s) | `K04` → `K04s` → `K04n` + `K04c` ×2 | 크로스 디졸브와 아주 느린 푸시인. 시계 인서트 0.5s ×2(2:14 PM 낮 그레이드, 6:40 PM 노을 그레이드). 째깍 SFX 없음 |
| C6 시계 (1.0s) | `K04c` | 밤 그레이드, 11:52 PM 합성. **이 편의 세 번째이자 마지막 시계 인서트** |
| C8 (3.5s) | `K01n` | 스틸에 편집으로 미세 핸드헬드와 그레인. 화면에 mom / 04:12 → 04:15 합성. 끝 프레임 ↔ C1 첫 프레임 루프 |
| END (3.0s) | — | 검은 화면 카드 `She was never too busy for you.` |

---

## 대표 결정 사항 (생성 전에 정할 것)

1. **렌즈 표기 치환** — 35mm가 아닌 컷(K02·K06·K07c 50mm, K04 24mm f/2.8, K04c 매크로)은 접미사 안의 렌즈만 바꿨다. 접미사를 글자 그대로 유지해야 한다면 해당 블록의 렌즈 부분을 `35mm lens, f/1.8`로 되돌린다.
2. **K01d 추가** — C1 뒤집기 영상의 끝 프레임용 편집 변형 1장을 새로 넣었다(샷리스트 요약의 13장 → 14장, 기준 이미지 포함 16장). 빼면 C1은 첫 프레임만으로 생성한다. 이 경우 실패 확률이 올라간다.
3. **접미사의 "Canon R50"** — 프롬프트에서 브랜드를 빼라는 원칙과 bible 표준 접미사가 겹친다. 화면에 나오지 않는 촬영 기기 표기라 bible 그대로 유지했다. 빼려면 `shot on a mirrorless camera`로 바꾼다.
4. **기준 이미지 확정** — ref-character의 실존 인물 닮음 검사와 ref-room에 벽시계·선풍기가 없는지 확인한다. 이 두 장이 확정되기 전에는 다음 단계를 시작하지 않는다.
5. **사용할 영상 모델** — 힉스필드 요금제에서 Kling 첫/끝 프레임 기능과 Seedance를 쓸 수 있는지 확인한다. 안 되면 C1은 2번의 대체 방식(첫 프레임만)으로 만든다.
