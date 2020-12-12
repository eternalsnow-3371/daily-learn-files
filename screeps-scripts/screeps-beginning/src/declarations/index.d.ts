declare const Leviathan: ILeviathan;

declare const global: any;

interface ILeviathan {
    zones: { [zoneName: string]: Zone };

    init(): void;
    run(): void;
    postRun(): void;
}

interface ProtoTask {
    taskName: string;
}
