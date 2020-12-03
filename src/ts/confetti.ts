import * as PIXI from 'pixi.js-legacy';
import Game from './game';
import Victor = require('victor');

export interface ConfettiOptions {
    pos: Victor;
    vel?: Victor | null;
}

export class Confetti {
    private el: PIXI.Sprite;
    private game: Game;
    private options: ConfettiOptions;
    private pos: Victor;
    private vel = new Victor(0, 0);
    private acc = new Victor(0, 0);
    private gravity = new Victor(0, 0.15);
    private friction = 0.99;
    private age = 0;
    private lifespan = 100;
    public isDead = false;
    public speed = 8;

    constructor(game: Game, options: ConfettiOptions) {
        this.game = game;
        this.options = {
            pos: options.pos.clone() ?? new Victor(0, 0),
            vel: options.vel?.clone() ?? this.setRandomVel(),
        };
        this.el = this.getRandomGraphic();
        this.pos = this.options.pos;
        this.vel = this.options.vel;
        this.init();
    }
    init() {
        // scale asset
        this.el.scale.set(this.game.app.screen.width > 600 ? 2 / 3 : 1 / 3);

        // add asset to stage
        this.game.graphics.confettiLayer.addChild(this.el);
    }
    update() {
        const width = this.game.app.screen.width;
        this.age++;
        this.acc = this.gravity;
        this.vel = this.vel.add(this.acc).multiplyScalar(this.friction);
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
    setRandomVel() {
        // set vel at target
        const randomVel = (range: number) => {
            return range * 2 * Math.random() - range;
        };
        return new Victor(randomVel(this.speed), randomVel(this.speed));
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
