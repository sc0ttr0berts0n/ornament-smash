import * as PIXI from 'pixi.js';
import Game from './game';
import Victor = require('victor');

export default class Confetti {
    private el: PIXI.Sprite;
    private game: Game;
    private pos: Victor;
    private vel = new Victor(0, 0);
    private acc = new Victor(0, 0);
    private gravity = new Victor(0, 0.098);
    private friction = new Victor(0.99, 0.99);
    private age = 0;
    private lifespan = 200;
    public isDead = false;
    public speed = 8;

    constructor(game: Game, pos: Victor) {
        this.game = game;
        this.el = this.getRandomGraphic();
        this.pos = pos.clone();
        this.init();
    }
    init() {
        // set vel at target
        const velX = this.speed * 2 * Math.random() - this.speed;
        const velY = this.speed * 2 * Math.random() - this.speed;
        this.vel = new Victor(velX, velY);

        // add asset to stage
        this.game.app.stage.addChild(this.el);
    }
    update() {
        const width = this.game.app.renderer.width;
        this.age++;
        this.acc = this.gravity;
        this.vel = this.vel.add(this.acc).multiply(this.friction);
        this.pos = this.pos.add(this.vel);
        if (this.age > 20) {
            if (this.pos.x < 0 || this.pos.x + this.el.width > width) {
                this.vel.invertX();
            }
            if (this.pos.y < 0) {
                this.vel.invertY();
            }
        }
        if (this.age > this.lifespan) {
            this.destory();
        }
        if (this.lifespan - this.age < 20) {
            this.el.alpha -= 0.05;
        }
        if (!this.isDead) {
            this.render();
        }
    }
    render() {
        this.el.position.set(this.pos.x, this.pos.y);
    }
    getRandomGraphic() {
        const randIndex = Math.floor(
            this.game.graphics.confetti.length * Math.random()
        );
        const texture = this.game.graphics.confetti[randIndex];
        return new PIXI.Sprite(texture);
    }
    destory() {
        this.el.destroy();
        this.isDead = true;
    }
}
