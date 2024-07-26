namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export enum CHICKEN_STATE {
    ALIVE, DEAD
  }

  export class Chicken extends ƒAid.NodeSprite {
    private static readonly MASS: number = 1;
    private static readonly FLAP_THRESHOLD: number = -2;
    private readonly rigidBody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(Chicken.MASS);
    public rect: ƒ.Rectangle;
    private flyDirection: number;
    private flapForceVertical: number;
    public velocity: ƒ.Vector3 = ƒ.Vector3.ZERO();

    //Sprite Animations
    private chickenFlyAnimation: ƒAid.SpriteSheetAnimation;
    private chickenDeathAnimation: ƒAid.SpriteSheetAnimation;

    private coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, chickenSpriteSheet);
    private stateMachine: ComponentStateMachineChicken = new ComponentStateMachineChicken();
  public initAnimations(): void {
     this.chickenFlyAnimation = new ƒAid.SpriteSheetAnimation("Fly", this.coat);
     this.chickenFlyAnimation.generateByGrid(ƒ.Rectangle.GET(0, 0 , 120, 111), 3, 120, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(120));
     this.chickenDeathAnimation = new ƒAid.SpriteSheetAnimation("Death", this.coat);
     this.chickenDeathAnimation.generateByGrid(ƒ.Rectangle.GET(0, 112 , 120, 111), 3, 120, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(120));
  
      this.setAnimation(this.chickenFlyAnimation);
      this.setFrameDirection(1);
      this.framerate = 3;

      this.mtxLocal.rotation = ƒ.Vector3.Y(this.flyDirection < 0 ? 180 : 0);
  }
    public constructor(_name: string, _position: ƒ.Vector2, _size: ƒ.Vector2, flyDirection: number, verticalFlapForce: number) {
      super(_name);
      
      this.flyDirection = flyDirection;
      this.flapForceVertical = verticalFlapForce;
      this.rect = new ƒ.Rectangle(_position.x, _position.y, _size.x, _size.y, ƒ.ORIGIN2D.CENTER);
      
      this.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(_position.toVector3(0))));
      this.rigidBody.collisionMask = 0;
      this.rigidBody.effectGravity = 0.1;
      this.rigidBody.applyLinearImpulse(new ƒ.Vector3(flyDirection, 0, 0));
      this.addComponent(this.rigidBody);
      this.addComponent(this.stateMachine);
      this.stateMachine.stateCurrent = CHICKEN_STATE.ALIVE;
      this.initAnimations();
    }

    public update(): void {
      this.stateMachine.act();
    }


    public flap(): void {
      if (this.currentState == CHICKEN_STATE.ALIVE && this.rigidBody.getVelocity().y < Chicken.FLAP_THRESHOLD) {
        console.log("FLAP! I am at [" + this.getPosition().x + "|" + this.getPosition().y + "]");
        this.rigidBody.applyLinearImpulse(new ƒ.Vector3(this.flyDirection, this.flapForceVertical, 0));
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
      this.stateMachine.transit(CHICKEN_STATE.DEAD);
      this.setAnimation(this.chickenDeathAnimation);
    }

    public get currentState(): CHICKEN_STATE {
      return this.stateMachine.stateCurrent;
    }
  }
}