<script setup lang="ts">
import { storeToRefs } from 'pinia';
import DataView from './components/DataView.vue';

import { useCovidStore } from 'src/stores/useCovid';
const { isLoaded } = storeToRefs(useCovidStore());
</script>

<template>
  <q-layout view="hHh lpR fFf" class="column q-pa-md">
    <q-page-container class="col column">
      <div class="text-h1 text-center q-pt-xl">
        Статистика по
        <span class="text-red text-weight-medium"> Covid-19 </span>
      </div>
      <DataView class="col" />
      <q-inner-loading
        :showing="isLoaded"
        label="Загрузка..."
        class="text-grey-8"
        label-style="font-size: 1.1em"
      />
    </q-page-container>
  </q-layout>
</template>
