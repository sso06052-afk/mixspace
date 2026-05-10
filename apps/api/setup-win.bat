@echo off
echo === MixSpace API Setup (Windows + CUDA) ===

REM Python venv 생성
python -m venv .venv
call .venv\Scripts\activate.bat

REM pip 업그레이드
python -m pip install --upgrade pip

REM 공통 의존성
pip install -r requirements.txt

REM PyTorch CUDA 12.1 (RTX 3070 이상)
pip install torch==2.4.0 torchaudio==2.4.0 --index-url https://download.pytorch.org/whl/cu121

REM Demucs
pip install demucs==4.0.1

REM LarsNet (drum 5분할, 오픈소스)
pip install git+https://github.com/polimi-ispl/larsnet.git

echo.
echo === CUDA 확인 ===
python -c "import torch; print('CUDA:', torch.cuda.is_available(), '| Device:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'N/A')"

echo.
echo === Setup complete! ===
echo 실행: .venv\Scripts\uvicorn.exe main:app --port 8000 --reload
pause
