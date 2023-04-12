
import Node from "./Node";
import Edge from "./Edge";


class Graph {

    constructor(props) {

        this.nodes = props.nodes ? props.nodes : new Map();
        this.edges = props.edges ? props.edges : new Map();

    }


    resetNodes(){


        for(let key in this.nodes){
            
            const node = this.nodes[key]
            
            
            node.setNodeType("none");

            if(node.ref.current.resetBorders)node.ref.current.resetBorders();
        }
    }


    removeNode(id){

        


        this.nodes[JSON.stringify(id)] = null;
        
       

        this.edges[JSON.stringify(id)] = null;

       

        for(let key in this.edges){
         

            let value = this.edges[key];
            
            for(let val of value){
                if(val.x == id.x && val.y == id.y){
                 
                    this.removeEdge(JSON.parse(key), val)
                }
            }

        
        }}
        

    


    addNode(id, ref) {
        
        let myNode = new Node({id:id, ref: ref});
        this.nodes[JSON.stringify(id)]=  myNode;
    }


    getNode(id) {

       
        let node = this.nodes[JSON.stringify(id)];
        
        return node
    }

    getNeighbors(id){

        return this.edges[JSON.stringify(id)];
    }

    getIndirectNeighbors(id){

        
        let indirectNeighbors = []

        for(let [key,value] of this.edges){

            for(let node of value){

                if(node.x == id.x && node.y == id.y){
                    indirectNeighbors.push(JSON.parse(key))
                }
            }
        }


        

    }


    addEdge(idFrom, idTo, ref){

        const edge = new Edge(idFrom,idTo,ref)
        

        if(this.edges[JSON.stringify(idFrom)]){

            this.edges[JSON.stringify(idFrom)].push(edge)
        }
        else {this.edges[JSON.stringify(idFrom)] = [edge]}

       // console.log("just added an edge, edges = ", this.edges)
        
    }


    removeEdge(idFrom,idTo, bothWays){

        let neighbors = this.edges[JSON.stringify(idFrom)]
        let indexToRemove = neighbors.findIndex(i => i.x == idTo.x && i.y == idTo.y)
        if(indexToRemove >= 0){
            neighbors.splice(indexToRemove, 1);
            this.edges[JSON.stringify(idFrom)] = neighbors;
        }

        if(bothWays){this.removeEdge(idTo,idFrom,false)}
    }



    setGridEdges(gridx, gridy){

        this.edges = new Map();

        for(let i = 1; i <= gridx; i++){

            for(let j = 1; j <= gridy; j++){

                const index = {x: i, y: j};
                const lowerx = i > 1;
                const upperx = i < gridx;
                const lowery = j > 1;
                const uppery = j < gridy;

                let edges = [];

                //if (lowerx) {edges.push({x: i - 1, y: j});}
                if (lowerx) this.addEdge(index, {x: i - 1, y: j})
                //if (upperx){edges.push({x: i + 1, y: j})}
                if(upperx)this.addEdge(index, {x: i + 1, y: j})
               // if (lowery){edges.push({x: i, y: j - 1})}
               if(lowery)this.addEdge(index, {x: i , y: j - 1})
                //if (uppery){edges.push({x: i, y: j + 1})}
                if(uppery)this.addEdge(index, {x: i, y: j + 1})

              //  this.edges[JSON.stringify(index)]=  edges;
            


                }

              
                
                
               

            }

  
        }


}

export default Graph;