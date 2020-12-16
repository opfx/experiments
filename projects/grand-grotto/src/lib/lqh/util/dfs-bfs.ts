import { Neighbor } from '../interfaces';

const WHITE = 'white';
const GRAY = 'gray';
const BLACK = 'black';

export class DfsBfs {
    private static instance:DfsBfs;

    private queue: Neighbor[] = []; // BFS queue
    private color: string[] = [];
    private d: number[] = []; // DFS discovery time -OR- BFS distance
    private f: number[] = []; // DFS finishing time
    private pi: Neighbor[] = [];  // DFS - where came from - RED edge
    private time = 0;
    private count = 0;

    private primaryPath: Neighbor[] = []; // path after BFS if was found
    private nextHousePath: Neighbor[] = []; // path after BFS if was found

    constructor () {}
    public static getInstance(): DfsBfs {
        if (!DfsBfs.instance) {
            DfsBfs.instance = new DfsBfs();
        }
        return DfsBfs.instance;
    }

    /** DFS: http://www.cs.toronto.edu/~ylzhang/csc263w15/slides/lec09-DFS.pdf */
    protected DFS(startTiles: Neighbor[], tiles: Neighbor[]): void {
        // console.log(' --------------- [Neighbors].DFS() ' + startTiles.length);

        this.color.length = 0;
        this.d.length = 0;
        this.f.length = 0;
        this.pi.length = 0;

        for (const tile of tiles) {
            this.color[tile.getId()] = WHITE;
            this.d[tile.getId()] = Number.MAX_SAFE_INTEGER;
            this.f[tile.getId()] = Number.MAX_SAFE_INTEGER;
            this.pi[tile.getId()] = null;
        }

        this.time = 0;

        for (const tile of startTiles) {
            if (this.color[tile.getId()] === WHITE) {
                // console.log(' ------ [Neighbors].DFS()');
                this.count = 0;
                this.DFS_VISIT(tile);
            }
        }
    }

    private DFS_VISIT(tile: Neighbor): void {

        this.color[tile.getId()] = GRAY;
        this.time = this.time + 1;
        this.d[tile.getId()] = this.time;

        for (const neighbour of tile.getNeighbours()) {
            if (this.color[neighbour.getId()] === WHITE && tile.isLinkedTo(neighbour)) {
                this.pi[neighbour.getId()] = tile;
                this.DFS_VISIT(neighbour);
            }
        }

        this.color[tile.getId()] = BLACK;
        this.time = this.time + 1;
        this.f[tile.getId()] = this.time;
    }

    /** USE BFS for finding paths! */
    /** BFS: http://www.cs.toronto.edu/~ylzhang/csc263w15/slides/lec08-BFS.pdf */
    public BFS(startTiles: Neighbor[], tiles: Neighbor[]): void {
        // console.log('------ [Neighbor].BFS');

        // clean
        this.queue.length = 0;
        this.color.length = 0;
        this.d.length = 0;
        this.pi.length = 0;

        // for all
        for (const tile of tiles) {
            this.color[tile.getId()] = WHITE;
            this.d[tile.getId()] = Number.MAX_SAFE_INTEGER;
            this.pi[tile.getId()] = null;
        }

        // slight modification for a start array - not a single vertex
        for (let tile of startTiles) {
            if (this.color[tile.getId()] === WHITE) {
                this.color[tile.getId()] = GRAY;
                this.d[tile.getId()] = 0;
                this.queue.push(tile); // enqueue

                // console.log('-- [Neighbor].BFS startTile');
            }

            while (this.queue.length > 0) {
                tile = this.queue.pop();
                // console.log('      [Neighbor].BFS enqueue ' + tile + ', depth: ' + this.d[tile.getId()]);

                for (const neighbour of tile.getNeighbours()) {
                    if (this.color[neighbour.getId()] === WHITE && tile.isLinkedTo(neighbour)) {

                        this.color[neighbour.getId()] = GRAY;
                        this.d[neighbour.getId()] = this.d[tile.getId()] + 1;
                        this.pi[neighbour.getId()] = tile;
                        this.queue.push(neighbour); // enqueue

                     }
                }

                this.color[tile.getId()] = BLACK;
            }
        }
    }

    // --- --- trace halper when path is found for BFS
    public traceData(tiles: Neighbor[]): void {
        console.log('----------- [Neighbor].BFS traceData()');
        // console.log('            [Neighbor].BFS this.pi: ' + this.pi);
        // console.log('            [Neighbor].BFS this.d: ' + this.d);
        for (const tile of tiles) {
            if (this.d[tile.getId()] !== Number.MAX_SAFE_INTEGER) {
                console.log('            [Neighbor].BFS tile: ' + tile + ' this.d:' + this.d[tile.getId()] + ' from:' + this.pi[tile.getId()]);
            }
        }
    }

    // --- ---
    /**
     * find primary path.
     * we revert: end tile was first in search and start tiles
     */
    public findPrimaryPath(tiles: Neighbor[]): Neighbor[] {
        this.primaryPath.length = 0;

        let minDistance: number = Number.MAX_SAFE_INTEGER;
        let startTile: Neighbor; let endTile: Neighbor;

        // find start(with smaller distance, we may have several) and end (distance=0, only one) tiles
        for (const tile of tiles) {
            if (this.d[tile.getId()] === 0) {
                endTile = tile;

            } else if (this.isConnectedStartTile(tile) && this.d[tile.getId()] < minDistance) {
                startTile = tile;
                minDistance = this.d[tile.getId()];
            }

            tile.setTraversed(false); // for scoring, traversed = true means pets step on it
        }

        // find primary path from this.pi
        let pathTile: Neighbor;
        if (startTile && endTile) {

            pathTile = startTile;
            this.primaryPath.push(pathTile);
            pathTile.setTraversed(true); // traversed = true means pets step on it

            while (this.pi[pathTile.getId()]) {
                pathTile = this.pi[pathTile.getId()];
                this.primaryPath.push(pathTile);
                pathTile.setTraversed(true); // traversed = true means pets step on it
            }
        }

        // console.log('----------- [Neighbor].findPrimaryPath() ' + this.primaryPath);

        return this.primaryPath;
    }

        /* find secondary paths (next house path). */
        protected findSecondaryPath(tiles: Neighbor[], primaryPath: Neighbor[], id: number): Neighbor[] {
            this.nextHousePath.length = 0;
            const endTile0: Neighbor = primaryPath[primaryPath.length - 1];
    
            // find next end house
            let endTile: Neighbor;
            for (const tile of tiles) {
                if (this.d[tile.getId()] < Number.MAX_SAFE_INTEGER && this.isConnectedEndTile(tile) // end connected tile
                    && tile.getId() > id && tile !== endTile0 ) { // ascending id and not equal to the first one
                    endTile = tile;
                    break;
                }
            }
    
            // first go by this.pi and look "entrance" - fork tile from  primaryPath;
            let pathTile: Neighbor = endTile;
    
            // console.log('[Neighbors].findSecondaryPath ---');
            // console.log('[Neighbors].findSecondaryPath add: ' + pathTile);
    
            let foundFork = false; let imax: number;
            while (pathTile && !foundFork) {
    
                imax = primaryPath.indexOf(pathTile); // primaryPath.lastIndexOf(pathTile);
                if (imax !== -1) {
                    foundFork = true;
                    // console.log('[Neighbors].findSecondaryPath it\'s a fork tile: ' + pathTile);
    
                    let i: number;
                    for (i = imax; i >= 0; i--) {
                        this.nextHousePath.unshift(primaryPath[i]);
                        // console.log('[Neighbors].findSecondaryPath 2 add from Primary: ' + primaryPath[i]);
                    }
                } else {
                    // console.log('[Neighbors].findSecondaryPath 1 add: ' + pathTile);
                    this.nextHousePath.unshift(pathTile);
                    pathTile.setTraversed(true); // traversed = true means pets step on it
                }
    
                pathTile = this.pi[pathTile.getId()];
            }
    
            // console.log('[Neighbors].findSecondaryPath: ' + this.nextHousePath);
            return this.nextHousePath;
        }

    // override
    protected isConnectedStartTile(tile: Neighbor): boolean { return false; }
    protected isConnectedEndTile(tile: Neighbor): boolean { return false; }
}