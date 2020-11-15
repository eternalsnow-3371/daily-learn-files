var CreepUtils = require('../common').CreepUtils;
var GoogleColorLib = require('../common/lib_color').GoogleColorLib;

var roleHarvester = {
    run: function (creep) {
        if (!CreepUtils.isFull(creep)) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: GoogleColorLib.red } });
            }
        }
        else {
            var needEnergyStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (needEnergyStructures.length > 0) {
                if (creep.transfer(needEnergyStructures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(needEnergyStructures[0], { visualizePathStyle: { stroke: GoogleColorLib.green } });
                }
            }
        }
    }
}

module.exports = roleHarvester;