import type { CopilotType } from '@sinsa/schema';
import { boxWithoutAuroriansInCopilot } from './helpers/box-without-aurorians-in-copilot';
import { canUseCopilot } from './helpers/can-use-copilot';
import type { CalcOptions, SolutionContext, SolutionResult } from './types';

interface StackContext {
  currentCopilotIndex: number;
  currentScenario: CopilotType[];
  remainingBox: SolutionContext['availableBox'];
  count: number;
}

/**
 * 计算所有的队伍方案和具体分数
 * @param context 解决方案上下文
 * @param k 队伍数量
 */
export function calculateAllScenariosAndScores(
  context: SolutionContext,
  k = 3,
  { disalbeAlternative }: CalcOptions = {},
): SolutionResult {
  const result: SolutionResult = {
    scenarios: [],
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
        result.scenarios.push({
          copilots: [...currentScenario],
          totalScore: currentScenario.reduce(
            (score, next) => score + BigInt(next.score),
            BigInt(0),
          ),
        });
      }
    } else {
      const currentCopilot = context.copilots[currentCopilotIndex];
      if (canUseCopilot(remainingBox, currentCopilot, { disalbeAlternative })) {
        const newRemainingBox = boxWithoutAuroriansInCopilot(
          remainingBox,
          currentCopilot,
          { disalbeAlternative },
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

  result.scenarios.sort((a, b) => Number(b.totalScore - a.totalScore));

  return result;
}
