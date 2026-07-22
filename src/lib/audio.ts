// Audio synthesizer and speech voice assistant using native browser APIs (Removed as per user request)

class SoundEngine {
  public setSoundEnabled(enabled: boolean) {}
  public setVoiceEnabled(enabled: boolean) {}
  public playStepBeep(frequency = 880, duration = 0.08, type: OscillatorType = 'sine') {}
  public playCountdownBeep(isGo = false) {}
  public playSuccessTone() {}
  public playMissTone() {}
  public speakPrompt(text: string) {}
}

export const soundEngine = new SoundEngine();

