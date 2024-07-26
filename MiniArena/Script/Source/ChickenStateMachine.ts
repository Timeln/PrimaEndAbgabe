namespace Script {
  import ƒaid = FudgeAid;

  export class ComponentStateMachineChicken extends ƒaid.ComponentStateMachine<CHICKEN_STATE> {
    private static instructions: ƒaid.StateMachineInstructions<CHICKEN_STATE> = ComponentStateMachineChicken.setupStateMachine();

    public constructor() {
      super();
      this.instructions = ComponentStateMachineChicken.instructions;
    }

    private static setupStateMachine(): ƒaid.StateMachineInstructions<CHICKEN_STATE> {
      let setup: ƒaid.StateMachineInstructions<CHICKEN_STATE> = new ƒaid.StateMachineInstructions();

      // Do this when the player wants to shoot
      setup.setAction(CHICKEN_STATE.ALIVE, (_machine) => {
        let chick: ƒ.Node = (<ƒaid.ComponentStateMachine<CHICKEN_STATE>>_machine).node;
        if(chick instanceof Chicken) {
          chick.flap();
        } else {
          console.error("Attached node is not a Chicken");
        }
      });

      setup.setTransition(CHICKEN_STATE.ALIVE, CHICKEN_STATE.DEAD, (_machine) => {
        console.log("Chicken shot.");
      });
      setup.setAction(CHICKEN_STATE.DEAD, (_machine) => {
        let chick: ƒ.Node = (<ƒaid.ComponentStateMachine<CHICKEN_STATE>>_machine).node;
        if(chick instanceof Chicken) {
          
        } else {
          console.error("Attached node is not a Chicken");
        }
      })
      return setup;
    }
  }
}