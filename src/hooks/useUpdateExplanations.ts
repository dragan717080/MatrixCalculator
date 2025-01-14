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

    // console.log('%cUpdating explanations', 'color:red;font-size:20px');
    // console.log('steps:', steps);
    // console.log('explanationParagraphs:', explanationParagraphs);

    const allExplanations = steps.flatMap(x => x.explanation)

    // console.log('All explanations:', allExplanations);

    explanationParagraphs.forEach((p, index) => {
      // console.log('Current html, should go back to:', p.innerHTML);
      // To do: remove
      const curr = p.innerHTML;
      const decodedString = p.textContent;
      // console.log(decodedString);
      const explanation = allExplanations.find(x => x === p.textContent) as string
      // console.log(explanation);

      if (explanation) {
        p.innerHTML = explanation
      }
    })
  }

  return { updateExplanations }
}

export default useUpdateExplanations;
