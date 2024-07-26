namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class ChickenHandler extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(ChickenHandler);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public spawnLeft: number = -12;
    public spawnRight: number = 12;
    public despawnThreshold: number = 1;
    public maxChickens: number = 5;
    public spawnInterval: number = 1500;
    private timeSinceLastSpawn: number = 0;
    private readonly handlerTime: ƒ.Time = new ƒ.Time();


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

  // Should we spawn a chicken in this frame or not?
  private spawnChicken(): void {
    let now: number = this.handlerTime.get();
      
      // Enough time elapsed to spawn a new chicken?
      if(now - this.timeSinceLastSpawn > this.spawnInterval && chickenContainer.getChildren().length < this.maxChickens) {
        this.timeSinceLastSpawn = now;
        let spawnPos: ƒ.Vector2;
        let speed: number;
        if(rng.getBoolean()) {  // Spawn left...
          spawnPos = new ƒ.Vector2(this.spawnLeft, rng.getRange(-5, 7));
          speed = 1;
        } else {                // ...or right
          spawnPos = new ƒ.Vector2(this.spawnRight, rng.getRange(-5, 7));
          speed = -1;
        }
        
        let newChicken : Chicken = new Chicken("Chicken", spawnPos, new ƒ.Vector2(1,1), speed * config.flapForceHorizontal, config.flapForceVertical);
  
        console.log(now + ": Spawning chicken at (" + spawnPos.x + "|" + spawnPos.y +") (" + chickenContainer.getChildren.length + ")");
  
        chickenContainer.addChild(newChicken);
      }
    }


    public update = (_event: Event): void => {
      this.spawnChicken();
      // Simulate chickens
      if(chickenContainer) {
        for (let chicken of chickenContainer.getChildren()) {
          if(chicken instanceof Chicken) {
            if((chicken.getPosition().x < this.spawnLeft - this.despawnThreshold || chicken.getPosition().x > this.spawnRight + this.despawnThreshold) && chicken.currentState == CHICKEN_STATE.ALIVE) {
              console.log("Chicken made it unharmed. Releasing into the wild... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
              chickenContainer.removeChild(chicken);
              player.removeLive();
              Hud.forceUpdate(); //The UI doesn't update fast enough, so when the player health drops to 0 and the game-over popup shows, the health is still shown as '1'. To prevent this, force the UI to update NOW
            } else if(chicken.getPosition().y < -5 && chicken.currentState == CHICKEN_STATE.DEAD) {
              console.log("Cleaning up dead chicken from the ground... [" + chicken.getPosition().x + "|" + chicken.getPosition().y + "]");
              chickenContainer.removeChild(chicken);
            } else {
              chicken.update();
            }
          }
        };
      } 
    }
  }


}