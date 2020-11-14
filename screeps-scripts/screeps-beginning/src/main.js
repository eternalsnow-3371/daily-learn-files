var roleHarvester = require('./creep/role.harvester');
var roleUpgrader = require('./creep/role.upgrader');
var roleBuilder = require('./creep/role.builder');
var MemMgmt = require('memory.mgmt');

module.exports.loop = function () {
    MemMgmt.cleanDeadCreeps();
    
    for (var name in Game.creeps) {
        var creep = Game.creeps['name'];
        roleHarvester.run(creep);
    }

}