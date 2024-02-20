namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let graph: ƒ.Node;
  let knuckles: ƒ.Node; 
  let gravity: number = -7.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  //let isGrounded: boolean = true;
  //let gravity: number = 0.3;
  //let ySpeed: number = 1;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    knuckles = graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0];
    knuckles.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
    let cmpCamera: ƒ.ComponentCamera = viewport.getBranch().getComponent(ƒ.ComponentCamera);
    viewport.camera = cmpCamera;
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(); //(ƒ.LOOP_MODE.TIME_GAME, 30);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    knucklesNodeInit(_event);
  }
  
   //Sprite Animations
   let knucklesWalkAnimation: ƒAid.SpriteSheetAnimation;
   let knucklesJumpAnimation: ƒAid.SpriteSheetAnimation;
 
   function initAnimations(coat: ƒ.CoatTextured): void {
     knucklesWalkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
     knucklesWalkAnimation.generateByGrid(ƒ.Rectangle.GET(10, 85 , 40, 45), 4, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
 
     knucklesJumpAnimation = new ƒAid.SpriteSheetAnimation("Jump", coat);
     knucklesJumpAnimation.generateByGrid(ƒ.Rectangle.GET(520, 324 , 40, 45), 3, 50, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(40));
 
   }
 
  let audioJump: ƒ.Audio;
 
    function initializeSounds(): void {
      //audioDeath = new ƒ.Audio("./sounds/death.wav");
      audioJump = new ƒ.Audio("./sounds/jump.wav");
    }
 
   //knucklesSprite
   let animationState: string = "standing";
   let knucklesAvatar: ƒAid.NodeSprite;
   let cmpAudio: ƒ.ComponentAudio;
   
 
   async function knucklesNodeInit(_event: Event): Promise<void> {
     let knucklesSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
     await knucklesSpriteSheet.load("./images/knucklesprite.png");
     let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, knucklesSpriteSheet);
 
     initAnimations(coat);
     initializeSounds();
 
     knucklesAvatar = new ƒAid.NodeSprite("knuckles_Sprite");
     knucklesAvatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
 
     knucklesAvatar.setAnimation(knucklesWalkAnimation);
     knucklesAvatar.setFrameDirection(1);
     knucklesAvatar.framerate = 20;
     
     knucklesAvatar.mtxLocal.translateY(0);
     knucklesAvatar.mtxLocal.translateZ(2);
     knucklesAvatar.mtxLocal.scaleX(1.5);
     knucklesAvatar.mtxLocal.scaleY(2);
 
 
     graph = viewport.getBranch();
     graph.addChild(knucklesAvatar);
 
    cmpAudio = graph.getComponent(ƒ.ComponentAudio);
    cmpAudio.connect(true);
    cmpAudio.volume = 1;
   }

  function update(_event: Event): void {
    knucklesAvatar.mtxLocal.rotation = ƒ.Vector3.Y(animationState.includes("left") ? 180 : 0);
    collision();
    // ƒ.Physics.simulate();  // if physics is included and used
    //ySpeed += gravity;
    //viewport.draw();
    ƒ.AudioManager.default.update();
    let timeFrame: number = ƒ.Loop.timeFrameGame / 1000; // time since last frame in seconds
    //let graph: ƒ.Node = viewport.getBranch();
    //let knuckles: ƒ.Node = graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0];
    //console.log(graph.getChildrenByName("Charakter")[0].getChildrenByName("knuckles")[0]);
    //knuckles.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4));
    //knuckles.mtxLocal.translateX(1);+
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D])){
      knucklesAvatar.mtxLocal.translateX(2 * timeFrame);
      if(animationState != "walkright"){
        animationState = "walkright";
        knucklesAvatar.setAnimation(knucklesWalkAnimation);
        return;
      }
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A])){
      knucklesAvatar.mtxLocal.translateX(2 * timeFrame);
      if(animationState != "walkleft"){
        animationState = "walkleft";
        knucklesAvatar.setAnimation(knucklesWalkAnimation);
        return;
      }
    }
    if(animationState.includes("standing")){
      knucklesAvatar.showFrame(0);
      return;
    }

    //if (pos.y > -0.5)
      //knuckles.mtxLocal.translateY(-0.2);
    //else
      //knuckles.mtxLocal.translateY(+1);
      //if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP]))
        //knuckles.mtxLocal.translateY(+1);
        //isGrounded = false;
      //if (pos.y > 0)
        //knuckles.mtxLocal.translateY(-0.3);
      if (isGrounded && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W])) {
        ySpeed = 5;
        isGrounded = false;
        knucklesAvatar.setAnimation(knucklesJumpAnimation);
        cmpAudio.setAudio(audioJump);
        cmpAudio.play(true);
        cmpAudio.volume = 4;
      collision();
  }
  ySpeed += gravity * timeFrame;
    let pos: ƒ.Vector3 = knucklesAvatar.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;
    if (pos.y < -2.5) {
      ySpeed = 0;
      pos.y = -2.5;
      isGrounded = true;
    }
    knucklesAvatar.mtxLocal.translation = pos;
    viewport.draw();
  }
  // let tileCollided: ƒ.Node = checkCollision(pos);
  //   if (tileCollided) {
  //     ySpeed = 0;
  //     pos.y = tileCollided.mtxWorld.translation.y + 0.5;
  //     isGrounded = true;
  //   }
  //   knuckles.mtxLocal.translation = pos;

  //   followCamera();


  //   viewport.draw();
  //   ƒ.AudioManager.default.update();
  // }

  // function checkCollision(_posWorld: ƒ.Vector3): ƒ.Node {
  //   let tiles: ƒ.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren()
  //   for (let tile of tiles) {
  //     let pos: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
  //     if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
  //       return tile;
  //   }

  //   return null;
  // }
  // function followCamera() {
  //   let mutator: ƒ.Mutator = knuckles.mtxLocal.getMutator();
  //   viewport.camera.mtxPivot.mutate(
  //     { "translation": { "x": mutator.translation.x, "y": mutator.translation.y } }
  //   );
  function collision():void{
    graph = viewport.getBranch();
    let floors: ƒ.Node = graph.getChildrenByName("Floor")[0];
    let pos: ƒ.Vector3 = knuckles.mtxLocal.translation;
    for (let floor of floors.getChildren()) {
      let posFloor: ƒ.Vector3 = floor.mtxLocal.translation;
      if (Math.abs(pos.x - posFloor.x) < 0.5) {
        if (pos.y < posFloor.y + 0.5) {
          pos.y = posFloor.y + 0.5;
          knuckles.mtxLocal.translation = pos;
          ySpeed = 0;
        }
      }
    }
  }

//mtxLocal.translation.y = 0 matrix translation an Y
//mtxLocal.translation = V neuer Vektor
}