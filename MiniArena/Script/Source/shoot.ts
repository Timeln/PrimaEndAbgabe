namespace Script {
    import ƒ = FudgeCore;
    
    export function pickByComponent(_event: PointerEvent): void {
      console.log("pickByComponent");
      Reflect.set(_event, "closestDistance", Infinity);
      Reflect.set(_event, "closestchickens", null);
      viewport.dispatchPointerEvent(_event);
      hitchickens(Reflect.get(_event, "closestchickens"));
    }
  
    export function hitComponent(_event: PointerEvent): void {
      let chickens: ƒ.Node = (<ƒ.Node>_event.target);
      let closestDistance: number = Reflect.get(_event, "closestDistance");
      let pick: ƒ.Pick = <ƒ.Pick>Reflect.get(_event, "pick");
      if (pick.zBuffer < closestDistance) {
        Reflect.set(_event, "closestDistance", pick.zBuffer);
        Reflect.set(_event, "closestchickens", chickens);
      }
    }
  
    export function pickByCamera(_event: PointerEvent): void {
      console.log("pickCamera");
      let picks: ƒ.Pick[] = ƒ.Picker.pickViewport(viewport, new ƒ.Vector2(_event.clientX, _event.clientY));
      picks.sort((_a, _b) => _a.zBuffer < _b.zBuffer ? -1 : 1);
      console.log(picks[0]);

      if(_event.button == 0){
        hitchickens(picks[0]?.node);
      }
      // else if(_event.button == 2){
      //   let posNewchickens: ƒ.Vector3 = 
      //   console.log(picks[0].normal.toString());
      //   addchickens();
      // }
    }
  
    export function pickByRadius(_event: PointerEvent): void {
      console.log("pickByRay");
      let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
      let shortest: number;
      let found: ƒ.Node;
      let compare: number = Math.pow(0.7, 2);
  
      for (let chickens of chicken.getChildren()) {
        if (compare < ray.getDistance(chickens.mtxWorld.translation).magnitudeSquared)
          continue;
        let distance: number = ƒ.Vector3.DIFFERENCE(chickens.mtxWorld.translation, ray.origin).magnitudeSquared;
        if (shortest == undefined || distance < shortest) {
          shortest = distance;
          found = chicken;
        }
      }
      hitchickens(found);
    }
  
    // export function pickByGrid(_event: PointerEvent): void {
    //   console.log("pickByGrid");
    //   let ray: ƒ.Ray = viewport.getRayFromClient(new ƒ.Vector2(_event.clientX, _event.clientY));
    //   let posCheck: ƒ.Vector3 = ray.origin.clone;
    //   let vctStep: ƒ.Vector3 = ray.direction.clone;
  
    //   // find largest component value
    //   let largest: number = vctStep.get().reduce((_p, _c) => Math.max(_p, Math.abs(_c)));
    //   // normalize to 1 in that direction
    //   vctStep.scale(1 / largest);
  
    //   for (let i: number = 0; i < 100; i++) {
    //     posCheck.add(vctStep);
    //     let posGrid: ƒ.Vector3 = posCheck.map(_value => Math.round(_value));
    //     console.log(posGrid.toString(), posCheck.toString());
    //     try {
    //       //let chickens = grid[posGrid.y][posGrid.z][posGrid.x];
    //       if (chickens) {
    //         hitchickens(chickens);
    //         return;
    //       }
    //     } catch (_e) { }
    //   }
    // }
  
    function hitchickens(_chickens: ƒ.Node) {
      if (!_chickens)
        return;
  
      console.log(_chickens.name);
      _chickens.getParent().removeChild(_chickens);
      viewport.draw();
    }

    // function addchickens(_pos: ƒ.Vector3){
    //     let txtColor: string = ƒ.Random.default.getElement(["red", "lime", "blue", "yellow"]);
    //     chickens.addChild(new chickens(_pos, ƒ.Color.CSS(txtColor)));
    // }
  }