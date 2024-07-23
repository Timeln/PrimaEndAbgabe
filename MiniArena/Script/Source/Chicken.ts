namespace Script {
  import ƒ = FudgeCore;

  export class Chicken extends ƒ.Node {
    private static readonly MASS: number = 1;
    private static readonly FLAP_FORCE: number = 4.3;
    private static readonly FLAP_THRESHOLD: number = -2;
    private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
    private static readonly REFLECT_VECTOR_X: ƒ.Vector3 = ƒ.Vector3.X();
    private static readonly REFLECT_VECTOR_Y: ƒ.Vector3 = ƒ.Vector3.Y();

    private readonly mtrSolidWhite: ƒ.Material;
    private readonly mtrSolidRed: ƒ.Material;
    private readonly materialAlive: ƒ.ComponentMaterial;
    private readonly materialDead: ƒ.ComponentMaterial;


    private readonly rigidBody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(Chicken.MASS);

    public rect: ƒ.Rectangle;
    private direction: number;
    private _alive: boolean = true;
    public velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();


    public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, direction: number, collisionGroup: ƒ.COLLISION_GROUP) {
      super(_name);

      this.mtrSolidWhite = new ƒ.Material("SolidWhite", ƒ.ShaderLit, new ƒ.CoatRemissive());
      this.mtrSolidRed = new ƒ.Material("SolidRed", ƒ.ShaderLit, new ƒ.CoatColored(ƒ.Color.CSS("RED")));
      this.materialAlive = new ƒ.ComponentMaterial(this.mtrSolidWhite);
      this.materialDead = new ƒ.ComponentMaterial(this.mtrSolidRed);



      
      this.direction = direction;
      this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
      
      this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
      this.rigidBody.collisionGroup = collisionGroup;
      this.rigidBody.effectGravity = 0.1;
      this.rigidBody.applyLinearImpulse(new ƒ.Vector3(direction, 0, 0));
      this.addComponent(this.rigidBody);
      let cmpQuad: ƒ.ComponentMesh = new ƒ.ComponentMesh(Chicken.meshQuad);
      this.addComponent(cmpQuad);



      this.addComponent(this.materialAlive);

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
      //console.log("Current velocity: " + this.rigidBody.getVelocity().y);
      if (this.alive && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
        console.log("FLAP! I am at [" + this.getPosition().x + "|" + this.getPosition().y + "]");
        this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.direction / 2, Chicken.FLAP_FORCE, 0));
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
      if (this.alive) {
        this.alive = false;
        this.removeComponent(this.materialAlive);
        this.addComponent(this.materialDead);

      }
    }
    public get alive(): boolean {
      return this._alive;
    }
  public set alive(_alive: boolean) {
    this._alive = _alive;
  }

    public get collisionGroup(): ƒ.COLLISION_GROUP {
      return this.rigidBody.collisionGroup;
    }
  }
}