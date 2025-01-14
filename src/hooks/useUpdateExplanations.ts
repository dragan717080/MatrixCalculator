import { getIndicesFromEquation } from '../lib/utils';
import { UseUpdateExplanationsProps } from '../interfaces/Hooks';
import { Step as DeterminantStep } from '../interfaces/Determinant';
import { Step } from '../interfaces/Matrix';

/**
 * For components that need to update explanations (e.g. `Multiplication`),
 * for improved formatting. Those components will add the `subindex` class span.
 */
const useUpdateExplanations = ({
  steps,
  isEquation = false,
  needsDeterminant = true
}: UseUpdateExplanationsProps) => {
  const updateExplanations = () => {
    const explanationParagraphs = Array.from(document.getElementsByClassName('step-explanation'))

    if (!steps.length || !explanationParagraphs.length) {
      return;
    }

    const allExplanations = steps.flatMap(x => x.explanation)

    explanationParagraphs.forEach((p, index) => {
      const explanation = allExplanations.find(x => x === p.textContent) as string

      if (explanation) {
        p.innerHTML = explanation
      }
    })
  }

  return { updateExplanations }
}

export default useUpdateExplanations;
