import { useCallback } from 'react'
import { wait } from '../lib/utils'
import { useToggleShowSolutionProps } from '../interfaces/Hooks'

/**
 * Add visual effect when `toShow` is active.
 *
 * This can be either only starting matrix (e.g. in `transpose`),
 *
 * or additional steps in other calculations (e.g. `determinant`).
 */
const useToggleShowSolution = ({
  solutionStepsRef,
  toShowSolution,
  setToShowSolution
}: useToggleShowSolutionProps) => {
  const toggleShowSolution = useCallback(async () => {
    if (!toShowSolution) {
      solutionStepsRef.current?.classList.remove('hidden')
      solutionStepsRef.current?.classList.add('fade-in')
      solutionStepsRef.current?.classList.remove('fade-out')
    } else {
      solutionStepsRef.current?.classList.remove('fade-in')
      solutionStepsRef.current?.classList.add('fade-out')
      await wait(700) // Wait for the fade-out animation to finish
      solutionStepsRef.current?.classList.add('hidden')
    }

    setToShowSolution(!toShowSolution)
  }, [solutionStepsRef, toShowSolution, setToShowSolution])

  return { toggleShowSolution }
}

export default useToggleShowSolution
