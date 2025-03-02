import { UseRecalculateProps } from '../interfaces/Hooks'
import { useLinearEquationsStore, useMatrixStore } from '../store/zustandStore'
import { useModalStore } from '../store/zustandStore'

/**
 * When recalculate operation and again opet input,
 * reset corresponding values in store.
 */
const useRecalculate = ({
  setTime,
  setC,
  setShow,
  setSteps,
  stepsRef,
  isPower,
  isSign,
}: UseRecalculateProps) => {
  const { setEquationCoefs } = useLinearEquationsStore()
  const { 
    isOnlyA, setIsOnlyA,
    setCalculate,
    aDim, setADim, A, setA, aIsFilled, setAIsFilled,
    setBDim, setB, setBIsFilled,
    setPower,
    setSign,
  } = useMatrixStore()
  const { setIsOpen } = useModalStore()

  const recalculate = () => {
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
    setIsOpen(false)
    setEquationCoefs([])

    if (setC) {
      setC([])
    }

    if (setShow) {
      setShow(false)
    }

    if (stepsRef) {
      stepsRef.current!.classList.add('hidden')
    }

    if (setSteps) {
      setSteps([])
    }

    if (!isOnlyA) {
      setBDim([0, 0])
      setB([])
      setBIsFilled(false)
    }

    if (isPower) {
      setPower(-1)
    }

    if (isSign) {
      setSign('+')
    }
  }

  return { recalculate }
}

export default useRecalculate
