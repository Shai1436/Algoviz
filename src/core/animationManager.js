

class AnimationManager {
    constructor(animatedObjs, generatorFn, fnArgs) {
        this.animatedObjs = animatedObjs;
        this.generatorFn = generatorFn;
        this.fnArgs = fnArgs;
        this.isAnimationRunning = false;
        this.generatorRef = null;
        this.timer = null;
        this.isRunningAnimationStep = false;
        this.init = this.init.bind(this);
        this.start = this.start.bind(this);
        this.toggle = this.toggle.bind(this);
        this.next = this.next.bind(this);
        
        
    }

    async draw() {
        this.isRunningAnimationStep = true;
        this.animatedObjs.rearrange();
        await this.animatedObjs.animate(this.context, true);
        this.isRunningAnimationStep = false;
    }

    init() {
        this.generatorRef = this.generatorFn(...this.fnArgs);
        const canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.animatedObjs.draw(this.context);
    }

    next() {
        const gen = this.generatorRef.next();
        this.draw();
        return gen;
    }

    start() {
        if (this.isRunningAnimationStep) {
            this.timer = setTimeout(this.start, 100);
            return;
        }

        const gen = this.next();
        if (!gen.done)
            this.timer = setTimeout(this.start, 100);
    }

    toggle() {
        if (!this.isAnimationRunning) {
            this.start();
        }
        else {
            window.clearTimeout(this.timer);
        }
        this.isAnimationRunning = !this.isAnimationRunning;
    }
}

export default AnimationManager;