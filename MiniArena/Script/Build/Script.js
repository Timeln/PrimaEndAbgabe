"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Chicken extends ƒ.Node {
        constructor(_name, _position, _size, speed) {
            super(_name);
            this.velocity = ƒ.Vector3.ZERO();
            this.speed = speed;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new ƒ.ComponentMesh(Chicken.meshQuad);
            this.addComponent(cmpQuad);
            //cmpQuad.pivot.scale(_size.toVector3(0));
            let cMaterial = new ƒ.ComponentMaterial(Chicken.mtrSolidWhite);
            this.addComponent(cMaterial);
            //this.velocity = new ƒ.Vector3(ƒ.Random.default.getRange(-1, 1), ƒ.Random.default.getRange(-1, 1), 0);
            this.velocity = new ƒ.Vector3(speed, 0, 0);
            //this.velocity.normalize(this.speed);
        }
        /**
         * move moves the game object and the collision detection reactangle
         */
        move() {
            let frameTime = ƒ.Loop.timeFrameGame / 1000;
            let distance = ƒ.Vector3.SCALE(this.velocity, frameTime);
            this.translate(distance);
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
    }
    Chicken.meshQuad = new ƒ.MeshQuad();
    //private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
    Chicken.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());
    Chicken.REFLECT_VECTOR_X = ƒ.Vector3.X();
    Chicken.REFLECT_VECTOR_Y = ƒ.Vector3.Y();
    Script.Chicken = Chicken;
})(Script || (Script = {}));
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
    let chickenContainer; //Holds chickens
    let rng;
    let time;
    document.addEventListener("interactiveViewportStarted", start);
    //export let enemyrigidbody: ƒ.ComponentRigidbody;
    //export let NPC: ƒ.Node;
    //let gravity: number = -9.81;
    //let ySpeed: number = 0;
    //let isGrounded: boolean = true;
    // resources
    let chickenSpriteSheet = new ƒ.TextureImage();
    let pickAlgorithm = [Script.pickByComponent, Script.pickByCamera, Script.pickByRadius];
    // viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
    // viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);
    function start(_event) {
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        chickenContainer = new ƒ.Node("ChickenContainer");
        graph.addChild(chickenContainer);
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
        Script.viewport.camera = cmpCamera;
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
        //audioAmbient = new ƒ.Audio("./Sounds/music.wav");
    }
    //chickenSprite
    //let chickenAvatar: ƒAid.NodeSprite;
    let cmpAudio;
    // Spawning
    let minSpawnInterval = 500; // In miliseconds
    let timeSinceLastSpawn = 0;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;
    let maxChickens = 20;
    let chickens = 0;
    //let animationState = "standing";
    // Should we spawn a chicken in this frame or not?
    function spawnChicken() {
        let now = time.get();
        // Enough time elapsed to spawn a new chicken?
        if (now - timeSinceLastSpawn > minSpawnInterval && chickens <= maxChickens) {
            chickens++;
            timeSinceLastSpawn = now;
            //let newChicken = new ƒAid.NodeSprite("chicken");
            //let newChicken: ƒAid.NodeSprite = constructChicken();
            let spawnPos;
            let speed;
            if (rng.getBoolean()) { // Spawn left
                spawnPos = new ƒ.Vector2(-15, rng.getRange(-7, 7));
                speed = 5;
            }
            else { // ...or right
                spawnPos = new ƒ.Vector2(15, rng.getRange(-7, 7));
                speed = -5;
            }
            //let newChicken : ƒ.Node = new ƒAid.NodeSprite("chicken_Sprite");
            let newChicken = new Script.Chicken("Chicken", spawnPos, new ƒ.Vector2(1, 1), speed);
            // cmpAudio = graph.getComponent(ƒ.ComponentAudio);
            // cmpAudio.connect(true);
            // cmpAudio.setAudio(audioAmbient);
            // cmpAudio.volume = 1;
            //newChicken.setAnimation(chickenFlyAnimation);
            //newChicken.setFrameDirection(1);
            //newChicken.framerate = 20;
            //newChicken.setAnimation(chickenDeathAnimation);
            //let spawnPos: ƒ.Vector3 = new ƒ.Vector3(-5, -5, -5);
            console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y + ") (" + chickens + ")");
            chickenContainer.addChild(newChicken);
        }
    }
    async function chickenNodeInit(_event) {
        let chickenSpriteSheet = new ƒ.TextureImage();
        await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
        let coat = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
        initAnimations(coat);
        Script.chicken = graph.getChildrenByName("Charakter")[0].getChildrenByName("chicken")[0];
        Script.chicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
        initializeSounds();
        //chickenAvatar = new ƒAid.NodeSprite("chicken_Sprite");
        //chickenAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        //
        //chickenAvatar.setAnimation(chickenFlyAnimation);
        //chickenAvatar.setFrameDirection(1);
        //chickenAvatar.framerate = 20;
        //chickenAvatar.setAnimation(chickenDeathAnimation);
        //chickenAvatar.mtxLocal.translateY(0);
        //chickenAvatar.mtxLocal.translateZ(2);
        //chickenAvatar.mtxLocal.scaleX(1.5);
        //chickenAvatar.mtxLocal.scaleY(2);
        graph = Script.viewport.getBranch();
        //graph.addChild(chickenAvatar);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    function update(_event) {
        spawnChicken();
        //moveEnemy();
        //ƒ.AudioManager.default.update();
        //let timeFrame: number = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
        //chickenAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("left") ? 180 : 0);
        //ySpeed += gravity * timeFrame;
        //  let pos: ƒ.Vector3 = chickenAvatar.mtxLocal.translation;
        //  pos.y += ySpeed * timeFrame;
        //
        //  chicken.mtxLocal.translation = pos;
        //
        //  if (pos.y < -2.5) {
        //    ySpeed = 0;
        //    pos.y = -2.5;
        //    isGrounded = true;
        //  }
        //  if(isGrounded == true){
        //  }
        //  //chickenAvatar.mtxLocal.translation = pos;
        Script.viewport.draw();
        chickenContainer.getChildren().forEach(function (element) {
            if (element instanceof Script.Chicken) {
                element.move();
            }
        });
    }
    //mtxLocal.translation.y = 0 matrix translation an Y
    //mtxLocal.translation = V neuer Vektor
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    function pickByComponent(_event) {
        console.log("pickByComponent");
        Reflect.set(_event, "closestDistance", Infinity);
        Reflect.set(_event, "closestchickens", null);
        Script.viewport.dispatchPointerEvent(_event);
        hitchickens(Reflect.get(_event, "closestchickens"));
    }
    Script.pickByComponent = pickByComponent;
    function hitComponent(_event) {
        let chickens = _event.target;
        let closestDistance = Reflect.get(_event, "closestDistance");
        let pick = Reflect.get(_event, "pick");
        if (pick.zBuffer < closestDistance) {
            Reflect.set(_event, "closestDistance", pick.zBuffer);
            Reflect.set(_event, "closestchickens", chickens);
        }
    }
    Script.hitComponent = hitComponent;
    function pickByCamera(_event) {
        console.log("pickCamera");
        let picks = ƒ.Picker.pickViewport(Script.viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
        picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
        console.log(picks[0]);
        if (_event.button == 0) {
            hitchickens(picks[0]?.node);
        }
        // else if(_event.button == 2){
        //   let posNewchickens: ƒ.Vector3 = 
        //   console.log(picks[0].normal.toString());
        //   addchickens();
        // }
    }
    Script.pickByCamera = pickByCamera;
    function pickByRadius(_event) {
        console.log("pickByRay");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest;
        let found;
        let compare = Math.pow(0.7, 2);
        for (let chickens of Script.chicken.getChildren()) {
            if (compare < ray.getDistance(chickens.mtxWorld.translation).magnitudeSquared)
                continue;
            let distance = ƒ.Vector3.DIFFERENCE(chickens.mtxWorld.translation, ray.origin).magnitudeSquared;
            if (shortest == undefined || distance < shortest) {
                shortest = distance;
                found = Script.chicken;
            }
        }
        hitchickens(found);
    }
    Script.pickByRadius = pickByRadius;
    // export function pickByGrid(_event: PointerEvent): void {
    //   console.log("pickByGrid");
    //   let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
    //   let posCheck: ƒ.Vector3 = ray.origin.clone;
    //   let vctStep: ƒ.Vector3 = ray.direction.clone;
    //   // find largest component value
    //   let largest: number = vctStep.get().reduce((_p, _c) => Math.max(_p, Math.abs(_c)));
    //   // normalize to 1 in that direction
    //   vctStep.scale(1 / largest);
    //   for (let i: number = 0; i < 100; i++) {
    //     posCheck.add(vctStep);
    //     let posGrid: ƒ.Vector3 = posCheck.map(_value => Math.round(_value));
    //     console.log(posGrid.toString(), posCheck.toString());
    //     try {
    //       //let chickens = grid[posGrid.y][posGrid.z][posGrid.x];
    //       if (chickens) {
    //         hitchickens(chickens);
    //         return;
    //       }
    //     } catch (_e) { }
    //   }
    // }
    function hitchickens(_chickens) {
        if (!_chickens)
            return;
        console.log(_chickens.name);
        _chickens.getParent().removeChild(_chickens);
        Script.viewport.draw();
    }
    // function addchickens(_pos: ƒ.Vector3){
    //     let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
    //     chickens.addChild(new chickens(_pos, ƒ.Color.CSS(txtColor)));
    // }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map