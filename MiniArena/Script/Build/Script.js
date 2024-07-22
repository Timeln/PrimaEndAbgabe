"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Chicken extends ƒ.Node {
        constructor(_name, _position, _size, direction) {
            super(_name);
            this.rigidBody = new ƒ.ComponentRigidbody(Chicken.MASS);
            this.alive = true;
            this.velocity = ƒ.Vector3.ZERO();
            this.direction = direction;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            this.rigidBody.effectGravity = 0.1;
            this.rigidBody.applyLinearImpulse(new ƒ.Vector3(direction, 0, 0));
            this.addComponent(this.rigidBody);
            let cmpQuad = new ƒ.ComponentMesh(Chicken.meshQuad);
            this.addComponent(cmpQuad);
            //cmpQuad.pivot.scale(_size.toVector3(0));
            this.addComponent(Chicken.materialAlive);
            //this.velocity = new ƒ.Vector3(ƒ.Random.default.getRange(-1, 1), ƒ.Random.default.getRange(-1, 1), 0);
            //this.velocity = new ƒ.Vector3(direction, 0, 0);
            //this.velocity.normalize(this.speed);
        }
        /**
         * move moves the game object and the collision detection reactangle
         */
        move() {
            //let frameTime: number = ƒ.Loop.timeFrameGame / 1000;
            //let force: ƒ.Vector3 = ƒ.Vector3.SCALE(new ƒ.Vector3(0, 9.81, 0), frameTime);
            this.flap();
            //this.translate(distance);
        }
        flap() {
            console.log("Current velocity: " + this.rigidBody.getVelocity().y);
            if (this.alive && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
                console.log("FLAP!");
                this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.direction / 2, Chicken.FLAP_FORCE, 0));
            }
        }
        translate(_distance) {
            this.mtxLocal.translate(_distance);
            this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
        getPosition() {
            return this.rigidBody.getPosition();
        }
        hit() {
            if (this.alive) {
                this.alive = false;
                this.removeComponent(Chicken.materialAlive);
                this.addComponent(Chicken.materialDead);
            }
        }
        isAlive() {
            return this.alive;
        }
    }
    Chicken.MASS = 1;
    Chicken.FLAP_FORCE = 4.3;
    Chicken.FLAP_THRESHOLD = -2;
    Chicken.meshQuad = new ƒ.MeshQuad();
    //private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
    Chicken.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());
    Chicken.mtrSolidRed = new ƒ.Material("SolidRed", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
    Chicken.materialAlive = new ƒ.ComponentMaterial(Chicken.mtrSolidWhite);
    Chicken.materialDead = new ƒ.ComponentMaterial(Chicken.mtrSolidRed);
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
    let rng;
    let time;
    document.addEventListener("interactiveViewportStarted", start);
    // resources
    let chickenSpriteSheet = new ƒ.TextureImage();
    function start(_event) {
        Script.viewport = _event.detail;
        graph = Script.viewport.getBranch();
        Script.chickenContainer = new ƒ.Node("ChickenContainer");
        graph.addChild(Script.chickenContainer);
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
        Script.viewport.camera = cmpCamera;
        rng = new ƒ.Random(0); // TODO non-deterministc seed
        time = new ƒ.Time();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        chickenNodeInit(_event);
        //Shot Event
        Script.viewport.canvas.addEventListener("pointerdown", Script.pickByRadius);
        Script.viewport.getBranch().addEventListener("pointerdown", Script.hitComponent);
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
    function initializeSounds() {
        //audioShot = new ƒ.Audio("./sounds/death.wav");
    }
    //chickenSprite
    //let chickenAvatar: ƒAid.NodeSprite;
    //let cmpAudio: ƒ.ComponentAudio;
    // Spawning
    let minSpawnInterval = 500; // In miliseconds
    let timeSinceLastSpawn = 0;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;
    let maxChickens = 3;
    let playerLives = 3; // Every time a chicken survives, this counts down. When 0, the player loses
    let gameOverShown = false;
    let animation = "";
    // Should we spawn a chicken in this frame or not?
    function spawnChicken() {
        let now = time.get();
        // Enough time elapsed to spawn a new chicken?
        if (now - timeSinceLastSpawn > minSpawnInterval && Script.chickenContainer.getChildren().length < maxChickens) {
            timeSinceLastSpawn = now;
            let spawnPos;
            let speed;
            if (rng.getBoolean()) { // Spawn left
                spawnPos = new ƒ.Vector2(-5, rng.getRange(-7, 7));
                speed = 1;
            }
            else { // ...or right
                spawnPos = new ƒ.Vector2(5, rng.getRange(-7, 7));
                speed = -1;
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
            console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y + ") (" + Script.chickenContainer.getChildren.length + ")");
            Script.chickenContainer.addChild(newChicken);
        }
    }
    async function chickenNodeInit(_event) {
        let chickenSpriteSheet = new ƒ.TextureImage();
        await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
        let coat = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
        initAnimations(coat);
        //chicken = graph.getChildrenByName("Charakter")[0].getChildrenByName("chicken")[0];
        //chicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
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
        ƒ.Physics.simulate();
        spawnChicken();
        // Simulate chickens
        Script.chickenContainer.getChildren().forEach(function (element) {
            if (element instanceof Script.Chicken) {
                if ((element.getPosition().x < -6 || element.getPosition().x > 6) && element.isAlive()) {
                    Script.chickenContainer.removeChild(element);
                    playerLives--;
                }
                else if (element.getPosition().y < -5 && !element.isAlive()) {
                    Script.chickenContainer.removeChild(element);
                }
                else {
                    element.move();
                }
            }
        });
        // Game over screen
        if (playerLives <= 0 && !gameOverShown) {
            gameOverShown = true;
            alert("Game Over");
        }
        Script.viewport.draw();
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
        Reflect.set(_event, "closestchicken", null);
        Script.viewport.dispatchPointerEvent(_event);
        hitchicken(Reflect.get(_event, "closestchicken"));
    }
    Script.pickByComponent = pickByComponent;
    function hitComponent(_event) {
        let chicken = _event.target;
        let closestDistance = Reflect.get(_event, "closestDistance");
        let pick = Reflect.get(_event, "pick");
        if (pick.zBuffer < closestDistance) {
            Reflect.set(_event, "closestDistance", pick.zBuffer);
            Reflect.set(_event, "closestchicken", chicken);
        }
    }
    Script.hitComponent = hitComponent;
    function pickByCamera(_event) {
        console.log("pickCamera");
        let picks = ƒ.Picker.pickViewport(Script.viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
        picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
        console.log(picks[0]);
        if (_event.button == 0) {
            hitchicken(picks[0]?.node);
        }
        // else if(_event.button == 2){
        //   let posNewchicken: ƒ.Vector3 = 
        //   console.log(picks[0].normal.toString());
        //   addchicken();
        // }
    }
    Script.pickByCamera = pickByCamera;
    function pickByRadius(_event) {
        console.log("pickByRay");
        let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest;
        let found;
        let compare = Math.pow(0.7, 2);
        for (let chicken of Script.chickenContainer.getChildren()) {
            if (compare < ray.getDistance(chicken.mtxWorld.translation).magnitudeSquared)
                continue;
            let distance = ƒ.Vector3.DIFFERENCE(chicken.mtxWorld.translation, ray.origin).magnitudeSquared;
            if (shortest == undefined || distance < shortest) {
                shortest = distance;
                found = chicken;
            }
        }
        hitchicken(found);
    }
    Script.pickByRadius = pickByRadius;
    function hitchicken(chicken) {
        if (!chicken)
            return;
        console.log(chicken.name);
        if (chicken instanceof Script.Chicken) {
            chicken.hit();
        }
        Script.viewport.draw();
    }
    // function addchicken(_pos: ƒ.Vector3){
    //     let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
    //     chicken.addChild(new chicken(_pos, ƒ.Color.CSS(txtColor)));
    // }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map