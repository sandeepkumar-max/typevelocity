let sharedAudioCtx: AudioContext | null = null;
let cachedNoiseBuffer: AudioBuffer | null = null;

const getAudioContext = () => {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioCtx = new AudioContextClass();
    }
  }
  // Resume context if it's suspended (due to browser autoplay policies)
  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
};

// Initialize audio context on first user interaction to ensure zero latency later
if (typeof window !== 'undefined') {
  const initAudio = () => {
    getAudioContext();
    window.removeEventListener('pointerdown', initAudio);
    window.removeEventListener('keydown', initAudio);
  };
  window.addEventListener('pointerdown', initAudio, { once: true });
  window.addEventListener('keydown', initAudio, { once: true });
}

const getNoiseBuffer = (audioCtx: AudioContext) => {
  if (cachedNoiseBuffer) return cachedNoiseBuffer;
  const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
};

export const playKeystrokeSound = () => {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    const t = audioCtx.currentTime;
    
    // 1. Noise component (the 'click' of the switch)
    const noise = audioCtx.createBufferSource();
    noise.buffer = getNoiseBuffer(audioCtx);

    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2500 + Math.random() * 500;
    noiseFilter.Q.value = 1;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noise.start(t);
    
    // 2. Oscillator component (the 'thock' or bottom-out sound)
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150 + Math.random() * 30, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.04);
    
    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.15, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
    
    const oscFilter = audioCtx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.value = 800;
    
    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start(t);
    osc.stop(t + 0.05);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playErrorSound = () => {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playSuccessSound = () => {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    // Ignore audio errors
  }
};

