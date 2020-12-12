import {Zone} from './zone';

export class Leviathan {
    public zones: Zone[];
    private static _leviathan: Leviathan;

    private constructor() {
        this.zones = [];
        for (const roomName in Game.rooms) {
            const zone = new Zone(Game.rooms[roomName]);
            this.zones.push(zone);
        }
    }

    public static getInstance(): Leviathan {
        if (!this._leviathan) {
            this._leviathan = new Leviathan();
        }
        return this._leviathan;
    }

    public init(): void {
        for (const zone of this.zones) {
            zone.init();
        }
    }

    public run(): void {
        for (const zone of this.zones) {
            zone.run();
        }
    }
}