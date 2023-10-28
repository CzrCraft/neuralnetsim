const prompt = require('prompt-sync')();

function cleanInt(x) {
    x = Number(x);
    return x >= 0 ? Math.floor(x) : Math.ceil(x);
}

const inputWord = prompt("Target word(make sure it's lowercase!!): ")
const populationSize = cleanInt(prompt("Population size: "))
let mutationChance = prompt("Mutation chance(default is 1): ")
if (mutationChance == "") {
    mutationChance = 1
} else {
    mutationChance = cleanInt(mutationChance)
}
let generationsCount = 0
//let generations = []
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz _-/?!!@#$%^&*()[]{}\\|;:,.=+0123456789"


function getRandomChar() {
    const alphabetLen = alphabet.length
    return alphabet.charAt(Math.floor(Math.random() * alphabetLen));
}

function calculateFitness(word) {
    const wordLen = inputWord.length
    let fitness = 0
    for (let i = 0; i < wordLen; i++){
        if (word.charAt(i) == inputWord.charAt(i)) {
            fitness += 1
        }
    }
    return fitness
}

function getRandInt(maxVal) {
    return Math.random() * maxVal
}

function generateNewPopulation(lastPopulation) {
    try {
        if (lastPopulation == undefined) {
            const inputWordLength = inputWord.length
            let newPop = []
            for (let i = 0; i < populationSize; i++){
                let result = ""
                for (let a = 0; a < inputWordLength; a++){
                    result += getRandomChar()
                }
                let fitness = calculateFitness(result)
                newPop.push([result, fitness])
            }
            generationsCount += 1
            return newPop
        } else {
            let bestGuess = ""
            let bestGuessFit = 0
            for (let i = 0; i < lastPopulation.length; i++){
                if (lastPopulation[i][1] > bestGuessFit) {
                    bestGuessFit = lastPopulation[i][1]
                    bestGuess = lastPopulation[i][0]
                }
            }
            let dontRepeat = false;
            console.log(generationsCount + ": " + "Best guess: " + bestGuess + "  |  " + bestGuessFit)
            let pickingArray = []
            // organise the parents
            for (let i = 0; i < populationSize; i++){
                let currentWord = lastPopulation[i][0]
                let currentFitness = lastPopulation[i][1] 
                let maxFitness = inputWord.length
                let fitnessPercentage = 100 * currentFitness / maxFitness
                //pickingArray.push([currentWord, currentFitness, maxFitness, fitnessPercentage])
                // when every fitness is 0, will throw error cuz picking array is 0
                // weird bug :(
                //pickingArray.push(i)
                for (let a = 0; a < fitnessPercentage; a++){
                    pickingArray.push(i)
                }
            }
            //console.log(pickingArray)
            // make new population
            let newPop = []
            for (let i = 0; i < populationSize; i++) {
                const firstParent = lastPopulation[pickingArray[Math.floor(getRandInt(pickingArray.length))]]
                let secondParent = lastPopulation[pickingArray[Math.floor(getRandInt(pickingArray.length))]]
                // make sure it isn't the same word
                try {
                    while (firstParent[0] != secondParent[0]) {
                        secondParent = lastPopulation[pickingArray[Math.floor(getRandInt(pickingArray.length))]]
                    }
                } catch (err) {
                    console.log(firstParent)
                    console.log(secondParent)
                }
                let result = ""
                // let firstParentChars = Math.floor(inputWord.length / 2)
                // for (let a = 0; a < firstParentChars; a++){
                //     let mutationDecision = getRandInt(100)
                //     if (mutationDecision <= mutationChance) {
                //         result += getRandomChar()
                //     } else {
                //         result += firstParent[0][a]
                //     }
                // }
                // for (let a = firstParentChars - 1; a < inputWord.length; a++){
                //     let mutationDecision = getRandInt(100)
                //     if (mutationDecision <= mutationChance) {
                //         result += getRandomChar()
                //     } else {
                //         result += secondParent[0][a]
                //     }
                // }
                let odd = false
                for (let a = 0; a < inputWord.length; a++){
                    if (odd) {
                        let mutationDecision = getRandInt(100)
                        if (mutationDecision <= mutationChance) {
                            result += getRandomChar()
                        } else {
                            result += firstParent[0][a]
                        }
                    } else {
                        let mutationDecision = getRandInt(100)
                        if (mutationDecision <= mutationChance) {
                            result += getRandomChar()
                        } else {
                            result += secondParent[0][a]
                        }
                    }
                    odd = !odd
                }
                let newFitness = calculateFitness(result)
                newPop.push([result, newFitness])
                if (result == inputWord) {
                    dontRepeat = true
                }
            }
            if (!dontRepeat) {
                //generations.push(newPop)
                generationsCount += 1
                return newPop
            } else {
                for (let i = 0; i < newPop.length; i++){
                    if (newPop[i][1] > bestGuessFit) {
                        bestGuessFit = newPop[i][1]
                        bestGuess = newPop[i][0]
                    }
                }
                console.log(generationsCount + ": " + "Best guess: " + bestGuess + "  |  " + bestGuessFit)
                generationsCount += 1
                console.log("Generations: " + generationsCount)
                console.log(newPop)
                return undefined;
            }
        }
    } catch (err) {
        console.log(err)
        console.log(lastPopulation)
    }

}
let res = undefined;
while (true) {
    res = generateNewPopulation(res)
    if (res == undefined) {
        break;
    } else {
        generateNewPopulation(res)
    }
}
