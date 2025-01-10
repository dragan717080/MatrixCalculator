import { FC, ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MatrixTextInsert from './MatrixTextInsert';
import useUpdateValuesForMatrix from '../hooks/useUpdateValuesForMatrix';
import { isStringNumeric, wait } from '../lib/utils';
import { useMatrixStore, useModalStore } from '../store/zustandStore';

const MatrixModal: FC = () => {
  const {
    isOnlyA,
    aDim, A, setA, aIsFilled, setAIsFilled,
    bDim, B, setB, bIsFilled, setBIsFilled,
    calculate
  } = useMatrixStore()
  const { isOpen, setIsOpen } = useModalStore()
  const { updateValuesForMatrix } = useUpdateValuesForMatrix()

  const [aRows, aCols] = aDim
  const [bRows, bCols] = bDim

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [inputCellsA, setInputCellsA] = useState<HTMLInputElement[]>([])
  const [inputCellsB, setInputCellsB] = useState<HTMLInputElement[]>([])
  const [isADisabled, setIsADisabled] = useState<boolean>(false)
  const [isBDisabled, setIsBDisabled] = useState<boolean>(false)
  const [isInsertingA, setIsInsertingA] = useState<boolean>(false)
  const [isInsertingB, setIsInsertingB] = useState<boolean>(false)
  // Keep track for case that both text inserts are open simultaneously, set to false on first render
  const [hasOpenedBefore, setHasOpenedBefore] = useState<boolean>(false)

  const allIsFilled = useMemo(() => {
    return isOnlyA ? aIsFilled : aIsFilled && bIsFilled;
  }, [isOnlyA, aIsFilled, bIsFilled]);

  /** Need separate functions since this will be triggered multiple times. */
  const initialFillA = () => {
    const newA = Array.from({ length: aRows }, () => Array.from({ length: aCols }).fill(undefined));
    // @ts-ignore:next-line
    setA(newA)
  }

  const initialFillB = () => {
    const newB = Array.from({ length: bRows }, () => Array.from({ length: bCols }).fill(undefined));
    // @ts-ignore:next-line
    setB(newB)
  }

  const fillInputCells = (isA = true) => {
    const matrix = isA ? A : B;
    const nCols = isA ? aCols : bCols;

    let inputCells = isA ? inputCellsA! : inputCellsB!;
    console.log('There are', inputCells.length, 'input elements');
    console.log('matrix in fill:', matrix);

    if (!inputCells.length && !hasOpenedBefore) {
      console.log('%cIS A:', 'color:red;font-size:22px', isA);
      console.log('has opened before:', hasOpenedBefore);
      console.log('is inserting A:', isInsertingA);
      console.log('is inserting B:', isInsertingB);
      console.log(`${isA ? 'A' : 'B'} has no input cells, will early return`);
      return
    }

    if (!inputCells.length) {
      const newAInputCells = Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
      const newBInputCells = Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
      inputCells = isA ? newAInputCells : newBInputCells
    }

    // In case it was in insert matrix, input cells will not be in DOM
    const { width: cellWidth } = inputCells[0].getBoundingClientRect()
    console.log('cell width:', cellWidth);

    if (cellWidth === 0) {
      console.log('resetting input cells');
      const newAInputCells = Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
      const newBInputCells = Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
      setInputCellsA(newAInputCells);
      setInputCellsB(newBInputCells);
      inputCells = isA ? newAInputCells : newBInputCells
    }

    for (let index = 0; index < inputCells.length; index++) {
      const inputCell = inputCells[index]
      const row = Math.floor(index / nCols);
      const col = index - row * nCols;

      if (matrix.length === 0) {
        inputCell.value = ''
      } else {
        console.log(matrix);
        console.log(aDim, bDim);
        /** If came from cancel previously, `aDim` and `A` will mismatch, then reset `A` (or `B`). */
        const expectedDim = isA ? aDim : bDim

        if (matrix.length !== expectedDim[0] || matrix[0].length !== expectedDim[1]) {
          console.log('Was in cancel, so dimensions mismatch');
          console.log('Will have input cells:', inputCells.length);
          const newAInputCells = Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
          setInputCellsA(newAInputCells);

          for (const cell of newAInputCells) {
            cell.value = ''
          }

          setA([])

          if (!isA) {
            const newBInputCells = Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
            setInputCellsB(newBInputCells)

            for (const cell of newBInputCells) {
              cell.value = ''
            }

            setB([])
          }

          return;
        }
        inputCell.value = matrix[row][col] as unknown as string ?? ''
      }

      console.log('cell', inputCell);
      // To do: remove
      if (matrix.length && typeof(matrix[row][col]) !== 'undefined') {
        console.log('new value of cell:', matrix[row][col])
      }
    };
  }

  /** Initially fill matrices with `rows` * undefined */
  const initialFillMatrices = () => {
    initialFillA();
    fillInputCells();

    if (!isOnlyA) {
      initialFillB();
      fillInputCells(false);
    }
  }

  /** Update the state with one new value immutably. */
  const updateValue = (row: number, col: number, value: number, isA = true) => {
    const matrix = isA ? A : B;
    console.log('is a:', isA);
    console.log('original matrix:', matrix);
    // Make a shallow copy of the previous matrix
    const newMatrix = [...matrix];
    const func = isA ? setA : setB;
    console.log('A:', A);
    console.log('new matrix in update value:', newMatrix);
    console.log('new value:', value, typeof (value));

    if (typeof(newMatrix[row]) === 'undefined') {
      newMatrix.push([])
    }
    // Make a copy of the row that we want to modify
    const updatedRow = [...newMatrix[row]];

    updatedRow[col] = value;

    // Replace the old row with the updated row in the matrix
    newMatrix[row] = updatedRow;

    func(newMatrix);
  };

  const checkIfIsMatrixFilled = (
    fillFunc: (value: boolean) => void,
    isA = true
  ) => {
    const inputCells = isA ? inputCellsA : inputCellsB;
    const isFilled = inputCells.every(x => x.value);
    fillFunc(isFilled);
    return isFilled;
  }

  const handleCellValueChange = (
    e: ChangeEvent<HTMLInputElement>,
    row: number,
    col: number,
    isA: boolean = true
  ) => {
    console.log('Row:', row);
    console.log('Col:', col);
    console.log('value:', e.target.value);

    // Only allow one dot
    let dotsCount = [...e.target.value].filter(x => x === '.').length;
    console.log('DOTS COUNT:', dotsCount);
    console.log('is a in handle:', isA);
    console.log(e.target);

    // @ts-ignore:next-line
    const newChar = e.nativeEvent.data;

    const disableFunc = isA ? setIsADisabled : setIsBDisabled
    const fillFunc = isA ? setAIsFilled : setBIsFilled
    const inputCells = isA ? inputCellsA : inputCellsB

    if (newChar === '.') {
      dotsCount--;

      if (e.target.value.length === 1 || dotsCount > 0) {
        console.log('preventing input value change');
        e.target.value = ''

        return;
      }
    }

    const isNum = isStringNumeric(e.target.value);
    console.log('is num:', isNum);

    const isNegativeInput = newChar === '-'
    const firstCharIsNegative = e.target.value.length === 1 && isNegativeInput
    console.log('first char is neg:', firstCharIsNegative);
    console.log('is matrix filled:', checkIfIsMatrixFilled(fillFunc, isA));
    if (firstCharIsNegative) {
      disableFunc(true)
      fillFunc(false)
      return
    }

    if (['--', '-.', '..'].includes(e.target.value)) {
      e.target.value = e.target.value[0]
      disableFunc(true)
      fillFunc(false)
      return
    }

    // Only update the value if it matches the pattern
    // Allow empty input and values like `2.` as well
    if (isNum || firstCharIsNegative || newChar === '.' || e.target.value === '') {
      console.log('UPDATING');
      updateValue(row, col, e.target.value as unknown as number, isA);

      if (inputCells.every(x => x.value !== '-')) {
        disableFunc(false)
      } else {
        fillFunc(false)
      }
    } else {
      // Prevent the input from updating if it's invalid
      console.log('NOT UPDATING');
      e.target.value = e.target.value.slice(0, -1);
      if (e.target.value.length === 0) {
        fillFunc(false)
      }
    }
  }

  const handleCalculate = () => {
    setIsOpen(false)
    console.log('old A in modal before calculate:', A)
    const newA = updateValuesForMatrix()
    console.log('new A in modal after calculate:', newA)
    setA(newA)

    if (!isOnlyA) {
      console.log('old B in modal before calculate:', B)
      const newB = updateValuesForMatrix(false)
      console.log('new B in modal after calculate:', newB)
      setB(newB)
    }

    calculate()
  }

  const fillWithZeros = useMemo(() => {
    return (isA = true) => {
      const func = isA ? setA : setB;
      const fillFunc = isA ? setAIsFilled : setBIsFilled;
      const newMatrix = isA ? [...A] : [...B];

      for (let row = 0; row < newMatrix.length; row++) {
        for (let col = 0; col < newMatrix[0].length; col++) {
          if (!newMatrix[row][col]) {
            newMatrix[row][col] = 0;
          }
        }
      }

      func!(newMatrix);
      fillFunc(true);

      console.log('is A', isA);
      const inputCells = isA ? inputCellsA : inputCellsB;

      console.log(inputCells);

      for (const inputCell of inputCells!) {
        if (!inputCell.value) {
          inputCell.value = '0';
        }
      }
    };
  }, [A, B, inputCellsA, inputCellsB, setA, setB, setAIsFilled, setBIsFilled]);

  const clearMatrix = (isA = true) => {
    const inputCells = isA ? inputCellsA : inputCellsB

    for (const inputCell of inputCells) {
      inputCell.value = ''
    }

    isA ? initialFillA() : initialFillB()
  }

  useEffect(() => {
    console.log('A changed:', A);
  }, [A])

  useEffect(() => {
    console.log('filling input cells again');
    if (isInsertingA) {
      return
    }

    setInputCellsA(
      Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
    );
    setInputCellsB(
      Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
    );
    fillInputCells()
  }, [isInsertingA])

  useEffect(() => {
    if (isInsertingB) {
      return
    }

    setInputCellsA(
      Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
    );
    setInputCellsB(
      Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
    );
    fillInputCells()
    fillInputCells(false)
  }, [!isInsertingB])

  useEffect(() => {
    setInputCellsA(
      Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>)
    );
    setInputCellsB(
      Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>)
    );
    initialFillMatrices();
    console.log('input cells A:', inputCellsA);
    console.log('input cells B:', inputCellsB);
  }, [aDim[0], aDim[1], bDim[0], bDim[1]]);

  // to do: remove
  useEffect(() => {
    // @ts-ignore
    setA([1, 2, 3, 4])
    //setAIsFilled(true)
    setIsOpen(false)
    console.log('closing modal');
  }, []);

  useEffect(() => {
    console.log('is open in modal:', isOpen);
  }, [isOpen])

  return (
    <>
      <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
        <div className='wrapper mt-[10%] text-white'>
          <div className='modal-content max-h-[37rem] min-w-fit row flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 min-h-fit md:min-h-auto md:h-full'>
            {/* Matrix A input */}
            <div className='w-full min-w-72 col-v items-center bg-gray-550 border-2 border-primary rounded-xl overflow-hidden'>
              <div className='row w-full bg-primary px-3'>
                <h3 className='flex-1 text-gray-300 text-center semibold leading-7'>
                  Matrix A input
                </h3>
                {isOnlyA && (
                  <button onClick={() => setIsOpen(false)}>X</button>
                )}
              </div>
              {!isInsertingA
                ? (
                  <div className='px-3'>
                    <div className='pt-5 pb-6 row space-x-3 text-sm md:text-md bold rounded-xl'>
                      <button
                        onClick={() => { setHasOpenedBefore(true); setIsInsertingA(true) }}
                        className='btn'
                      >
                        Insert matrix
                      </button>
                      <button disabled className='btn'>Restore matrix</button>
                    </div>
                    <div className='flex-1 row w-full'>
                      <table className='matrix-table overflow-scroll md:overflow-auto text-center'>
                        <thead>
                          <tr>
                            {/* First element is empty */}
                            <th>&nbsp;</th>
                            {Array.from({ length: aCols }).map((_, col) => (
                              <th key={col}>A<span className='subindex'>{col + 1}</span></th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: aRows }).map((_, row) => (
                            <tr key={row}>
                              <td>{row + 1}</td>
                              {Array.from({ length: aCols }).map((_, col) => (
                                <td className='' key={col}>
                                  <input
                                    type='text'
                                    onChange={(e) => handleCellValueChange(e, row, col)}
                                    className='matrix-table-input-cell cell-a focus:bg-primary'
                                    data-gtm-form-interact-field-id='0'
                                  />
                                </td>
                              ))}
                            </tr>
                          ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className='flex flex-col space-y-1.5 mb-4'>
                      <div className='row space-x-3 mt-6 mb-2.5'>
                        <button onClick={() => clearMatrix()} className='btn'>Clear</button>
                        <button onClick={() => fillWithZeros()} className='btn'>Fill empty cells with zero</button>
                      </div>
                      {allIsFilled && (
                        <button
                          disabled={isADisabled}
                          onClick={() => handleCalculate()}
                          className='btn'
                        >
                          Calculate
                        </button>
                      )}
                    </div>
                  </div>
                )
                : (
                  <MatrixTextInsert setIsInserting={setIsInsertingA} />
                )
              }
            </div>
            {/* Matrix B input */}
            {!isOnlyA && (
              <div className='w-full min-w-72 col-v items-center bg-gray-550 border-2 border-primary rounded-xl overflow-hidden'>
                <div className='row w-full bg-primary px-3'>
                  <h3 className='flex-1 text-gray-300 text-center semibold leading-7'>
                    Matrix B input
                  </h3>
                  <button onClick={() => setIsOpen(false)}>X</button>
                </div>
                {!isInsertingB
                  ? (
                    <div className='px-3'>
                      <div className='pt-5 pb-6 row space-x-3 text-sm md:text-md bold rounded-xl'>
                        <button
                          onClick={() => { setHasOpenedBefore(true); setIsInsertingB(true) }}
                          className='btn'
                        >
                          Insert matrix
                        </button>
                        <button disabled className='btn'>Restore matrix</button>
                      </div>
                      <div className='flex-1 row w-full'>
                        <table className='matrix-table overflow-scroll md:overflow-auto text-center'>
                          <thead>
                            <tr>
                              {/* First element is empty */}
                              <th>&nbsp;</th>
                              {Array.from({ length: bCols }).map((_, col) => (
                                <th key={col}>B<span className='subindex'>{col + 1}</span></th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from({ length: bRows }).map((_, row) => (
                              <tr key={row}>
                                <td>{row + 1}</td>
                                {Array.from({ length: bCols }).map((_, col) => (
                                  <td className='' key={col}>
                                    <input
                                      type='text'
                                      onChange={(e) => handleCellValueChange(e, row, col, false)}
                                      className='matrix-table-input-cell cell-b focus:bg-primary'
                                      data-gtm-form-interact-field-id='0'
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))
                            }
                          </tbody>
                        </table>
                      </div>
                      <div className='flex flex-col space-y-1.5 mb-4'>
                        <div className='row space-x-3 mt-6 mb-2.5'>
                          <button onClick={() => clearMatrix(false)} className='btn'>Clear</button>
                          <button onClick={() => fillWithZeros(false)} className='btn'>Fill empty cells with zero</button>
                        </div>
                        {allIsFilled && (
                          <button
                            disabled={isBDisabled}
                            onClick={() => handleCalculate()}
                            className='btn'
                          >
                            Calculate
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <MatrixTextInsert setIsInserting={setIsInsertingB} isA={false} />
                  )
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export { MatrixModal };
