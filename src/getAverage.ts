import {Average} from "./types";


const getMean = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => {
        return acc + num
    }, 0) / numbers.length
}

const getMedian = (numbers: number[]): number => {

    const isOdd = numbers.length % 2 !== 0;
    const sortedNumbers = numbers.sort();
    const halfLen = numbers.length / 2;
    const centerIndex = halfLen - 1

    if(isOdd) {
        /**
         * standard middle value
         */
        return sortedNumbers[Math.ceil(centerIndex)]
    }

    return getMean([
        sortedNumbers[centerIndex],
        sortedNumbers[centerIndex + 1],
    ])
}



export const getAverage = (numbers: number[]): Average => {

    return {
        median: getMedian(numbers),
        mean: getMean(numbers)
    }

}