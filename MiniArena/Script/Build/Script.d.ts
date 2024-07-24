declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Chicken extends ƒAid.NodeSprite {
        private static readonly MASS;
        private static readonly FLAP_FORCE;
        private static readonly FLAP_THRESHOLD;
        private static readonly REFLECT_VECTOR_X;
        private static readonly REFLECT_VECTOR_Y;
        private readonly animationstate;
        private readonly meshQuad;
        private readonly rigidBody;
        rect: ƒ.Rectangle;
        private flyDirection;
        private _alive;
        velocity: ƒ.Vector3;
        private chickenFlyAnimation;
        private chickenDeathAnimation;
        private coat;
        initAnimations(): void;
        constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, flyDirection: number);
        /**
         * move moves the game object and the collision detection reactangle
         */
        move(): void;
        flap(): void;
        translate(_distance: ƒ.Vector3): void;
        getPosition(): ƒ.Vector3;
        hit(): void;
        get alive(): boolean;
        set alive(_alive: boolean);
        get collisionGroup(): ƒ.COLLISION_GROUP;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
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
    class Player {
        private cmpAudio;
        private _lives;
        constructor(lives: number);
        pickByRadius(_event: PointerEvent): void;
        hitchicken(chicken: ƒ.Node): void;
        createSoundNode(): void;
        removeLive(): void;
        get playerLives(): number;
    }
}
