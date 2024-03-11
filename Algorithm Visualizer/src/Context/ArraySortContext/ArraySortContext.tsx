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
        let temp;
        let newResultStates: ResultStates[] | ((prevState: ResultStates[]) => ResultStates[]) = [];

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
            arrayCopy = [...arrayCopy]

            temp = arrayCopy[i]
            arrayCopy[i] = arrayCopy[smallestValue];
            arrayCopy[smallestValue] = temp;
            const newResultState = {
                comparedNumbers: [],
                numberArray: arrayCopy
            }
            newResultStates = [...newResultStates, newResultState]
            


        }

        setResultStates(newResultStates);

    }

    function insertionSort(): void {
        const arrayCopy = [...resultStates[0].numberArray];
        let newResultStates: ResultStates[] | ((prevState: ResultStates[]) => ResultStates[]) = [];

        let j;

        for (let i = 1; i < arrayCopy.length; i++) {

            j = i
            newResultStates = storeResultState(arrayCopy, i, i - 1, newResultStates)

            while (j >= 0 && arrayCopy[j - 1] > arrayCopy[j]) {

                [arrayCopy[j], arrayCopy[j - 1]] = [arrayCopy[j-1], arrayCopy[j]]
                j -= 1
                newResultStates = storeResultState(arrayCopy, j - 1, j, newResultStates)
            }



        }
        setResultStates(newResultStates)
    }

    function storeResultState(arrayCopy: number[], i: number, j: number, newResultStates) {
        arrayCopy = [...arrayCopy]
        const newResultState = {
            comparedNumbers: [i, j],
            numberArray: arrayCopy
        }
        return [...newResultStates, newResultState]
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
