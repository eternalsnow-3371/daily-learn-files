export class CreepUtils {
  public static isFull(creep: Creep): boolean {
    return creep.store.getFreeCapacity() === 0;
  }

  public static isEmpty(creep: Creep): boolean {
    return creep.store.getUsedCapacity() === 0;
  }
}
