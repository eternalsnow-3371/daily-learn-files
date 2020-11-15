var CreepUtils = require('../common').CreepUtils;
var GoogleColorLib = require('../common/lib_color').GoogleColorLib;

var roleBuilder = {

    needBuild: function (creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        return targets.length > 0;
    },

    run: function (creep) {
        var isEmpty = CreepUtils.isEmpty(creep);
        var isFull = CreepUtils.isFull(creep);

        if (isEmpty) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: GoogleColorLib.red } });
            }
        }
        else if (isFull) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: GoogleColorLib.green } });
                }
            }
        }
        else {
            // a creep alaways stop only when its energy reach max or zero.
            // if target and source both available, then harvest -> build -> harvest. 
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                creep.build(targets[0]);
            }
            var sources = creep.room.find(FIND_SOURCES);
            creep.harvest(sources[0]);
        }
    }
}

module.exports = roleBuilder;