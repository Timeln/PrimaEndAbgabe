"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let graph;
    let knuckles;
    let gravity = -7.81;
    let ySpeed = 0;
    let isGrounded = true;
    //let isGrounded: boolean = true;
    //let gravity: number = 0.3;
    //let ySpeed: number = 1;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        knuckles = graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0];
        knuckles.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        knucklesNodeInit(_event);
    }
    //Sprite Animations
    let knucklesWalkAnimation;
    let knucklesJumpAnimation;
    function initAnimations(coat) {
        knucklesWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        knucklesWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 85, 40, 45), 4, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        knucklesJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
        knucklesJumpAnimation.generateByGrid(ƒ.Rectangle.GET(520, 324, 40, 45), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
    }
    let audioJump;
    function initializeSounds() {
        //audioDeath = new ƒ.Audio("./sounds/death.wav");
        audioJump = new ƒ.Audio("./sounds/jump.wav");
    }
    //knucklesSprite
    let animationState = "standing";
    let knucklesAvatar;
    let cmpAudio;
    async function knucklesNodeInit(_event) {
        let knucklesSpriteSheet = new ƒ.TextureImage();
        await knucklesSpriteSheet.load("./images/knucklesprite.png");
        let coat = new ƒ.CoatTextured(undefined, knucklesSpriteSheet);
        initAnimations(coat);
        initializeSounds();
        knucklesAvatar = new ƒAid.NodeSprite("knuckles_Sprite");
        knucklesAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        knucklesAvatar.setAnimation(knucklesWalkAnimation);
        knucklesAvatar.setFrameDirection(1);
        knucklesAvatar.framerate = 20;
        knucklesAvatar.mtxLocal.translateY(0);
        knucklesAvatar.mtxLocal.translateZ(2);
        knucklesAvatar.mtxLocal.scaleX(1.5);
        knucklesAvatar.mtxLocal.scaleY(2);
        graph = viewport.getBranch();
        graph.addChild(knucklesAvatar);
        cmpAudio = graph.getComponent(ƒ.ComponentAudio);
        cmpAudio.connect(true);
        cmpAudio.volume = 1;
    }
    function update(_event) {
        knucklesAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("left") ? 180 : 0);
        collision();
        // ƒ.Physics.simulate();  // if physics is included and used
        //ySpeed += gravity;
        //viewport.draw();
        ƒ.AudioManager.default.update();
        let timeFrame = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
        //let graph: ƒ.Node = viewport.getBranch();
        //let knuckles: ƒ.Node = graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0];
        //console.log(graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0]);
        //knuckles.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
        //knuckles.mtxLocal.translateX(1);+
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            knucklesAvatar.mtxLocal.translateX(2 * timeFrame);
            if (animationState != "walkright") {
                animationState = "walkright";
                knucklesAvatar.setAnimation(knucklesWalkAnimation);
                return;
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            knucklesAvatar.mtxLocal.translateX(2 * timeFrame);
            if (animationState != "walkleft") {
                animationState = "walkleft";
                knucklesAvatar.setAnimation(knucklesWalkAnimation);
                return;
            }
        }
        if (animationState.includes("standing")) {
            knucklesAvatar.showFrame(0);
            return;
        }
        //if (pos.y > -0.5)
        //knuckles.mtxLocal.translateY(-0.2);
        //else
        //knuckles.mtxLocal.translateY(+1);
        //if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP]))
        //knuckles.mtxLocal.translateY(+1);
        //isGrounded = false;
        //if (pos.y > 0)
        //knuckles.mtxLocal.translateY(-0.3);
        if (isGrounded && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
            ySpeed = 5;
            isGrounded = false;
            knucklesAvatar.setAnimation(knucklesJumpAnimation);
            cmpAudio.setAudio(audioJump);
            cmpAudio.play(true);
            cmpAudio.volume = 4;
            collision();
        }
        ySpeed += gravity * timeFrame;
        let pos = knucklesAvatar.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        if (pos.y < -2.5) {
            ySpeed = 0;
            pos.y = -2.5;
            isGrounded = true;
        }
        knucklesAvatar.mtxLocal.translation = pos;
        viewport.draw();
    }
    // let tileCollided: ƒ.Node = checkCollision(pos);
    //   if (tileCollided) {
    //     ySpeed = 0;
    //     pos.y = tileCollided.mtxWorld.translation.y + 0.5;
    //     isGrounded = true;
    //   }
    //   knuckles.mtxLocal.translation = pos;
    //   followCamera();
    //   viewport.draw();
    //   ƒ.AudioManager.default.update();
    // }
    // function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
    //   let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren()
    //   for (let tile of tiles) {
    //     let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
    //     if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
    //       return tile;
    //   }
    //   return null;
    // }
    // function followCamera() {
    //   let mutator: ƒ.Mutator = knuckles.mtxLocal.getMutator();
    //   viewport.camera.mtxPivot.mutate(
    //     { "translation": { "x": mutator.translation.x, "y": mutator.translation.y } }
    //   );
    function collision() {
        graph = viewport.getBranch();
        let floors = graph.getChildrenByName("Floor")[0];
        let pos = knuckles.mtxLocal.translation;
        for (let floor of floors.getChildren()) {
            let posFloor = floor.mtxLocal.translation;
            if (Math.abs(pos.x - posFloor.x) < 0.5) {
                if (pos.y < posFloor.y + 0.5) {
                    pos.y = posFloor.y + 0.5;
                    knuckles.mtxLocal.translation = pos;
                    ySpeed = 0;
                }
            }
        }
    }
    //mtxLocal.translation.y = 0 matrix translation an Y
    //mtxLocal.translation = V neuer Vektor
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map