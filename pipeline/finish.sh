#!/usr/bin/env bash
# 필름 마감: 모든 컷(AI·Blender)에 같은 질감을 입혀 '촬영한 듯한' 화면으로 통일한다.
#   bash pipeline/finish.sh <입력.mp4> <출력.mp4> [grain=12] [lut.cube]
# - 9:16 1080×1920 24fps 로 맞춤
# - 약간 눌린 대비·채도 + 따뜻한 하이라이트/차가운 그림자 (LUT 가 있으면 LUT 우선)
# - 필름 그레인(시간에 따라 변함) + 비네팅
# - 오디오 −14 LUFS (쇼츠·릴스 기준), 오디오가 없으면 무음 트랙을 깐다
set -euo pipefail
IN="$1"; OUT="$2"; GRAIN="${3:-12}"; LUT="${4:-}"

if [[ -n "$LUT" && -f "$LUT" ]]; then
  LOOK="lut3d='${LUT}'"
else
  LOOK="eq=contrast=0.94:saturation=0.86:gamma=1.02,colorbalance=rs=-0.03:bs=0.04:rh=0.04:bh=-0.03"
fi
VF="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24,${LOOK},noise=alls=${GRAIN}:allf=t+u,vignette=PI/5,format=yuv420p"

if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$IN" | grep -q .; then
  ffmpeg -y -v error -i "$IN" -vf "$VF" -af "loudnorm=I=-14:TP=-1.5:LRA=11" \
    -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
else
  ffmpeg -y -v error -i "$IN" -f lavfi -i anullsrc=r=48000:cl=stereo -shortest -vf "$VF" \
    -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "$OUT"
fi
ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate,codec_name -of compact=p=0 "$OUT"
