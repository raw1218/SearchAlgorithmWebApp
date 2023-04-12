import Algorithm from "./Algorithm";

class DepthFirstSearch extends Algorithm {

    
    
    type = "Depth First Search";




     nextStep(){

       

    

        if (this.next.length == 0){
            
            this.searchFailed();
        }

        else{
            

            let next = this.next.pop();
            
            while(!this.checkIfValidNext(next.node)){next = this.next.pop();}
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

export default DepthFirstSearch;