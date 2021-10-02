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
      <div class="gantt-chart__right">
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
            class="gantt-chart__line"
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
                class="gantt-chart__block-flight"
                :style="{
                  left: `${departureValue}%`,
                  width: `${duration}%`,
                  backgroundColor: getColor(),
                }"
              >
                {{ `${operationCarrier} ${flightNumber}` }}
                <div class="gantt-chart__block-flight__arrival">{{ arrivalStationIataCode }}</div>
                <div class="gantt-chart__block-flight__departure">{{ departureStationIataCode }}</div>
              </div>
              <div
                class="gantt-chart__block-sheduled"
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

export default {
    name: 'Gantt',
    props: ['legs', 'ganttDate'],
    data () {
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
        rightHoursShift: ''
      }
    },
    created () {
      this.date = new Date(this.ganttDate);
      this.date.setDate(this.date.getDate() + 1);
      const deadlineDateUnix = +this.date;
      this.width = 1280;
      this.rangeHours = 4;
      this.leftHoursShift = 3;
      this.rightHoursShift = 24;
      this.currentTimePosition = this.normalizedTime(new Date(this.ganttDate).getTime());
      this.filteredLegs = this.legs.filter(e => e.relevantDepartureTime < deadlineDateUnix && e.relevantArrivalTime <= deadlineDateUnix)
    },
    computed: {
      startTime () {
        return this.timeShift(this.ganttDate, -this.leftHoursShift);
      },
      endTime () {
        const remains = (this.leftHoursShift + this.rightHoursShift) % this.rangeHours;
        if (remains === 0) {
          return this.timeShift(this.ganttDate, this.rightHoursShift);
        } else {
          return this.timeShift(
            this.ganttDate,
            this.rightHoursShift + +this.rangeHours - remains
          );
        }
      },
      timeBlocks () {
        return (
          (this.endTime - this.startTime) / 1000 / 60 / 60 / +this.rangeHours + 1
        );
      },
      timeMarks () {
        const initialHours = new Date(this.startTime).getHours();
        return Array.from({ length: this.timeBlocks }, (_, i) => {
          const time = i * +this.rangeHours + initialHours;
            if (time > 23) {
              return `${time - 24}:00`;
            }
            return `${time}:00`;
        });
      },

      chartData () {
        return this.filteredLegs.reduce((res, curr) => {
          const departureValue = this.normalizedTime(curr.relevantDepartureTime);
          const duration = this.normalizedTime(curr.relevantArrivalTime) - departureValue;
          const sheduledOffValue = this.normalizedTime(curr.scheduledOffBlockTime);
          const sheduledDuration = this.normalizedTime(curr.scheduledOnBlockTime) - sheduledOffValue;
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
          if (curr.aircraftRegistration) {
            if (res[curr.aircraftRegistration]) {
              res[curr.aircraftRegistration].push(currentFlightData);
            } else {
              res[curr.aircraftRegistration] = [currentFlightData];
            }
          }
          return res;
        }, {});
      }
    },

    methods: {
      timeShift (date, hours)  {
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
      normalizedTime (ms)  {
        return ((ms - this.startTime) / (this.endTime - this.startTime)) * 100;
      },
      getColor ()  {
        let colors = ['#D15EB8', '#7291E0', '#A67DD9', '#D76872'];
        return colors[Math.floor(Math.random() * colors.length)];
      },
    }
}
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
    width: 100%;
    overflow: hidden;
    display: flex;
    border: var(--border);
    box-sizing: border-box;
  }
  .gantt-chart__left {
    width: var(--left-width);
    border-right: var(--border);
  }
  .gantt-chart__right {
    width: calc(100% - var(--left-width));
    overflow-x: auto;
    overflow-y: hidden;
  }
  .gantt-chart__line {
    display: flex;
    height: var(--row-height);
    border-bottom: var(--border);
    position: relative;
    flex-grow: 1;
    display: flex;
    width: 100%;
  }
  .gantt-chart__line--current {
    height: 0px;
    border: none;
  }
  .gantt-chart__line:last-child {
    border-bottom: none;
  }
  .gantt-chart__line-name {
    border-bottom: var(--border);
    width: var(--left-width);
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--row-height);
  }
  .gantt-chart__line-name:last-child {
    border-bottom: none;
  }
  .gantt-chart__block-flight {
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
  .gantt-chart__block-flight:hover {
    transform: scale(1.03);
  }
  .gantt-chart__block-sheduled {
    height: 5px;
    position: absolute;
    color: rgba(0, 0, 0, 0.5);
    background: #ffffff;
    border: 1px solid currentColor;
    top: 4px;
    border-radius: 2px;
    z-index: 9;
  }
  .gantt-chart__mark {
    text-align: center;
    flex-shrink: 0;
    flex-grow: 0;
    position: relative;
    width: 75px;
  }
  .gantt-chart__mark:after {
    content: '';
    position: absolute;
    width: 1px;
    background: darkblue;
    height: 100vh;
    right: 0;
    top: 0;
    z-index: 0;
  }
  .gantt-chart__date {
    height: var(--row-height);
    width: 100%;
    border: var(--border);
    border-bottom: none;
    line-height: var(--row-height);
    padding-left: var(--left-width);
    box-sizing: border-box;
  }
  .gantt-chart__current {
    position: absolute;
    width: 3px;
    background-color: #d2d42a;
    height: 100vh;
    top: 0;
    z-index: 999;
  }
  .gantt-chart__block-flight__arrival {
    position: absolute;
    top: 0;
    left: calc(100% + 4px);
  }
  .gantt-chart__block-flight__departure {
    position: absolute;
    top: 0;
    right: calc(100% + 4px);
  }
</style>
