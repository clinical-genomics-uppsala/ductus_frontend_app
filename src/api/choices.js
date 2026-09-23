import axios from "axios";

let inflight = null;

/**
 * Fetch the status enums once and keep them in the store.
 *
 * The backend serves them from the model definitions, so status labels and
 * filter options can't drift out of step with it the way the old per-component
 * dictionaries did.
 */
export function ensureChoices(store) {
  if (store.state.choices) {
    return Promise.resolve(store.state.choices);
  }
  if (!inflight) {
    inflight = axios
      .get("api/v1/choices/")
      .then(({ data }) => {
        store.commit("setChoices", data);
        inflight = null;
        return data;
      })
      .catch((error) => {
        inflight = null;
        throw error;
      });
  }
  return inflight;
}

/** The [{value, label}] options for one field, e.g. ("analysis", "status"). */
export function choiceList(choices, model, field) {
  if (!choices || !choices[model] || !choices[model][field]) {
    return [];
  }
  return choices[model][field];
}

/** The same options as a {code: label} lookup for rendering a cell. */
export function choiceLabels(choices, model, field) {
  const labels = {};
  choiceList(choices, model, field).forEach((choice) => {
    labels[choice.value] = choice.label;
  });
  return labels;
}
