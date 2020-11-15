class MemMgmt {
    constructor() {}

    static cleanDeadCreeps() {
        for (const creep in Memory.creeps) {
            if (!Game.creeps[creep]) {
                delete Memory.creeps[name];
            }
        }
    }
}

module.exports = MemMgmt;
