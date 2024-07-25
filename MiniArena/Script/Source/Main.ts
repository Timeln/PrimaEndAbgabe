namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  export let graph: ƒ.Node;
  export let viewport: ƒ.Viewport;
  export let chickenContainer: ƒ.Node; //Holds chickens
  let rng: ƒ.Random;
  let time: ƒ.Time;
  let player: Player;
  let config: {[key: string]: number};
  document.addEventListener("interactiveViewportStarted", start);

  // resources
  export let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();

  async function start(_event: Event): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    console.log(config);

    viewport = (<CustomEvent>_event).detail;
    graph = viewport.getBranch();

    chickenContainer = new ƒ.Node("ChickenContainer");
    graph.addChild(chickenContainer);
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
    viewport.camera = cmpCamera;
    rng = new ƒ.Random(0); // TODO non-deterministc seed
    time = new ƒ.Time();

    player = new Player(3);


    

    //Shot Event
    viewport.canvas.addEventListener("pointerdown", (_event) => {player.pickByRadius(_event)});

    // Load resources 
   
    chickenSpriteSheet.load("./images/chickenSpriteSheetEigen.jpg");
      Hud.start(player);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }
  
    // Spawning
    let minSpawnInterval: number = 1500; // In miliseconds
    let timeSinceLastSpawn: number = 0;
    let leftSpawn = -12;
    let rightSpawn = 12;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;

    let maxChickens: number = 5;

    
    let gameOverShown: boolean = false;
    let animation: string = "";
    let AVAILABLE_COLLISION_GROUPS: ƒ.COLLISION_GROUP[] = [ƒ.COLLISION_GROUP.GROUP_1, ƒ.COLLISION_GROUP.GROUP_2, ƒ.COLLISION_GROUP.GROUP_3, ƒ.COLLISION_GROUP.GROUP_4, ƒ.COLLISION_GROUP.GROUP_5];
  // Should we spawn a chicken in this frame or not?
  function spawnChicken(): void {
    let now: number = time.get();
    
    // Enough time elapsed to spawn a new chicken?
    if(now - timeSinceLastSpawn > minSpawnInterval && chickenContainer.getChildren().length < maxChickens) {
      timeSinceLastSpawn = now;
      let spawnPos: ƒ.Vector2;
      let speed: number;
      if(rng.getBoolean()) {  // Spawn left...
        spawnPos = new ƒ.Vector2(leftSpawn, rng.getRange(-5, 7));
        speed = 1;
      } else {                // ...or right
        spawnPos = new ƒ.Vector2(rightSpawn, rng.getRange(-5, 7));
        speed = -1;
      }
      
      let newChicken : Chicken = new Chicken("Chicken", spawnPos, new ƒ.Vector2(1,1), speed * config.flapForceHorizontal, config.flapForceVertical);

      console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y +") (" + chickenContainer.getChildren.length + ")");

      chickenContainer.addChild(newChicken);
    }
  }
  
   //async function chickenNodeInit(_event: Event): Promise<void> {
     
     
     //let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
     
    //graph = viewport.getBranch();
     //graph.addChild(chickenAvatar);


     //ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     //ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
   //}

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    spawnChicken();
    
    
    // Simulate chickens
    for (let chicken of chickenContainer.getChildren()) {
      if(chicken instanceof Chicken) {
        if((chicken.getPosition().x < leftSpawn - 1 || chicken.getPosition().x > rightSpawn + 1) && chicken.alive) {
          console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
          chickenContainer.removeChild(chicken);
          player.removeLive()
        } else if(chicken.getPosition().y < -5 && !chicken.alive) {
          console.log("Cleaning up dead chicken from the ground... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
          chickenContainer.removeChild(chicken);
        } else {
          chicken.move();
        }
      }
    };

    // Game over screen
    if(player.playerLives <= 0 && !gameOverShown) {
      gameOverShown = true;
      alert("Game Over");
    }
    viewport.draw();
  }
//mtxLocal.translation.y = 0 matrix translation an Y
//mtxLocal.translation = V neuer Vektor
}