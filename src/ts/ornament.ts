import * as PIXI from 'pixi.js';
import Game from './game';
import Victor = require('victor');
import Confetti from './confetti';

export default class Ornament {
    private el: PIXI.Sprite;
    private game: Game;
    private pos: Victor;
    private vel: Victor;
    private acc = new Victor(0, 0);
    private gravity = new Victor(0, 0.098);
    private friction = new Victor(0.99, 0.99);
    private age = 0;
    private lifespan = 500;
    public isDead = false;

    constructor(game: Game) {
        this.game = game;
        this.el = this.getRandomIcon();
        this.init();
    }
    init() {
        // determine pos
        const centerX = this.game.app.renderer.width / 2;
        const centerY = this.game.app.renderer.height / 2;
        const center = new Victor(centerX, centerY);
        const spawnRingRadius = center.magnitude();
        this.pos = new Victor(-spawnRingRadius, 0)
            .rotateBy(Math.PI / 4 + (Math.PI / 2) * Math.random())
            .add(center);

        // determine motion target
        const target = new Victor(
            centerX - this.pos.x * Math.random() + this.pos.x * Math.random(),
            0
        );

        // set vel at target
        this.vel = target
            .subtract(this.pos)
            .multiply(new Victor(0.0175, 0.0175));

        // scale asset
        this.el.scale.set(2, 2);

        // add asset to stage
        this.game.graphics.ornamentLayer.addChild(this.el);

        // init button mode for event tracking
        this.el.interactive = true;
        this.el.buttonMode = true;

        this.el.on(
            'mousedown',
            function () {
                this.handleClick();
            }.bind(this)
        );
        this.el.on(
            'touchstart',
            function () {
                this.handleClick();
            }.bind(this)
        );
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
        } else {
            this.render();
        }
    }
    render() {
        this.el.position.set(this.pos.x, this.pos.y);
    }
    getRandomIcon() {
        const randIndex = Math.floor(
            this.game.graphics.icons.length * Math.random()
        );
        const texture = this.game.graphics.icons[randIndex];
        return new PIXI.Sprite(texture);
    }
    destory() {
        this.el.destroy();
        this.isDead = true;
    }
    handleClick() {
        document.body.classList.add('isClicked');
        this.destory();
        this.addConfetti(10);
        this.game.score++;
    }
    addConfetti(amt: number) {
        for (let i = 0; i < amt; i++) {
            this.game.confetti.push(new Confetti(this.game, this.pos));
        }
    }
}
