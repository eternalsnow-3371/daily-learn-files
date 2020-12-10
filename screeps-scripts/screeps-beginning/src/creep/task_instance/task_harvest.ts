import { CreepTaskName } from '../../common/const_creep';
import { CreepUtils } from '../creep_util';
import { GoogleColorLib } from '../../common/lib_color';
import { Task } from '../task';
import { TaskBuild } from './task_build';
import { TaskUpgrade } from './task_upgrade';
import _ from 'lodash';

export class TaskHarvest extends Task {

  public constructor(creepName: string) {
    super(CreepTaskName.harvest, creepName);
  }

  public static creepRequire(creep: Creep): boolean {
    const bodys = _.map(creep.body, 'type');
    const findWork = _.includes(bodys, WORK);
    const findCarry = _.includes(bodys, CARRY);
    return findWork && findCarry && creep.fatigue <= 0;
  }


  public nothingTodo(): boolean {
    return _.size(this.getNeedEnergyStructures()) === 0;
  }

  public findSomethingElse(): Task | null {
    const buildTask = new TaskBuild(this.creepName);
    if (!buildTask.nothingTodo()) {
      return buildTask;
    }
    const upgradeTask = new TaskUpgrade(this.creepName);
    return upgradeTask.nothingTodo() ? null : upgradeTask;
  }


  public run(): void {
    if (!CreepUtils.isFull(this.creep)) {
      const sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], {
          visualizePathStyle: {
            stroke: GoogleColorLib.red
          }
        });
      }
    } else {
      const needEnergyStructures = this.getNeedEnergyStructures();

      if (needEnergyStructures.length > 0) {
        if (this.creep.transfer(needEnergyStructures[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(needEnergyStructures[0], {
            visualizePathStyle: {
              stroke: GoogleColorLib.green
            }
          });
        }
      }
    }
  }

  private getNeedEnergyStructures() {
    return this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => (structure.structureType === STRUCTURE_EXTENSION
        || structure.structureType === STRUCTURE_SPAWN
        || structure.structureType === STRUCTURE_TOWER)
        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
  }
}
