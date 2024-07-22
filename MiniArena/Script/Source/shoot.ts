namespace Script {
    import ƒ = FudgeCore;
    
    export function pickByComponent(_event: PointerEvent): void {
      console.log("pickByComponent");
      Reflect.set(_event, "closestDistance", Infinity);
      Reflect.set(_event, "closestchicken", null);
      viewport.dispatchPointerEvent(_event);
      hitchicken(Reflect.get(_event, "closestchicken"));
    }
  
    export function hitComponent(_event: PointerEvent): void {
      let chicken: ƒ.Node = (<ƒ.Node>_event.target);
      let closestDistance: number = Reflect.get(_event, "closestDistance");
      let pick: ƒ.Pick = <ƒ.Pick>Reflect.get(_event, "pick");
      if (pick.zBuffer < closestDistance) {
        Reflect.set(_event, "closestDistance", pick.zBuffer);
        Reflect.set(_event, "closestchicken", chicken);
      }
    }
  
    export function pickByCamera(_event: PointerEvent): void {
      console.log("pickCamera");
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
      picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
      console.log(picks[0]);

      if(_event.button == 0){
        hitchicken(picks[0]?.node);
      }
      // else if(_event.button == 2){
      //   let posNewchicken: ƒ.Vector3 = 
      //   console.log(picks[0].normal.toString());
      //   addchicken();
      // }
    }
  
    export function pickByRadius(_event: PointerEvent): void {
      console.log("pickByRay");
      let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
      let shortest: number;
      let found: ƒ.Node;
      let compare: number = Math.pow(0.7, 2);
  
      for (let chicken of chickenContainer.getChildren()) {
        if (compare < ray.getDistance(chicken.mtxWorld.translation).magnitudeSquared)
          continue;
        let distance: number = ƒ.Vector3.DIFFERENCE(chicken.mtxWorld.translation, ray.origin).magnitudeSquared;
        if (shortest == undefined || distance < shortest) {
          shortest = distance
          found = chicken;
        }
      }
      hitchicken(found);
    }
  

  
    function hitchicken(chicken: ƒ.Node) {
      if (!chicken)
        return;
  
      console.log(chicken.name);
      if(chicken instanceof Chicken) {
        chicken.hit();
      }
      
      viewport.draw();
    }

    // function addchicken(_pos: ƒ.Vector3){
    //     let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
    //     chicken.addChild(new chicken(_pos, ƒ.Color.CSS(txtColor)));
    // }
  }