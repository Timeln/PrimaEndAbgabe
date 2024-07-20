namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let graph: ƒ.Node;
  let viewport: ƒ.Viewport;
  let chickenContainer: ƒ.Node; //Hold
  let chicken: ƒ.Node; 
  let rng: ƒ.Random;
  let time: ƒ.Time;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  //export let enemyrigidbody: ƒ.ComponentRigidbody;
  //export let NPC: ƒ.Node;
 
  let gravity: number = -9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;

  
  // resources
  let chickenSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
  


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    chickenContainer = new ƒ.Node("ChickenContainer");
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
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
    audioAmbient = new ƒ.Audio("./sounds/music.wav");
  }
 
   //chickenSprite
   let chickenAvatar: ƒAid.NodeSprite;
   let cmpAudio: ƒ.ComponentAudio;
   

    // Spawning
    
    let minSpawnInterval: number = 500; // In miliseconds
    let timeSinceLastSpawn: number = 0.0;

    //let maxChickens: number = 10;
    //let chickens: number = 0;
    let animationState = "standing";

 
    function constructChicken(): ƒAid.NodeSprite {
    
      
      let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
      
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
  function spawnChicken(): void {
    let now: number = time.get();

    // Enough time elapsed to spawn a new chicken?
    if(now - timeSinceLastSpawn > minSpawnInterval) {
      //let newChicken = new ƒAid.NodeSprite("chicken");
      let newChicken: ƒAid.NodeSprite = constructChicken();
      newChicken.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
  
      //newChicken.setAnimation(chickenFlyAnimation);
      //newChicken.setFrameDirection(1);
      //newChicken.framerate = 20;

      //newChicken.setAnimation(chickenDeathAnimation);
      newChicken.mtxLocal.translate(rng.getVector3(new ƒ.Vector3(-5, -5, -5), new ƒ.Vector3(5, 5, 5)))
      newChicken.mtxLocal.scaleX(1);
      newChicken.mtxLocal.scaleY(1);

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

     ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
     ƒ.Loop.start(ƒ.LOOP_MODE.FRAME_REQUEST, 30);
   }

  function update(_event: Event): void {
    spawnChicken();
    //moveEnemy();
    ƒ.AudioManager.default.update();
    let timeFrame: number = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      chickenAvatar.mtxLocal.translateX(2 * timeFrame);
      if(animationState != "flyright"){
        animationState = "flyright";
        chickenAvatar.setAnimation(chickenFlyAnimation);
        return;
      }
    }

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      chickenAvatar.mtxLocal.translateX(2 * timeFrame);
      if(animationState != "flyleft"){
        animationState = "flyleft";
        chickenAvatar.setAnimation(chickenFlyAnimation);
        return;
      }
    }

    chickenAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("left") ? 180 : 0);
  ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = chickenAvatar.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    chicken.mtxLocal.translation = pos;

    if (pos.y < -2.5) {
      ySpeed = 0;
      pos.y = -2.5;
      isGrounded = true;
    }
    if(isGrounded == true){
      cmpAudio.setAudio(audioAmbient);
      cmpAudio.volume = 1;
    }
    chickenAvatar.mtxLocal.translation = pos;
    viewport.draw();
  }
//mtxLocal.translation.y = 0 matrix translation an Y
//mtxLocal.translation = V neuer Vektor
}