import { SpawnMgmt } from "control/spawn_mgmt";

export class Zone {
    public room: Room;
    public memory: RoomMemory;
    public creeps: Creep[];
    public spawns: StructureSpawn[];
    public towers: StructureTower[];
    public sources: Source[];

    private spawnMgmt: SpawnMgmt;

    public constructor(room: Room) {
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

    public init(): void {
        // do nothing.
    }

    public run(): void {
        this.spawnMgmt.init();
        this.spawnMgmt.check();
        this.spawnMgmt.tryStartTask();
    }

    public postRun(): void {
        // do nothing.
    }

}