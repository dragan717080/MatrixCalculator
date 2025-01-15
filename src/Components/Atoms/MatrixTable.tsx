import React, { FC, memo } from 'react'
import MatrixTableProps from '../../interfaces/MatrixTableProps'
import { useLinearEquationsStore } from '../../store/zustandStore'

const MatrixTable: FC<MatrixTableProps> = ({
  nRows,
  nCols,
  A,
  highlightFunc,
  className,
  index,
  letter,
  isWithCoefs
}) => {
    const { equationCoefs } = useLinearEquationsStore()

    const getTableCellValue = (value: number) => {
      if (typeof (value) === 'string') {
        value = parseFloat(value)
      }

      return Number.isInteger(value) ? value : value?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')
    }

    return (
      <table
        className={`${className ? className : ''} matrix-table mt-5 mb-6 mx-auto overflow-scroll md:overflow-auto text-center`}
      >
        <thead>
          <tr>
            {/* First element is empty */}
            <th>&nbsp;</th>
            {Array.from({ length: nCols }).map((_, col) => (
              <th key={col}>{letter || 'A'}<span className='subindex'>{col + 1}</span></th>
            ))}
            {isWithCoefs && (
              <th className='border-l-orange'>b</th>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: nRows }).map((_, row) => (
            <tr key={row} className='!leading-6.5'>
              <td className='!text-gray-350'>{row + 1}</td>
              {Array.from({ length: nCols }).map((_, col) => (
                <td
                  className={`${highlightFunc && highlightFunc(row, col, index, A) ? 'bg-gray-450 text-neutral-150' : ''} min-h-[2.3125rem] min-w-[2.3125rem] whitespace-nowrap`}
                  key={col}
                >
                  {getTableCellValue(A && A.length && A.length > row && A[0] && A[0].length > col ? A[row][col] as number : 0)}
                </td>
              ))}
              {isWithCoefs && (
                <td className='border-l-orange'>{equationCoefs.length > row ? equationCoefs[row] : ''}</td>
              )}
            </tr>
          ))
          }
        </tbody>
      </table>
    )
  }

export default memo(MatrixTable)
