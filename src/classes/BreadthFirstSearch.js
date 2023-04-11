import Algorithm from "./Algorithm";

class BreadthFirstSearch extends Algorithm {

    
    type = "Breadth First Search";
    

    nextStep(){

       

    

        if (this.next.length == 0){
            
            this.searchFailed();
        }

        else{
            

            let next = this.next.shift();
            
            while(!this.checkIfValidNext(next.node)){next = this.next.shift();}
             this.visitNode(next);
            

            let neighbors = this.graph.getNeighbors(next.node);
            if(!neighbors)return;
            for (const n of neighbors){

               

                if(this.checkIfVisited(n.idTo) == false){
                    
                    this.next.push({node: n.idTo, edge: n});
                   
                }
            }

            
            


        }
    }


    

}

export default BreadthFirstSearch;