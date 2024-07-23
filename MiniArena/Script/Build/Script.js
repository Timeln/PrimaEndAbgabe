"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Chicken extends ƒ.Node {
        constructor(_name, _position, _size, direction, collisionGroup) {
            super(_name);
            this.rigidBody = new ƒ.ComponentRigidbody(Chicken.MASS);
            this._alive = true;
            this.velocity = ƒ.Vector3.ZERO();
            this.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());
            this.mtrSolidRed = new ƒ.Material("SolidRed", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
            this.materialAlive = new ƒ.ComponentMaterial(this.mtrSolidWhite);
            this.materialDead = new ƒ.ComponentMaterial(this.mtrSolidRed);
            this.direction = direction;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            this.rigidBody.collisionGroup = collisionGroup;
            this.rigidBody.effectGravity = 0.1;
            this.rigidBody.applyLinearImpulse(new ƒ.Vector3(direction, 0, 0));
            this.addComponent(this.rigidBody);
            let cmpQuad = new ƒ.ComponentMesh(Chicken.meshQuad);
            this.addComponent(cmpQuad);
            this.addComponent(this.materialAlive);
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
            //console.log("Current velocity: " + this.rigidBody.getVelocity().y);
            if (this.alive && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
                console.log("FLAP! I am at [" + this.getPosition().x + "|" + this.getPosition().y + "]");
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
                this.removeComponent(this.materialAlive);
                this.addComponent(this.materialDead);
            }
        }
        get alive() {
            return this._alive;
        }
        set alive(_alive) {
            this._alive = _alive;
        }
        get collisionGroup() {
            return this.rigidBody.collisionGroup;
        }
    }
    Chicken.MASS = 1;
    Chicken.FLAP_FORCE = 4.3;
    Chicken.FLAP_THRESHOLD = -2;
    Chicken.meshQuad = new ƒ.MeshQuad();
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
    let rng;
    let time;
    let player;
    document.addEventListener("interactiveViewportStarted", start);
    // resources
    let chickenSpriteSheet = new ƒ.TextureImage();
    function start(_event) {
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        Script.chickenContainer = new ƒ.Node("ChickenContainer");
        Script.graph.addChild(Script.chickenContainer);
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
        Script.viewport.camera = cmpCamera;
        rng = new ƒ.Random(0); // TODO non-deterministc seed
        time = new ƒ.Time();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        chickenNodeInit(_event);
        player = new Script.Player();
        //Shot Event
        Script.viewport.canvas.addEventListener("pointerdown", (_event) => { player.pickByRadius(_event); });
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
    //chickenSprite
    //let chickenAvatar: ƒAid.NodeSprite;
    //let cmpAudio: ƒ.ComponentAudio;
    // Spawning
    let minSpawnInterval = 1500; // In miliseconds
    let timeSinceLastSpawn = 0;
    let leftSpawn = -12;
    let rightSpawn = 12;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;
    let maxChickens = 5;
    let playerLives = 3; // Every time a chicken survives, this counts down. When 0, the player loses
    let gameOverShown = false;
    let animation = "";
    let AVAILABLE_COLLISION_GROUPS = [ƒ.COLLISION_GROUP.GROUP_1, ƒ.COLLISION_GROUP.GROUP_2, ƒ.COLLISION_GROUP.GROUP_3, ƒ.COLLISION_GROUP.GROUP_4, ƒ.COLLISION_GROUP.GROUP_5];
    // Should we spawn a chicken in this frame or not?
    function spawnChicken() {
        let now = time.get();
        // Enough time elapsed to spawn a new chicken?
        if (now - timeSinceLastSpawn > minSpawnInterval && Script.chickenContainer.getChildren().length < maxChickens) {
            timeSinceLastSpawn = now;
            let spawnPos;
            let speed;
            if (rng.getBoolean()) { // Spawn left
                spawnPos = new ƒ.Vector2(leftSpawn, rng.getRange(-5, 7));
                speed = 1;
            }
            else { // ...or right
                spawnPos = new ƒ.Vector2(rightSpawn, rng.getRange(-5, 7));
                speed = -1;
            }
            //find a free collision group
            let freeCollisionGroup = null;
            for (let collGroup of AVAILABLE_COLLISION_GROUPS) {
                let found = true;
                for (let chicken of Script.chickenContainer.getChildren()) {
                    if (chicken instanceof Script.Chicken && chicken.collisionGroup == collGroup) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    freeCollisionGroup = collGroup;
                    break;
                }
            }
            let newChicken;
            if (freeCollisionGroup) {
                console.log("Collision group " + freeCollisionGroup.toString() + " is free. Using for new chicken.");
                newChicken = new Script.Chicken("Chicken", spawnPos, new ƒ.Vector2(1, 1), speed, freeCollisionGroup);
            }
            else {
                console.log("NO FREE COLLISION GROUP FOUND. THIS SHOULD NOT HAPPEN. FIX ME.");
            }
            //newChicken.setAnimation(chickenFlyAnimation);
            //newChicken.setFrameDirection(1);
            //newChicken.framerate = 20;
            //newChicken.setAnimation(chickenDeathAnimation);
            console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y + ") (" + Script.chickenContainer.getChildren.length + ")");
            Script.chickenContainer.addChild(newChicken);
        }
    }
    async function chickenNodeInit(_event) {
        let chickenSpriteSheet = new ƒ.TextureImage();
        await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
        let coat = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
        initAnimations(coat);
        //chickenAvatar = new ƒAid.NodeSprite("chicken_Sprite");
        //chickenAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        //chickenAvatar.setAnimation(chickenFlyAnimation);
        //chickenAvatar.setFrameDirection(1);
        //chickenAvatar.framerate = 20;
        //chickenAvatar.setAnimation(chickenDeathAnimation);
        //chickenAvatar.mtxLocal.translateY(0);
        //chickenAvatar.mtxLocal.translateZ(2);
        //chickenAvatar.mtxLocal.scaleX(1.5);
        //chickenAvatar.mtxLocal.scaleY(2);
        Script.graph = Script.viewport.getBranch();
        //graph.addChild(chickenAvatar);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    }
    function update(_event) {
        ƒ.Physics.simulate();
        spawnChicken();
        // Simulate chickens
        for (let chicken of Script.chickenContainer.getChildren()) {
            if (chicken instanceof Script.Chicken) {
                if ((chicken.getPosition().x < leftSpawn - 1 || chicken.getPosition().x > rightSpawn + 1) && chicken.alive) {
                    console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
                    Script.chickenContainer.removeChild(chicken);
                    playerLives--;
                }
                else if (chicken.getPosition().y < -5 && !chicken.alive) {
                    console.log("Cleaning up dead chicken from the ground... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
                    Script.chickenContainer.removeChild(chicken);
                }
                else {
                    chicken.move();
                }
            }
        }
        ;
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
    class Player {
        constructor() {
            this.createSoundNode();
        }
        pickByRadius(_event) {
            console.log("Picking by radius...");
            let ray = Script.viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
            let shortest;
            let found;
            let compare = Math.pow(0.7, 2);
            this.cmpAudio.play(true);
            console.log("schuss");
            for (let chicken of Script.chickenContainer.getChildren()) {
                if (compare < ray.getDistance(chicken.mtxWorld.translation).magnitudeSquared)
                    continue;
                let distance = ƒ.Vector3.DIFFERENCE(chicken.mtxWorld.translation, ray.origin).magnitudeSquared;
                if (shortest == undefined || distance < shortest) {
                    shortest = distance;
                    found = chicken;
                }
            }
            this.hitchicken(found);
        }
        hitchicken(chicken) {
            if (!chicken)
                return;
            console.log(chicken.name);
            if (chicken instanceof Script.Chicken) {
                chicken.hit();
            }
        }
        createSoundNode() {
            // Lade die Sounddatei
            let audio = new ƒ.Audio("./Sounds/shot.mp3");
            // Erstelle die Audio-Komponente und füge die geladene Sounddatei hinzu
            this.cmpAudio = new ƒ.ComponentAudio(audio, false, false);
            // Erstelle einen Knoten, um die Audio-Komponente zu hosten, und füge die Audio-Komponente hinzu
            Script.graph.addComponent(this.cmpAudio);
        }
    }
    Script.Player = Player;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map