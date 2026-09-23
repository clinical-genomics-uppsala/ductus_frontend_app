import axios from "axios";

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/**
 * Build django-filter query params from a filter map.
 *
 * Array values become a `__in` list; keys that already carry a lookup
 * (`run_id__icontains`, `date__gte`) are passed through as they are. Empty
 * values are dropped entirely rather than sent as `?status__in=` — django-filter
 * reads an empty `in` list as [""], which matches nothing instead of being
 * ignored, so an untouched filter would silently empty the table.
 *
 * `limit` is always sent. Without it the API returns a bare, unpaginated array
 * instead of the {count, results} envelope.
 */
export function buildParams(filters, { page, pageSize, ordering }) {
  const params = {};

  Object.keys(filters || {}).forEach((key) => {
    const value = filters[key];
    if (value === null || value === undefined) {
      return;
    }
    if (Array.isArray(value)) {
      if (value.length) {
        params[`${key}__in`] = value.join(",");
      }
      return;
    }
    const text = String(value).trim();
    if (text) {
      params[key] = text;
    }
  });

  params.limit = pageSize;
  const offset = (page - 1) * pageSize;
  if (offset > 0) {
    params.offset = offset;
  }
  if (ordering) {
    params.ordering = ordering;
  }
  return params;
}

/** GET a list endpoint, tolerating both the envelope and the bare-array shape. */
export function fetchList(url, params) {
  return axios.get(url, { params }).then(({ data }) => {
    if (Array.isArray(data)) {
      return { results: data, count: data.length };
    }
    return { results: data.results || [], count: data.count || 0 };
  });
}

/**
 * Read table state out of the route query.
 *
 * Both tables live on the dashboard route, so each one prefixes its keys
 * (`a_status`, `sr_archive_status`) to stay out of the other's way.
 */
export function stateFromQuery(query, prefix, spec) {
  const filters = {};
  spec.forEach(({ key, query: name, multi }) => {
    const raw = query[`${prefix}${name || key}`];
    if (raw === undefined) {
      filters[key] = multi ? [] : "";
    } else if (multi) {
      filters[key] = String(raw).split(",").filter(Boolean);
    } else {
      filters[key] = String(raw);
    }
  });

  const pageSize = Number(query[`${prefix}size`]) || DEFAULT_PAGE_SIZE;
  return {
    filters,
    page: Number(query[`${prefix}page`]) || 1,
    pageSize: PAGE_SIZE_OPTIONS.includes(pageSize)
      ? pageSize
      : DEFAULT_PAGE_SIZE,
    ordering: query[`${prefix}sort`] || "",
  };
}

/** Merge this table's state back into the route query, leaving other keys alone. */
export function queryFromState(query, prefix, state, spec) {
  const next = { ...query };
  const put = (key, value) => {
    if (value) {
      next[`${prefix}${key}`] = value;
    } else {
      delete next[`${prefix}${key}`];
    }
  };

  spec.forEach(({ key, query: name, multi }) => {
    const value = state.filters[key];
    put(
      name || key,
      multi ? (value || []).join(",") : String(value || "").trim()
    );
  });
  put("page", state.page > 1 ? String(state.page) : "");
  put(
    "size",
    state.pageSize !== DEFAULT_PAGE_SIZE ? String(state.pageSize) : ""
  );
  put("sort", state.ordering || "");
  return next;
}

/** Next `ordering` value when a column header is clicked. */
export function toggleOrdering(current, field) {
  if (current === field) {
    return `-${field}`;
  }
  if (current === `-${field}`) {
    return "";
  }
  return field;
}
