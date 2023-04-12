

class Node {

    constructor(props){

        this.id = props.id;
        this.visited = false;

        this.ref = props.ref;
        this.type = props.type

    }

    getType(){return this.type;}

    reset(){
        this.visited = false;
        this.type = "none";
        this.ref.current.setType("none");
    }


    setNodeType(type){

        

      
        this.type = type;
        this.ref.current.setType(type);
    }


}

export default Node;