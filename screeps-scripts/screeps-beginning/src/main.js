var roleHarvester = require('./creep/role_harvester');
var roleUpgrader = require('./creep/role_upgrader');
var roleBuilder = require('./creep/role_builder');
var MemMgmt = require('memory.mgmt');

var versionCheck = function () {
    require('update_time');
    if (!Memory.SCRIPT_UPDATE_TIME || Memory.SCRIPT_UPDATE_TIME != SCRIPT_UPDATE_TIME) {
        Memory.SCRIPT_UPDATE_TIME = SCRIPT_UPDATE_TIME;
        console.log('New code uplodated');
    }
}

module.exports.loop = function () {
    versionCheck();
    MemMgmt.cleanDeadCreeps();

    for (var name in Game.creeps) {
        var creep = Game.creeps['name'];
        roleHarvester.run(creep);
    }
}