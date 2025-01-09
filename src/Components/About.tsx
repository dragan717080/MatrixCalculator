import React from 'react'

const About = () => {
  return (
    <div className=''>
      <p><span className='bold'>MatriXpert</span> is the most convenient free online Matrix Calculator. All the basic matrix operations as well as methods for solving systems of simultaneous linear equations are implemented on this site. For methods and operations that require complicated calculations a 'very detailed solution' feature has been made. With the help of this option our calculator solves your task efficiently as the person would do showing every step.</p>
      <h3 className='my-4'>How to use</h3>
      <ol className='flex flex-col space-y-0.5'>
        <li>Choose parameters and press "Set matrix" button.</li>
        <li>A window will be opened where you'll be able to set your matrix. Two modes are available: Fractional - calculates using common fractions (used as a default) and Decimal - calculates in decimal fractions. In Fractional mode you can input common fractions (using slash, for example: 3/7) and integer numbers. In Decimal mode you can input decimal fractions (using dot, for example: 0.38) and integer numbers as well.</li>
        <li>In order to use complex numbers check the corresponding checkbox. For input use standard form with 'i': for example, 1+3i or 3i+1. There's no need to use parentheses to input fractions with complex numbers, for example, 2+5i/8-i means that 2+5i is a numerator, 8-i is a denominator.</li>
        <li>For your convenience, you can input nonzero coefficients first and then fill the rest cells with zero by pressing the corresponding button. Matrix must be filled completely. Besides there is an ability to restore the matrix you've calculated before, so you won't have to fill it all over again if you want to correct just a few numbers and calculate again.</li>
        <li>If you want to get a very detailed solution, check the corresponding checkbox, but mind that it might slightly increase the computing time in case of big matrix sizes. This variant differs from the classic one in showing every step in details.</li>
        <li>Press "Solve" ("Calculate") button.</li>
      </ol>
      <h3 className='mt-1 mb-0.5'>Continue calculation & Recalculate</h3>
      <ul>
        <li>After the solution you can continue calculation (or recalculate) using another method. Just click the corresponding button and choose a new method to be applied.</li>
        <li>If you choose to continue calculation the method will be applied to the result matrix. If you choose to recalculate the method will be applied to the original matrix.</li>
        <li>If there is no method in the menu then it can't be applied to the matrix (for example the matrix is not square when it should be).</li>
      </ul>
    </div>
  )
}

export default About
