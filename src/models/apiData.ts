export interface Country {
  iso: string;
  name: string;
}

export interface Report {
  active: number;
  active_diff: number;
  confirmed: number;
  confirmed_diff: number;
  date: string;
  deaths: number;
  deaths_diff: number;
  fatality_rate: number;
  last_update: string;
  recovered: number;
  recovered_diff: number;
}

export class WidgetDataset {
  constructor(
    active?: number,
    confirmed?: number,
    fatality_rate?: number,
    recovered?: number
  ) {
    this.active = active ?? 0;
    this.deaths = this.calcDeathsCount(confirmed ?? 0, fatality_rate ?? 0);
    this.recovered = recovered ?? 0;
  }

  calcDeathsCount(confirmed: number, fatality_rate: number) {
    return Math.round(confirmed * fatality_rate);
  }
  active: number;
  deaths: number;
  recovered: number;
}
