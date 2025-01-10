import { UseResetParamsProps } from '../interfaces/Hooks'
import { useMatrixStore } from '../store/zustandStore'

/** On initial render, in `useEffect` reset params in store. */
const useResetParams = ({
  onlyHasA = true,
  isSign = false,
}: UseResetParamsProps) => {
  const {
    setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    setBDim, setB, setBIsFilled,
    setPower,
    setSign
  } = useMatrixStore()

  const resetParams = () => {
    setIsOnlyA(onlyHasA)
    setAIsFilled(false)
    setBIsFilled(false)

    if (isSign) {
      setSign('+')
    }
  }

  return { resetParams }
}

export default useResetParams
