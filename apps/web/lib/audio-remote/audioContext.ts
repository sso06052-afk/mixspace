import type { FinalStemName } from '@mixspace/shared';

/**
 * 다중 스템 동시 재생 컨트롤러.
 *
 * 핵심: 모든 스템을 단일 AudioContext에서 한 번의 start(t0)로 재생 → 샘플 정확 동기.
 * <audio> 엘리먼트 여러 개 띄우는 방식은 동기 어긋남.
 */
export class StemPlayer {
  private ctx: AudioContext;
  private buffers = new Map<FinalStemName, AudioBuffer>();
  private sources = new Map<FinalStemName, AudioBufferSourceNode>();
  private gains = new Map<FinalStemName, GainNode>();
  private startTime = 0;
  private playing = false;

  constructor() {
    this.ctx = new AudioContext();
  }

  async loadStem(name: FinalStemName, url: string): Promise<void> {
    const buf = await fetch(url).then((r) => r.arrayBuffer());
    const decoded = await this.ctx.decodeAudioData(buf);
    this.buffers.set(name, decoded);
  }

  play(): void {
    if (this.playing) return;
    const t0 = this.ctx.currentTime + 0.1;
    this.buffers.forEach((buf, name) => {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const gain = this.ctx.createGain();
      src.connect(gain).connect(this.ctx.destination);
      src.start(t0);
      this.sources.set(name, src);
      this.gains.set(name, gain);
    });
    this.startTime = t0;
    this.playing = true;
  }

  stop(): void {
    this.sources.forEach((s) => s.stop());
    this.sources.clear();
    this.gains.clear();
    this.playing = false;
  }

  /** 재생 시작 시점부터의 경과 시간(초). Viz Agent에 전달할 값. */
  get currentTime(): number {
    if (!this.playing) return 0;
    return Math.max(0, this.ctx.currentTime - this.startTime);
  }

  setGain(name: FinalStemName, value: number): void {
    const g = this.gains.get(name);
    if (g) g.gain.value = value;
  }
}
