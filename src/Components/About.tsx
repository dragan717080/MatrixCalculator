const About = () => {
  return (
    <div className=''>
      <p><span className='bold'>MatriXpert</span> is the most convenient free online Matrix Calculator. All the basic matrix operations as well as methods for solving systems of simultaneous linear equations are implemented on this site. For methods and operations that require complicated calculations a 'very detailed solution' feature has been made. With the help of this option our calculator solves your task efficiently as the person would do showing every step.</p>
      <h3 className='my-4'>How to use</h3>
      <ol className='flex flex-col space-y-0.5'>
        <li>Choose parameters and press "Set matrix" button.</li>
        <li>A window will be opened where you'll be able to set your matrix. You can input decimal fractions (using dot, for example: 0.54) and integer numbers as well.</li>
        <li>For your convenience, you can input nonzero coefficients first and then fill the rest cells with zero by pressing the corresponding button. Matrix must be filled completely. Besides there is an ability to restore the matrix you've calculated before, so you won't have to fill it all over again if you want to correct just a few numbers and calculate again.</li>
        <li>Press "Solve" ("Calculate") button.</li>
        <li>If you want to get a very detailed solution, click on "Show solution".</li>
      </ol>
      <h3 className='mt-1 mb-0.5 bold'>All methods are supported</h3>
      <ol>
        <li>Multiplication</li>
        <li>Addition</li>
        <li>Substraction</li>
        <li>Transpose</li>
        <li>Determinant</li>
        <li>Rank</li>
        <li>Power</li>
        <li>Inverse</li>
        <li>Inverse method</li>
        <li>Gauss-Jordan Elimination</li>
        <li>Cramer's Rule</li>
      </ol>
    </div>
  )
}

export default About
