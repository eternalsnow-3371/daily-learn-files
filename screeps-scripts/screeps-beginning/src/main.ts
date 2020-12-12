import { MemMgmt } from './memory_mgmt';
import { createTask } from './creep/task_initializer';
import { Leviathan } from 'leviathan/leviathan';

export function loop(): void {
    MemMgmt.cleanDeadCreeps();

    const leviathan = Leviathan.getInstance();
    leviathan.init();
    leviathan.run();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        const job = createTask(creep, creep.memory.job);
        const jobNothingTodo = job.nothingTodo();

        if (!jobNothingTodo) {
            creep.memory.tempTask = null;
            job.run();
            continue;
        }

        if (!creep.memory.tempTask) {
            const newTempTask = job.findSomethingElse();
            creep.memory.tempTask = newTempTask;
        }

        if (creep.memory.tempTask) {
            const tempTask = createTask(creep, creep.memory.tempTask);
            const tempTaskNothingTodo = tempTask.nothingTodo();
            if (tempTaskNothingTodo) {
                creep.memory.tempTask = tempTask.findSomethingElse();
                if (creep.memory.tempTask) {
                    tempTask.run();
                }
            } else {
                tempTask.run();
            }
        }
    }
}
