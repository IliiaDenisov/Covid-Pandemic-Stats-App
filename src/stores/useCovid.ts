import { defineStore } from 'pinia';

import { Country, Report, WidgetDataset } from 'src/models/apiData';
import { ref } from 'vue';

export const useCovidStore = defineStore('covid', () => {
  const isLoaded = ref(false);
  async function getCountiesList(): Promise<Country[]> {
    isLoaded.value = true;
    let countries;
    try {
      const response = await fetch(
        'https://covid-api.com/api/regions?per_page=219&order=name&sort=asc'
      );
      countries = await response.json();
    } catch (err) {
      console.log(err);
      isLoaded.value = false;
    }

    isLoaded.value = false;

    return countries.data as Country[];
  }

  async function getReportsByCountry(iso: string, date: string) {
    let data = new WidgetDataset();
    try {
      const response = await fetch(
        `https://covid-api.com/api/reports/total?date=${date}&iso=${iso}`
      );
      const promise = await response.json();
      const report: Report = promise.data;
      data = new WidgetDataset(
        report.active,
        report.confirmed,
        report.fatality_rate,
        report.recovered
      );
    } catch (err) {
      console.log(err);
      isLoaded.value = false;
    }
    return data as WidgetDataset;
  }

  return {
    isLoaded,
    getCountiesList,
    getReportsByCountry,
  };
});
