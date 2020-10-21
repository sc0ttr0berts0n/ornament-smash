import * as PIXI from 'pixi.js';
import Game from './game';
import Victor = require('victor');
import { Confetti, ConfettiOptions } from './confetti';

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
    private matureAge = 20;
    public isOnScreen = false;
    public isDead = false;
    public isOld = false;
    public isClicked = false;

    constructor(game: Game) {
        this.game = game;
        this.el = this.getRandomIcon();
        this.init();
    }
    init() {
        // refs for stage dimensions
        const width = this.game.app.renderer.width;
        const height = this.game.app.renderer.height;

        // determine pos
        this.pos = new Victor(width - this.el.width, height);
        this.pos.x = this.pos.x * Math.random();

        // determine motion target
        const target = new Victor(
            width / 2 -
                (width / 2) * Math.random() +
                (width / 2) * Math.random(),
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

        // add some corresponding confetti to launch
        for (let i = 0; i < 5; i++) {
            const randX = Math.random() * 10 - 5;
            const randY = Math.random() * 4 - 2;
            const confettiVel = this.vel
                .clone()
                .multiply(new Victor(0.25, 0.25))
                .add(new Victor(randX, randY));
            const confettiOptions = { pos: this.pos, vel: confettiVel };
            this.addConfetti(1, confettiOptions);
        }

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
        // refs for stage dimensions
        const width = this.game.app.renderer.width;
        const height = this.game.app.renderer.height;

        // add age
        this.age++;

        // handle physics
        this.acc = this.gravity;
        this.vel = this.vel.add(this.acc).multiply(this.friction);
        this.pos = this.pos.add(this.vel);

        // handle reflections
        if (this.age > this.matureAge) {
            if (this.pos.x < 0 || this.pos.x + this.el.width > width) {
                this.vel.invertX();
            }
            if (this.pos.y < 0) {
                this.vel.invertY();
            }
        }

        // decide to clear the particle or render it
        if (this.age > this.lifespan) {
            this.isOld = true;
            this.destroy();
        } else if (this.age > this.matureAge && this.pos.y > height) {
            this.destroy();
        } else if (this.game.strikes >= 3) {
            this.endGameRemove();
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
    destroy() {
        this.el.destroy();
        this.isDead = true;
        if (!this.isOld && !this.isClicked) {
            this.game.addStrike();
        }
    }
    handleClick() {
        document.body.classList.add('isClicked');
        this.isClicked = true;
        this.destroy();
        this.addConfetti();
        this.game.addScore();
    }
    endGameRemove() {
        this.destroy();
        this.addConfetti();
    }
    addConfetti(
        amt: number = 10,
        options: ConfettiOptions = { pos: this.pos }
    ) {
        for (let i = 0; i < amt; i++) {
            this.game.confetti.push(new Confetti(this.game, options));
        }
    }
}
