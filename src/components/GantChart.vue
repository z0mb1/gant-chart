<style scoped>
.gant-chart {
  --left-width: 70px;
  --row-height: 50px;
  --border: 1px solid rgba(0, 0, 0, 0.5);
}
.gant-chart__container {
  width: 100%;
  overflow: hidden;
  display: flex;
  border: var(--border);
  box-sizing: border-box;
}
.gant-chart__left {
  width: var(--left-width);
  border-right: var(--border);
}
.gant-chart__right {
  width: calc(100% - var(--left-width));
  overflow-x: auto;
  overflow-y: hidden;
}
.gant-chart__line {
  display: flex;
  height: var(--row-height);
  border-bottom: var(--border);
  position: relative;
  flex-grow: 1;
  display: flex;
  width: 100%;
}
.gant-chart__line--current {
  height: 0px;
  border: none;
}
.gant-chart__line:last-child {
  border-bottom: none;
}
.gant-chart__line-name {
  border-bottom: var(--border);
  width: var(--left-width);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--row-height);
}
.gant-chart__line-name:last-child {
  border-bottom: none;
}
.gant-chart__block-flight {
  cursor: pointer;
  height: 30px;
  position: absolute;
  border: 1px solid rgba(0, 0, 0, 0.5);
  top: 10px;
  border-radius: 4px;
  transition: transform 0.25s;
  z-index: 9;
  line-height: 30px;
  text-align: center;
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
  width: 75px;
}
.gant-chart__mark:after {
  content: '';
  position: absolute;
  width: 1px;
  background: darkblue;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 0;
}
.gant-chart__date {
  height: var(--row-height);
  width: 100%;
  border: var(--border);
  border-bottom: none;
  line-height: var(--row-height);
  padding-left: var(--left-width);
  box-sizing: border-box;
}
.gant-chart__current {
  position: absolute;
  width: 3px;
  background-color: #d2d42a;
  height: 100vh;
  top: 0;
  z-index: 999;
}
.gant-chart__block-flight__arrival {
  position: absolute;
  top: 0;
  left: calc(100% + 4px);
}
.gant-chart__block-flight__departure {
  position: absolute;
  top: 0;
  right: calc(100% + 4px);
}
</style>

<template>
  <!-- Settings -->
  <div class="gant-chart-settings">
    <div style="margin-bottom: 16px">
      <span>Дата: </span><input type="datetime-local" v-model="date" />
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <span>Интервал времени: </span
      ><input type="range" min="1" max="4" step="1" v-model="rangeHours" />
      {{ rangeHours }} ч.
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 16px">
      <span>Размер графика: </span
      ><input type="range" min="500" max="1280" step="1" v-model="width" />
      {{ width }} px
    </div>
  </div>
  <!-- Chart -->
  <div class="gant-chart">
    <div class="gant-chart__date">
      <b>{{
        new Date(date).toLocaleString('ru', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      }}</b>
    </div>
    <div class="gant-chart__container">
      <div class="gant-chart__left">
        <div class="gant-chart__line-name"></div>
        <div
          class="gant-chart__line-name"
          v-for="aircraft in Object.keys(chartData)"
          :key="aircraft"
        >
          {{ aircraft }}
        </div>
      </div>
      <div class="gant-chart__right">
        <div :style="{ width: `${width}px` }">
          <div class="gant-chart__line gant-chart__line--current">
            <div
              class="gant-chart__current"
              :style="{ left: `calc(${currentTimePosition}% + 3px)` }"
            ></div>
          </div>

          <div class="gant-chart__line">
            <div
              class="gant-chart__mark"
              v-for="(mark, idx) in timeMarks"
              :key="idx"
              :style="{ width: `calc(100% / ${timeBlocks})` }"
            >
              {{ mark }}
            </div>
          </div>
          <div
            class="gant-chart__line"
            v-for="(items, idx) in Object.values(chartData)"
            :key="idx"
          >
            <template
              v-for="({
                departureValue,
                duration,
                sheduledOffValue,
                sheduledDuration,
                operationCarrier,
                flightNumber,
                arrivalStationIataCode,
                departureStationIataCode,
              },
              idx) in items"
              :key="idx"
            >
              <div
                class="gant-chart__block-flight"
                :style="{
                  left: `${departureValue}%`,
                  width: `${duration}%`,
                  backgroundColor: getColor(),
                }"
              >
                {{ `${operationCarrier} ${flightNumber}` }}
                <div class="gant-chart__block-flight__arrival">{{ arrivalStationIataCode }}</div>
                <div class="gant-chart__block-flight__departure">{{ departureStationIataCode }}</div>
              </div>
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
    </div>
  </div>
</template>

<script>
import { toRefs, computed, ref } from '@vue/runtime-core';

export default {
  name: 'GantChart',
  props: {
    // данные для графика
    flights: { type: Array },
  },
  data() {
    return {};
  },
  setup(props) {
    // settings
    const date = ref('2021-08-05T10:00');
    const rangeHours = ref(4);
    const width = ref(1280);
    const leftHoursShift = 3;
    const rightHoursShift = 24;

    const { flights } = toRefs(props);

    const timeShift = (date, hours) => {
      const d = new Date(date);
      const currentTimeValue = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours()
      );
      currentTimeValue.setHours(currentTimeValue.getHours() + hours);
      return currentTimeValue.getTime();
    };
    // Начало временной шкалы
    const startTime = computed(() => {
      return timeShift(date.value, -leftHoursShift);
    });

    // Конец временной шкалы
    const endTime = computed(() => {
      const remains = (leftHoursShift + rightHoursShift) % rangeHours.value;
      if (remains === 0) {
        return timeShift(date.value, rightHoursShift);
      } else {
        return timeShift(
          date.value,
          rightHoursShift + +rangeHours.value - remains
        );
      }
    });

    const timeBlocks = computed(() => {
      return (
        (endTime.value - startTime.value) / 1000 / 60 / 60 / +rangeHours.value
      );
    });
    const timeMarks = computed(() => {
      const initialHours = new Date(startTime.value).getHours();
      return Array.from({ length: timeBlocks.value }, (_, i) => {
        const time = i * +rangeHours.value + initialHours;
        if (time > 23) {
          return `${time - 24}:00`;
        }
        return `${time}:00`;
      });
    });
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
          flightNumber: curr.flightNumber,
          operationCarrier: curr.operationCarrier,
          arrivalStationIataCode: curr.arrivalStationIataCode,
          departureStationIataCode: curr.departureStationIataCode,
        };
        if (res[curr.aircraftRegistration]) {
          res[curr.aircraftRegistration].append(currentFlightData);
        } else {
          res[curr.aircraftRegistration] = [currentFlightData];
        }
        return res;
      }, {});
    });
    const currentTimePosition = normalizedTime(new Date(date.value).getTime());

    const getColor = () => {
      let colors = ['#D15EB8', '#7291E0', '#A67DD9', '#D76872'];

      return colors[Math.floor(Math.random() * colors.length)];
    };
    return {
      date,
      rangeHours,
      chartData,
      timeBlocks,
      timeMarks,
      currentTimePosition,
      getColor,
      width,
    };
  },
};
</script>
