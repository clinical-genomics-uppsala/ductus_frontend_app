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
                assigned_bf_samplesheet[
                  sequencerun.assigned_bionformatic_samplesheet_status
                ]
              }}
            </p>

            <table v-if="analyzes">
              <tr>
                <th>Analysis</th>
                <th>Used for archiving</th>
              </tr>
              <tr v-for="analysis in analyzes" :key="analysis.analysis_name">
                <td>{{ analysis.analysis_name }}</td>
                <td class="text-center">
                  {{ analysis.use_for_archive_settings }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm">
            Archive status: {{ archive_status[sequencerun.archive_status] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SequenceRunItem",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analyzes: {
        type: Object,
      },
      sequencerun: {
        type: Object,
      },
      assigned_bf_samplesheet: {
        NA: "Not Assigned",
        PA: "Partial Assigned",
        AS: "Assigned",
      },
      archive_status: {
        NA: "Not Archived",
        BA: "Being Archived",
        AD: "Archiving Done",
        FA: "Failed archiving",
        AI: "Do not archive",
      },
    };
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
  },
  methods: {
    async getSequenceRun() {
      await axios
        .get("api/v1/sequencerun/list/?run_id__in=" + this.sequencerun_id)
        .then((response) => {
          this.sequencerun = response.data[0];
        })
        .catch((error) => console.log(error));
    },
    async getAnalsysis() {
      console.log("api/v1/sequencerun/analysis/" + this.sequencerun_id + "/");
      await axios
        .get("api/v1/sequencerun/analysis/" + this.sequencerun_id + "/")
        .then((response) => {
          this.analyzes = response.data;
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
