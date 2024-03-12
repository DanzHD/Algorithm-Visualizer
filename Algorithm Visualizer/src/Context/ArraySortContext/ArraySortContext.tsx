import React, {createContext, useEffect, useState} from "react";
import {ArraySort} from "./ArraySortInterface.tsx";
import {ResultStates} from "./ResultStates.tsx";
import {INITIAL_ARRAY_SIZE} from "../../Utils/Constants.tsx";
import {SortMethods} from "../../Utils/enum.tsx";

export const ArraySortContext = createContext<ArraySort>({} as ArraySort);

export function ArraySortContextProvider({children}: {children: React.ReactNode}) {

    const [resultStates, setResultStates] = useState<ResultStates[]>([]);
    const [initialNumberArray] = useState<number[]>([]);
    const [count, setCount] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [pause, setPause] = useState(false);

    useEffect(() => {
        generateArray(INITIAL_ARRAY_SIZE);

    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (count >= resultStates.length) {
            setCount(0)
        }

        if (!isSorting) return;

        if (pause) {
            return;
        }


        if (count < resultStates.length - 1) {
            setTimeout(() => {
                setCount(count => count + 1);

            }, 20)
        } else {
            setPause(true)
        }


    }, [resultStates, count, pause]);


    function generateArray(size: number) {

        const max: number = 200
        const min: number = 1
        const numberArray: number[] = []
        for (let i = 0; i < size; i++) {

            numberArray.push(Math.floor(Math.random() * (max - min) + min));
        }
        setResultStates([{
            comparedNumbers: [],
            numberArray: numberArray
        }]);

    }

    function selectionSort(): void {
        let arrayCopy = [...resultStates[0].numberArray];
        let newResultStates: ResultStates[]  = [];

        for (let i = 0; i < arrayCopy.length; i++) {
            let smallestValue = i;

            for (let j = i; j < arrayCopy.length; j++) {
                arrayCopy = [...arrayCopy];
                const newResultState = {
                    comparedNumbers: [smallestValue, j],
                    numberArray: arrayCopy
                }

                newResultStates = [...newResultStates, newResultState];
                if (arrayCopy[smallestValue] > arrayCopy[j]) {
                    smallestValue = j;
                }


            }
            swap(arrayCopy, i, smallestValue)
            storeResultState(arrayCopy, i, smallestValue);



        }

        setResultStates(newResultStates);

    }

    function insertionSort(): void {
        const arrayCopy = [...resultStates[0].numberArray];

        let j;

        for (let i = 1; i < arrayCopy.length; i++) {

            j = i
            storeResultState(arrayCopy, j, j - 1);
            while (j > 0 && arrayCopy[j - 1] > arrayCopy[j]) {
                swap(arrayCopy, j, j - 1)
                storeResultState(arrayCopy, j, j - 1);
                j -= 1
                if (j > 0) {

                    storeResultState(arrayCopy, j, j - 1);
                }

            }


        }
    }

    function partition(array: number[], l: number, r: number) {
        const pivotIndex = l;
        const pivot = array[l]
        const arrayLength = r;
        const startingIndex = l;
        while (true) {
            while (++l && l < arrayLength) {
                let swapIndexFound = false;
                if (array[l] > pivot) {
                    swapIndexFound = true;

                }
                if (r === arrayLength) {

                    storeResultState(array, pivotIndex, l, r - 1)
                } else {
                    storeResultState(array, pivotIndex, l, r)
                }
                if (swapIndexFound) {
                    break;
                }
            }
            while (--r && r > startingIndex) {
                let swapIndexFound = false;
                if (array[r] < pivot) {
                    swapIndexFound = true;

                }
                storeResultState(array, pivotIndex, r, l);
                if (swapIndexFound) {
                    break;
                }
            }
            if (l >= r) break;
            swap(array, l, r);
            storeResultState(array, pivotIndex, r, l);

        }
        swap(array, pivotIndex, r);
        storeResultState(array, pivotIndex, r, l);

        return r;
    }

    function swap(array: number[], i: number, j: number) {
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp;

    }

    function quickSort(array: number[], l: number, r: number) {

        if (l < r) {
            const i = partition(array, l, r);
            quickSort(array, i + 1, r);
            quickSort(array, l, i );


        }
    }

    function storeResultState(arrayCopy: number[], ...comparedNumbers: number[]) {
        arrayCopy = [...arrayCopy]
        const newResultState = {
            comparedNumbers: comparedNumbers,
            numberArray: arrayCopy
        }
        setResultStates(resultStates => [...resultStates, newResultState])
    }

    function increaseCount() {
        if (count >= resultStates.length) {
            setCount(0);
            return
        }
        setCount(count => count + 1)
    }
    function decreaseCount() {
        if (count <= 0) {
            setCount(resultStates.length - 1);
            return
        }
        setCount(count => count - 1)
    }



    function chooseSort(sortingMethod : SortMethods) {

        if (sortingMethod === SortMethods.SELECTION_SORT) {

            selectionSort();
        }
        if (sortingMethod === SortMethods.INSERTION_SORT) {
            insertionSort()
        }

        if (sortingMethod === SortMethods.QUICK_SORT) {

            quickSort([...resultStates[0].numberArray], 0, resultStates[0].numberArray.length);
        }
    }


    const contextData: ArraySort = {
        generateArray,
        selectionSort,
        resultStates,
        initialNumberArray,
        count,
        setCount,
        chooseSort,
        increaseCount,
        decreaseCount,
        pause,
        setPause,
        isSorting,
        setIsSorting


    }

    return (

        <ArraySortContext.Provider value={contextData}>
            {children}
        </ArraySortContext.Provider>
    )
}
