// TOUGH          10
// MOVE           50
// CARRY          50
// ATTACK         80
// WORK           100
// RANGED_ATTACK  150
// HEAL           200

const creepConfig = [
  {
    role: 'harvester',
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.4,
    max: 4
  },
  {
    role: 'upgrader',
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.3,
    max: 4
  },
  {
    role: 'builder',
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.3,
    max: 4
  }];

class SpawnMgmt {
  static init() {
    if (!Memory.spawnQueue) {
      Memory.spawnQueue = [];
      console.log('init SpawnQueue');
      SpawnMgmt.check();
    }
  }

  static addTask(role, bodys) {
    Memory.spawnQueue.push({
      role: role,
      bodys: bodys
    });
  }

  static check() {
    console.log('Start check creeps...');
    const roleStatistics = {};
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

    for (let i = 0; i < 10; i += 1) {
      let updateTasks = false;
      for (const config of creepConfig) {
        const role = config.role;
        let num = roleStatistics[role];
        if (num === null || num === undefined) {
          num = 0;
        }
        const percentage = config.globalPercentage;
        if (totalNum === 0 || (num < config.max && num / totalNum < percentage)) {
          updateTasks = true;
          SpawnMgmt.addTask(role, config.bodys);
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
    const spawn = Game.spawns['Spawn1'];
    if (spawn.spwaning || !Memory.spawnQueue || Memory.spawnQueue.length === 0) {
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

module.exports = SpawnMgmt;
