import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent {
  processing: boolean = false;
  
  textControl: FormControl = new FormControl("Страх убивает разум. Страх - это малая смерть, несущая забвение. Я смотрю в лицо моему страху, я дам ему овладеть мною и пройти сквозь меня. И когда он пройдет сквозь меня, я обернусь и посмотрю на тропу страха. Там, где прошел страх, не останется ничего. Там, где прошел страх, останусь только я.");
  picthControl: FormControl = new FormControl(1); // 0 to 2
  rateControl: FormControl = new FormControl(1); // 0.1 to 1
  voiceControl: FormControl = new FormControl(0);
  volumeControl: FormControl = new FormControl(0.5); // 0 to 1

  readonly LANG: string = "ru-RU";
  readonly SYNTH: SpeechSynthesis;
  readonly UTTER: SpeechSynthesisUtterance;

  constructor() {
    this.SYNTH = window.speechSynthesis;
    this.UTTER = new SpeechSynthesisUtterance();
    this.UTTER.lang = this.LANG;
    this.setUtterProperties();
  }

  async TextToVoice(): Promise<void> {
    if (this.SYNTH.speaking) {
      this.SYNTH.cancel();
    }
    this.setVoice();
    this.UTTER.text = this.textControl.value;
    this.SYNTH.speak(this.UTTER);
  }

  setUtterProperties(): void {
    this.stop();
    this.UTTER.pitch = this.picthControl.value;
    this.UTTER.rate = this.rateControl.value;
    this.UTTER.volume = this.volumeControl.value;
  }

  private setVoice(): void {
    this.UTTER.voice = this.SYNTH.getVoices().filter((voice) => voice.lang == "ru-RU")[this.voiceControl.value];
  }

  stop(): void {
    if (this.SYNTH.speaking) {
      this.SYNTH.cancel();
    }
  }

  pause(): void {
    if (this.SYNTH.speaking) {
      this.SYNTH.pause();
    }
  }

  resume(): void {
    if (this.SYNTH.paused) {
      this.SYNTH.resume();
    }
  }
}
