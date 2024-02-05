<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Chart, { ChartItem } from 'chart.js/auto';

import { WidgetDataset } from 'src/models/apiData';

const props = defineProps<{
  countryData: Array<WidgetDataset>;
  oppositeCountryData: Array<WidgetDataset>;
  tab: string;
  countryName: string;
  oppositeCountryName: string;
}>();
const emit = defineEmits(['update:tab']);

const computedTab = computed({
  get(): string {
    return props.tab;
  },
  set(val: string) {
    emit('update:tab', val);
  },
});

const myChart = ref<any>();

const months = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

function setupBarChart() {
  const active = props.countryData.map((item) => item.active);
  const recovered = props.countryData.map((item) => item.recovered);
  const deaths = props.countryData.map((item) => item.deaths);

  myChart.value?.destroy();

  myChart.value = new Chart(document.getElementById('myChart') as ChartItem, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Количество зараженных',
          data: active,
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
        {
          label: 'Количество погибших',
          data: deaths,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        {
          label: 'Количество выздоровевших',
          data: recovered,
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function setupLineChart() {
  const data = props.countryData.map(
    (item) => item.active + item.recovered + item.deaths
  );
  const oppositeData = props.oppositeCountryData.map(
    (item) => item.active + item.recovered + item.deaths
  );

  myChart.value?.destroy();

  myChart.value = new Chart(document.getElementById('myChart') as ChartItem, {
    type: 'line',
    data: {
      labels: months,
      datasets: [
        {
          label: props.countryName,
          data: data,
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
        {
          label: props.oppositeCountryName,
          data: oppositeData,
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    },
  });
}

function setupPieChart() {
  myChart.value?.destroy();

  myChart.value = new Chart(document.getElementById('myChart') as ChartItem, {
    type: 'pie',
    data: {
      labels: ['Заразилось за все время', 'Умерло за все время'],
      datasets: [
        {
          label: 'Количество зараженных',
          data: [props.countryData[0].active, props.countryData[0].deaths],
          backgroundColor: ['rgba(255, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.5)'],
        },
      ],
    },
  });
}

watch(
  () => props.countryData,
  () => {
    if (props.countryData.length === 12 && props.tab === 'byYear')
      setupBarChart();
    else if (props.countryData.length === 1 && props.tab === 'allTime') {
      setupPieChart();
    } else if (
      props.countryData.length === 12 &&
      props.oppositeCountryData.length === 12 &&
      props.tab === 'comparison'
    ) {
      setupLineChart();
    }
  },
  { deep: true }
);
</script>

<template>
  <q-card flat>
    <q-tabs v-model="computedTab">
      <q-tab name="byYear" label="Статистика по годам" />
      <q-tab name="allTime" label="Статистика за все время" />
      <q-tab name="comparison" label="Сравнение по странам" />
    </q-tabs>
    <q-separator />
    <slot></slot>
    <div class="q-pt-xl relative-position" style="width: 100%; height: 700px">
      <canvas
        id="myChart"
        class="absolute-center"
        style="max-height: 700px"
      ></canvas>
    </div>
  </q-card>
</template>
