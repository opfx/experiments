import { CellModel } from '../progress-model/cell-model';
import { Neighbor } from '../interfaces';

export class PathFindingController {
    private cells: CellModel[] = [];
    private searchQueue: CellModel[] = [];

    constructor(cells: CellModel[]) {
        this.cells = cells;
    }

    /** Find if there is path for water from N.in to N.out or from N.in to fish not under base. */
    public findIfHasPathToGuestWithAlias(cell0: CellModel, searchingAlias: string): boolean {
        this.searchQueue.length = 0;

        // const search: DfsBfs = DfsBfs.getInstance();
        let cell: CellModel;
        for (cell of this.cells) { 
            cell.visited = false;
        }

        this.searchQueue.push(cell0); // simple BFS
        cell0.visited = true;

        while (this.searchQueue.length > 0) {
            cell = this.searchQueue.shift();
            const neighbours: Neighbor[] = cell.getNeighbours();

            for (const neighbour of neighbours) {
                const neighbourCell = neighbour as CellModel;
                
                if (neighbourCell && !neighbourCell.visited && neighbourCell.isOpenForPath()) {

                    if (neighbourCell.hasGuestOfAlias(searchingAlias)) {

                        this.searchQueue.length = 0;
                        return true;
                    }

                    this.searchQueue.push(neighbourCell);
                    neighbourCell.visited = true;                  
                }
            }
        }

        this.searchQueue.length = 0;
        return false;
    }

    public cleanup(): void {
        this.cells = null;

        if (this.searchQueue !== null) {
            this.searchQueue.length = 0;
        }

        this.searchQueue = null;
    }
}