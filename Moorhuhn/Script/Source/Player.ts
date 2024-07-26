namespace Script {
    import ƒ = FudgeCore;


    
    export class Player extends ƒ.Mutable{
      private cmpAudio: ƒ.ComponentAudio;
      public health: number; // Every time a chicken survives, this counts down. When 0, the player loses
      public score:number = 0 ;
      protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
      public constructor(lives: number) {
        super();
        this.createSoundNode();
        this.health = lives;
      }

      public pickByRadius(_event: PointerEvent): void {
        console.log("Picking by radius...");
        let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
        let shortest: number;
        let found: ƒ.Node;
        let compare: number = Math.pow(0.7, 2);
        this.cmpAudio.play(true);
        console.log("schuss");
        
        for (let chicken of chickenContainer.getChildren()) {
          if (compare < ray.getDistance(chicken.mtxWorld.translation).magnitudeSquared)
            continue;
          let distance: number = ƒ.Vector3.DIFFERENCE(chicken.mtxWorld.translation, ray.origin).magnitudeSquared;
          if (shortest == undefined || distance < shortest) {
            shortest = distance;
            found = chicken;
          }
        }
        this.hitchicken(found);
      }
    
      public hitchicken(chicken: ƒ.Node): void {
        
        if (!chicken)
          return;
        
        console.log(chicken.name);
        if(chicken instanceof Chicken) {
          chicken.hit();
          this.score += 5
          console.log(this.score)
        }
      }

      public createSoundNode(): void {
        let audio: ƒ.Audio = new ƒ.Audio("./Sounds/shot.mp3");
        this.cmpAudio = new ƒ.ComponentAudio(audio, false, false);
        graph.addComponent(this.cmpAudio);

        }
        
          public removeLive(): void {
            this.health--;
          }
          public get playerLives(): number {
            return this.health;
          }
      }      
    }