<template>
  <div>
    <div class="card card-body">
      <a
        :href="`${api_address}/admin/processing_api/sequencerun/${sequencerun.run_id}/change/`"
        class="text-end"
      >
        <i class="bi bi-pen"></i>
      </a>
      <div class="text-start">
        <h5 class="card-title">
          {{ sequencerun.run_id }}
        </h5>
        <p>
          <small>
            <strong>runfolder name</strong>
          </small>
        </p>
        <hr />
        <div class="row">
          <div class="col-sm">
            {{ sequencerun.flowcell }}
            <br />
            <p>
              <small>
                <strong>Flowcell</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ sequencerun.machine_id }}
            <br />
            <p>
              <small>
                <strong>ID</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ sequencerun.machine_type }}
            <br />
            <p>
              <small>
                <strong>Type</strong>
              </small>
            </p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm">
            <p>
              Assigned bioinformatic SampleSheet:
              {{
                assignedSamplesheetStatusName[
                  sequencerun.assigned_bionformatic_samplesheet_status
                ]
              }}
            </p>

            <table v-if="analysis.length" class="table">
              <tr>
                <th>Assigned analysis</th>
                <th>Status</th>
              </tr>
              <tr v-for="a in analysis" :key="a.analysis_name">
                <td>
                  <a :href="`/analysis/${a.analysis_name}`">
                    {{ a.analysis_name }}
                  </a>
                </td>
                <td>{{ analysisStatusName[a.status] }}</td>
              </tr>
            </table>

            <table v-if="extra_analysis.length" class="table">
              <tr>
                <th>Re-used in (extra analysis)</th>
                <th>Status</th>
              </tr>
              <tr v-for="a in extra_analysis" :key="a.analysis_name">
                <td>
                  <a :href="`/analysis/${a.analysis_name}`">
                    {{ a.analysis_name }}
                  </a>
                </td>
                <td>{{ analysisStatusName[a.status] }}</td>
              </tr>
            </table>
          </div>
        </div>
        <hr v-if="missingConfigExperiments.length" />
        <div v-if="missingConfigExperiments.length" class="row">
          <div class="col-sm">
            <p class="text-warning">
              <strong>Samples missing bioinformatics configuration</strong>
            </p>
            <table class="table">
              <tr>
                <th>Experiment</th>
                <th>Samples</th>
              </tr>
              <tr
                v-for="experiment in missingConfigExperiments"
                :key="experiment"
              >
                <td>{{ experiment }}</td>
                <td>{{ missingConfig[experiment].join(", ") }}</td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm">
            Archive status:
            {{ runArchiveStatusName[sequencerun.archive_status] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  analysisStatusName,
  assignedSamplesheetStatusName,
  runArchiveStatusName,
} from "@/constants/statuses";

export default {
  name: "SequenceRunItem",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analysis: [],
      extra_analysis: [],
      missingConfig: {},
      sequencerun: {},
      analysisStatusName,
      assignedSamplesheetStatusName,
      runArchiveStatusName,
    };
  },
  computed: {
    missingConfigExperiments() {
      return Object.keys(this.missingConfig);
    },
  },
  props: {
    sequencerun_id: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getSequenceRun();
    this.getAnalsysis();
    this.getMissingConfig();
  },
  methods: {
    async getSequenceRun() {
      await axios
        .get("api/v1/sequencerun/list/?run_id__in=" + this.sequencerun_id)
        .then((response) => {
          const results = Array.isArray(response.data)
            ? response.data
            : response.data.results;
          this.sequencerun = results[0];
        })
        .catch((error) => console.log(error));
    },
    async getAnalsysis() {
      await axios
        .get("api/v1/sequencerun/analysis/" + this.sequencerun_id + "/")
        .then((response) => {
          this.analysis = response.data.analysis;
          this.extra_analysis = response.data.extra_analysis;
        })
        .catch((error) => console.log(error));
    },
    async getMissingConfig() {
      await axios
        .get(
          "api/v1/sequencerun/missing-bioinformatic-config/" +
            this.sequencerun_id +
            "/"
        )
        .then((response) => {
          this.missingConfig = response.data;
        })
        .catch((error) => console.log(error));
    },
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
/* Your component-specific styles go here */
</style>
