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
    // export function moveEnemy(){
    //   NPC= viewport.getBranch().getChildrenByName("NPC")[0];
    //   enemyrigidbody = NPC.getComponent(ƒ.ComponentRigidbody);
    //   let positionSteve: ƒ.Vector3 = knuckles.mtxWorld.translation;
    //   let positionCreeper: ƒ.Vector3 = NPC.mtxWorld.translation;
    //   let movementVector= ƒ.Vector3.DIFFERENCE(positionSteve, positionCreeper);
    //   movementVector.normalize(100);
    //   enemyrigidbody.applyForce(movementVector);
    // }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let graph;
    let viewport;
    let chickenContainer; //Hold
    let chicken;
    let rng;
    let time;
    document.addEventListener("interactiveViewportStarted", start);
    //export let enemyrigidbody: ƒ.ComponentRigidbody;
    //export let NPC: ƒ.Node;
    let gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    // resources
    let chickenSpriteSheet = new ƒ.TextureImage();
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        chickenContainer = new ƒ.Node("ChickenContainer");
        let cmpCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
        viewport.camera = cmpCamera;
        rng = new ƒ.Random(0); // TODO non-deterministc seed
        time = new ƒ.Time();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        chickenNodeInit(_event);
        // Load resources
        chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
    }
    //Sprite Animations
    let chickenFlyAnimation;
    let chickenDeathAnimation;
    function initAnimations(coat) {
        chickenFlyAnimation = new ƒAid.SpriteSheetAnimation("Fly", coat);
        chickenFlyAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 366, 103), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
        chickenDeathAnimation = new ƒAid.SpriteSheetAnimation("Death", coat);
        chickenDeathAnimation.generateByGrid(ƒ.Rectangle.GET(255, 266, 447, 355), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
    }
    //let audioDeath: ƒ.Audio;
    let audioAmbient;
    function initializeSounds() {
        //audioDeath = new ƒ.Audio("./sounds/death.wav");
        //audioJump = new ƒ.Audio("./sounds/jump.wav");
        audioAmbient = new ƒ.Audio("./sounds/music.wav");
    }
    //chickenSprite
    let chickenAvatar;
    let cmpAudio;
    // Spawning
    let minSpawnInterval = 500; // In miliseconds
    let timeSinceLastSpawn = 0.0;
    //let maxChickens: number = 10;
    //let chickens: number = 0;
    let animationState = "standing";
    function constructChicken() {
        let coat = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
        initAnimations(coat);
        //chicken = graph.getChildrenByName("Charakter")[0].getChildrenByName("chicken")[0];
        //
        //initializeSounds();
        let newChicken = new ƒAid.NodeSprite("chicken_Sprite");
        newChicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        newChicken.setAnimation(chickenFlyAnimation);
        newChicken.setFrameDirection(1);
        newChicken.framerate = 20;
        //newChicken.setAnimation(chickenDeathAnimation);
        //cmpAudio = graph.getComponent(ƒ.ComponentAudio);
        //cmpAudio.connect(true);
        //cmpAudio.volume = 1;
        //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        //ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
        return newChicken;
    }
    // Should we spawn a chicken in this frame or not?
    function spawnChicken() {
        let now = time.get();
        // Enough time elapsed to spawn a new chicken?
        if (now - timeSinceLastSpawn > minSpawnInterval) {
            //let newChicken = new ƒAid.NodeSprite("chicken");
            let newChicken = constructChicken();
            newChicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            //newChicken.setAnimation(chickenFlyAnimation);
            //newChicken.setFrameDirection(1);
            //newChicken.framerate = 20;
            //newChicken.setAnimation(chickenDeathAnimation);
            newChicken.mtxLocal.translate(rng.getVector3(new ƒ.Vector3(-5, -5, -5), new ƒ.Vector3(5, 5, 5)));
            newChicken.mtxLocal.scaleX(1);
            newChicken.mtxLocal.scaleY(1);
            chickenContainer.addChild(newChicken);
        }
    }
    async function chickenNodeInit(_event) {
        let chickenSpriteSheet = new ƒ.TextureImage();
        await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
        let coat = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
        initAnimations(coat);
        chicken = graph.getChildrenByName("Charakter")[0].getChildrenByName("chicken")[0];
        chicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
        initializeSounds();
        chickenAvatar = new ƒAid.NodeSprite("chicken_Sprite");
        chickenAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        chickenAvatar.setAnimation(chickenFlyAnimation);
        chickenAvatar.setFrameDirection(1);
        chickenAvatar.framerate = 20;
        chickenAvatar.setAnimation(chickenDeathAnimation);
        chickenAvatar.mtxLocal.translateY(0);
        chickenAvatar.mtxLocal.translateZ(2);
        chickenAvatar.mtxLocal.scaleX(1.5);
        chickenAvatar.mtxLocal.scaleY(2);
        graph = viewport.getBranch();
        graph.addChild(chickenAvatar);
        cmpAudio = graph.getComponent(ƒ.ComponentAudio);
        cmpAudio.connect(true);
        cmpAudio.volume = 1;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    function update(_event) {
        spawnChicken();
        //moveEnemy();
        ƒ.AudioManager.default.update();
        let timeFrame = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])) {
            chickenAvatar.mtxLocal.translateX(2 * timeFrame);
            if (animationState != "flyright") {
                animationState = "flyright";
                chickenAvatar.setAnimation(chickenFlyAnimation);
                return;
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])) {
            chickenAvatar.mtxLocal.translateX(2 * timeFrame);
            if (animationState != "flyleft") {
                animationState = "flyleft";
                chickenAvatar.setAnimation(chickenFlyAnimation);
                return;
            }
        }
        chickenAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("left") ? 180 : 0);
        ySpeed += gravity * timeFrame;
        let pos = chickenAvatar.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        chicken.mtxLocal.translation = pos;
        if (pos.y < -2.5) {
            ySpeed = 0;
            pos.y = -2.5;
            isGrounded = true;
        }
        if (isGrounded == true) {
            cmpAudio.setAudio(audioAmbient);
            cmpAudio.volume = 1;
        }
        chickenAvatar.mtxLocal.translation = pos;
        viewport.draw();
    }
    //mtxLocal.translation.y = 0 matrix translation an Y
    //mtxLocal.translation = V neuer Vektor
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map