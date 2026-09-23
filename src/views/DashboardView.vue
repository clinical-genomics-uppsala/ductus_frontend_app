<template>
  <div class="container">
    <div class="dashboard">
      <h1>
        Statistics
        <button
          class="btn btn-link"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#statistictables"
          aria-expanded="true"
          aria-controls="statistictables"
        >
          +/-
        </button>
      </h1>
      <div class="collapse show" id="statistictables">
        <div class="card card-body">
          <p class="text-muted small text-start mb-2">
            Select a number to filter the tables below.
          </p>

          <table class="table">
            <thead>
              <tr>
                <th scope="col" :colspan="analysisTiles.length">
                  Processing Status
                </th>
              </tr>
              <tr>
                <th v-for="tile in analysisTiles" :key="tile.label" scope="col">
                  {{ tile.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="tile in analysisTiles" :key="tile.label">
                  <button
                    class="btn btn-link p-0"
                    type="button"
                    @click="applyFilter('a_status', tile.codes.join(','))"
                  >
                    {{ tileCount(analysis_count, tile.codes) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="table">
            <thead>
              <tr>
                <th scope="col" :colspan="archiveTiles.length">
                  Archive Status
                </th>
              </tr>
              <tr>
                <th v-for="tile in archiveTiles" :key="tile.label" scope="col">
                  {{ tile.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="tile in archiveTiles" :key="tile.label">
                  <button
                    class="btn btn-link p-0"
                    type="button"
                    @click="applyFilter('sr_archive', tile.codes.join(','))"
                  >
                    {{ tileCount(archive_count, tile.codes) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="table">
            <thead>
              <tr>
                <th scope="col" :colspan="samplesheetTiles.length">
                  Analysis assigned
                </th>
              </tr>
              <tr>
                <th
                  v-for="tile in samplesheetTiles"
                  :key="tile.label"
                  scope="col"
                >
                  {{ tile.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="tile in samplesheetTiles" :key="tile.label">
                  <button
                    class="btn btn-link p-0"
                    type="button"
                    @click="applyFilter('sr_samplesheet', tile.codes.join(','))"
                  >
                    {{ tileCount(assigned_analysis_count, tile.codes) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <hr class="hr" />

      <h1>Analyses</h1>
      <div class="card card-body">
        <AnalysisTable />
      </div>

      <h1>Sequence Runs</h1>
      <div class="card card-body mb-4">
        <SequenceRunTable />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AnalysisTable from "../components/AnalysisTable";
import SequenceRunTable from "../components/SequenceRunTable";

export default {
  name: "DashboardView",
  components: {
    AnalysisTable,
    SequenceRunTable,
  },
  data() {
    return {
      analysis_count: {},
      archive_count: {},
      assigned_analysis_count: {},
      // Codes come from the backend TextChoices; CountStatisticsV reports
      // these nine analysis statuses.
      analysisTiles: [
        { label: "Waiting for sequencing", codes: ["WS"] },
        { label: "Sequencing completed", codes: ["SC"] },
        { label: "Partial demultiplexed", codes: ["PD"] },
        { label: "Waiting for processing", codes: ["WP"] },
        { label: "Reserved", codes: ["RE"] },
        { label: "Processing", codes: ["PR"] },
        { label: "Completed", codes: ["AC"] },
        { label: "Delivered", codes: ["DD"] },
        { label: "Failed", codes: ["FA"] },
      ],
      archiveTiles: [
        { label: "Archived", codes: ["AD"] },
        { label: "Partially archived", codes: ["PA"] },
        { label: "Not archived", codes: ["NA"] },
        { label: "Failed", codes: ["FA"] },
      ],
      samplesheetTiles: [
        { label: "Assigned", codes: ["AS"] },
        { label: "Partially assigned", codes: ["PA"] },
        { label: "Not assigned", codes: ["NA"] },
      ],
    };
  },
  created() {
    this.getStatistics();
  },
  methods: {
    tileCount(counts, codes) {
      return codes.reduce((total, code) => total + (counts[code] || 0), 0);
    },
    // The tables read their state from the route query, so setting it here is
    // all that's needed to filter them.
    applyFilter(key, value) {
      const query = { ...this.$route.query };
      if (value) {
        query[key] = value;
      } else {
        delete query[key];
      }
      delete query[key.startsWith("a_") ? "a_page" : "sr_page"];
      this.$router.replace({ query }).catch(() => {});
    },
    async getStatistics() {
      await axios
        .get("api/v1/statistics/counts/")
        .then((response) => {
          this.analysis_count = response.data.analysis_count || {};
          this.archive_count = response.data.archive_count || {};
          this.assigned_analysis_count =
            response.data.assigned_analysis_count || {};
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.d-card {
  color: #d0d6d6;
  background-color: #386994;
  border-color: #386994;
  font-size: larger;
  font-weight: bold;
}
</style>
