namespace Script {
    import ƒ = FudgeCore;
  
    export class Chicken extends ƒ.Node {
      private static readonly MASS: number = 1;
      private static readonly FLAP_FORCE: number = 4.3;
      private static readonly FLAP_THRESHOLD: number = -2;
      private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
      //private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("WHITE")));
      private static readonly mtrSolidWhite: ƒ.Material = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());
      private static readonly mtrSolidRed: ƒ.Material = new ƒ.Material("SolidRed", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
      private static readonly materialAlive: ƒ.ComponentMaterial =  new ƒ.ComponentMaterial(Chicken.mtrSolidWhite);
      private static readonly materialDead: ƒ.ComponentMaterial =  new ƒ.ComponentMaterial(Chicken.mtrSolidRed);
      private readonly rigidBody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(Chicken.MASS);
  
      public rect: ƒ.Rectangle;
      private static readonly REFLECT_VECTOR_X: ƒ.Vector3 = ƒ.Vector3.X();
      private static readonly REFLECT_VECTOR_Y: ƒ.Vector3 = ƒ.Vector3.Y();
      
      private direction: number;
      private alive: boolean = true;
      public velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

    

      public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, direction: number) {
        super(_name);
  
        this.direction = direction;
        this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
        
        this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
      
        this.rigidBody.effectGravity = 0.1;
        this.rigidBody.applyLinearImpulse(new ƒ.Vector3(direction, 0, 0));
        this.addComponent(this.rigidBody);
        let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(Chicken.meshQuad);
        this.addComponent(cmpQuad);
        //cmpQuad.pivot.scale(_size.toVector3(0));

 
        
        this.addComponent(Chicken.materialAlive);

        //this.velocity = new ƒ.Vector3(ƒ.Random.default.getRange(-1, 1), ƒ.Random.default.getRange(-1, 1), 0);
        //this.velocity = new ƒ.Vector3(direction, 0, 0);
      //this.velocity.normalize(this.speed);
      }

      
    /**
     * move moves the game object and the collision detection reactangle
     */
    public move(): void {
      //let frameTime: number = ƒ.Loop.timeFrameGame / 1000;
      
      //let force: ƒ.Vector3 = ƒ.Vector3.SCALE(new ƒ.Vector3(0, 9.81, 0), frameTime);
      
      this.flap();
      //this.translate(distance);
    }

    public flap(): void {
      console.log("Current velocity: " + this.rigidBody.getVelocity().y);
      if(this.alive && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
        console.log("FLAP!");
        this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.direction/2, Chicken.FLAP_FORCE, 0));
      }
    }

    public translate(_distance: ƒ.Vector3): void {
      this.mtxLocal.translate(_distance);
      this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
      this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
    }
    public getPosition(): ƒ.Vector3 {
      return this.rigidBody.getPosition();
    }

    public hit() {
      if(this.alive) {
        this.alive = false;
        this.removeComponent(Chicken.materialAlive);
        this.addComponent(Chicken.materialDead);
      }
    }

    public isAlive() {
      return this.alive;
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