/* eslint-disable */
/* still work on it. */

import _ from "lodash";

export class SourceMgmt {
    private roomName: string;
    private memory: RoomMemory;
    private sources: Source[];

    private source2flagCost: { [sourceId: string]: { [flagName: string]: number } };

    // only occur when creep decide to go to source.
    private pickSource(creep: Creep) {
        // do nothing.
    }

    private sortSourceBySimpleCost(creep: Creep): Source[] {
        const costs: { sourceId: string; cost: number; }[] = [];
        for (const source of this.sources) {
            costs.push({ sourceId: source.id, cost: source.pos.simpleCostTo(creep.pos) });
        }
        const sortCosts = _.sortBy(costs, 'cost');
        const sources = _.map(sortCosts, (cost)=>Game.getObjectById(cost.sourceId as Id<Source>));
        return _.without(sources, null) as Source[];
    }
}
