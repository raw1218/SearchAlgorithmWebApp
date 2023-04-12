class Edge {

    constructor(idFrom, idTo, ref){

        this.idFrom = idFrom;
        this.idTo = idTo;
        this.ref = ref;
    }

    

    animateEdge(reverse){

        this.ref.startAnimation(reverse);
    }
}


export default Edge