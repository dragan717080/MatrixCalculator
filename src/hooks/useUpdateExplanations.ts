import { getIndicesFromEquation } from '../lib/utils';
import { UseUpdateExplanationsProps } from '../interfaces/Hooks';
import { Step } from '../interfaces/Matrix';

/**
 * For components that need to update explanations (e.g. `Multiplication`),
 * for improved formatting. Those components will add the `subindex` class span.
 */
const useUpdateExplanations = ({ steps, setSteps }: UseUpdateExplanationsProps) => {
  const updateExplanations = () => {
    console.log('%cUpdating explanations', 'color:red;font-size:22px');
    console.log('steps:', steps);

    const newSteps: Step[] = structuredClone(steps)

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
      (steps[stepIndex].explanation as string[]).forEach((expl, index) => {
        const [indices, equation] = getIndicesFromEquation(expl as string, true)
        console.log('indices:', indices);
        console.log('equation:', equation);
        const prevIndices = newSteps[stepIndex].indices ?? []

        newSteps[stepIndex].indices = [...prevIndices, indices]
      })
    }

    console.log('Updated steps:', newSteps);
    console.log('new indices:', newSteps.map(x => x.indices));

    setSteps(newSteps)
  }

  return { updateExplanations }
}

export default useUpdateExplanations;
