export class CreepUtils {
  static isFull(creep: Creep) {
    return creep.store.getFreeCapacity() == 0;
  }

  static isEmpty(creep: Creep) {
    return creep.store.getUsedCapacity() == 0;
  }
}
