import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
    `textarea {
      min-height: 150px;
    }`
  ]
})
export class MainComponent {
  translationControl: FormControl = new FormControl(0);
  textControl: FormControl = new FormControl("I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.")

  translatedText: string = "";
  words: any[] = [];
  wordsFlag: boolean = false;
  trees: any[] = [];
  treeFlag: boolean = false;
  processing: boolean = false;

  readonly SYNTH: SpeechSynthesis;

  constructor(
    private summary: TranslateService
  ) {
    this.SYNTH = window.speechSynthesis;
  }

  async Translate(): Promise<void> {
    this.processing = true;

    let langObj = this.getLang();

    await this.summary.text(
      this.textControl.value,
      langObj.to,
      langObj.from
    ).then((result) => {
      this.translatedText = result.translationAPI;
      this.processing = false;
    });
  }

  async Words(): Promise<void> {
    this.processing = true;
    this.wordsFlag = false;
    this.treeFlag = false;

    let langObj = this.getLang();

    await this.summary.words(
      this.textControl.value,
      langObj.to,
      langObj.from
    ).then((result) => {
      this.words = result.translationByWords;
      this.words.sort((a, b) => (a.frequency < b.frequency ? 1 : -1));
      this.wordsFlag = true;
      this.processing = false;
    });
  }

  async Trees(): Promise<void> {
    this.processing = true;
    this.wordsFlag = false;
    this.treeFlag = false;

    let langObj = this.getLang();

    await this.summary.trees(
      this.translatedText,
      langObj.to
    ).then((result) => {
      this.trees = result.translationTree;
      this.treeFlag = true;
      this.processing = false;
    });
  }

  speak(text: string): void {
    let utter = new SpeechSynthesisUtterance(text);
    let lang = this.getLang().to == "fr" ? "fr-FR" : "en-EN";
    utter.voice = this.SYNTH.getVoices().filter((voice) => voice.lang == lang)[0];
    this.SYNTH.speak(utter);
  }

  stop(): void {
    if (this.SYNTH.speaking) {
      this.SYNTH.cancel();
    }
  }

  private getLang(): { to: string, from: string } {
    switch (this.translationControl.value) {
      case "1":
        return {
          to: "en",
          from: "fr"
        }
      case "0":
      default:
        return {
          to: "fr",
          from: "en"
        }
    }
  }
}
