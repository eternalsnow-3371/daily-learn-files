const roleHarvester = require('./creep/role_harvester');
const MemMgmt = require('./memory_mgmt');
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
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    roleHarvester.run(creep);
  }
};
