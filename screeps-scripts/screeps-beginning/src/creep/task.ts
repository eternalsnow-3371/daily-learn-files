export abstract class Task implements ProtoTask {
    public taskName: string;
    public creepName: string;
    private _creep: Creep;

    public constructor(taskName: string, creepName: string) {
        this.taskName = taskName;
        this.creepName = creepName;
    }

    public abstract nothingTodo(): boolean;

    public abstract findSomethingElse(): Task | null;

    public abstract run(): void;

    public get creep(): Creep {
        if (!this._creep) {
            this._creep = Game.creeps[this.creepName];
        }
        return this._creep;
    }

    public toJSON(): ProtoTask {
        return {taskName: this.taskName};
    }
}
