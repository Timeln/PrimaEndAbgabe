namespace Script {
  import ƒaid = FudgeAid;

  export class ComponentStateMachineEnemy extends ƒaid.ComponentStateMachine<PLAYER_STATE> {
    private static instructions: ƒaid.StateMachineInstructions<PLAYER_STATE> = ComponentStateMachineEnemy.setupStateMachine();

    public constructor() {
      super();
      this.instructions = ComponentStateMachineEnemy.instructions;
    }

    private static setupStateMachine(): ƒaid.StateMachineInstructions<PLAYER_STATE> {
      let setup: ƒaid.StateMachineInstructions<PLAYER_STATE> = new ƒaid.StateMachineInstructions();

      // Do this when the player wants to shoot
      setup.setAction(PLAYER_STATE.READY_TO_SHOOT, (_machine) => {
        let player: ƒ.Node = (<ƒaid.ComponentStateMachine<PLAYER_STATE>>_machine).node;
        if(player instanceof Player) {
          if(player.ammo > 0) {
            // TODO what to do here? Can't pass PointerEvent?
            //player.pickByRadius();
          } else {
            _machine.transit(PLAYER_STATE.RELOAD);
          }
        }
      });

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