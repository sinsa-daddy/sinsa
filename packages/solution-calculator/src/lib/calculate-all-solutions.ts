import type { CopilotNextType } from '@sinsa/schema';
import type { CalcOptions, SolutionContext, AllSolutions } from '../types';
import { boxWithoutAuroriansInCopilot } from './helpers/box-without-aurorians-in-copilot';
import { canUseCopilot } from './helpers/can-use-copilot';

interface StackContext {
  currentCopilotIndex: number;
  currentScenario: CopilotNextType[];
  remainingBox: SolutionContext['availableBox'];
  count: number;
}

/**
 * 计算所有的队伍方案和具体分数
 * @param context 解决方案上下文
 * @param k 队伍数量
 */
export function calculateAllSolutions(
  context: SolutionContext,
  k = 3,
  options: CalcOptions = {},
): AllSolutions {
  const result: AllSolutions = {
    solutions: [],
  };

  const stack: StackContext[] = [
    {
      currentCopilotIndex: 0,
      currentScenario: [],
      remainingBox: context.availableBox,
      count: k,
    },
  ];

  while (stack.length > 0) {
    const { currentCopilotIndex, currentScenario, remainingBox, count } =
      stack.pop()!;

    if (count === 0 || currentCopilotIndex === context.copilots.length) {
      if (currentScenario.length >= k) {
        result.solutions.push({
          copilots: [...currentScenario],
          totalScore: currentScenario.reduce(
            (score, next) => score + next.score,
            0,
          ),
        });
      }
    } else {
      const currentCopilot = context.copilots[currentCopilotIndex];
      if (canUseCopilot(remainingBox, currentCopilot, options)) {
        const newRemainingBox = boxWithoutAuroriansInCopilot(
          remainingBox,
          currentCopilot,
          options,
        );
        stack.push({
          currentCopilotIndex: currentCopilotIndex + 1,
          currentScenario: [...currentScenario, currentCopilot],
          remainingBox: newRemainingBox,
          count: count - 1,
        });
      }

      stack.push({
        currentCopilotIndex: currentCopilotIndex + 1,
        currentScenario,
        remainingBox,
        count,
      });
    }
  }

  result.solutions.sort((a, b) => Number(b.totalScore - a.totalScore));

  return result;
}
