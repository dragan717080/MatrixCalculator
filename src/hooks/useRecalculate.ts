import { UseRecalculateProps } from '../interfaces/Hooks';
import { useMatrixStore } from '../store/zustandStore';
import { useModalStore } from '../store/zustandStore';

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
    console.log('setting again');
    setTime(-1)
    setADim([0, 0])
    setA([])
    setAIsFilled(false)
    setIsOpen(false)

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
    console.log('is power in recalculate:', isPower);

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
