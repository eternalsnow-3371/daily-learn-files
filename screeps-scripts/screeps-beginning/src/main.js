const roleHarvester = require('./creep/role_harvester');
const roleUpgrader = require('./creep/role_upgrader');
const roleBuilder = require('./creep/role_builder');
const MemMgmt = require('./memory_mgmt');
const SpawnMgmt = require('./control/spawn_mgmt');
require('./update_time');

const versionCheck = function() {
  if (!Memory.SCRIPT_UPDATE_TIME || Memory.SCRIPT_UPDATE_TIME !== global.SCRIPT_UPDATE_TIME) {
    Memory.SCRIPT_UPDATE_TIME = global.SCRIPT_UPDATE_TIME;
    console.log('New code uplodated');
  }
};

module.exports.loop = function() {
  SpawnMgmt.init();
  if (Game.time % 10 === 0 && !Game.spawns['Spawn1'].spawning && Memory.spawnQueue.length === 0) {
    SpawnMgmt.check();
  }
  versionCheck();
  MemMgmt.cleanDeadCreeps();
  SpawnMgmt.tryStartTask();
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    }
  }
};
