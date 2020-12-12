import { SpawnMgmt } from "control/spawn_mgmt";

export class Zone {
    room: Room;
    memory: RoomMemory;
    creeps: Creep[];
    spawns: StructureSpawn[];
    towers: StructureTower[];
    sources: Source[];

    spawnMgmt: SpawnMgmt;

    constructor(room: Room) {
        this.room = room;
        this.memory = room.memory;
        this.creeps = room.find(FIND_MY_CREEPS);
        this.spawns = room.find(FIND_MY_SPAWNS);
        this.towers = room.find(FIND_MY_STRUCTURES, {
            filter: (structure)=>structure.structureType===STRUCTURE_TOWER
        }) as StructureTower[];
        this.sources = room.find(FIND_SOURCES);

        this.spawnMgmt = new SpawnMgmt(this);
    }

    init(): void {}

    run(): void {
        this.spawnMgmt.init();
        this.spawnMgmt.check();
        this.spawnMgmt.tryStartTask();
    }

}