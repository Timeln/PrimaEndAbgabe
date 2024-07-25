"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Chicken extends ƒAid.NodeSprite {
        constructor(_name, _position, _size, flyDirection, verticalFlapForce) {
            super(_name);
            this.animationstate = "fly";
            //private readonly mtrSolidWhite: ƒ.Material;
            //private readonly mtrSolidRed: ƒ.Material;
            //private readonly materialAlive: ƒ.ComponentMaterial;
            //private readonly materialDead: ƒ.ComponentMaterial;
            this.meshQuad = new ƒ.MeshQuad();
            this.rigidBody = new ƒ.ComponentRigidbody(Chicken.MASS);
            this._alive = true;
            this.velocity = ƒ.Vector3.ZERO();
            this.coat = new ƒ.CoatTextured(undefined, Script.chickenSpriteSheet);
            this.flyDirection = flyDirection;
            this.flapForceVertical = verticalFlapForce;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            this.rigidBody.collisionMask = 0;
            this.rigidBody.effectGravity = 0.1;
            this.rigidBody.applyLinearImpulse(new ƒ.Vector3(flyDirection, 0, 0));
            this.addComponent(this.rigidBody);
            let cmpQuad = new ƒ.ComponentMesh(this.meshQuad);
            //this.addComponent(cmpQuad);
            //this.addComponent(this.materialAlive);
            this.initAnimations();
        }
        initAnimations() {
            this.chickenFlyAnimation = new ƒAid.SpriteSheetAnimation("Fly", this.coat);
            this.chickenFlyAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0, 120, 111), 3, 120, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(120));
            this.chickenDeathAnimation = new ƒAid.SpriteSheetAnimation("Death", this.coat);
            this.chickenDeathAnimation.generateByGrid(ƒ.Rectangle.GET(0, 112, 120, 111), 3, 120, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(120));
            this.setAnimation(this.chickenFlyAnimation);
            this.setFrameDirection(1);
            this.framerate = 3;
            this.mtxLocal.rotation = ƒ.Vector3.Y(this.flyDirection < 0 ? 180 : 0);
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
                this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.flyDirection, this.flapForceVertical, 0));
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
                //this.removeComponent(this.materialAlive);
                //this.addComponent(this.materialDead);
                this.setAnimation(this.chickenDeathAnimation);
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
    Chicken.FLAP_THRESHOLD = -2;
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
    let config;
    document.addEventListener("interactiveViewportStarted", start);
    // resources
    Script.chickenSpriteSheet = new ƒ.TextureImage();
    async function start(_event) {
        let response = await fetch("config.json");
        config = await response.json();
        console.log(config);
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        Script.chickenContainer = new ƒ.Node("ChickenContainer");
        Script.graph.addChild(Script.chickenContainer);
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
        Script.viewport.camera = cmpCamera;
        rng = new ƒ.Random(0); // TODO non-deterministc seed
        time = new ƒ.Time();
        player = new Script.Player(3);
        //Shot Event
        Script.viewport.canvas.addEventListener("pointerdown", (_event) => { player.pickByRadius(_event); });
        // Load resources 
        Script.chickenSpriteSheet.load("./images/chickenSpriteSheetEigen.jpg");
        Script.Hud.start(player);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    // Spawning
    let minSpawnInterval = 1500; // In miliseconds
    let timeSinceLastSpawn = 0;
    let leftSpawn = -12;
    let rightSpawn = 12;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;
    let maxChickens = 5;
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
            if (rng.getBoolean()) { // Spawn left...
                spawnPos = new ƒ.Vector2(leftSpawn, rng.getRange(-5, 7));
                speed = 1;
            }
            else { // ...or right
                spawnPos = new ƒ.Vector2(rightSpawn, rng.getRange(-5, 7));
                speed = -1;
            }
            let newChicken = new Script.Chicken("Chicken", spawnPos, new ƒ.Vector2(1, 1), speed * config.flapForceHorizontal, config.flapForceVertical);
            console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y + ") (" + Script.chickenContainer.getChildren.length + ")");
            Script.chickenContainer.addChild(newChicken);
        }
    }
    //async function chickenNodeInit(_event: Event): Promise<void> {
    //let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
    //graph = viewport.getBranch();
    //graph.addChild(chickenAvatar);
    //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    //ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
    //}
    function update(_event) {
        ƒ.Physics.simulate();
        spawnChicken();
        // Simulate chickens
        for (let chicken of Script.chickenContainer.getChildren()) {
            if (chicken instanceof Script.Chicken) {
                if ((chicken.getPosition().x < leftSpawn - 1 || chicken.getPosition().x > rightSpawn + 1) && chicken.alive) {
                    console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
                    Script.chickenContainer.removeChild(chicken);
                    player.removeLive();
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
        if (player.playerLives <= 0 && !gameOverShown) {
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
    let PLAYER_STATE;
    (function (PLAYER_STATE) {
        PLAYER_STATE[PLAYER_STATE["READY_TO_SHOOT"] = 0] = "READY_TO_SHOOT";
        PLAYER_STATE[PLAYER_STATE["RELOAD"] = 1] = "RELOAD";
        PLAYER_STATE[PLAYER_STATE["GAME_OVER"] = 2] = "GAME_OVER";
    })(PLAYER_STATE = Script.PLAYER_STATE || (Script.PLAYER_STATE = {}));
    class Player extends ƒ.Mutable {
        constructor(lives) {
            super();
            this.score = 0;
            this.ammo = 5;
            this.createSoundNode();
            this.health = lives;
        }
        reduceMutator(_mutator) { }
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
                this.score += 5;
                console.log(this.score);
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
        createReloadSoundNode() {
            // Lade die Sounddatei
            let audio = new ƒ.Audio("./Sounds/reload.mp3");
            // Erstelle die Audio-Komponente und füge die geladene Sounddatei hinzu
            this.cmpAudio = new ƒ.ComponentAudio(audio, false, false);
            // Erstelle einen Knoten, um die Audio-Komponente zu hosten, und füge die Audio-Komponente hinzu
            Script.graph.addComponent(this.cmpAudio);
        }
        removeLive() {
            this.health--;
        }
        get playerLives() {
            return this.health;
        }
    }
    Script.Player = Player;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒaid = FudgeAid;
    class ComponentStateMachineEnemy extends ƒaid.ComponentStateMachine {
        constructor() {
            super();
            this.instructions = ComponentStateMachineEnemy.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒaid.StateMachineInstructions();
            // Do this when the player wants to shoot
            setup.setAction(Script.PLAYER_STATE.READY_TO_SHOOT, (_machine) => {
                let player = _machine.node;
                if (player instanceof Script.Player) {
                    if (player.ammo > 0) {
                        // TODO what to do here? Can't pass PointerEvent?
                        //player.pickByRadius();
                    }
                    else {
                        _machine.transit(Script.PLAYER_STATE.RELOAD);
                    }
                }
            });
            // TODO transit between RELOAD and READO_TO_SHOOT and GAME_OVER
            //setup.setAction(JOB.PATROL, (_machine) => {
            //  let container: Enemy = <Enemy>(<ƒaid.ComponentStateMachine<JOB>>_machine).getContainer();
            //  // console.log(container);
            //  if (container.mtxLocal.translation.equals(container.posTarget, 0.1))
            //    _machine.transit(JOB.IDLE);
            //  container.move();
            //});
            //
            //setup.setTransition(JOB.PATROL, JOB.IDLE, (_machine) => {
            //  let container: Enemy = <Enemy>(<ƒaid.ComponentStateMachine<JOB>>_machine).getContainer();
            //  ƒ.Time.game.setTimer(3000, 1, (_event: ƒ.EventTimer) => {
            //    container.chooseTargetPosition();
            //    _machine.transit(JOB.PATROL);
            //  })
            //});
            return setup;
        }
    }
    ComponentStateMachineEnemy.instructions = ComponentStateMachineEnemy.setupStateMachine();
    Script.ComponentStateMachineEnemy = ComponentStateMachineEnemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒui = FudgeUserInterface;
    class Hud {
        static start(player) {
            let domHud = document.querySelector("div#hud");
            Hud.controller = new ƒui.Controller(player, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    Script.Hud = Hud;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map