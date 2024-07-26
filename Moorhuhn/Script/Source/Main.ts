namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let graph: ƒ.Node;
  export let viewport: ƒ.Viewport;
  export let chickenContainer: ƒ.Node; //Holds chickens
  export let rng: ƒ.Random;
  export let player: Player;
  export let config: {[key: string]: number};
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
    viewport.camera = cmpCamera;
    rng = new ƒ.Random(0); // TODO non-deterministc seed


    player = new Player(3);

    //Shot Event
    viewport.canvas.addEventListener("pointerdown", (_event) => {player.pickByRadius(_event)});

    // Load resources 
   
    chickenSpriteSheet.load("./images/chickenSpriteSheetEigen.png");
      Hud.start(player);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }
    let gameOverShown: boolean = false;



  function update(_event: Event): void {
    
    // Game over screen
    if(player.playerLives <= 0 && !gameOverShown) {
      gameOverShown = true;
      
      alert("Game Over. Reload to play again or press 'OK'");
      window.location.reload();
    }

    ƒ.Physics.simulate();

    viewport.draw();
  }
}