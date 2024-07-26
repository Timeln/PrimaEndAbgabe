namespace Script {
    import ƒui = FudgeUserInterface;

    export class Hud {
      private static controller: ƒui.Controller;
  
      public static start(player: Player): void {
        let domHud: HTMLDivElement = document.querySelector("div#hud");
        Hud.controller = new ƒui.Controller(player, domHud);
        Hud.controller.updateUserInterface();
      }
      public static forceUpdate(): void {
        Hud.controller.updateUserInterface();
      }
    }
  }