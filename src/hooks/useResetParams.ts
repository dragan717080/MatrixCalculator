import { UseResetParamsProps } from '../interfaces/Hooks'
import { useMatrixStore } from '../store/zustandStore'

/** On initial render, in `useEffect` reset params in store. */
const useResetParams = ({
  onlyHasA = true,
  isSign = false,
  descriptionAndInputRef
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

    if (descriptionAndInputRef) {
      console.log('%creceived descriptionAndInputRef:', 'color:red;font-size:26px', descriptionAndInputRef);
      
      descriptionAndInputRef.current!.classList.remove('hidden')
    }
  }

  return { resetParams }
}

export default useResetParams
