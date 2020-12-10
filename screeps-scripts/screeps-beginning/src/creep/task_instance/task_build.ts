import { CreepTaskName } from '../../common/const_creep';
import { CreepUtils } from '../creep_util';
import { GoogleColorLib } from '../../common/lib_color';
import { Task } from '../task';
import { TaskHarvest } from './task_harvest';
import { TaskUpgrade } from './task_upgrade';
import _ from 'lodash';

export class TaskBuild extends Task {

  public constructor(creepName: string) {
    super(CreepTaskName.build, creepName);
  }

  public static creepRequire(creep: Creep): boolean {
    const bodys = _.map(creep.body, 'type');
    const findWork = _.includes(bodys, WORK);
    const findCarry = _.includes(bodys, CARRY);
    return findWork && findCarry && creep.fatigue <= 0;
  }

  public nothingTodo(): boolean {
    const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
    return targets.length === 0;
  }

  public findSomethingElse(): Task | null {
    const harvestTask = new TaskHarvest(this.creepName);
    if (!harvestTask.nothingTodo()) {
      return harvestTask;
    }
    const upgradeTask = new TaskUpgrade(this.creepName);
    return upgradeTask.nothingTodo() ? null : upgradeTask;
  }

  public run(): void {
    const isEmpty = CreepUtils.isEmpty(this.creep);
    const isFull = CreepUtils.isFull(this.creep);

    if (isEmpty) {
      const sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], {
          visualizePathStyle: {
            stroke: GoogleColorLib.red
          }
        });
      }
    } else if (isFull) {
      const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (this.creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {
            visualizePathStyle: {
              stroke: GoogleColorLib.green
            }
          });
        }
      }
    } else {
      // a creep alaways stop only when its energy reach max or zero.
      // if target and source both available, then harvest -> build -> harvest.
      const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        this.creep.build(targets[0]);
      }
      const sources = this.creep.room.find(FIND_SOURCES);
      this.creep.harvest(sources[0]);
    }
  }
}
