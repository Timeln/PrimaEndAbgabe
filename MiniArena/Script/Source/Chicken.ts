namespace Script {
    import ƒ = FudgeCore;
  
    export class Chicken extends ƒ.Node {
      private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
      //private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
      private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());

  
      public rect: ƒ.Rectangle;
      private static readonly REFLECT_VECTOR_X: ƒ.Vector3 = ƒ.Vector3.X();
      private static readonly REFLECT_VECTOR_Y: ƒ.Vector3 = ƒ.Vector3.Y();

      public speed: number;
      public velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();
      public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, speed: number) {
        super(_name);
  
        this.speed = speed;
        this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
  
        this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
  
        let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(Chicken.meshQuad);
        this.addComponent(cmpQuad);
        //cmpQuad.pivot.scale(_size.toVector3(0));
  
        let cMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(Chicken.mtrSolidWhite);

 
        
        this.addComponent(cMaterial);

        //this.velocity = new ƒ.Vector3(ƒ.Random.default.getRange(-1, 1), ƒ.Random.default.getRange(-1, 1), 0);
        this.velocity = new ƒ.Vector3(speed, 0, 0);
      //this.velocity.normalize(this.speed);
      }

      
    /**
     * move moves the game object and the collision detection reactangle
     */
    public move(): void {
      let frameTime: number = ƒ.Loop.timeFrameGame / 1000;

      let distance: ƒ.Vector3 = ƒ.Vector3.SCALE(this.velocity, frameTime);
      this.translate(distance);
    }

    public translate(_distance: ƒ.Vector3): void {
      this.mtxLocal.translate(_distance);
      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
    }

    ///**
    // * collides returns if the moveable itself collides with the _target and if so
    // * reflects the movement
    // */
    //public checkCollision(_target: Chicken): boolean {
    //  let intersection: ƒ.Rectangle = this.rect.getIntersection(_target.rect);
    //  if (intersection == null)
    //    return false;
//
    //  if (intersection.size.x > intersection.size.y)
    //    this.velocity.reflect(Moveable.REFLECT_VECTOR_Y);
    //  else
    //    this.velocity.reflect(Moveable.REFLECT_VECTOR_X);
//
    //  return true;
    //}
    }
  }