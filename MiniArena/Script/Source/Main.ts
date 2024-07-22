namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Node;
  export let viewport: ƒ.Viewport;
  export let chickenContainer: ƒ.Node; //Holds chickens
  let rng: ƒ.Random;
  let time: ƒ.Time;

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

    //Shot Event
    viewport.canvas.addEventListener("pointerdown", pickByRadius);
    viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);

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
 
  function initializeSounds(): void {
    //audioShot = new ƒ.Audio("./sounds/death.wav");
  }
 
   //chickenSprite
   //let chickenAvatar: ƒAid.NodeSprite;
   //let cmpAudio: ƒ.ComponentAudio;
   

    // Spawning
    let minSpawnInterval: number = 500; // In miliseconds
    let timeSinceLastSpawn: number = 0;

    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;

    let maxChickens: number = 3;

    let playerLives: number = 3; // Every time a chicken survives, this counts down. When 0, the player loses
    let gameOverShown: boolean = false;
    let animation: string = "";

  // Should we spawn a chicken in this frame or not?
  function spawnChicken(): void {
    let now: number = time.get();

    // Enough time elapsed to spawn a new chicken?
    if(now - timeSinceLastSpawn > minSpawnInterval && chickenContainer.getChildren().length < maxChickens) {
      timeSinceLastSpawn = now;
      
      let spawnPos: ƒ.Vector2;
      let speed: number;
      if(rng.getBoolean()) {// Spawn left
        spawnPos = new ƒ.Vector2(-5, rng.getRange(-7, 7));
        speed = 1;
      } else { // ...or right
        spawnPos = new ƒ.Vector2(5, rng.getRange(-7, 7));
        speed = -1;
      }
      //let newChicken : ƒ.Node = new ƒAid.NodeSprite("chicken_Sprite");
      let newChicken : Chicken = new Chicken("Chicken", spawnPos, new ƒ.Vector2(1,1), speed);


      
   
      // cmpAudio = graph.getComponent(ƒ.ComponentAudio);
      // cmpAudio.connect(true);
      // cmpAudio.setAudio(audioAmbient);
      // cmpAudio.volume = 1;


  
      //newChicken.setAnimation(chickenFlyAnimation);
      //newChicken.setFrameDirection(1);
      //newChicken.framerate = 20;

      //newChicken.setAnimation(chickenDeathAnimation);
      
      //let spawnPos: ƒ.Vector3 = new ƒ.Vector3(-5, -5, -5);


      console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y +") (" + chickenContainer.getChildren.length + ")");

      chickenContainer.addChild(newChicken);
    }
  }
  
   async function chickenNodeInit(_event: Event): Promise<void> {
     
     let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
     await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
     let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
     
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
 
 
     graph = viewport.getBranch();
     //graph.addChild(chickenAvatar);


     ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
   }

  function update(_event: Event): void {
    ƒ.Physics.simulate();
    spawnChicken();
    
    
    // Simulate chickens
    chickenContainer.getChildren().forEach(function (element){
      if(element instanceof Chicken) {
        if((element.getPosition().x < -6 || element.getPosition().x > 6) && element.isAlive()) {
          chickenContainer.removeChild(element);
          playerLives--;
        } else if(element.getPosition().y < -5 && !element.isAlive()) {
          chickenContainer.removeChild(element);
        } else {
          element.move();
        }
      }
    });

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