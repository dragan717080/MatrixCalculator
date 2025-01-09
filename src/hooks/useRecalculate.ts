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
  stepsRef
}: UseRecalculateProps) => {
  const { setIsOnlyA, setCalculate, aDim, setADim, A, setA, aIsFilled, setAIsFilled, setBIsFilled } = useMatrixStore()
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
  }

  return { recalculate }
}

export default useRecalculate
