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

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  // resources
  let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    chickenContainer = new ƒ.Node("ChickenContainer");
    graph.addChild(chickenContainer);
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    //console.log("Camera is at (" + cmpCamera.get+ "" + + "|" + + ")")
    viewport.camera = cmpCamera;
    rng = new ƒ.Random(0); // TODO non-deterministc seed
    time = new ƒ.Time();
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    chickenNodeInit(_event);

    player = new Player();

    //Shot Event
    viewport.canvas.addEventListener("pointerdown", (_event) => {player.pickByRadius(_event)});

    // Load resources
    chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
  }
  
   //Sprite Animations
   let chickenFlyAnimation: ƒAid.SpriteSheetAnimation;
   let chickenDeathAnimation: ƒAid.SpriteSheetAnimation;
 
   function initAnimations(coat: ƒ.CoatTextured): void {
     chickenFlyAnimation = new ƒAid.SpriteSheetAnimation("Fly", coat);
     chickenFlyAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0 , 366, 103), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

     chickenDeathAnimation = new ƒAid.SpriteSheetAnimation("Death", coat);
     chickenDeathAnimation.generateByGrid(ƒ.Rectangle.GET(255, 266 , 447, 355), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));

   }
 
   //chickenSprite
   //let chickenAvatar: ƒAid.NodeSprite;
   //let cmpAudio: ƒ.ComponentAudio;
   

    // Spawning
    let minSpawnInterval: number = 1500; // In miliseconds
    let timeSinceLastSpawn: number = 0;
    let leftSpawn = -12;
    let rightSpawn = 12;
    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;

    let maxChickens: number = 5;

    let playerLives: number = 3; // Every time a chicken survives, this counts down. When 0, the player loses
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
      if(rng.getBoolean()) {// Spawn left
        spawnPos = new ƒ.Vector2(leftSpawn, rng.getRange(-5, 7));
        speed = 1;
      } else { // ...or right
        spawnPos = new ƒ.Vector2(rightSpawn, rng.getRange(-5, 7));
        speed = -1;
      }

      //find a free collision group
      let freeCollisionGroup: ƒ.COLLISION_GROUP = null;

      for(let collGroup of AVAILABLE_COLLISION_GROUPS) {
        let found: boolean = true;
        for (let chicken of chickenContainer.getChildren()) {
          if(chicken instanceof Chicken && chicken.collisionGroup == collGroup) {
            found = false;
            break;
          }
        }
        if(found) {
          freeCollisionGroup = collGroup;
          break;
        }
      }
      
      let newChicken : Chicken;
      if(freeCollisionGroup) {
        console.log("Collision group " + freeCollisionGroup.toString() + " is free. Using for new chicken.");
        newChicken = new Chicken("Chicken", spawnPos, new ƒ.Vector2(1,1), speed, freeCollisionGroup);
      } else {
        console.log("NO FREE COLLISION GROUP FOUND. THIS SHOULD NOT HAPPEN. FIX ME.")
      }
      //newChicken.setAnimation(chickenFlyAnimation);
      //newChicken.setFrameDirection(1);
      //newChicken.framerate = 20;
      //newChicken.setAnimation(chickenDeathAnimation);


      console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y +") (" + chickenContainer.getChildren.length + ")");

      chickenContainer.addChild(newChicken);
    }
  }
  
   async function chickenNodeInit(_event: Event): Promise<void> {
     
     let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
     await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
     let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
     
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
 
 
     graph = viewport.getBranch();
     //graph.addChild(chickenAvatar);


     ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
   }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    spawnChicken();
    
    
    // Simulate chickens
    for (let chicken of chickenContainer.getChildren()) {
      if(chicken instanceof Chicken) {
        if((chicken.getPosition().x < leftSpawn - 1 || chicken.getPosition().x > rightSpawn + 1) && chicken.alive) {
          console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
          chickenContainer.removeChild(chicken);
          playerLives--;
        } else if(chicken.getPosition().y < -5 && !chicken.alive) {
          console.log("Cleaning up dead chicken from the ground... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
          chickenContainer.removeChild(chicken);
        } else {
          chicken.move();
        }
      }
    };

    // Game over screen
    if(playerLives <= 0 && !gameOverShown) {
      gameOverShown = true;
      alert("Game Over");
    }
    viewport.draw();
  }
//mtxLocal.translation.y = 0 matrix translation an Y
//mtxLocal.translation = V neuer Vektor
}