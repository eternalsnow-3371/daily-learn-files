import {CreepRoles} from '../common/const_creep';

// TOUGH          10
// MOVE           50
// CARRY          50
// ATTACK         80
// WORK           100
// RANGED_ATTACK  150
// HEAL           200
export const CreepConfig = [
  {
    role: CreepRoles.harvester,
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.4,
    max: 4
  },
  {
    role: CreepRoles.upgrader,
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.3,
    max: 4
  },
  {
    role: CreepRoles.builder,
    bodys: [WORK, CARRY, MOVE],
    globalPercentage: 0.3,
    max: 4
  }
];
