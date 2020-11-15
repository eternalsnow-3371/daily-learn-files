var roleHarvester = require('./creep/role_harvester');
var roleUpgrader = require('./creep/role_upgrader');
var roleBuilder = require('./creep/role_builder');
var MemMgmt = require('memory.mgmt');

module.exports.loop = function () {
    MemMgmt.cleanDeadCreeps();
    
    for (var name in Game.creeps) {
        var creep = Game.creeps['name'];
        roleHarvester.run(creep);
    }
}