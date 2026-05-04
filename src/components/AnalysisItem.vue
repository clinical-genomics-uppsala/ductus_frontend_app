<template>
  <div>
    <div class="card card-body">
      <a
        :href="`${api_address}/admin/processing_api/analysis/${analysis.analysis_name}/change/`"
        class="text-end"
      >
        <i class="bi bi-pen"></i>
      </a>
      <div class="text-start">
        <h5 class="card-title">
          {{ analysis.analysis_name }}
        </h5>
        <p>
          <small>
            <strong>name</strong>
          </small>
        </p>
        <hr />
        <div class="row">
          <div class="col-sm">
            {{ analysis.analysis }}
            <br />
            <p>
              <small>
                <strong>analysis to run</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ analysis.workpackage }}
            <br />
            <p>
              <small>
                <strong>workpackage</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ analysis_status_name[analysis.status] }}
            <br />
            <p>
              <small>
                <strong>status</strong>
              </small>
            </p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm">
            {{ archive_status_name[analysis.archive_status] }}
            <br />
            <p>
              <small>
                <strong>Archive status</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ priority[analysis.priority] }}
            <br />
            <p>
              <small>
                <strong>Priorty</strong>
              </small>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            {{ analysis.created_date }}
            <br />
            <p>
              <small>
                <strong>Uploaded to API</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ analysis.last_update }}
            <br />
            <p>
              <small>
                <strong>Updated</strong>
              </small>
            </p>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-sm">
            {{ analysis.progress }}
            <br />
            <p>
              <small>
                <strong>Progress message</strong>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AnalysisItem",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analysis: {
        type: Object,
      },
      analysis_status_name: {
        WS: "Waiting for sequencing",
        SC: "Sequencing completed",
        WP: "Waiting for processing",
        RE: "Reserved for processing",
        PR: "Processing",
        AC: "Analysis completed",
        DD: "Data delivered",
        FA: "Processing failed",
        PD: "Partial demultiplexed",
      },
      archive_status_name: {
        AI: "Do not use for archiving",
        WS: "Waiting for sequence data",
        PS: "Partial sequenced data",
        WA: "Waiting for archiving",
        BA: "Being archived",
        FA: "Failed archiving",
        AD: "Archived done",
      },
      priority: {
        "1-N": "Normal",
        "0-L": "Low",
        "2-H": "High",
        "3-S": "Super urgent",
      },
      // archive_status: {
      //   NA: "Not Archived",
      //   BE: "Being Archived",
      //   AC: "Archived",
      // },
    };
  },
  props: {
    analysis_name: {
      type: String,
      required: true,
    },
  },
  created() {
    this.getAnalsysis();
  },
  methods: {
    async getAnalsysis() {
      await axios
        .get("api/v1/analysis/tasks/?analysis_name__in=" + this.analysis_name)
        .then((response) => {
          this.analysis = response.data[0];
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
