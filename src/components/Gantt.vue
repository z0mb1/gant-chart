<template>
  <div class="gantt-chart">
    <div class="gantt-chart__date">
      <b>{{
        new Date(ganttDate).toLocaleString('ru', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      }}</b>
    </div>
    <div class="gantt-chart__container">
      <div class="gantt-chart__left">
        <div class="gantt-chart__line-name"></div>
        <div
          class="gantt-chart__line-name"
          v-for="aircraft in Object.keys(chartData)"
          :key="aircraft"
        >
          {{ aircraft }}
        </div>
      </div>
      <div
        class="gantt-chart__right"
        ref="rightBlock"
        @click="highlight(null)"
        :style="{ '--height': height }"
      >
        <div :style="{ width: `${width}px` }">
          <div class="gantt-chart__line gantt-chart__line--current">
            <div
              class="gantt-chart__current"
              :style="{ left: `calc(${currentTimePosition}% + 3px)` }"
            ></div>
          </div>

          <div class="gantt-chart__line">
            <div
              class="gantt-chart__mark"
              v-for="(mark, idx) in timeMarks"
              :key="idx"
              :style="{ width: `calc(100% / ${timeBlocks})` }"
            >
              {{ mark }}
            </div>
          </div>
          <div
            class="gantt-chart__line overflow-hidden"
            v-for="(items, idx) in Object.values(chartData)"
            :key="idx"
          >
            <FlightGroup
              v-for="(flightData, itemIdx) in items"
              :flightData="flightData"
              :key="itemIdx"
              :isHighlight="`${idx}-${itemIdx}` === highlightItem"
              :isHidden="highlightItem && `${idx}-${itemIdx}` !== highlightItem"
              @select="highlight(`${idx}-${itemIdx}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FlightGroup from './FlightGroup.vue';

export default {
  name: 'Gantt',
  components: { FlightGroup },
  props: ['legs', 'ganttDate'],
  data() {
    return {
      currentTimePosition: '',
      filteredLegs: [],
      aircrafts: [],
      ganttData: [],
      items: [],
      date: '',
      rangeHours: '',
      width: '',
      leftHoursShift: '',
      rightHoursShift: '',
      highlightItem: null,
      height: '100vh',
    };
  },
  created() {
    this.date = new Date(this.ganttDate);
    this.date.setDate(this.date.getDate() + 1);
    const deadlineDateUnix = +this.date;
    this.width = 1280;
    this.rangeHours = 4;
    this.leftHoursShift = 3;
    this.rightHoursShift = 24;
    this.currentTimePosition = this.normalizedTime(
      new Date(this.ganttDate).getTime()
    );
    this.filteredLegs = this.legs.filter(
      (e) =>
        e.relevantDepartureTime < deadlineDateUnix &&
        e.relevantArrivalTime <= deadlineDateUnix
    );
  },
  computed: {
    startTime() {
      return this.timeShift(this.ganttDate, -this.leftHoursShift);
    },
    endTime() {
      const remains =
        (this.leftHoursShift + this.rightHoursShift) % this.rangeHours;
      if (remains === 0) {
        return this.timeShift(this.ganttDate, this.rightHoursShift);
      } else {
        return this.timeShift(
          this.ganttDate,
          this.rightHoursShift + +this.rangeHours - remains
        );
      }
    },
    timeBlocks() {
      return (
        (this.endTime - this.startTime) / 1000 / 60 / 60 / +this.rangeHours + 1
      );
    },
    timeMarks() {
      const initialHours = new Date(this.startTime).getHours();
      return Array.from({ length: this.timeBlocks }, (_, i) => {
        const time = i * +this.rangeHours + initialHours;
        if (time > 23) {
          return `${time - 24}:00`;
        }
        return `${time}:00`;
      });
    },

    chartData() {
      return this.filteredLegs.reduce((res, curr) => {
        const currentFlightData = this.prepareFlightData(curr);
        const color = this.getColor();
        currentFlightData.color = color;
        for (let key of ['backwardLeg', 'onwardLeg']) {
          if (curr[key]) {
            currentFlightData[key] = this.prepareFlightData(
              curr[key],
              'scheduledOffBlockTime',
              'scheduledOnBlockTime'
            );
            currentFlightData[key].color = color;
          }
        }
        if (curr.aircraftRegistration) {
          if (res[curr.aircraftRegistration]) {
            res[curr.aircraftRegistration].push(currentFlightData);
          } else {
            res[curr.aircraftRegistration] = [currentFlightData];
          }
        }
        return res;
      }, {});
    },
  },

  methods: {
    highlight(val) {
      this.highlightItem = val;
    },
    prepareFlightData(
      flight,
      departureTimeFieldName = 'relevantDepartureTime',
      arrivalTimeFieldName = 'relevantArrivalTime'
    ) {
      const departureValue = this.normalizedTime(
        flight[departureTimeFieldName]
      );
      const arrivalValue = this.normalizedTime(flight[arrivalTimeFieldName]);
      const sheduledOffValue = this.normalizedTime(
        flight.scheduledOffBlockTime
      );
      const sheduledDuration =
        this.normalizedTime(flight.scheduledOnBlockTime) - sheduledOffValue;
      const currentFlightData = {
        departureValue,
        arrivalValue,
        sheduledOffValue,
        sheduledDuration,
        flightNumber: flight.flightNumber,
        operationCarrier: flight.operationCarrier,
        arrivalStationIataCode: flight.arrivalStationIataCode,
        departureStationIataCode: flight.departureStationIataCode,
        aircraftType: flight.aircraftType,
        aircraftConfiguration: flight.aircraftConfiguration
      };
      return currentFlightData;
    },
    timeShift(date, hours) {
      const d = new Date(date);
      const currentTimeValue = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours()
      );
      currentTimeValue.setHours(currentTimeValue.getHours() + hours);
      return currentTimeValue.getTime();
    },
    normalizedTime(ms) {
      return ((ms - this.startTime) / (this.endTime - this.startTime)) * 100;
    },
    getColor() {
      let colors = ['#D15EB8', '#7291E0', '#A67DD9', '#D76872'];
      return colors[Math.floor(Math.random() * colors.length)];
    },
  },
  mounted() {
    this.height = `${this.$refs.rightBlock.offsetHeight}px`;
  },
};
</script>

<style scoped>
* {
}
.gantt-chart {
  --left-width: 70px;
  --row-height: 50px;
  --border: 1px solid rgba(0, 0, 0, 0.5);
}
.gantt-chart__container {
  @apply w-full overflow-hidden flex box-border;
  border: var(--border);
}
.gantt-chart__left {
  width: var(--left-width);
  border-right: var(--border);
}
.gantt-chart__right {
  width: calc(100% - var(--left-width));
  overflow-x: auto;
  overflow-y: hidden;
  --height: 100vh;
}
.gantt-chart__line {
  @apply flex relative flex-grow w-full;
  height: var(--row-height);
  border-bottom: var(--border);
}
.gantt-chart__line--current {
  height: 0px;
  border: none;
}
.gantt-chart__line:last-child {
  border-bottom: none;
}
.gantt-chart__line-name {
  @apply flex items-center justify-center;
  border-bottom: var(--border);
  width: var(--left-width);
  height: var(--row-height);
}
.gantt-chart__line-name:last-child {
  border-bottom: none;
}
.gantt-chart__mark {
  @apply relative text-center flex-grow-0 flex-shrink-0;
  width: 75px;
}
.gantt-chart__mark:after {
  @apply absolute;
  content: '';
  width: 1px;
  background: darkblue;
  height: var(--height);
  right: 0;
  top: 0;
  z-index: 0;
}
.gantt-chart__date {
  @apply w-full box-border;
  height: var(--row-height);
  border: var(--border);
  border-bottom: none;
  line-height: var(--row-height);
  padding-left: var(--left-width);
}
.gantt-chart__current {
  @apply absolute z-999 top-0;
  width: 3px;
  background-color: #d2d42a;
  height: var(--height);
}
</style>
