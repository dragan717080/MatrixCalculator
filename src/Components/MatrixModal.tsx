import { FC, ChangeEvent } from "react";
import MatrixModalProps from "../interfaces/MatrixModalProps";
import { useMatrixStore } from "../store/zustandStore";
import Matrix from "../interfaces/Matrix";

const MatrixModal: FC<MatrixModalProps> = ({ isOpen, setIsOpen }) => {
  const { isOnlyA, aDim, A, setA, bDim, B, setB } = useMatrixStore();
  console.log('A dim:', aDim, 'B dim:', bDim);
  const [aRows, aCols] = aDim;

  console.log('a rows:', aRows);
  // Make matrix have `aRows` or `bRows` empty rows
  console.log('new matrix value:', Array(aDim[0]).fill([]))
  //setA(Array(aDim[0]).fill([]));

  /** Update the state immutably */
  const updateValue = (isA = true, row: number, col: number, value: number) => {
    // Make a shallow copy of the previous matrix
    const newMatrix = [...A];

    // Make a copy of the row that we want to modify (row 1)
    const updatedRow = [...newMatrix[row]];

    // Update the value at index 5 in row 1
    updatedRow[col] = value;

    // Replace the old row with the updated row in the matrix
    newMatrix[row] = updatedRow;

    setA(newMatrix);
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
  }

  const fillWithZeros = (isA = true) => {
    console.log(A);
  }

  return (
    <>
      <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
        <div className="wrapper mt-[10%] text-white">
          <div className="modal-content max-h-[37rem] row space-x-4 h-full">
            {/* Matrix A input */}
            <div className="w-full col-v items-center bg-gray-550 border-2 border-primary rounded-xl overflow-hidden">
              <div className="row w-full bg-primary px-3">
                <h3 className="flex-1 text-gray-300 text-center semibold leading-7">
                  Matrix A input
                </h3>
                {isOnlyA && (
                  <button onClick={() => setIsOpen(false)}>
                    X
                  </button>
                )}
              </div>
              <div className="pt-5 pb-6 row space-x-3 text-sm md:text-md bold rounded-xl">
                <button className="btn">Insert matrix</button>
                <button disabled className="btn">Restore matrix</button>
              </div>
              <div className="flex-1 row w-full">
                <table className="modal-table text-center">
                  <thead>
                    <tr>
                      {/* First element is empty */}
                      <th>&nbsp;</th>
                      {Array.from({ length: aCols }).map((_, col) => (
                        <th key={col}>A<span className="subindex">{col + 1}</span></th>
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
                              type="text"
                              onChange={(e) => handleCellValueChange(e, row, col)}
                              className="modal-table-input-cell focus:bg-primary"
                              data-gtm-form-interact-field-id="0"
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="row space-x-3 mt-6 mb-2.5">
                <button className="btn">Clear</button>
                <button className="btn">Fill empty cells with zero</button>
              </div>
            </div>
            {/* Matrix B input */}
            {!isOnlyA && (
              <div className="w-full col-v bg-gray-550 border-2 border-primary rounded-xl">
                <div className="row w-full bg-primary px-3">
                  <h3 className="flex-1 text-gray-300 text-center semibold leading-7">
                    Matrix B input
                  </h3>
                  {!isOnlyA && (
                    <button onClick={() => setIsOpen(false)}>
                      X
                    </button>
                  )}
                </div>
                <div className="my-8 mx-3.5 md:mx-7 py-1.5 flex-1 text-sm md:text-md bold rounded-xl">
                  <div className="">
                    <table>

                    </table>
                  </div>
                  <div className="row space-x-3">
                    <button className="btn">Clear</button>
                    <button onClick={() => fillWithZeros()} className="btn">Fill empty cells with zero</button>
                  </div>
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
