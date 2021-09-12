<style scoped>
.gant-chart {
  width: 100%;
  overflow: hidden;
  min-width: 1280px;
}
.gant-chart__line {
  display: flex;
  height: 50px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-bottom: none;
}
.gant-chart__line:last-child {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
.gant-chart__line-name {
  border-right: 1px solid rgba(0, 0, 0, 0.5);
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gant-chart__line-container {
  position: relative;
  flex-grow: 1;
  display: flex;
}
.gant-chart__block-flight {
  cursor: pointer;
  height: 30px;
  position: absolute;
  background: rgb(6, 236, 18);
  border: 1px solid rgba(0, 0, 0, 0.5);
  top: 10px;
  border-radius: 8px;
  transition: transform 0.25s;
  z-index: 9;
}
.gant-chart__block-flight:hover {
  transform: scale(1.03);
}
.gant-chart__block-sheduled {
  height: 5px;
  position: absolute;
  color: rgba(0, 0, 0, 0.5);
  background: #ffffff;
  border: 1px solid currentColor;
  top: 4px;
  border-radius: 2px;
  z-index: 9;
}
.gant-chart__mark {
  text-align: center;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
}
.gant-chart__mark:after {
  content: "";
  position: absolute;
  width: 1px;
  background: darkblue;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 0;
}
</style>

<template>
  <div class="gant-chart">
    <div class="gant-chart__line">
      <div class="gant-chart__line-name">{{ aircraft }}</div>
      <div class="gant-chart__line-container">
        <div
          class="gant-chart__mark"
          v-for="(mark, idx) in timeMarks"
          :key="idx"
          :style="{ width: `calc(100% / ${timeBlocks})` }"
        >
          {{ mark }}
        </div>
      </div>
    </div>
    <div
      class="gant-chart__line"
      v-for="[aircraft, items] in Object.entries(chartData)"
      :key="aircraft"
    >
      <div class="gant-chart__line-name">{{ aircraft }}</div>
      <div class="gant-chart__line-container">
        <template
          v-for="({
            departureValue,
            duration,
            sheduledOffValue,
            sheduledDuration,
          },
          idx) in items"
          :key="idx"
        >
          <div
            class="gant-chart__block-flight"
            :style="{ left: `${departureValue}%`, width: `${duration}%` }"
          ></div>
          <div
            class="gant-chart__block-sheduled"
            :style="{
              left: `${sheduledOffValue}%`,
              width: `${sheduledDuration}%`,
            }"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, toRefs, computed } from '@vue/runtime-core';

export default {
  name: 'GantChart',
  props: {
    // значение, возвращаемое функцией getTime()
    timeFrom: { type: Number },
    timeTo: { type: Number },
    // данные для графика
    flights: { type: Array },
  },
  data() {
    return {};
  },
  setup(props) {
    // TODO
    // найти минимальный и максиальный часы и расчертить поле
    // подготовить данные на вход
    const { timeFrom, timeTo, flights } = toRefs(props);
    const startTime = computed(() => {
      const d = new Date(timeFrom.value);
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours()
      ).getTime();
    });
    const endTime = computed(() => {
      const d = new Date(timeTo.value);
      const currentTimeValue = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours()
      );
      currentTimeValue.setHours(currentTimeValue.getHours() + 1);
      return currentTimeValue.getTime();
    });
    const timeBlocks = computed(() => {
      return (endTime.value - startTime.value) / 1000 / 60 / 60;
    });
    const timeMarks = computed(() => {
      const initialHours = new Date(startTime.value).getHours();
      return Array.from(
        { length: timeBlocks.value },
        (_, i) => `${i + initialHours}:00`
      );
    });
    console.log('timeMarks', timeMarks.value);
    const normalizedTime = (ms) => {
      return ((ms - startTime.value) / (endTime.value - startTime.value)) * 100;
    };
    const chartData = computed(() => {
      return flights.value.reduce((res, curr) => {
        const departureValue = normalizedTime(curr.relevantDepartureTime);
        const duration =
          normalizedTime(curr.relevantArrivalTime) - departureValue;
        const sheduledOffValue = normalizedTime(curr.scheduledOffBlockTime);
        const sheduledDuration =
          normalizedTime(curr.scheduledOnBlockTime) - sheduledOffValue;
        const currentFlightData = {
          departureValue,
          duration,
          sheduledOffValue,
          sheduledDuration,
        };
        if (res[curr.aircraftRegistration]) {
          res[curr.aircraftRegistration].append(currentFlightData);
        } else {
          res[curr.aircraftRegistration] = [currentFlightData];
        }
        return res;
      }, {});
    });
    console.log('chartData', chartData.value);
    onMounted(() => {
      console.log('timeBlocks', timeBlocks.value);
    });
    return { chartData, timeBlocks, timeMarks };
  },
};
</script>
