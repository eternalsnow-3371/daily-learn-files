import {CreepUtils} from './creep_util';
import {GoogleColorLib} from '../common/lib_color';

export const roleBuilder = {

  needBuild(creep: Creep): boolean {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length > 0;
  },

  run(creep: Creep): void {
    const isEmpty = CreepUtils.isEmpty(creep);
    const isFull = CreepUtils.isFull(creep);

    if (isEmpty) {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: {
            stroke: GoogleColorLib.red
          }
        });
      }
    } else if (isFull) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: GoogleColorLib.green
            }
          });
        }
      }
    } else {
      // a creep alaways stop only when its energy reach max or zero.
      // if target and source both available, then harvest -> build -> harvest.
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        creep.build(targets[0]);
      }
      const sources = creep.room.find(FIND_SOURCES);
      creep.harvest(sources[0]);
    }
  }
};