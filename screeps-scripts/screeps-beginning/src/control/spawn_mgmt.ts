import { CreepConfig } from './spawn_config';
import { SpawnControl } from '../common/const_spawn';
import { Zone } from 'leviathan/zone';
import _ from 'lodash';

export class SpawnMgmt {

  private roomName: string;
  private memory: RoomMemory;
  private roomCreeps: Creep[];
  private spawns: StructureSpawn[];

  public constructor(zone: Zone) {
    this.roomName = zone.room.name;
    this.memory = zone.memory;
    this.roomCreeps = zone.creeps;
    this.spawns = zone.spawns;
  }

  private allSpawning(): boolean {
    return _.every(this.spawns, (spawn)=>spawn.spawning);
  }

  private pickSpawn(): StructureSpawn | undefined {
    return _.find(this.spawns, (spawn)=>!spawn.spawning);
  }

  public init(): void {
    if (!this.memory.spawnQueue) {
      this.memory.spawnQueue = [];
      console.log(`init SpawnQueue of ${this.roomName}`);
      this.check(true);
    }
  }

  public check(force?: boolean): void {
    if (!force && (Game.time % SpawnControl.CHECK_INTERVAL !== 0 || this.allSpawning
      || this.memory.spawnQueue.length === 0)) {
      return;
    }
    console.log(`Room ${this.roomName} Start check creeps...`);

    const activeCreeps = _.map(this.roomCreeps, (creep)=>creep.memory.job.taskName);
    const spawningCreeps = _.map(this.memory.spawnQueue, (spawnConfig)=>spawnConfig.jobTaskName);
    const allCreeps = _.concat(activeCreeps, spawningCreeps);
    const countResult = _.countBy(allCreeps, (jobName)=>(jobName));
    let totalNum = _.size(allCreeps);

    for (let i = 0; i < SpawnControl.CIRCLE_CHECK_MAX_TIMES; i += 1) {
      let updateTasks = false;
      for (const config of CreepConfig) {
        let num = countResult[config.jobName];
        if (num === null || num === undefined) {
          num = 0;
        }
        const percentage = config.globalPercentage;
        if (totalNum === 0 || (num < config.max && num / totalNum < percentage)) {
          updateTasks = true;
          this.memory.spawnQueue.push({
            jobTaskName: config.jobName,
            bodys: config.bodys
          });
          countResult[config.jobName] += 1;
          totalNum += 1;
        }
      }
      if (!updateTasks) {
        break;
      }
    }

    console.log(`Check creeps end, now spawnQueue has ${this.memory.spawnQueue.length} creeps, value:\n ${JSON.stringify(this.memory.spawnQueue)}.`);
  }

  public tryStartTask(): void {
    if (!this.memory.spawnQueue || this.memory.spawnQueue.length === 0) {
      return;
    }
    const spawn = this.pickSpawn();
    if (!spawn) {
      return;
    }
    const config = this.memory.spawnQueue[0];
    const newName = config.jobTaskName + Game.time.toString();

    if (spawn.spawnCreep(config.bodys, newName, { memory: { job: { taskName: config.jobTaskName }, tempTask: null } }) === OK) {
      this.memory.spawnQueue.shift();
      console.log(`Start spawn creep: ${newName}, left ${this.memory.spawnQueue.length} creeps.`);
    }
  }
}
