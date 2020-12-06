const CreepUtils = require('./creep_util').CreepUtils;
const GoogleColorLib = require('../common/lib_color').GoogleColorLib;

const roleUpgrader = {
  run: function(creep) {
    if (!CreepUtils.isFull(creep)) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: {
            stroke: GoogleColorLib.red
          }
        });
      }
    } else {
      const controller = creep.room.controller;
      if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
          visualizePathStyle: {
            stroke: GoogleColorLib.green
          }
        });
      }
    }
  }
};

module.exports = roleUpgrader;
