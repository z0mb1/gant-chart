<style scoped>
.gantt-flight {
  @apply cursor-pointer absolute z-10 text-center;
  height: 30px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  top: 10px;
  border-radius: 4px;
  transition: transform 0.25s;
  line-height: 16px;
  font-size: 12px;
  transition: opacity 0.25s;
}
.gantt-flight.backward {
  @apply z-20;
}
.gantt-flight.onward {
  @apply z-20;
}
.gantt-flight:hover {
  transform: scale(1.03);
}
.gantt-flight__sheduled {
  @apply absolute z-10;
  height: 5px;
  color: rgba(0, 0, 0, 0.5);
  background: #ffffff;
  border: 1px solid currentColor;
  top: 4px;
  border-radius: 2px;
}
.gantt-flight__arrival {
  @apply absolute top-3 right-1;
  font-size: 10px;
}
.gantt-flight__departure {
  @apply absolute top-3 left-1;
  right: calc(100% + 4px);
  font-size: 10px;
}
.gantt-flight__connect {
  @apply absolute z-10;
  height: 2px;
  background: v-bind('color');
  top: 24px;
}
</style>

<template>
  <div
    class="gantt-flight__connect"
    v-if="type === 'backward'"
    :style="{
      left: `${arrivalValue}%`,
      width: `${connectValue - arrivalValue}%`,
      backgroundColor: color,
    }"
  ></div>
  <div
    class="gantt-flight__connect"
    v-if="type === 'onward'"
    :style="{
      left: `${connectValue}%`,
      width: `${departureValue - connectValue}%`,
      backgroundColor: color,
    }"
  ></div>
  <div
    class="gantt-flight"
    v-tippy="{
      content: `flightNumber: ${flightNumber || '-'} / aircraftType: ${aircraftType || '-'} / aircraftConfiguration: ${aircraftConfiguration  || '-'}`,
      trigger: 'mouseenter click',
      touch: true,
      theme: 'custom'
    }"
    :style="{
      ...style,
      left: `${departureValue}%`,
      width: `${duration}%`,
      backgroundColor: color,
    }"
    :class="type"
    @click.stop="$emit('select')"
  >
    {{ `${operationCarrier} ${flightNumber}` }}
    <div class="gantt-flight__arrival">
      {{ arrivalStationIataCode }}
    </div>
    <div class="gantt-flight__departure">
      {{ departureStationIataCode }}
    </div>
  </div>
  <div
    v-if="type === 'main'"
    class="gantt-flight__sheduled"
    :style="{
      left: `${sheduledOffValue}%`,
      width: `${sheduledDuration}%`,
    }"
  ></div>
</template>

<script>
export default {
  name: 'Flight',
  components: {},
  data() {
    return {};
  },
  emits: ['select'],
  props: {
    departureValue: { type: Number },
    arrivalValue: { type: Number },
    sheduledOffValue: { type: Number },
    sheduledDuration: { type: Number },
    operationCarrier: { type: String },
    flightNumber: { type: String },
    arrivalStationIataCode: { type: String },
    departureStationIataCode: { type: String },
    aircraftType: { type: String },
    aircraftConfiguration: { type: String },
    color: { type: String },
    connectValue: { type: Number },
    type: {
      type: String,
      validator: function(val) {
        return ['main', 'backward', 'onward'].includes(val);
      },
    },
    style: { type: Object },
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {
    duration() {
      return this.arrivalValue - this.departureValue;
    },
  },
};
</script>
