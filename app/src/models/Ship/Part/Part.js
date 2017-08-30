/**
 * @type {Part}
 */
class Part {
    /**
     * @param {string} name
     * @param {Object.<string, string>} partStats
     */
    constructor (name, partStats) {
        this.name = name;
        this.partStats = partStats;
    }
}
export default Part;