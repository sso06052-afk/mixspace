#!/bin/bash
set -e
echo "=== MixSpace API Setup (Mac Intel — CPU Only) ==="

# Python venv 생성
python3 -m venv .venv
source .venv/bin/activate

# pip 업그레이드
pip install --upgrade pip

# 공통 의존성
pip install -r requirements.txt

# PyTorch (Mac Intel 최대 버전, CPU only)
# 주의: Demucs 로컬 실행은 CPU라 30분+ 소요 → 실제 분리는 Replicate 사용
pip install torch==2.2.2 torchaudio==2.2.2

# Demucs (import 가능하게만; 실제 분리는 Replicate로)
pip install demucs==4.0.1

echo ""
echo "=== 확인 ==="
python -c "import torch; print('torch:', torch.__version__, '| MPS:', torch.backends.mps.is_available())"
python -c "import librosa; print('librosa:', librosa.__version__)"

echo ""
echo "=== Setup complete! ==="
echo "실행: .venv/bin/uvicorn main:app --port 8000 --reload"
