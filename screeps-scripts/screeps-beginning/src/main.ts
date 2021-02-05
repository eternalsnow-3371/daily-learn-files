import { MemMgmt } from './memory_mgmt';

export function loop(): void {
    MemMgmt.cleanDeadCreeps();
}
