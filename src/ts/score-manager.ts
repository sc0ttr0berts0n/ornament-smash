import Game from './game';

export default class ScoreManager {
    private game: Game;
    public score: number = 0;
    private localStorageID = 'ornament-smash-high-score';
    private scoreNode: HTMLElement = document.querySelector(
        '.score--current-value'
    );
    private scoreText: string = this.score.toString();
    private highScore: number =
        parseInt(localStorage.getItem(this.localStorageID)) || 0;
    private highScoreNode: HTMLElement = document.querySelector(
        '.score--highscore-value'
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
        if (this.score.toString() !== this.scoreText) {
            this.scoreText = this.score.toString();
            this.scoreNode.textContent = this.score.toString();
        }
    }

    public update() {
        this.renderScore();
        this.renderHighScore();
        this.highScoreNode.textContent = this.game.app.screen.height.toString();
    }

    private renderHighScore() {
        const _isNewHighScore = this.score > Number(this.highScore);
        if (_isNewHighScore) {
            this.highScore = this.score;
            localStorage.setItem(this.localStorageID, this.score.toString());
            this.highScoreNode.textContent = this.highScore.toString();
        }
    }

    public resetHighScore() {
        localStorage.setItem(this.localStorageID, '0');
        if (!this.game.gameEnded) {
            this.highScore = this.score;
        } else {
            this.highScore = 0;
        }
        this.highScoreNode.textContent = this.highScore.toString();
    }

    private initHighScore() {
        this.highScoreNode.textContent = this.highScore.toString();
    }
}
