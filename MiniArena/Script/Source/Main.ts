namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Node;
  export let viewport: ƒ.Viewport;
  let chickenContainer: ƒ.Node; //Holds chickens
  export let chicken: ƒ.Node; 
  let rng: ƒ.Random;
  let time: ƒ.Time;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  //export let enemyrigidbody: ƒ.ComponentRigidbody;
  //export let NPC: ƒ.Node;
 
  //let gravity: number = -9.81;
  //let ySpeed: number = 0;
  //let isGrounded: boolean = true;

  
  // resources
  let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
  
  let pickAlgorithm = [pickByComponent, pickByCamera, pickByRadius];

  // viewport.canvas.addEventListener("pointerdown", pickAlgorithm[1]);
  // viewport.getBranch().addEventListener("pointerdown", <ƒ.EventListenerUnified>hitComponent);


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
 
  //let audioDeath: ƒ.Audio;
  let audioAmbient: ƒ.Audio;
 
  function initializeSounds(): void {
    //audioDeath = new ƒ.Audio("./sounds/death.wav");
    //audioJump = new ƒ.Audio("./sounds/jump.wav");
    //audioAmbient = new ƒ.Audio("./Sounds/music.wav");
  }
 
   //chickenSprite
   //let chickenAvatar: ƒAid.NodeSprite;
   let cmpAudio: ƒ.ComponentAudio;
   

    // Spawning
    
    let minSpawnInterval: number = 500; // In miliseconds
    let timeSinceLastSpawn: number = 0;

    //let minChickenSpeed: number = 0.1;
    //let maxChickenSpeed: number = 1.0;

    let maxChickens: number = 20;
    let chickens: number = 0;
    //let animationState = "standing";


  // Should we spawn a chicken in this frame or not?
  function spawnChicken(): void {
    let now: number = time.get();

    // Enough time elapsed to spawn a new chicken?
    if(now - timeSinceLastSpawn > minSpawnInterval && chickens <= maxChickens) {
      chickens++;
      timeSinceLastSpawn = now;
      

      
      //let newChicken = new ƒAid.NodeSprite("chicken");
      //let newChicken: ƒAid.NodeSprite = constructChicken();
      let spawnPos: ƒ.Vector2;
      let speed: number;
      if(rng.getBoolean()) {// Spawn left
        spawnPos = new ƒ.Vector2(-15, rng.getRange(-7, 7));
        speed = 5;
      } else { // ...or right
        spawnPos = new ƒ.Vector2(15, rng.getRange(-7, 7));
        speed = -5;
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


      console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y +") (" + chickens + ")");

      chickenContainer.addChild(newChicken);
    }
  }
  
   async function chickenNodeInit(_event: Event): Promise<void> {
     
     let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
     await chickenSpriteSheet.load("./images/chickenSpriteSheet.jpg");
     let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
     
     initAnimations(coat);

     chicken = graph.getChildrenByName("Charakter")[0].getChildrenByName("chicken")[0];
     chicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
 
     
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
    viewport.draw();
    chickenContainer.getChildren().forEach(function (element){
      if(element instanceof Chicken) {
        element.move();
      }
    });
    }
//mtxLocal.translation.y = 0 matrix translation an Y
//mtxLocal.translation = V neuer Vektor
}