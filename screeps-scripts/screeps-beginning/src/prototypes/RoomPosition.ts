RoomPosition.prototype.simpleCostTo = function (pos: RoomPosition): number {
    return Math.abs(pos.x - this.x) + Math.abs(pos.y - this.y);
}