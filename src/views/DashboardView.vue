<template>
  <div class="container">
    <div class="dashboard">
      <table class="table table-success">
        <thead>
          <tr>
            <th scope="col" colspan="4">Archive Status</th>
          </tr>
          <tr>
            <th scope="col">Done</th>
            <th scope="col">Not Archived</th>
            <th scope="col">Archiving</th>
            <th scope="col">Failed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ archived_count }}</td>
            <td>{{ not_archived_count }}</td>
            <td>{{ archiving_count }}</td>
            <td>{{ failed_archive_count }}</td>
          </tr>
        </tbody>
      </table>

      <table class="table table-success">
        <thead>
          <tr>
            <th scope="col" colspan="7">Processing Status</th>
          </tr>
          <tr>
            <th scope="col">Waiting for Sequencing</th>
            <th scope="col">Unprocessed</th>
            <th scope="col">Reserved</th>
            <th scope="col">Processing</th>
            <th scope="col">Done</th>
            <th scope="col">Deliverd</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ analysis_ws }}</td>
            <td>{{ analysis_wp }}</td>
            <td>{{ analysis_re }}</td>
            <td>{{ analysis_pr }}</td>
            <td>{{ analysis_ad }}</td>
            <td>{{ analysis_dd }}</td>
          </tr>
        </tbody>
      </table>
      <table v-if="analysis_fa || analysis_pa" class="table table-success">
        <thead>
          <tr>
            <th scope="col" colspan="6">Processing Failures</th>
          </tr>
          <tr>
            <th scope="col">Failed</th>
            <th scope="col" colspan="5">Partial Sequenced</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ analysis_fa }}</td>
            <td>{{ analysis_pa }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardView",
  data() {
    return {
      sequence_runs: [],
      analysis: [],
      archive: [],
      analysis_ws: 0,
      analysis_wp: 0,
      analysis_re: 0,
      analysis_pa: 0,
      analysis_pr: 0,
      analysis_ad: 0,
      analysis_dd: 0,
      analysis_fa: 0,
      archived_count: 0,
      archiving_count: 0,
      failed_archive_count: 0,
      not_archived_count: 0,
    };
  },
  created() {
    console.log("CREATED");
    this.getStatistics();
  },
  methods: {
    getStatistics() {
      axios
        .get("api/v1/statistics/counts/")
        .then((response) => {
          console.log(response.data);
          this.sequence_runs = response.data.sequence_runs;
          this.analysis = response.data.analysis;
          this.archive = response.data.archive;
          this.archived_count = response.data.archive_count.AD;
          this.archiving_count = response.data.archive_count.BA;
          this.failed_archive_count = response.data.archive_count.FA;
          this.not_archived_count = response.data.archive_count.NA;
          this.analysis_pa = response.data.analysis_count.PA;
          this.analysis_ws = response.data.analysis_count.WS;
          this.analysis_wp = response.data.analysis_count.WP;
          this.analysis_re = response.data.analysis_count.RE;
          this.analysis_pr = response.data.analysis_count.PR;
          this.analysis_ad = response.data.analysis_count.AD;
          this.analysis_dd = response.data.analysis_count.DD;
          this.analysis_fa = response.data.analysis_count.FA;
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
