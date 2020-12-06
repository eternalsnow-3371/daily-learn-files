module.exports.CreepUtils = class CreepUtils {
  static isFull(creep) {
    return creep.store.getFreeCapacity() === 0;
  }

  static isEmpty(creep) {
    return creep.store[RESOURCE_ENERGY] === 0;
  }
};
