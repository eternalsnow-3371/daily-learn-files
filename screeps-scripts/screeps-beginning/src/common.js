module.exports.CreepUtils = class CreepUtils {
    static isFull(creep) {
        return creep.store.getFreeCapacity() == 0;
    }

    static isEmpty(creep) {
        return creep.store[RESOURCE_ENERGY] == 0;
    }
}

module.exports.GoogleColorLib = {
    blue: '#2d85f0',
    red: '#f4433c',
    yellow: '#ffbc32',
    green: '#0aa858'
}