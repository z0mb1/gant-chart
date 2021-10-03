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
    :opacity="opacity"
    @mouseover="highlightGroup"
    @mouseleave="highlightGroupOff"
  />
  <template v-if="showLinkedFlights">
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
    return {
      showLinkedFlights: false,
    };
  },
  emits: ['highlightOn', 'highlightOff'],
  props: {
    flightData: { type: Object },
    opacity: {type: String}
  },
  created() {},
  mounted() {},
  methods: {
    highlightGroup() {
      this.showLinkedFlights = true
      this.$emit('highlightOn')
    },
    highlightGroupOff() {
      this.showLinkedFlights = false
      this.$emit('highlightOff')
    }
  },
  computed: {},
};
</script>
