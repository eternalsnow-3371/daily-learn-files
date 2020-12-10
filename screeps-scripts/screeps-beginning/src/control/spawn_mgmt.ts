import { DefaultSpawn, SpawnControl } from '../common/const_spawn';
import { CreepConfig } from './spawn_config';

export class SpawnMgmt {
  public static init(): void {
    if (!Memory.spawnQueue) {
      Memory.spawnQueue = [];
      console.log('init SpawnQueue');
      SpawnMgmt.check();
    }
  }

  public static check(): void {
    if (Game.time % SpawnControl.CHECK_INTERVAL !== 0 || !Game.spawns[DefaultSpawn.name].spawning
      || Memory.spawnQueue.length === 0) {
      return;
    }
    console.log('Start check creeps...');
    const jobStatistics: { [job: string]: number } = {};
    let totalNum = 0;
    for (const name in Game.creeps) {
      totalNum += 1;
      const job = Game.creeps[name].memory.job.taskName;
      if (!jobStatistics[job]) {
        jobStatistics[job] = 0;
      } else {
        jobStatistics[job] += 1;
      }
    }

    for (const config of Memory.spawnQueue) {
      totalNum += 1;
      const job = config.jobTaskName;
      if (!jobStatistics[job]) {
        jobStatistics[job] = 0;
      } else {
        jobStatistics[job] += 1;
      }
    }

    for (let i = 0; i < SpawnControl.CIRCLE_CHECK_MAX_TIMES; i += 1) {
      let updateTasks = false;
      for (const config of CreepConfig) {
        const job = config.jobName;
        let num = jobStatistics[job];
        if (num === null || num === undefined) {
          num = 0;
        }
        const percentage = config.globalPercentage;
        if (totalNum === 0 || (num < config.max && num / totalNum < percentage)) {
          updateTasks = true;
          Memory.spawnQueue.push({
            jobTaskName: job,
            bodys: config.bodys
          });
          jobStatistics[job] += 1;
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
