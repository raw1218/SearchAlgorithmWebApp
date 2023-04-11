import Algorithm from "./Algorithm";
import Edge from "./Edge";



class MazeGeneratorDFS extends Algorithm {


    constructor(){
        super({})
        this.newEdges = new Map()
        this.path = []
        this.completed = true;
    }

    addNewEdge(edge, bothWays){

        const idFrom = edge.idFrom
        const idTo  = edge.idTo
        const key = JSON.stringify(idFrom)

        const edges = this.newEdges[key]
        if(!edges)this.newEdges[key] = [];

        this.newEdges[key].push(edge);


        if(bothWays){

            const newEdge = new Edge(idTo, idFrom);
            this.addNewEdge(newEdge, false)
        }


        
    }
 
    startSearch(speed, startNodeID) {

        return new Promise(async (resolve) => {
            this.completed = false;
            this.speed = speed;
            this.next = [{ node: startNodeID, edge: null }];
    
            const search = async () => {
                if (this.completed) return;
    
                if (this.next.length > 0) {
                    this.nextStep();
                    setTimeout(search, this.speed);
                } else {
                    this.searchPassed();
                    resolve(); // resolve the promise when the search is complete
                }
            };
    
            await search(); // wait for the search to complete
        });
    }


    connectNodes(edge){


        

        const idFrom = edge.idFrom;
        const idTo = edge.idTo;

        this.addNewEdge(edge, true)
      

        const nodeFrom = this.graph.getNode(idFrom)
        const nodeTo = this.graph.getNode(idTo)

        const leftToRight = (idTo.x == idFrom.x + 1 && idTo.y == idFrom.y)
        const rightToLeft = (idTo.x == idFrom.x - 1 && idTo.y == idFrom.y)
        const upToDown = (idTo.x == idFrom.x && idTo.y == idFrom.y +1)
        const downToUp = (idTo.x == idFrom.x && idTo.y == idFrom.y - 1)

        if(leftToRight){
            nodeFrom.ref.current.removeBorder("right");
            nodeTo.ref.current.removeBorder("left");
        }

        if(rightToLeft){
            nodeFrom.ref.current.removeBorder("left");
            nodeTo.ref.current.removeBorder("right");
        }

        if(upToDown){
            nodeFrom.ref.current.removeBorder("bottom");
            nodeTo.ref.current.removeBorder("top");
        }

        if(downToUp){
            nodeFrom.ref.current.removeBorder("top")
            nodeTo.ref.current.removeBorder("bottom");
        }


    }
 
 
    visitNode(next) {
    
        
        this.visited.push(next.node)
        
        this.graph.getNode(next.node).setNodeType('none')
        
       
        const edge = next.edge
        if(edge)this.connectNodes(edge)



    }

    getValidNeighbors(id){
        const neighbors = this.graph.getNeighbors(id)
            let validNeighbors = []

            for(let neighbor of neighbors){
                const neighborID = neighbor.idTo
                if(this.checkIfVisited(neighborID) == false){
                    validNeighbors.push(neighborID)
                }
            }

            return validNeighbors
    }

    checkIfValidNext(id){



        if(this.checkIfVisited(id)){
            return false
        }

        if(this.graph.getNode(id).getType() == 'none'){
            return false
        }
        return true;
    }

    nextStep(){

    

        if (! this.next){
            
            this.searchPassed();
        }

        else{
            

            let next = this.next.pop();
            while(!this.checkIfValidNext(next.node)){next = this.next.pop();if(!next) return}
            this.visitNode(next);
            

            let neighbors = this.graph.getNeighbors(next.node);
            neighbors =  neighbors.sort(() => Math.random() - 0.5);
            
            for (const n of neighbors){


                if(this.checkIfVisited(n.idTo) == false){
                    
                    this.next.push({node: n.idTo, edge: n});

                }
            }

            
            


        }
    }


    searchPassed(){
        this.completed = true;
    }

    
}

export default MazeGeneratorDFS;