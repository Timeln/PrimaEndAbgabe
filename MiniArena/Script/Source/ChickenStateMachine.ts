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
        console.log("BOOM, HEADSHOT!");
      });
      setup.setAction(CHICKEN_STATE.DEAD, (_machine) => {
        let chick: ƒ.Node = (<ƒaid.ComponentStateMachine<CHICKEN_STATE>>_machine).node;
        if(chick instanceof Chicken) {
          
        } else {
          console.error("Attached node is not a Chicken");
        }
      })



      // TODO transit between RELOAD and READO_TO_SHOOT and GAME_OVER



      //setup.setAction(JOB.PATROL, (_machine) => {
      //  let container: Enemy = <Enemy>(<ƒaid.ComponentStateMachine<JOB>>_machine).getContainer();
      //  // console.log(container);
      //  if (container.mtxLocal.translation.equals(container.posTarget, 0.1))
      //    _machine.transit(JOB.IDLE);
      //  container.move();
      //});
//
      //setup.setTransition(JOB.PATROL, JOB.IDLE, (_machine) => {
      //  let container: Enemy = <Enemy>(<ƒaid.ComponentStateMachine<JOB>>_machine).getContainer();
      //  ƒ.Time.game.setTimer(3000, 1, (_event: ƒ.EventTimer) => {
      //    container.chooseTargetPosition();
      //    _machine.transit(JOB.PATROL);
      //  })
      //});

      return setup;
    }
  }
}