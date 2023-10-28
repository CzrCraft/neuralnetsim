const brain = require("brain.js")
const prompt = require('prompt-sync')();
// provide optional config object (or undefined). Defaults shown.
const config = {
    binaryThresh: 0.5,
    hiddenLayers: [10, 10], // array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
};

// create a simple feed forward neural network with backpropagation
const net = new brain.NeuralNetwork(config);

const colorRGB = [
    { r: 0.404, b: 1 }, // purple
    { r: 1 }, //red
    { b: 1 }, //blue
    { g: 1 }, //green
    { r: 0.973, g: 1 }, //yellow
    { r: 0.639, g: 0.608, b: 0.141 }, // yellow
    { r: 0.141, g: 0.639, b: 0.204 }, //green
    { g: 1, b: 0.871 }, //teal
    { r: 1, b: 1 }, // pink
    { r : 1, g: 0.6}, // orange
]

const colorNames = [
    { purple: 1 },
    { red: 1 },
    { blue: 1 },
    { green: 1 },
    { yellow: 1 },
    { yellow: 1 },
    { green: 1 },
    { teal: 1 },
    { pink: 1 },
    { orange: 1}, 
]

// const colorNames = [
//     "purple",
//     "red",
//     "blue",
//     "green",
//     "yellow",
//     "yellow",
//     "green",
//     "teal",
//     "pink",
//     "orange",
// ]

let trainingData = []

for (colorIndex in colorNames) {
    const rgb = colorRGB[colorIndex]
    const name = colorNames[colorIndex]
    trainingData.push({
        input: rgb,
        output: name
    })
}
console.log(trainingData)
console.log(trainingData[0])
console.log(trainingData[0]["output"])

net.train(trainingData, {
        log: (error) => console.log(error),
        logPeriod: 100,
        iterations: 1000000000,
        errorThresh: 0.001,
});
const r = prompt("red: ")
const g = prompt("green: ")
const b = prompt("blue: ")
const test = net.run({ r: parseFloat(r), b: parseFloat(b), g: parseFloat(g)})
console.log(test)



// net.train([
//         { input: [0, 0], output: [0] },
//         { input: [0, 1], output: [1] },
//         { input: [1, 0], output: [1] },
//         { input: [1, 1], output: [0] },
//     ], {
//         log: (error) => console.log(error),
//         logPeriod: 100,
//         iterations: 1000000000,
//         errorThresh: 0.000002,
// });

// console.log("[1,1] " + net.run([1, 1]))
// console.log("[1,0] " + net.run([1, 0]))
// console.log("[0,1] " + net.run([0, 1]))
// console.log("[0,0] " + net.run([0,0]))