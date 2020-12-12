import { Zone } from './zone';

export class _Leviathan implements ILeviathan {
    public zones: { [zoneName: string]: Zone };
    private static _leviathan: _Leviathan;

    private constructor() {
        this.zones = {};
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            this.zones[roomName] = new Zone(room);
        }
    }

    public static getInstance(): ILeviathan {
        if (!this._leviathan) {
            this._leviathan = new _Leviathan();
        }
        return this._leviathan;
    }

    public init(): void {
        for (const zoneName in this.zones) {
            this.zones[zoneName].init();
        }
    }

    public run(): void {
        for (const zoneName in this.zones) {
            this.zones[zoneName].run();
        }
    }

    public postRun(): void {
        for (const zoneName in this.zones) {
            this.zones[zoneName].postRun();
        }
    }
}
