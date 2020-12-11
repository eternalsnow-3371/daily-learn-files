import { DefaultSpawn, SpawnControl } from '../common/const_spawn';
import { CreepConfig } from './spawn_config';
import _ from 'lodash';

export class SpawnMgmt {
  public static init(): void {
    if (!Memory.spawnQueue) {
      Memory.spawnQueue = [];
      console.log('init SpawnQueue');
      SpawnMgmt.check(true);
    }
  }

  public static check(force?: boolean): void {
    if (!force && (Game.time % SpawnControl.CHECK_INTERVAL !== 0 || Game.spawns[DefaultSpawn.name].spawning
      || Memory.spawnQueue.length === 0)) {
      return;
    }
    console.log('Start check creeps...');

    const activeCreeps = _.map(Game.creeps, (creep)=>creep.memory.job.taskName);
    const spawningCreeps = _.map(Memory.spawnQueue, (spawnConfig)=>spawnConfig.jobTaskName);
    const allCreeps = _.concat(activeCreeps, spawningCreeps);
    let countResult = _.countBy(allCreeps, (jobName)=>(jobName));
    let totalNum = _.size(allCreeps);

    for (let i = 0; i < SpawnControl.CIRCLE_CHECK_MAX_TIMES; i += 1) {
      let updateTasks = false;
      for (const config of CreepConfig) {
        let num = countResult[config.jobName];
        if (num === null || num === undefined) {
          num = 0;
        }
        const percentage = config.globalPercentage;
        if (totalNum === 0 || (num < config.max && num / totalNum < percentage)) {
          updateTasks = true;
          Memory.spawnQueue.push({
            jobTaskName: config.jobName,
            bodys: config.bodys
          });
          countResult[config.jobName] += 1;
          totalNum += 1;
        }
      }
      if (!updateTasks) {
        break;
      }
    }

    console.log(`Check creeps end, now spawnQueue has ${Memory.spawnQueue.length} creeps, value:\n ${JSON.stringify(Memory.spawnQueue)}.`);
  }

  public static tryStartTask(): void {
    const spawn: StructureSpawn = Game.spawns[DefaultSpawn.name];
    if (spawn.spawning || !Memory.spawnQueue || Memory.spawnQueue.length === 0) {
      return;
    }
    const config = Memory.spawnQueue[0];
    const newName = config.jobTaskName + Game.time.toString();

    if (spawn.spawnCreep(config.bodys, newName, { memory: { job: { taskName: config.jobTaskName }, tempTask: null } }) === OK) {
      Memory.spawnQueue.shift();
      console.log(`Start spawn creep: ${newName}, left ${Memory.spawnQueue.length} creeps.`);
    }
  }
}
