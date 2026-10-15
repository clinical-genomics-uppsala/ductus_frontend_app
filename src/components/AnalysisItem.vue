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
            {{ statusLabels[analysis.status] }}
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
            {{ archiveStatusLabels[analysis.archive_status] }}
            <br />
            <p>
              <small>
                <strong>Archive status</strong>
              </small>
            </p>
          </div>
          <div class="col-sm">
            {{ priorityLabels[analysis.priority] }}
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
import { choiceLabels, ensureChoices } from "@/api/choices";

export default {
  name: "AnalysisItem",
  data() {
    return {
      api_address: process.env.VUE_APP_API_ADDRESS,
      analysis: {
        type: Object,
      },
    };
  },
  props: {
    analysis_name: {
      type: String,
      required: true,
    },
  },
  computed: {
    choices() {
      return this.$store.state.choices;
    },
    statusLabels() {
      return choiceLabels(this.choices, "analysis", "status");
    },
    priorityLabels() {
      return choiceLabels(this.choices, "analysis", "priority");
    },
    archiveStatusLabels() {
      return choiceLabels(this.choices, "analysis", "archive_status");
    },
  },
  created() {
    ensureChoices(this.$store).catch((error) =>
      console.debug("Could not load choices: " + error)
    );
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
