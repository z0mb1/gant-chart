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
    <GantChart :flights="flights" />
  </div>
</template>

<script>
import GantChart from './components/GantChart.vue';

export default {
  name: 'App',
  components: {
    GantChart,
  },
  data: function() {
    return {
      rawData: [
        {
          data: {
            aircraftConfiguration: '20J/138Y',
            aircraftRegistration: 'VPBSB',
            aircraftType: '73H',
            arrivalStationIataCode: 'IKT',
            arrivalStationId: '5a909573-921f-46f3-a6a5-34a3f5f12da4',
            arrivalTerminalName: 'B',
            delays: [],
            departureGateName: '115',
            departureParkingStandName: '117',
            departureStationIataCode: 'SVO',
            departureStationId: '502e3b1b-c6dd-4d07-8d97-acde0323348b',
            departureTerminalName: 'B',
            estimatedOffBlockTime: 1628149800000,
            estimatedOnBlockTime: 1628169900000,
            flightDate: 1628121600000,
            flightNumber: '1564',
            legId: '00b0725d-abf2-4270-822f-9bc7977d7c38',
            operationCarrier: 'SU',
            relevantArrivalTime: 1628170000000,
            relevantDepartureTime: 1628151000000,
            remarks: [],
            scheduledOffBlockTime: 1628149800000,
            scheduledOnBlockTime: 1628169900000,
            specialStatus: 2,
            status: 1,
          },
        },
        {
          data: {
            aircraftConfiguration: '8J/150Y',
            aircraftRegistration: 'VPBLR',
            aircraftType: '32A',
            arrivalParkingStandName: '141',
            arrivalStationIataCode: 'SVO',
            arrivalStationId: '502e3b1b-c6dd-4d07-8d97-acde0323348b',
            arrivalTerminalName: 'C',
            delays: [],
            departureStationIataCode: 'ARN',
            departureStationId: '3928948f-3a09-4d7c-8c46-112477a8874b',
            departureTerminalName: '5',
            estimatedOffBlockTime: 1628160000000,
            estimatedOnBlockTime: 1628167800000,
            flightDate: 1628121600000,
            flightNumber: '2211',
            legId: '00c0d7ce-9a61-4cd0-bff8-16f6f254c2a9',
            operationCarrier: 'SU',
            relevantArrivalTime: 1628167800000,
            relevantDepartureTime: 1628160000000,
            remarks: [],
            scheduledOffBlockTime: 1628160000000,
            scheduledOnBlockTime: 1628167800000,
            status: 1,
          },
        },
        {
          data: {
            aircraftConfiguration: '12J/144Y',
            aircraftRegistration: 'VPBPR',
            aircraftType: '32N',
            arrivalStationIataCode: 'MMK',
            arrivalStationId: '2a1398ed-8776-4d04-8736-b16af1dd7116',
            arrivalTerminalName: 'C',
            delays: [],
            departureParkingStandName: '166',
            departureStationIataCode: 'SVO',
            departureStationId: '502e3b1b-c6dd-4d07-8d97-acde0323348b',
            departureTerminalName: 'B',
            estimatedOffBlockTime: 1628165400000,
            estimatedOnBlockTime: 1628174700000,
            flightDate: 1628121600000,
            flightNumber: '1324',
            legId: '026a8707-3b93-455b-ac74-a53393421cda',
            operationCarrier: 'SU',
            relevantArrivalTime: 1628174700000,
            relevantDepartureTime: 1628165400000,
            remarks: [],
            scheduledOffBlockTime: 1628165400000,
            scheduledOnBlockTime: 1628174700000,
            status: 1,
          },
        },
        {
          data: {
            aircraftConfiguration: '8J/150Y',
            aircraftRegistration: 'VPBTA',
            aircraftType: '32A',
            arrivalStationIataCode: 'SVX',
            arrivalStationId: '75ea0957-a462-48d1-9501-5edfb6346f49',
            arrivalTerminalName: 'B',
            delays: [],
            departureGateName: '104',
            departureParkingStandName: '184',
            departureStationIataCode: 'SVO',
            departureStationId: '502e3b1b-c6dd-4d07-8d97-acde0323348b',
            departureTerminalName: 'B',
            estimatedOffBlockTime: 1628144700000,
            estimatedOnBlockTime: 1628153700000,
            flightDate: 1628121600000,
            flightNumber: '1416',
            legId: '02e392bd-42eb-43a5-8f43-b2a68f99f042',
            operationCarrier: 'SU',
            relevantArrivalTime: 1628153700000,
            relevantDepartureTime: 1628144700000,
            remarks: [],
            scheduledOffBlockTime: 1628144700000,
            scheduledOnBlockTime: 1628153700000,
            status: 1,
          },
        },
        {
          data: {
            aircraftConfiguration: '30J/48W/324Y',
            aircraftRegistration: 'VQBQG',
            aircraftType: '77W',
            arrivalParkingStandName: '142A',
            arrivalStationIataCode: 'SVO',
            arrivalStationId: '502e3b1b-c6dd-4d07-8d97-acde0323348b',
            arrivalTerminalName: 'C',
            delays: [],
            departureStationIataCode: 'GYD',
            departureStationId: 'a2cb37dc-a333-404e-8b1a-2d7c402a41eb',
            departureTerminalName: '1',
            estimatedOffBlockTime: 1628166900000,
            estimatedOnBlockTime: 1628179200000,
            flightDate: 1628121600000,
            flightNumber: '1855',
            legId: '03001c6d-fb03-4f47-87b7-36a5b34c51e8',
            operationCarrier: 'SU',
            relevantArrivalTime: 1628179200000,
            relevantDepartureTime: 1628166900000,
            remarks: [],
            scheduledOffBlockTime: 1628166900000,
            scheduledOnBlockTime: 1628179200000,
            status: 1,
          },
        },
      ],
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
