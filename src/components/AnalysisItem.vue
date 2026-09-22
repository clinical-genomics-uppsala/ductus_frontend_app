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
            {{ analysisStatusName[analysis.status] }}
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
            {{ analysisArchiveStatusName[analysis.archive_status] }}
            <br />
            <p>
              <small>
                <strong>Archive status</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ priorityName[analysis.priority] }}
            <br />
            <p>
              <small>
                <strong>Priority</strong>
              </small>
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            {{ demuxStatusName[analysis.demux_status] }}
            <br />
            <p>
              <small>
                <strong>Demultiplexing</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ analysis.process_location }}
            <br />
            <p>
              <small>
                <strong>Process location</strong>
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
import {
  analysisStatusName,
  analysisArchiveStatusName,
  priorityName,
  demuxStatusName,
} from "@/constants/statuses";

export default {
  name: "AnalysisItem",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analysis: {},
      analysisStatusName,
      analysisArchiveStatusName,
      priorityName,
      demuxStatusName,
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
          const results = Array.isArray(response.data)
            ? response.data
            : response.data.results;
          this.analysis = results[0];
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
