import type { CopilotType } from '@sinsa/schema';
import { boxWithoutAuroriansInCopilot } from './helpers/box-without-aurorians-in-copilot';
import { canUseCopilot } from './helpers/can-use-copilot';
import type { SolutionContext, SolutionResult } from './types';

/**
 * 计算所有的队伍方案和具体分数
 * @param context 解决方案上下文
 * @param k 队伍数量
 */
export function calculateAllScenariosAndScores(
  context: SolutionContext,
  k = 3,
): SolutionResult {
  const result: SolutionResult = {
    scenarios: [],
  };

  function generateAllScenarios(
    currentCopilotIndex: number,
    availableBox: SolutionContext['availableBox'],
    currentScenario: CopilotType[],
    count: number,
  ) {
    // 一般情况，已经处理完所有的作业或者已经满足队伍数量
    if (count === 0 || currentCopilotIndex === context.copilots.length) {
      result.scenarios.push({
        copilots: [...currentScenario],
        totalScore: currentScenario.reduce(
          (score, next) => score + next.score,
          BigInt(0),
        ),
      });
      return;
    }
    // 尝试使用当前作业
    const currentCopilot = context.copilots[currentCopilotIndex];
    if (canUseCopilot(availableBox, currentCopilot)) {
      const remainingBox = boxWithoutAuroriansInCopilot(
        availableBox,
        currentCopilot,
      );

      generateAllScenarios(
        currentCopilotIndex + 1,
        remainingBox,
        [...currentScenario, currentCopilot],
        count - 1,
      );
    }

    // 递归处理不使用当前作业
    generateAllScenarios(
      currentCopilotIndex + 1,
      availableBox,
      currentScenario,
      count - 1,
    );
  }

  generateAllScenarios(0, context.availableBox, [], k);

  return result;
}
