declare namespace Script {
    import ƒ = FudgeCore;
    class Chicken extends ƒ.Node {
        private static readonly MASS;
        private static readonly FLAP_FORCE;
        private static readonly FLAP_THRESHOLD;
        private static readonly meshQuad;
        private static readonly mtrSolidWhite;
        private static readonly mtrSolidRed;
        private static readonly materialAlive;
        private static readonly materialDead;
        private readonly rigidBody;
        rect: ƒ.Rectangle;
        private static readonly REFLECT_VECTOR_X;
        private static readonly REFLECT_VECTOR_Y;
        private direction;
        private alive;
        velocity: ƒ.Vector3;
        constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, direction: number);
        /**
         * move moves the game object and the collision detection reactangle
         */
        move(): void;
        flap(): void;
        translate(_distance: ƒ.Vector3): void;
        getPosition(): ƒ.Vector3;
        hit(): void;
        isAlive(): boolean;
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
    let viewport: ƒ.Viewport;
    let chickenContainer: ƒ.Node;
}
declare namespace Script {
    function pickByComponent(_event: PointerEvent): void;
    function hitComponent(_event: PointerEvent): void;
    function pickByCamera(_event: PointerEvent): void;
    function pickByRadius(_event: PointerEvent): void;
}
