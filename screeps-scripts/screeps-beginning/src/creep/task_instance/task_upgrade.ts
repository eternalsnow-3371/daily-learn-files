import { CreepTaskName } from '../../common/const_creep';
import { CreepUtils } from '../creep_util';
import { GoogleColorLib } from '../../common/lib_color';
import { Task } from '../task';
import { TaskBuild } from './task_build';
import { TaskHarvest } from './task_harvest';
import _ from 'lodash';

export class TaskUpgrade extends Task {

  public constructor(creepName: string) {
    super(CreepTaskName.upgrade, creepName);
  }

  public static creepRequire(creep: Creep): boolean {
    const findWork = _.find(creep.body, (body) => body.type === WORK);
    const findCarry = _.find(creep.body, (body) => body.type === CARRY);
    const result = findWork && findCarry && creep.fatigue <= 0;
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  public nothingTodo(): boolean {
    return false;
  }

  public findSomethingElse(): Task | null {
    const harvestTask = new TaskHarvest(this.creepName);
    if (!harvestTask.nothingTodo()) {
      return harvestTask;
    }
    const buildTask = new TaskBuild(this.creepName);
    return buildTask.nothingTodo() ? null : buildTask;
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
      const controller = this.creep.room.controller;
      if (controller === undefined) { return; }
      if (this.creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(controller, {
          visualizePathStyle: {
            stroke: GoogleColorLib.green
          }
        });
      }
    }
  }
}
