



class Algorithm {

    constructor(props){

        this.type = "Algorithm"

        this.completed = false;

        this.visited = [];
        this.next = [];

        this.graph = props.graph;

        this.start = props.start;
        this.end = props.end

    
        this.intervalID = null;
        this.setFinished = null;
    }

    setGraph(graph){

        this.graph = graph;
    }

    checkIfVisited(id){

        for(let item of this.visited){

            
            if(id.x && id.x == item.x && id.y == item.y){return true;}
            if(id == item){return true}
            
        }
        return false;
    }

    checkIfValidNext(id){



        if(this.checkIfVisited(id)){
            return false
        }

        if(this.graph.getNode(id).ref.current.getType() == 'obstacle'){
            return false
        }
        return true;
    }


    startSearch(speed, setFinished) {

       

        this.setFinished = setFinished;
        if(this.intervalID != null)clearInterval(this.intervalID);
     
        if(this.next.length == 0)this.next = [{ node: this.start, edge: null }];


        

        this.intervalID = setInterval(() => {this.nextStep()}, speed)

    }

    

     visitNode({node, edge}) {
       
            const id = node;
            const n = this.graph.getNode(id);
            
            const ref = n.ref;
            this.visited.push(id);
            
            
            if (id.x && id.x == this.end.x && id.y == this.end.y) {
                
                this.searchPassed();
            
            }
    
            else if (id == this.end) {
                
                this.searchPassed();
                
            }
    
            if (edge && edge.ref) {


                const source = edge.ref.current.getSource();
                const source2 = edge.idFrom
                console.log("ref source = ",source, " edge source = ", source2 )
                const reverse = source.id != source2
                edge.ref.current.setVisited(true);
                
                
                
                
            } 
            const type = ref.current.getType();
            console.log("reading type of ", type);
            if(type != "start" && type != "end")ref.current.setType("visited");
                   
        
    }

        

     

    searchFailed(){

        console.log("search failed");
        this.completed = true;
        clearInterval(this.intervalID)
        this.setFinished(true);
        

    }

    searchPassed(){

        console.log("search complete");
        this.completed = true;
        clearInterval( this.intervalID)
        this.setFinished(true);

    }





    resetNodes(){


        this.completed = false;
        this.next = [{ node: this.start, edge: null }]

        console.log("resetting nodes")
        for(let k in this.graph.nodes){

            
            const n = this.graph.nodes[k];
    
            console.log("n = ", n);
            const type = n.ref.current.getType();

           if(type == "visited")n.ref.current.setType("none");
        }

        for(let k in this.graph.edges){

            const e = this.graph.edges[k];
            for(const edge of e){
                if(edge.ref){
                    edge.ref.current.setVisited(false);
                }
            }
        }
    }






}

export default Algorithm;