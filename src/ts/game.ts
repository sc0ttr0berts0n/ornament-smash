import * as PIXI from 'pixi.js';
import GraphicAssets from './graphic-assets';
import AudioAssets from './audio-assets';
import { Howler } from 'howler';
import Ornament from './ornament';
import { Confetti } from './confetti';
import Crosshair from './crosshair';

export default class Game {
    private canvas: HTMLCanvasElement;
    public app: PIXI.Application;
    public graphics: GraphicAssets;
    public audio: AudioAssets;
    public frameCount: number = 0;
    private lastRestart: number = 0;
    private paused: boolean = false;
    private muted: boolean = false;
    public gameover = false;
    public ornaments: Ornament[] = [];
    public confetti: Confetti[] = [];
    public crosshair: Crosshair;
    public framesPerObject = 90;
    public minFramesPerObject = 5;
    public score = 0;
    public scoreNode = document.querySelector('.score');
    public strikes = 0;
    public strikeNode = document.querySelector('.strike-wrapper');

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
        });
        this.graphics = new GraphicAssets(this);
        this.audio = new AudioAssets(this);
        this.crosshair = new Crosshair(this);
        this.init();
    }

    private init() {
        Howler.volume(0.2);
        this.app.ticker.add(() => this.update());
        this.graphics.placeAssets();
    }

    private update() {
        if (!this.paused) {
            this.frameCount++;
            const rate =
                this.framesPerObject - this.score > this.minFramesPerObject
                    ? this.framesPerObject - this.score
                    : this.minFramesPerObject;
            if (this.frameCount % rate === 0 && this.strikes < 3) {
                this.ornaments.push(new Ornament(this));
            }
            if (this.ornaments.length) {
                this.ornaments = this.ornaments.filter(
                    (ornament) => !ornament.isDead
                );
                this.ornaments.forEach((ornament) => {
                    ornament.update();
                });
            }
            if (this.confetti.length) {
                this.confetti = this.confetti.filter(
                    (particle) => !particle.isDead
                );
                this.confetti.forEach((particle) => {
                    particle.update();
                });
            }
            this.crosshair.update();
        }
    }
    public reinit() {
        this.lastRestart = this.frameCount;
    }
    addScore(num: number = 1) {
        if (this.strikes >= 3) return;
        this.score = this.score + num;
        this.scoreNode.textContent = this.score.toString();
    }
    addStrike(num: number = 1) {
        this.strikes = this.strikes + num;
        this.strikeNode.setAttribute('data-strikes', this.strikes.toString());
        if (this.strikes >= 3) {
            this.gameover = true;
        }
    }
}
