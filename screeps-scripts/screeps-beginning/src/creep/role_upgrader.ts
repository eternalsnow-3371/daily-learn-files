import { CreepUtils } from './creep_util';
import { GoogleColorLib } from '../common/lib_color';

export const roleUpgrader = {
  run(creep: Creep): void {
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
      if (controller === undefined) { return; }
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
