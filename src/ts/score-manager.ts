import Game from './game';

export default class ScoreManager {
    private game: Game;
    public score: number = 0;
    private localStorageID = 'ornament-smash-high-score';
    private scoreDomEl: HTMLElement = document.querySelector('.score');
    private scoreDomElText: string = this.score.toString();
    private highScore: number =
        parseInt(localStorage.getItem(this.localStorageID)) || 0;
    private highScoreDomEl: HTMLElement = document.querySelector(
        '.high-score-value'
    );

    constructor(game: Game) {
        this.game = game;
        this.init();
    }

    public init() {
        this.initHighScore();
    }

    public reinit() {
        this.score = 0;
        this.update();
    }

    public addScore(num: number = 1) {
        if (this.game.strikes >= 3) return;
        this.score = this.score + num;
    }

    private renderScore() {
        if (this.score.toString() !== this.scoreDomElText) {
            this.scoreDomElText = this.score.toString();
            this.scoreDomEl.textContent = this.score.toString();
        }
    }

    public update() {
        this.renderScore();
        this.renderHighScore();
    }

    private renderHighScore() {
        const _isNewHighScore = this.score > Number(this.highScore);
        if (_isNewHighScore) {
            this.highScore = this.score;
            localStorage.setItem(this.localStorageID, this.score.toString());
            this.highScoreDomEl.textContent = this.highScore.toString();
        }
    }

    public resetHighScore() {
        localStorage.setItem(this.localStorageID, '0');
        if (!this.game.gameEnded) {
            this.highScore = this.score;
        } else {
            this.highScore = 0;
        }
        this.highScoreDomEl.textContent = this.highScore.toString();
    }

    private initHighScore() {
        this.highScoreDomEl.textContent = this.highScore.toString();
    }
}
