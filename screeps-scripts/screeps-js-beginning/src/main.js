const CreepRoles = require('./common/const_creep').CreepRoles;
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
  versionCheck();
  MemMgmt.cleanDeadCreeps();

  SpawnMgmt.init();
  SpawnMgmt.check();
  SpawnMgmt.tryStartTask();

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === CreepRoles.harvester) {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === CreepRoles.upgrader) {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === CreepRoles.builder) {
      roleBuilder.run(creep);
    }
  }
};
