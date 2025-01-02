import { FC, ChangeEvent, useEffect, useState } from 'react';
import MatrixModalProps from '../interfaces/MatrixModalProps';
import { useMatrixStore } from '../store/zustandStore';

const MatrixModal: FC<MatrixModalProps> = ({ isOpen, setIsOpen }) => {
  const { isOnlyA, aDim, A, setA, bDim, B, setB, calculate } = useMatrixStore();
  console.log('A dim:', aDim, 'B dim:', bDim);
  const [aRows, aCols] = aDim;
  const [bRows, bCols] = bDim;
  const [aIsFilled, setAIsFilled] = useState<boolean>(false);
  const [bIsFilled, setBIsFilled] = useState<boolean>(false);
  let inputCellsA: HTMLInputElement[] | undefined;
  let inputCellsB: HTMLInputElement[] | undefined;

  /** Need separate functions since this will be triggered multiple times. */
  const initialFillA = () => {
    console.log('A dim:', aRows, aCols);
    const newA = Array.from({ length: aRows }, () => Array.from({ length: aCols }).fill(undefined));
    console.log('NEW A:', newA);
    // @ts-ignore:next-line
    setA(newA)
  }

  const initialFillB = () => {
    console.log('B dim:', aRows, bCols);
    const newB = Array.from({ length: bRows }, () => Array.from({ length: bCols }).fill(undefined));
    console.log('NEW B:', newB);
    // @ts-ignore:next-line
    setB(newB)
  }

  const fillInputCells = (isA = true) => {
    console.log('filling input cells');
    const matrix = isA ? A : B;
    const nRows = isA ? aRows : bRows;
    const nCols = isA ? aCols : bCols;

    const inputCells = isA ? inputCellsA! : inputCellsB!;
    console.log(inputCells.length);

    inputCells.forEach((inputCell, index) => {
      const row = Math.floor(index / nCols);
      const col = index - row * nCols;
      console.log('Index:', index, 'Row:', row, 'Col:', col)
      if (matrix.length === 0) {
        inputCell.value = ''
      } else {
        inputCell.value = matrix[row][col] as unknown as string ?? ''
      }
    });
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

  //initialFillMatrices();

  //console.log('a rows:', aRows);
  // Make matrix have `aRows` or `bRows` empty rows
  //console.log('new matrix value:', Array(aDim[0]).fill([]))
  //setA(Array(aDim[0]).fill([]));
  //console.log('%cINITIAL MATRIX:', 'color:red', A);

  /** Update the state with one new value immutably */
  const updateValue = (row: number, col: number, value: number, isA = true) => {
    const matrix = isA ? A : B;
    console.log('is a:', isA);
    console.log('original matrix:', matrix);
    // Make a shallow copy of the previous matrix
    const newMatrix = [...matrix];
    const func = isA ? setA : setB;
    console.log('A:', A);
    console.log('new matrix in update value:', newMatrix);

    // Make a copy of the row that we want to modify
    const updatedRow = [...newMatrix[row]];

    updatedRow[col] = value;

    // Replace the old row with the updated row in the matrix
    newMatrix[row] = updatedRow;

    func(newMatrix);
  };

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

    if (newChar === '.') {
      dotsCount--;

      if (e.target.value.length === 1 || dotsCount > 0) {
        console.log('preventing input value change');
        e.target.value = e.target.value.slice(0, -1);

        return;
      }
    }

    const pattern = /^[\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?$/;
    const isNum = pattern.test(e.target.value);
    console.log('is num:', isNum);

    // Only update the value if it matches the pattern
    // Allow empty input and values like `2.` as well
    if (isNum || newChar === '.' || e.target.value === '') {
      console.log('UPDATING');
      updateValue(row, col, e.target.value as unknown as number, isA);
    } else {
      // Prevent the input from updating if it's invalid
      console.log('NOT UPDATING');
      e.target.value = e.target.value.slice(0, -1);
    }
  }

  const fillWithZeros = (isA = true) => {
    const func = isA ? setA : setB;
    const fillFunc = isA ? setAIsFilled : setBIsFilled;
    const newMatrix = isA ? [...A] : [...B];
    const newRows = isA ? aRows : bRows as number;
    const newCols = isA ? aCols : bCols as number;

    for (const row in newMatrix) {
      for (const col in newMatrix[0]) {
        if (!newMatrix[row][col]) {
          newMatrix[row][col] = 0;
        }
      }
    }

    func!(newMatrix);
    fillFunc(true);
  }

  useEffect(() => {
    inputCellsA =
      Array.from(document.getElementsByClassName('cell-a') as HTMLCollectionOf<HTMLInputElement>);
    inputCellsB =
      Array.from(document.getElementsByClassName('cell-b') as HTMLCollectionOf<HTMLInputElement>);
    initialFillMatrices();
  }, [aDim[0], aDim[1], bDim[0], bDim[1]]);

  return (
    <>
      <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
        <div className='wrapper mt-[10%] text-white'>
          <div className='modal-content max-h-[37rem] row space-x-4 h-full'>
            {/* Matrix A input */}
            <div className='w-full col-v items-center bg-gray-550 border-2 border-primary rounded-xl overflow-hidden'>
              <div className='row w-full bg-primary px-3'>
                <h3 className='flex-1 text-gray-300 text-center semibold leading-7'>
                  Matrix A input
                </h3>
                {isOnlyA && (
                  <button onClick={() => setIsOpen(false)}>X</button>
                )}
              </div>
              <div className='pt-5 pb-6 row space-x-3 text-sm md:text-md bold rounded-xl'>
                <button className='btn'>Insert matrix</button>
                <button disabled className='btn'>Restore matrix</button>
              </div>
              <div className='flex-1 row w-full'>
                <table className='modal-table text-center'>
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
                              className='modal-table-input-cell cell-a focus:bg-primary'
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
                  <button onClick={() => initialFillA()} className='btn'>Clear</button>
                  <button onClick={() => fillWithZeros()} className='btn'>Fill empty cells with zero</button>
                </div>
                {!aIsFilled && (
                  <button onClick={() => { setIsOpen(false); calculate() }} className='btn'>Calculate</button>
                )}
              </div>
            </div>
            {/* Matrix B input */}
            {!isOnlyA && (
              <div className='w-full col-v items-center bg-gray-550 border-2 border-primary rounded-xl overflow-hidden'>
                <div className='row w-full bg-primary px-3'>
                  <h3 className='flex-1 text-gray-300 text-center semibold leading-7'>
                    Matrix B input
                  </h3>
                  <button onClick={() => setIsOpen(false)}>X</button>
                </div>
                <div className='pt-5 pb-6 row space-x-3 text-sm md:text-md bold rounded-xl'>
                  <button className='btn'>Insert matrix</button>
                  <button disabled className='btn'>Restore matrix</button>
                </div>
                <div className='flex-1 row w-full'>
                  <table className='modal-table text-center'>
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
                                className='modal-table-input-cell cell-b focus:bg-primary'
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
                    <button onClick={() => initialFillB()} className='btn'>Clear</button>
                    <button onClick={() => fillWithZeros(false)} className='btn'>Fill empty cells with zero</button>
                  </div>
                  {!bIsFilled && (
                    <button onClick={() => { setIsOpen(false); calculate() }} className='btn'>Calculate</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export { MatrixModal };
