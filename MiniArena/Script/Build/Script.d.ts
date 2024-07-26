declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum CHICKEN_STATE {
        ALIVE = 0,
        DEAD = 1
    }
    class Chicken extends ƒAid.NodeSprite {
        private static readonly MASS;
        private static readonly FLAP_THRESHOLD;
        private readonly rigidBody;
        rect: ƒ.Rectangle;
        private flyDirection;
        private flapForceVertical;
        velocity: ƒ.Vector3;
        private chickenFlyAnimation;
        private chickenDeathAnimation;
        private coat;
        private stateMachine;
        initAnimations(): void;
        constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, flyDirection: number, verticalFlapForce: number);
        update(): void;
        flap(): void;
        translate(_distance: ƒ.Vector3): void;
        getPosition(): ƒ.Vector3;
        hit(): void;
        get currentState(): CHICKEN_STATE;
    }
}
declare namespace Script {
    import ƒaid = FudgeAid;
    class ComponentStateMachineChicken extends ƒaid.ComponentStateMachine<CHICKEN_STATE> {
        private static instructions;
        constructor();
        private static setupStateMachine;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let viewport: ƒ.Viewport;
    let chickenContainer: ƒ.Node;
    let chickenSpriteSheet: ƒ.TextureImage;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Player extends ƒ.Mutable {
        private cmpAudio;
        health: number;
        score: number;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
        constructor(lives: number);
        pickByRadius(_event: PointerEvent): void;
        hitchicken(chicken: ƒ.Node): void;
        createSoundNode(): void;
        removeLive(): void;
        get playerLives(): number;
    }
}
declare namespace Script {
    class Hud {
        private static controller;
        static start(player: Player): void;
        static forceUpdate(): void;
    }
}
