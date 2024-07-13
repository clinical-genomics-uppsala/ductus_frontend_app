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
          <table class="table">
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
          <table v-if="analysis_fa || analysis_pa" class="table">
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

          <table class="table">
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
        </div>
      </div>
      <br />
      <hr class="hr" />
      <h1>Sequence Runs and Analyzes</h1>
      <div v-if="analysis_ws || analysis_pa">
        <h2>
          Waiting for fastq-files
          <button
            class="btn btn-link"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#waitintforfastq"
            aria-expanded="true"
            aria-controls="waitintforfastq"
          >
            +/-
          </button>
        </h2>
        <div class="collapse show" id="waitintforfastq">
          <div class="card card-body">
            <AnalysisTable analysis_status="WS,PA" />
          </div>
        </div>
      </div>
      <!-- <div v-if="analysis_ws || analysis_pa">
        <h1>Sequence not assigned analysis</h1>
        <AnalysisTable analysis_status="WS,PA" />
      </div> -->
      <div v-if="failed_archive_count || analysis_fa">
        <h2>
          Failures
          <button
            class="btn btn-link"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#failures"
            aria-expanded="true"
            aria-controls="failures"
          >
            +/-
          </button>
        </h2>
        <div class="collapse show" id="failures">
          <div class="card card-body">
            <h4 v-if="failed_archive_count">Archiving</h4>
            <SequenceRunTable archive_status="FA" v-if="failed_archive_count" />
            <h4 v-if="analysis_fa">Analyzes</h4>
            <AnalysisTable v-if="analysis_fa" analysis_status="FA" />
          </div>
        </div>
      </div>

      <div v-if="not_archived_count || analysis_ws || analysis_wp">
        <h2>
          Not handled
          <button
            class="btn btn-link"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#notHandled"
            aria-expanded="true"
            aria-controls="notHandled"
          >
            +/-
          </button>
        </h2>
        <div class="collapse show" id="notHandled">
          <div class="card card-body">
            <h4 v-if="not_archived_count">Archiving</h4>
            <SequenceRunTable
              assigned_analysis="NA"
              v-if="not_archived_count"
            />
            <h4 v-if="analysis_wp || analysis_ws">Analyzes</h4>
            <AnalysisTable
              v-if="analysis_wp || analysis_ws"
              title="Analysis"
              analysis_status="WS,WP"
            />
          </div>
        </div>
      </div>

      <div v-if="analysis_re || analysis_pr || analysis_ad">
        <h2>
          Analysis being processed
          <button
            class="btn btn-link"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#processing"
            aria-expanded="true"
            aria-controls="processing"
          >
            +/-
          </button>
        </h2>
        <div class="collapse show" id="processing">
          <div class="card card-body">
            <AnalysisTable analysis_status="RE,PR,AD" />
          </div>
        </div>
      </div>

      <h2>
        Delivered
        <button
          class="btn btn-link"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#delivered"
          aria-expanded="true"
          aria-controls="delivered"
        >
          +/-
        </button>
      </h2>
      <div class="collapse show" id="delivered">
        <div class="card card-body">
          <AnalysisTable analysis_status="DD" />
        </div>
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
      analysis_delivered: [],
    };
  },
  created() {
    this.getStatistics();
  },
  methods: {
    async getStatistics() {
      await axios
        .get("api/v1/statistics/counts/")
        .then((response) => {
          //console.log(response.data);
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
