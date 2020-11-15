'use strict';

var CreepUtils = require('./creep_util').CreepUtils;
var GoogleColorLib = require('../common/lib_color').GoogleColorLib;

var roleUpgrader = {
  run(creep) {
    if (!CreepUtils.isFull(creep)) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: {
            stroke: GoogleColorLib.red
          }
        });
      }
    } else {
      var controller = creep.room.controller;
      if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
          visualizePathStyle: {
            stroke: GoogleColorLib.green
          }
        });
      }

    }
  }
}

module.exports = roleUpgrader;
