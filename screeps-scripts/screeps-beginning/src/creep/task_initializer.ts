import { CreepTaskName } from '../common/const_creep';
import { Task } from './task';
import { TaskBuild } from './task_instance/task_build';
import { TaskHarvest } from './task_instance/task_harvest';
import { TaskUpgrade } from './task_instance/task_upgrade';

export function createTask(creep: Creep, task: ProtoTask): Task {
	switch (task.taskName) {
		case CreepTaskName.harvest:
			return new TaskHarvest(creep.name);
		case CreepTaskName.build:
			return new TaskBuild(creep.name);
		case CreepTaskName.upgrade:
			return new TaskUpgrade(creep.name);
		default:
			console.log(`cannot resolve taskName: ${task.taskName}!!`);
			throw new Error();
	}
}

export function checkRequire(creep: Creep, task: ProtoTask): boolean {
	switch (task.taskName) {
		case CreepTaskName.harvest:
			return TaskHarvest.creepRequire(creep);
		case CreepTaskName.build:
			return TaskBuild.creepRequire(creep);
		case CreepTaskName.upgrade:
			return TaskUpgrade.creepRequire(creep);
		default:
			console.log(`cannot resolve taskName: ${task.taskName}!!`);
			throw new Error();
	}
}
