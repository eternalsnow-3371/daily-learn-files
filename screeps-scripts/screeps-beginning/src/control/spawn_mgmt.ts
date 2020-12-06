import {CreepConfig} from './spawn_config';
import {SpawnControl, DefaultSpawn} from '../common/const_spawn';

export class SpawnMgmt {
  static init() {
    if (!Memory.spawnQueue) {
      Memory.spawnQueue = [];
      console.log('init SpawnQueue');
      SpawnMgmt.check();
    }
  }

   static check() {
    if (Game.time % SpawnControl.CHECK_INTERVAL !== 0 || !Game.spawns[DefaultSpawn.name].spawning
      || Memory.spawnQueue.length === 0) {
      return;
    }
    console.log('Start check creeps...');
    const roleStatistics : {[role: string]: number} = {};
    let totalNum = 0;
    for (const name in Game.creeps) {
      totalNum += 1;
      const role = Game.creeps[name].memory.role;
      if (!roleStatistics[role]) {
        roleStatistics[role] = 0;
      } else {
        roleStatistics[role] += 1;
      }
    }

    for (const config of Memory.spawnQueue) {
      totalNum += 1;
      const role = config.role;
      if (!roleStatistics[role]) {
        roleStatistics[role] = 0;
      } else {
        roleStatistics[role] += 1;
      }
    }

    for (let i = 0; i < SpawnControl.CIRCLE_CHECK_MAX_TIMES; i += 1) {
      let updateTasks = false;
      for (const config of CreepConfig) {
        const role = config.role;
        let num = roleStatistics[role];
        if (num === null || num === undefined) {
          num = 0;
        }
        const percentage = config.globalPercentage;
        if (totalNum === 0 || (num < config.max && num / totalNum < percentage)) {
          updateTasks = true;
          Memory.spawnQueue.push({
            role: role,
            bodys: config.bodys
          });
          roleStatistics[role] += 1;
          totalNum += 1;
        }
      }
      if (!updateTasks) {
        break;
      }
    }

    console.log('Check creeps end, now spawnQueue has ' + Memory.spawnQueue.length + ' creeps, value:\n' + JSON.stringify(Memory.spawnQueue));
  }

  static tryStartTask() {
    const spawn: StructureSpawn = Game.spawns[DefaultSpawn.name];
    if (spawn.spawning || !Memory.spawnQueue || Memory.spawnQueue.length === 0) {
      return;
    }
    const config = Memory.spawnQueue[0];
    const newName = config.role + Game.time;

    if (spawn.spawnCreep(config.bodys, newName, { memory: { role: config.role } }) === OK) {
      Memory.spawnQueue.shift();
      console.log('Start spawn creep: ' + newName + ', left ' + Memory.spawnQueue.length + ' creeps.');
    }
  }
}
