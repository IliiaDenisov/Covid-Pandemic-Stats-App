<script setup lang="ts">
import WidgetComponent from './WidgetComponent.vue';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useCovidStore } from 'src/stores/useCovid';
import { Country, WidgetDataset } from '@/models/apiData';

const { getCountiesList, getReportsByCountry } = useCovidStore();
const { isLoaded } = storeToRefs(useCovidStore());

const year = ref(2020);
const countries = ref<Array<Country>>([]);
const selectedCountry = ref<Country>({
  iso: '',
  name: '',
});
const oppositeSelectedCountry = ref<Country>({
  iso: '',
  name: '',
});

const filteredCountries = ref<Array<Country>>([]);
const tab = ref('byYear');
const countryDataSet = ref<Array<WidgetDataset>>([]);
const oppositeCountryDataSet = ref<Array<WidgetDataset>>([]);
const cityDataSets = ref<Array<WidgetDataset>>([]);

async function onPageLoad() {
  countries.value = await getCountiesList();
  filteredCountries.value = countries.value;
}
function filterFn(val: string, update: CallableFunction) {
  if (val === '') {
    update(() => {
      filteredCountries.value = countries.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    filteredCountries.value = countries.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
async function* range(end: number) {
  for (let i = 0; i < end; i++) {
    yield i;
  }
}
async function loadCountryReports() {
  isLoaded.value = true;
  countryDataSet.value = [];
  for await (let i of range(12)) {
    const month = i < 9 ? '0' + (i + 1) : i + 1;
    const response = await getReportsByCountry(
      selectedCountry.value.iso,
      `${year.value}-${month}-14`
    );
    countryDataSet.value.push(response);
  }

  isLoaded.value = false;
}

async function loadAllTimeReports() {
  isLoaded.value = true;
  countryDataSet.value = [];

  const response = await getReportsByCountry(
    selectedCountry.value.iso,
    '2023-02-14'
  );
  countryDataSet.value.push(response);

  isLoaded.value = false;
}

async function loadReportsForComparison() {
  isLoaded.value = true;
  countryDataSet.value = [];
  oppositeCountryDataSet.value = [];

  for await (let i of range(12)) {
    const month = i < 9 ? '0' + (i + 1) : i + 1;
    const oppositeResponse = await getReportsByCountry(
      oppositeSelectedCountry.value.iso,
      `${year.value}-${month}-14`
    );
    oppositeCountryDataSet.value.push(oppositeResponse);
  }

  for await (let i of range(12)) {
    const month = i < 9 ? '0' + (i + 1) : i + 1;
    const response = await getReportsByCountry(
      selectedCountry.value.iso,
      `${year.value}-${month}-14`
    );
    countryDataSet.value.push(response);
  }

  isLoaded.value = false;
}

onPageLoad();
</script>

<template>
  <WidgetComponent
    v-model:tab="tab"
    :country-data="countryDataSet"
    :opposite-country-data="oppositeCountryDataSet"
    :country-name="selectedCountry.name"
    :opposite-country-name="oppositeSelectedCountry.name"
    :city-data="cityDataSets"
    class="q-pt-md q-px-md"
  >
    <div class="q-pt-xl flex justify-center col-1">
      <q-select
        v-model="selectedCountry"
        :options="filteredCountries"
        label="Выберите страну"
        option-label="name"
        style="width: 300px"
        class="q-pr-md"
        use-input
        input-debounce="0"
        @filter="(val: string, update: CallableFunction) => filterFn(val, update)"
      />
      <q-select
        v-if="tab === 'comparison'"
        v-model="oppositeSelectedCountry"
        :options="filteredCountries"
        label="Выберите страну для сравнения"
        option-value="iso"
        option-label="name"
        style="width: 300px"
        class="q-pr-md"
        use-input
        input-debounce="0"
        @filter="(val: string, update: CallableFunction) => filterFn(val, update)"
      />
      <q-select
        v-if="tab !== 'allTime'"
        v-model="year"
        :options="[2020, 2021, 2022, 2023]"
        label="Выберите год"
        style="width: 300px"
        class="q-pr-md"
      />
      <q-btn
        class="q-ml-md q-my-sm"
        color="primary"
        no-caps
        label="Обновить график"
        @click="
          tab === 'allTime'
            ? loadAllTimeReports()
            : tab === 'comparison'
            ? loadReportsForComparison()
            : loadCountryReports()
        "
      />
    </div>
  </WidgetComponent>
</template>

<style lang="scss">
.q-menu {
  max-height: 60vh !important;
}
</style>
