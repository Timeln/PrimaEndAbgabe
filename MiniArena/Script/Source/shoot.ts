namespace Script {
    import ƒ = FudgeCore;

    export class Player{
      private cmpAudio: ƒ.ComponentAudio;
      
      public constructor() {
        this.createSoundNode();
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
            shortest = distance
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
        }
      }

      public createSoundNode(): void {

        // Lade die Sounddatei
        let audio: ƒ.Audio = new ƒ.Audio("./Sounds/shot.mp3");

        // Erstelle die Audio-Komponente und füge die geladene Sounddatei hinzu
        this.cmpAudio = new ƒ.ComponentAudio(audio, false, false);
      
        // Erstelle einen Knoten, um die Audio-Komponente zu hosten, und füge die Audio-Komponente hinzu
        graph.addComponent(this.cmpAudio);

        }
      }      
    }