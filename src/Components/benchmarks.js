const arr = [10, 20, 30]
const largeArr = Array.from({ length: 100000 }).fill(10)

const testForOfOnSmallArrays = (n=15000000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (const item of arr) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testForInOnSmallArrays = (n=15000000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (const item in arr) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testForLetOnSmallArrays = (n=15000000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < arr.length; i++) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testForOfOnLargeArrays = (n=15000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (const item of largeArr) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testForInOnLargeArrays = (n=15000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (const item in largeArr) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testForLetOnLargeArrays = (n=15000) => {
    const startTime = performance.now();
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < largeArr.length; i++) {
            //console.log('Index:', index, 'item:', item)
        }
    }
    const endTime = performance.now();
    return endTime - startTime;
}

const testOnSmallArrays = () => {
    const timeForOf = testForOfOnSmallArrays()
    const timeForIn = testForInOnSmallArrays()
    const timeForLet = testForLetOnSmallArrays()
    
    console.log('Time with for of:', timeForOf)
    console.log('Time with for in:', timeForIn)
    console.log('Time with for let:', timeForLet)
}

const testOnLargeArrays = () => {
    const timeForOf = testForOfOnLargeArrays()
    const timeForIn = testForInOnLargeArrays()
    const timeForLet = testForLetOnLargeArrays()

    console.log('Time with for of:', timeForOf)
    console.log('Time with for in:', timeForIn)
    console.log('Time with for let:', timeForLet)
}

//testOnSmallArrays()
testOnLargeArrays()
