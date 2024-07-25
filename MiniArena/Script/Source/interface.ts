namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    import ƒui = FudgeUserInterface;


  
    export class Hud {
      private static controller: ƒui.Controller;
  
      public static start(player: Player): void {
        let domHud: HTMLDivElement = document.querySelector("div#hud");
        Hud.controller = new ƒui.Controller(player, domHud);
        Hud.controller.updateUserInterface();
      }
    }
  }