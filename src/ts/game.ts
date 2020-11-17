import * as PIXI from 'pixi.js';
import GraphicAssets from './graphic-assets';
import AudioAssets from './audio-assets';
import { Howl, Howler } from 'howler';
import Ornament from './ornament';
import { Confetti } from './confetti';
import Crosshair from './crosshair';
import ScoreManager from './score-manager';

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
    public scoreManager: ScoreManager;
    public framesPerObject = 90;
    public minFramesPerObject = 5;
    public strikes = 0;
    public strikeNode = document.querySelector('.strike-wrapper');
    public startButtonNode = document.querySelector('.start-button');
    public retryButtonNode = document.querySelector('.retry-button');
    public gameWrapperNode = document.querySelector('.game-wrapper');
    public muteButtonNode = document.querySelector('.sound-wrapper');

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            transparent: true,
            resizeTo: canvas,
        });
        this.graphics = new GraphicAssets(this);
        this.audio = new AudioAssets(this);
        this.crosshair = new Crosshair(this);
        this.scoreManager = new ScoreManager(this);
        this.init();
    }

    private init() {
        this.app.ticker.add(() => this.update());
        this.graphics.placeAssets();
        this.startButtonNode.addEventListener('click', this.start.bind(this));
        this.retryButtonNode.addEventListener('click', this.reinit.bind(this));
        this.muteButtonNode.addEventListener(
            'click',
            this.toggleMute.bind(this)
        );
    }

    private update() {
        if (!this.paused) {
            this.frameCount++;

            // determine rate of fire for ornaments
            const rate =
                this.framesPerObject - this.scoreManager.score >
                this.minFramesPerObject
                    ? this.framesPerObject - this.scoreManager.score
                    : this.minFramesPerObject;

            // if possible, fire ornaments
            if (
                this.started &&
                this.frameCount > this.lastRestart + this.startDelay
            ) {
                if (this.frameCount % rate === 0 && this.strikes < 3) {
                    this.ornaments.push(new Ornament(this));
                }
            }

            // update ornaments
            if (this.ornaments.length) {
                this.ornaments = this.ornaments.filter(
                    (ornament) => !ornament.isDead
                );
                this.ornaments.forEach((ornament) => {
                    ornament.update();
                });
            }

            // update confetti
            if (this.confetti.length) {
                this.confetti = this.confetti.filter(
                    (particle) => !particle.isDead
                );
                this.confetti.forEach((particle) => {
                    particle.update();
                });
            }

            // update score
            this.scoreManager.update();
        }
        this.crosshair.update();
    }
    public reinit() {
        this.lastRestart = this.frameCount;
        this.scoreManager.reinit();
        this.reinitStrikes();
        this.retryButtonNode.classList.add('is-hidden');
        this.start();
        this.audio.bgm.volume(this.audio.BGM_MAX_VOLUME);
        this.audio.bgm.seek(0);
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
        document.body.classList.add('game-is-started');
        this.startButtonNode.classList.add('is-hidden');
        this.strikeNode.classList.remove('hide-strikes');
        this.audio.bgm.play();
    }
    gameover() {
        document.body.classList.add('game-is-over');
        document.body.classList.remove('game-is-started');
        this.retryButtonNode.classList.remove('is-hidden');
        this.audio.bgm.fade(this.audio.BGM_MAX_VOLUME, 0, 2000);
    }
    toggleMute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
        if (this.muted) {
            this.muteButtonNode.classList.add('is-muted');
        } else {
            this.muteButtonNode.classList.remove('is-muted');
        }
    }
}
