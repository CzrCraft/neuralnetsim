const { sec, create } = require("mathjs")

const maxNeuronId = 1000000000

// max is also min so its like this
// -max < randRange() < max

// TODO: ADD SETS FOR WEIGHTS, NEURON BIASES AND SO ON
// currently they're kind of private to avoid bugs
// also im planning to use genetic algorithms with this so no backpropagation need theorethically yet

function leakyRelu(x) {
    if (x > 0) {
        return x
    } else {
        return x * 0.01
    }
}

function randRange(max) {
    return Math.round(Math.random() * max * 2) - max;
} 

function positiveRandRage(max) {
    return Math.round(Math.random() * max);
}

function randRangeFloat(max) {
    return (Math.random() * max * 2) - max
}

class InputNeuron{
    constructor(id, NN, callbackForValue) { 
        this.id = id
        this.value = 0
        this.NN = NN
        this.callbackForValue = callbackForValue
        this.value = 0
    }

    activate() {
        this.value = this.callbackForValue()
    }
}

class Neuron{
    constructor(id, bias, NN) { 
        this.id = id
        this.value = 0
        this.NN = NN
        this.ran = false
        if (bias != undefined) {
            this.bias = bias
        } else {
            this.bias = randRange(5)
        }
    }

    resetRan() {
        this.ran = false
    }

    activate() {
        // steps:
        //   1. get all of the connections
        //   2. then all of the other neurons
        //   3. multiply neuron*con
        //   4. add all of those
        //   5. add the bias
        //   6. apply activation function(ReLU)
        //   7. ready to go!
        if (!this.ran) {
            let inputConnections = this.NN.getNeuronInputConnections(this.id)
            let sum = 0
            for (let i = 0; i < inputConnections.length; i++){
                let iCon = inputConnections[i]
                if (iCon.firstNeuron != this) {
                    iCon.firstNeuron.activate()
                    let fNeuronVal = iCon.firstNeuron.value
                    let conWeight = iCon.weight
                    let res = fNeuronVal * conWeight
                    sum += res
                }

            }
            sum += this.bias
            sum = leakyRelu(sum)
            this.value = sum
            this.ran = true
            return;
        } else {
            return;
        }
    }
}

class OutputNeuron{
    constructor(id, NN) { 
        this.id = id
        this.value = 0
        this.ran = false
        this.NN = NN
    }
    resetRan() {
        this.ran = false
        return
    }
    activate() {
        if (!this.ran) {
            let inputConnections = this.NN.getNeuronInputConnections(this.id)
            let sum = 0
            for (let i = 0; i < inputConnections.length; i++) {
                let iCon = inputConnections[i]
                if (iCon.firstNeuron != this) {
                    iCon.firstNeuron.activate()
                    let fNeuronVal = iCon.firstNeuron.value
                    let conWeight = iCon.weight
                    let res = fNeuronVal * conWeight
                    sum += res
                }
            }
            sum = leakyRelu(sum)
            this.value = sum
            this.ran = true
            return;
        } else {
            return;
        }
        return;
    }
}

class Connection{
    constructor(firstNeuron, secondNeuron, id, weight, NN) {
        this.firstNeuron = firstNeuron
        this.secondNeuron = secondNeuron
        this.id = id
        this.NN = NN
        if (weight != undefined) {
            this.weight = weight
        } else {
            this.weight = randRangeFloat(1)
        }
    }
    // set id(newv) { }
    // get id() {
    //     return this.id
    // }
    // set weight(newv) {}
    // get weight() { return this.weight }
    
    // set firstNeuron(newv) { }
    // get firstNeuron() { return this.firstNeuron }
    
    // set secondNeuron(newv) { }
    // get secondNeuron() {return this.secondNeuron}
}

class NeuralNetwork{
    constructor() { 
        this.Neurons = {}
        this.Connections = {}
    }
    // weight and bias are optional!!
    // if not specified they are random :3

    run() {
        let result = {}
        for (let tempId in this.Neurons) {
            let tempN = this.Neurons[tempId]
            if (!(tempN instanceof InputNeuron)) {
                tempN.resetRan()
            }
        }
        for (let neuronID in this.Neurons) {
            let neuron = this.Neurons[neuronID]
            if (neuron instanceof OutputNeuron) {
                neuron.activate()
                result[neuronID] = neuron.value
            }
        }
        return result;
    }
    newNeuron(bias, id) {
        let id2 = id
        if (id == undefined) {
            id2 = randRange(maxNeuronId) + maxNeuronId
        }
        let newN = new Neuron(id2, bias, this)
        this.Neurons[id2] = newN
        return newN
    }
    newInputNeuron(callBackFunc, id) {
        let id2 = id
        if (id == undefined) {
            id2 = randRange(maxNeuronId) + maxNeuronId
        }
        let newN = new InputNeuron(id2, this, callBackFunc)
        this.Neurons[id2] = newN
        return newN
    }
    newOutputNeuron(id) {
        let id2 = id
        if (id == undefined) {
            id2 = randRange(maxNeuronId) + maxNeuronId
        }
        let newN = new OutputNeuron(id2, this)
        this.Neurons[id2] = newN
        return newN
    }
    newConnection(firstNeuron, secondNeuron, weight) {
        let id = randRange(maxNeuronId) + maxNeuronId
        let newcon = new Connection(firstNeuron, secondNeuron, id, weight, this)
        this.Connections[id] = newcon
        return newcon;
    }
    getNeuron(id) {
        return this.Neurons[id]
    }
    neuron(id) {
        return this.Neurons[id]
    }
    getConnection(id) {
        return this.Connections[id]
    }
    connection(id) {
        return this.Connections[id]
    }
    getAllConnections() {
        let result = []
        for (let i = 0; i < Object.keys(this.Connections).length; i++){
            let con = this.Connections[Object.keys(this.Connections)[i]]
            result.push([con.firstNeuron, con.weight, con.secondNeuron])
        }
        return result;
    }
    getAllNeurons() {
        return this.Neurons;
    }
    getNeuronInputConnections(id) {
        let result = []
        for (let i = 0; i < Object.keys(this.Connections).length; i++){
            let conn = this.Connections[Object.keys(this.Connections)[i]]
            if (conn.secondNeuron.id == id) {
                result.push(conn)
            }
        }
        return result;
    }

    getNeuronOutputConnections(id) {
        let result = []
        for (let i = 0; i < Object.keys(this.Connections).length; i++){
            let conn = this.Connections[Object.keys(this.Connections)[i]]
            if (conn.firstNeuron.id == id) {
                result.push(conn)
            }
        }
        return result;
    }    

}

// input neurons is a list of callbacks function for their value
// example: [func1, func2, func3, func4]

// gene structure
// neuron:
// {
// 	first:{
// 		type: 
// 		id: 
// 		bias: 
// 	},
// 	second:{
// 		type: 
// 		id: 
// 		bias: 
// 	},
// 	weight: 
// }


class Creature{
    constructor(parentGenes, inputNeurons, maxOutputNeurons, mutationRate, newGeneCount) { // newGeneCount optional
        let genes = []
        if (parentGenes != undefined) {
            let len1 = parentGenes[0].length
            let len2 = parentGenes[1].length
            if (len1 > len2) {
                let swtch = false
                for (let i = 0; i < len1; i++){
                    if (swtch) {
                        if (parentGenes[0][i] != undefined) {
                            genes.push(parentGenes[0][i])
                        } else if (parentGenes[1][i] != undefined) {
                            genes.push(parentGenes[1][i])
                        } 
                    } else {
                        if (parentGenes[1][i] != undefined) {
                            genes.push(parentGenes[1][i])
                        } else if (parentGenes[0][i] != undefined) {
                            genes.push(parentGenes[0][i])
                        } 
                    }
                    swtch = !swtch
                }
            } else { // len2 > 1
                let swtch = false
                for (let i = 0; i < len2; i++){
                    if (swtch) {
                        if (parentGenes[0][i] != undefined) {
                            genes.push(parentGenes[0][i])
                        } else if (parentGenes[1][i] != undefined) {
                            genes.push(parentGenes[1][i])
                        } 
                    } else {
                        if (parentGenes[1][i] != undefined) {
                            genes.push(parentGenes[1][i])
                        } else if (parentGenes[0][i] != undefined) {
                            genes.push(parentGenes[0][i])
                        } 
                    }
                    swtch = !swtch
                }
            }
        }
        let maxValidInputNeuron = inputNeurons.length
        let inputNeuronsCallbacks = []
        let nn = new NeuralNetwork()
        this.outputNeurons = []
        this.normalNeurons = []
        this.inputNeurons = []
        this.allNeurons = []
        this.nn = nn
        this.genes = genes
        let callbacksOnFinnish = []
        for (let i = 0; i < inputNeurons.length; i++){
            let inp = inputNeurons[i]
            inputNeuronsCallbacks.push(inp)
            let newN = nn.newInputNeuron(inp, i)
            this.inputNeurons.push(newN)
            this.allNeurons.push(newN)
        }
        for (let i = 0; i < maxOutputNeurons; i++){
            let newN = nn.newOutputNeuron(i)
            this.outputNeurons.push(newN)
            this.allNeurons.push(newN)
        }
        for (let i = 0; i < genes.length; i++) { 
            let gene = genes[i]
            let conWeight = gene["weight"]
            let fNeuron = gene["first"]
            let sNeuron = gene["second"]

            // first neuron logic
            let fType = fNeuron["type"]
            let fId = fNeuron["id"]
            let fBias = fNeuron["bias"]
            let fNeuronObj
            switch (fType) {
                case 0:
                    // it's a input neuron
                    if (fId < maxValidInputNeuron) {
                        if (nn.getNeuron(fId) == undefined) {
                            fNeuronObj = nn.newInputNeuron(inputNeuronsCallbacks[fId], fId)
                            this.inputNeurons.push(fNeuronObj)
                        }
                    } else {
                        throw "invalid input neuron"
                    }
                    break;
                case 1:
                    // it's a normal neuron
                    if (nn.getNeuron(fId) == undefined) {
                        fNeuronObj = nn.newNeuron(fBias, fId)
                        this.normalNeurons.push(fNeuronObj) 
                    }
                    break;
                case 2:
                    // it's a output neuron
                    if (nn.getNeuron(fId) == undefined) {
                        fNeuronObj = nn.newOutputNeuron(fId)
                        this.outputNeurons.push(fNeuronObj)
                    }
                    break;
            }
            // second neuron logic
            let sType = sNeuron[0]
            let sId = sNeuron[1]
            let sBias = sNeuron[2]
            let sNeuronObj
            switch (sType) {
                case 0:
                    // it's a input neuron
                    if (sId < maxValidInputNeuron) {
                        if (nn.getNeuron(sId) == undefined) {
                            sNeuronObj = nn.newInputNeuron(inputNeuronsCallbacks[sId], sId)
                            this.inputNeurons.push(sNeuronObj)
                        }
                    } else {
                        throw "invalid input neuron"
                    }
                    break;
                case 1:
                    // it's a normal neuron
                    if (nn.getNeuron(sId) == undefined) {
                        sNeuronObj = nn.newNeuron(sBias, sId)
                        this.normalNeurons.push(sNeuronObj) 
                    }
                    break;
                case 2:
                    // it's a output neuron
                    if (nn.getNeuron(sId) == undefined) {
                        sNeuronObj = nn.newOutputNeuron(sId)
                        this.outputNeurons.push(sNeuronObj)
                    }
                    break;
            }

            // make the connection
            let conn = nn.newConnection(fNeuronObj, sNeuronObj, conWeight)
            this.allNeurons.push(fNeuronObj)
            this.allNeurons.push(sNeuronObj)
            // decide if to mutate or not
            let randNr = randRange(50) + 50 // this produces output between -50 and 50 so we add 50 so output is 0 to 100
            if (randNr < mutationRate) {
                // decide mutation
                let mutationArray = ["add", "modFirst", "modSecond", "modWeight", "add", "modFirst", "modSecond", "modWeight", "add"] // array length should be divideable by 2
                let arrLen = (mutationArray.length / 2) - 1 // so it starts from 0
                let choice = mutationArray[randRange(arrLen) + arrLen]
                switch (choice) {
                    case "modFirst":
                        if (fNeuronObj instanceof Neuron) {
                            fNeuronObj.bias = fNeuronObj.bias * randRangeFloat(1)
                        }
                    case "modSecond":
                        if (sNeuronObj instanceof Neuron) {
                            sNeuronObj.bias = sNeuronObj.bias * randRangeFloat(1)
                        }
                        break;  
                    case "modWeight":
                        conn.weight = conn.weight * randRangeFloat(1)
                        break;  
                    case "add": // this is really hard to implement cuz you have to generate genes from 0
                        // this will make it so this func waits for this loop to finnish
                        callbacksOnFinnish.push(this.addMutatedGene)
                        break;
                }
            }
            
        }
        if (newGeneCount != undefined) {
            for (let i = 0; i < newGeneCount; i++){
                callbacksOnFinnish.push(this.addMutatedGene)
            }
        }
        for (let i = 0; i < callbacksOnFinnish.length; i++){
            this.addMutatedGene()
        }
    }
    addMutatedGene() {
        let newNeurs = []
        let nn = this.nn
        let fNeur
        let sNeur
        for (let i = 0; i < 2; i++) {
            let fChoice = randRange(1) + 1
            if (fChoice < 1.5) { // make the gene with already existing neurons
                let fNeur = this.allNeurons[positiveRandRage(this.allNeurons.length - 1)]
                let fNeurType
                if (fNeur instanceof InputNeuron) {
                    fNeurType = 0
                } else if(fNeur instanceof Neuron){
                    fNeurType = 1
                }else if(fNeur instanceof OutputNeuron){
                    fNeurType = 2
                }
                let sNeur = this.allNeurons[positiveRandRage(this.allNeurons.length - 1)]
                let sNeurType
                if (sNeur instanceof InputNeuron) {
                    sNeurType = 0
                } else if(sNeur instanceof Neuron){
                    sNeurType = 1
                }else if(sNeur instanceof OutputNeuron){
                    sNeurType = 2
                }
                if (sNeurType != 0) {
                    let newGene = {
                        first: {
                            type: fNeurType,
                            id: fNeur.id,
                            bias: fNeur.bias
                        },
                        second: {
                            type: sNeurType,
                            id: sNeur.id,
                            bias: sNeur.bias,
                        },
                        weight: randRangeFloat(1)
                    }
                    nn.newConnection(fNeur, sNeur, newGene["weight"])
                    this.genes.push(newGene)
                } else {
                    let sNeur = nn.newNeuron()
                    let newGene = {
                        first: {
                            type: fNeurType,
                            id: fNeur.id,
                            bias: fNeur.bias
                        },
                        second: {
                            type: 1,
                            id: sNeur.id,
                            bias: sNeur.bias,
                        },
                        weight: randRangeFloat(1)
                    }
                    nn.newConnection(fNeur, sNeur, newGene["weight"])
                    this.genes.push(newGene)
                    this.allNeurons.push(sNeur)
                    this.normalNeurons.push(sNeur)
                }
            } else { // make the gene with already only first neuron
                let sNeur = nn.newNeuron()
                let fNeur = this.allNeurons[positiveRandRage(this.allNeurons.length - 1)]
                let fNeurType
                if (fNeur instanceof InputNeuron) {
                    fNeurType = 0
                } else if(fNeur instanceof Neuron){
                    fNeurType = 1
                }else if(fNeur instanceof OutputNeuron){
                    fNeurType = 2
                }
                let newGene = {
                    first: {
                        type: fNeurType,
                        id: fNeur.id,
                        bias: fNeur.bias
                    },
                    second: {
                        type: 1,
                        id: sNeur.id,
                        bias: sNeur.bias,
                    },
                    weight: randRangeFloat(1)
                }
                this.genes.push(newGene)
                nn.newConnection(fNeur, sNeur, newGene["weight"])
                this.allNeurons.push(sNeur)
                this.normalNeurons.push(sNeur)
            }
        }
        return;
    }
    runNN() {
        this.nn.run()
    }
}
let lastGen = []
let populationCount = 10
let mutRate = 1;
let newGeneCount = 5;
let targetValue = 3.5;
let popcount = 0


while (true) {
    //console.log(popcount)
    if (lastGen.length <= 1) {
        for (let i = 0; i < populationCount; i++){
            let newCret = new Creature(undefined, [function () {
                return 3.569;// random ass number
            }], 1, mutRate, newGeneCount)
            lastGen.push([newCret, 0])
        }
    } else {
        //console.log(lastGen)
        // run every creature
        let pickingarray = []
        for (let i = 0; i < lastGen.length; i++){
            console.log(i)
            lastGen[i][0].runNN()
            let nOutput = lastGen[i][0].outputNeurons[0].value
            if (nOutput < 0) { nOutput = nOutput * -1 }
            let fitness = Math.round((targetValue - nOutput) * 10)
            lastGen[i][1] = fitness
            for (let a = 0; a < fitness; a++){
                pickingarray.push(i)
            }
        }
        // start making a new gen
        let newGen = []
        for (let i = 0; i < lastGen.length; i++){
            let firstParent = lastGen[pickingarray[positiveRandRage(pickingarray.length - 1)]][0]
            let secondParent = lastGen[pickingarray[positiveRandRage(pickingarray.length - 1)]][0]
            while (firstParent == undefined) {
                firstParent = lastGen[pickingarray[positiveRandRage(pickingarray.length - 1)]][0]
            }
            while (firstParent == secondParent || secondParent == undefined) {
                secondParent = lastGen[pickingarray[positiveRandRage(pickingarray.length - 1)]][0]
            }
            let child = new Creature([firstParent.genes, secondParent.genes], [function () {
                return 3.569;// random ass number
            }], 1, mutRate, 0)
            newGen.push([child, 0])
        } 
        let bestOne = 0
        for (let i = 0; i < lastGen.length; i++){
            if (lastGen[i][1] > bestOne) {
                bestOne = lastGen[i][1]
            }
        }   
        console.log(lastGen)
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
        console.log(newGen)
        console.log("Best one: " + bestOne)
        
        lastGen = newGen
    }
    popcount += 1
}

// let nn = new NeuralNetwork()
// let testNeuron = nn.newNeuron()
// let input = 2
// let testInput = nn.newInputNeuron(function () {
//     console.log("asked for input, gave: " + input)
//     return input
// })
// let testCon = nn.newConnection(testInput, testNeuron)
// let testOutput = nn.newOutputNeuron()
// let testCon2 = nn.newConnection(testNeuron, testOutput)
// console.log(nn.run())

// console.log(nn.getAllConnections())