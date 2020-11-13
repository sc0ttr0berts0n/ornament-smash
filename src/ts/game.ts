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
    private startDelay = 180;
    private paused: boolean = false;
    public started = false;
    public gameEnded = false;
    private muted: boolean = false;
    public ornaments: Ornament[] = [];
    public confetti: Confetti[] = [];
    public crosshair: Crosshair;
    public framesPerObject = 90;
    public minFramesPerObject = 5;
    public score = 0;
    public strikes = 0;
    public scoreNode = document.querySelector('.score');
    public strikeNode = document.querySelector('.strike-wrapper');
    public startButtonNode = document.querySelector('.start-button');
    public retryButtonNode = document.querySelector('.retry-button');
    public gameWrapperNode = document.querySelector('.game-wrapper');

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
        this.startButtonNode.addEventListener('click', this.start.bind(this));
        this.retryButtonNode.addEventListener('click', this.reinit.bind(this));
    }

    private update() {
        if (!this.paused) {
            this.frameCount++;
            const rate =
                this.framesPerObject - this.score > this.minFramesPerObject
                    ? this.framesPerObject - this.score
                    : this.minFramesPerObject;
            if (
                this.started &&
                this.frameCount > this.lastRestart + this.startDelay
            ) {
                if (this.frameCount % rate === 0 && this.strikes < 3) {
                    this.ornaments.push(new Ornament(this));
                }
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
        }
        this.crosshair.update();
    }
    public reinit() {
        this.lastRestart = this.frameCount;
        this.reinitScore();
        this.reinitStrikes();
        this.retryButtonNode.classList.add('is-hidden');
        this.gameWrapperNode.classList.remove('game-is-over');
    }
    addScore(num: number = 1) {
        if (this.strikes >= 3) return;
        this.score = this.score + num;
        this.scoreNode.textContent = this.score.toString();
    }
    reinitScore() {
        this.score = 0;
        this.scoreNode.textContent = this.score.toString();
    }
    addStrike(num: number = 1) {
        this.strikes = this.strikes + num;
        this.strikeNode.setAttribute('data-strikes', this.strikes.toString());
        if (this.strikes >= 3) {
            setTimeout(this.gameover.bind(this), 2000);
        }
    }
    reinitStrikes() {
        this.strikes = 0;
        this.strikeNode.setAttribute('data-strikes', this.strikes.toString());
    }
    start() {
        this.started = true;
        this.lastRestart = this.frameCount;
        this.gameWrapperNode.classList.add('game-is-started');
        this.startButtonNode.classList.add('is-hidden');
        this.strikeNode.classList.remove('hide-strikes');
    }
    gameover() {
        this.gameWrapperNode.classList.add('game-is-over');
        this.gameWrapperNode.classList.remove('game-is-started');
        this.retryButtonNode.classList.remove('is-hidden');
    }
}
