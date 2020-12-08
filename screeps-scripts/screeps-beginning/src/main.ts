import {CreepRoles} from './common/const_creep';
import {MemMgmt} from'./memory_mgmt';
import {SpawnMgmt} from'./control/spawn_mgmt';
import {roleBuilder} from'./creep/role_builder';
import {roleHarvester} from './creep/role_harvester';
import {roleUpgrader} from'./creep/role_upgrader';

export function loop(): void {
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
}
