export class MemMgmt {
  static cleanDeadCreeps() {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }
  }
}
