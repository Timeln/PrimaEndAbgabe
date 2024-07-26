"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let CHICKEN_STATE;
    (function (CHICKEN_STATE) {
        CHICKEN_STATE[CHICKEN_STATE["ALIVE"] = 0] = "ALIVE";
        CHICKEN_STATE[CHICKEN_STATE["DEAD"] = 1] = "DEAD";
    })(CHICKEN_STATE = Script.CHICKEN_STATE || (Script.CHICKEN_STATE = {}));
    class Chicken extends ƒAid.NodeSprite {
        constructor(_name, _position, _size, flyDirection, verticalFlapForce) {
            super(_name);
            this.rigidBody = new ƒ.ComponentRigidbody(Chicken.MASS);
            this.velocity = ƒ.Vector3.ZERO();
            this.coat = new ƒ.CoatTextured(undefined, Script.chickenSpriteSheet);
            this.stateMachine = new Script.ComponentStateMachineChicken();
            this.flyDirection = flyDirection;
            this.flapForceVertical = verticalFlapForce;
            this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            this.rigidBody.collisionMask = 0;
            this.rigidBody.effectGravity = 0.1;
            this.rigidBody.applyLinearImpulse(new ƒ.Vector3(flyDirection, 0, 0));
            this.addComponent(this.rigidBody);
            this.addComponent(this.stateMachine);
            this.stateMachine.stateCurrent = CHICKEN_STATE.ALIVE;
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
        update() {
            this.stateMachine.act();
        }
        flap() {
            if (this.currentState == CHICKEN_STATE.ALIVE && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
                console.log("FLAP! I am at [" + this.getPosition().x + "|" + this.getPosition().y + "]");
                this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.flyDirection, this.flapForceVertical, 0));
            }
        }
        getPosition() {
            return this.rigidBody.getPosition();
        }
        hit() {
            this.stateMachine.transit(CHICKEN_STATE.DEAD);
            this.setAnimation(this.chickenDeathAnimation);
        }
        get currentState() {
            return this.stateMachine.stateCurrent;
        }
    }
    Chicken.MASS = 1;
    Chicken.FLAP_THRESHOLD = -2;
    Script.Chicken = Chicken;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class ChickenHandler extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.spawnLeft = -12;
            this.spawnRight = 12;
            this.despawnThreshold = 1;
            this.maxChickens = 5;
            this.spawnInterval = 1500;
            this.timeSinceLastSpawn = 0;
            this.handlerTime = new ƒ.Time();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.update);
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
            this.update = (_event) => {
                this.spawnChicken();
                // Simulate chickens
                if (Script.chickenContainer) {
                    for (let chicken of Script.chickenContainer.getChildren()) {
                        if (chicken instanceof Script.Chicken) {
                            if ((chicken.getPosition().x < this.spawnLeft - this.despawnThreshold || chicken.getPosition().x > this.spawnRight + this.despawnThreshold) && chicken.currentState == Script.CHICKEN_STATE.ALIVE) {
                                console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
                                Script.chickenContainer.removeChild(chicken);
                                Script.player.removeLive();
                                Script.Hud.forceUpdate(); //The UI doesn't update fast enough, so when the player health drops to 0 and the game-over popup shows, the health is still shown as '1'. To prevent this, force the UI to update NOW
                            }
                            else if (chicken.getPosition().y < -5 && chicken.currentState == Script.CHICKEN_STATE.DEAD) {
                                console.log("Cleaning up dead chicken from the ground... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
                                Script.chickenContainer.removeChild(chicken);
                            }
                            else {
                                chicken.update();
                            }
                        }
                    }
                    ;
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
        // Should we spawn a chicken in this frame or not?
        spawnChicken() {
            let now = this.handlerTime.get();
            // Enough time elapsed to spawn a new chicken?
            if (now - this.timeSinceLastSpawn > this.spawnInterval && Script.chickenContainer.getChildren().length < this.maxChickens) {
                this.timeSinceLastSpawn = now;
                let spawnPos;
                let speed;
                if (Script.rng.getBoolean()) { // Spawn left...
                    spawnPos = new ƒ.Vector2(this.spawnLeft, Script.rng.getRange(-5, 7));
                    speed = 1;
                }
                else { // ...or right
                    spawnPos = new ƒ.Vector2(this.spawnRight, Script.rng.getRange(-5, 7));
                    speed = -1;
                }
                let newChicken = new Script.Chicken("Chicken", spawnPos, new ƒ.Vector2(1, 1), speed * Script.config.flapForceHorizontal, Script.config.flapForceVertical);
                console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y + ") (" + Script.chickenContainer.getChildren.length + ")");
                Script.chickenContainer.addChild(newChicken);
            }
        }
    }
    // Register the script as component for use in the editor via drag&drop
    ChickenHandler.iSubclass = ƒ.Component.registerSubclass(ChickenHandler);
    Script.ChickenHandler = ChickenHandler;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒaid = FudgeAid;
    class ComponentStateMachineChicken extends ƒaid.ComponentStateMachine {
        constructor() {
            super();
            this.instructions = ComponentStateMachineChicken.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒaid.StateMachineInstructions();
            // Do this when the player wants to shoot
            setup.setAction(Script.CHICKEN_STATE.ALIVE, (_machine) => {
                let chick = _machine.node;
                if (chick instanceof Script.Chicken) {
                    chick.flap();
                }
                else {
                    console.error("Attached node is not a Chicken");
                }
            });
            setup.setTransition(Script.CHICKEN_STATE.ALIVE, Script.CHICKEN_STATE.DEAD, (_machine) => {
                console.log("Chicken shot.");
            });
            setup.setAction(Script.CHICKEN_STATE.DEAD, (_machine) => {
                let chick = _machine.node;
                if (chick instanceof Script.Chicken) {
                }
                else {
                    console.error("Attached node is not a Chicken");
                }
            });
            return setup;
        }
    }
    ComponentStateMachineChicken.instructions = ComponentStateMachineChicken.setupStateMachine();
    Script.ComponentStateMachineChicken = ComponentStateMachineChicken;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    // resources
    Script.chickenSpriteSheet = new ƒ.TextureImage();
    async function start(_event) {
        let response = await fetch("config.json");
        Script.config = await response.json();
        console.log(Script.config);
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        Script.chickenContainer = new ƒ.Node("ChickenContainer");
        Script.graph.addChild(Script.chickenContainer);
        let cmpCamera = Script.viewport.getBranch().getComponent(ƒ.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        Script.rng = new ƒ.Random(0); // TODO non-deterministc seed
        Script.player = new Script.Player(3);
        //Shot Event
        Script.viewport.canvas.addEventListener("pointerdown", (_event) => { Script.player.pickByRadius(_event); });
        // Load resources 
        Script.chickenSpriteSheet.load("./images/chickenSpriteSheetEigen.png");
        Script.Hud.start(Script.player);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    let gameOverShown = false;
    function update(_event) {
        // Game over screen
        if (Script.player.playerLives <= 0 && !gameOverShown) {
            gameOverShown = true;
            alert("Game Over. Reload to play again or press 'OK'");
            window.location.reload();
        }
        ƒ.Physics.simulate();
        Script.viewport.draw();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Player extends ƒ.Mutable {
        constructor(lives) {
            super();
            this.score = 0;
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
            let audio = new ƒ.Audio("./Sounds/shot.mp3");
            this.cmpAudio = new ƒ.ComponentAudio(audio, false, false);
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
    var ƒui = FudgeUserInterface;
    class Hud {
        static start(player) {
            let domHud = document.querySelector("div#hud");
            Hud.controller = new ƒui.Controller(player, domHud);
            Hud.controller.updateUserInterface();
        }
        static forceUpdate() {
            Hud.controller.updateUserInterface();
        }
    }
    Script.Hud = Hud;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map