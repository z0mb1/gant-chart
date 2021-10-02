<style>
body {
  padding: 0;
  margin: 0;
}
.app-layout {
  max-width: 100vw;
  padding: 8px;
  background-color: #ffffff;
}
</style>

<template>
  <div class="app-layout">
    <Gantt :legs="initialData" :ganttDate="1632873600000" />
  </div>
</template>

<script>
import data from '@/assets/data.json';
import Gantt from './components/Gantt.vue';

export default {
  name: 'App',
  components: {
    Gantt,
  },
  data: function() {
    return {
      initialData: data,
    };
  },
  computed: {
    flights() {
      return this.rawData.map((item) => item.data);
    },
  },
  created() {},
};
</script>
