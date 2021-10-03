<style lang="scss"></style>

<template>
  <Flight
    :departureValue="flightData.departureValue"
    :arrivalValue="flightData.arrivalValue"
    :sheduledOffValue="flightData.sheduledOffValue"
    :sheduledDuration="flightData.sheduledDuration"
    :operationCarrier="flightData.operationCarrier"
    :flightNumber="flightData.flightNumber"
    :arrivalStationIataCode="flightData.arrivalStationIataCode"
    :departureStationIataCode="flightData.departureStationIataCode"
    :color="flightData.color"
    type="main"
    :opacity="isHidden ? '0.5' : '1'"
    @select="$emit('select')"
  />
  <template v-if="isHighlight">
    <Flight
      v-if="flightData.backwardLeg"
      v-bind="flightData.backwardLeg"
      type="backward"
      :connectValue="flightData.departureValue"
    />
    <Flight
      v-if="flightData.onwardLeg"
      v-bind="flightData.onwardLeg"
      type="onward"
      :connectValue="flightData.arrivalValue"
    />
  </template>
</template>

<script>
import Flight from './Flight.vue';

export default {
  name: 'FlightGroup',
  components: { Flight },
  data() {
    return {};
  },
  emits: ['select'],
  props: {
    flightData: { type: Object },
    isHighlight: { type: Boolean },
    isHidden: {type: Boolean}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
};
</script>
