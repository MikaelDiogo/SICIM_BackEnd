import { UsageCategory } from '../enums/usage-category.enum';
import { MonetaryValue } from '../value-objects/monetary-value.vo';

// Annual depreciation rate by usage category, per the municipality's accounting policy.
// Parametrizable — adjust here (or move to a configurable table) as the policy evolves.
export const ANNUAL_DEPRECIATION_RATE: Record<UsageCategory, number> = {
  [UsageCategory.ADMINISTRATIVE]: 0.02,
  [UsageCategory.EDUCATIONAL]: 0.02,
  [UsageCategory.HEALTH]: 0.025,
  [UsageCategory.SOCIAL_ASSISTANCE]: 0.02,
  [UsageCategory.CULTURAL]: 0.015,
  [UsageCategory.OTHER]: 0.02,
};

export class DepreciationCalculator {
  static calculate(
    originalValue: MonetaryValue,
    usageCategory: UsageCategory,
    acquisitionYear: number,
    asOf: Date = new Date(),
  ): MonetaryValue {
    const yearsElapsed = Math.max(0, asOf.getFullYear() - acquisitionYear);
    const rate = ANNUAL_DEPRECIATION_RATE[usageCategory];
    const depreciatedAmount = originalValue.amount * rate * yearsElapsed;

    return MonetaryValue.create(Math.min(depreciatedAmount, originalValue.amount));
  }
}
