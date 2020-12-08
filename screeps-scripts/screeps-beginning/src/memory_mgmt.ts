export class MemMgmt {
  public static cleanDeadCreeps(): void {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
}
