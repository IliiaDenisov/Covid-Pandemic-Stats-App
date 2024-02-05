import { expect, it, describe } from '@jest/globals';
import { WidgetDataset } from './apiData';

describe('calculateDeposit', () => {
  it('Должно вернуть 0, если один из коэффициентов равен 0', () => {
    const data = new WidgetDataset();
    const result = data.calcDeathsCount(10, 0);
    expect(result).toBe(0);
  });

  it('Должно вернуть значение равное 50', () => {
    const data = new WidgetDataset();
    const result = data.calcDeathsCount(100, 0.5);
    expect(result).toBe(50);
  });

  it('Должно округлить по законам математики', () => {
    const data = new WidgetDataset();
    const result = data.calcDeathsCount(143, 0.5);
    expect(result).toBe(72);
  });
});
