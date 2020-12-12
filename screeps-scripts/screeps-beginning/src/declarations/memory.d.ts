interface RoomMemory {
    spawnQueue: { jobTaskName: string, bodys: BodyPartConstant[] }[];
}

interface CreepMemory {
    job: ProtoTask;
    tempTask: ProtoTask | null;
}
