import React, { FC, forwardRef } from 'react'
import MatrixTableProps from '../../interfaces/MatrixTableProps'

const MatrixTable = forwardRef<HTMLTableElement, MatrixTableProps>(
  ({ nRows, nCols, A, toHighlight, className }, ref) => {
    const getTableCellValue = (row: number, col: number, value: number) => {
      if (typeof(value) === 'string') {
        value = parseFloat(value)
      }

      return Number.isInteger(value) ? value : value?.toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')
    }

    return (
      <table
        ref={ref}
        className={`${className} matrix-table mt-5 mb-6 mx-auto overflow-scroll md:overflow-auto text-center`}
      >
        <thead>
          <tr>
            {/* First element is empty */}
            <th>&nbsp;</th>
            {Array.from({ length: nCols }).map((_, col) => (
              <th key={col}>A<span className='subindex'>{col + 1}</span></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: nRows }).map((_, row) => (
            <tr key={row} className='!leading-6.5'>
              <td className='!text-gray-350'>{row + 1}</td>
              {Array.from({ length: nCols }).map((_, col) => (
                <td
                  className={`${toHighlight && toHighlight(row, col) ? 'bg-gray-450 text-neutral-150' : ''} min-h-[2.3125rem] min-w-[2.3125rem] whitespace-nowrap`}
                  key={col}
                >
                  {getTableCellValue(row, col, A[row][col]!)}
                </td>
              ))}
            </tr>
          ))
          }
        </tbody>
      </table>
    )
  }
)

export default MatrixTable
