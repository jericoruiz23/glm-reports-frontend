export function hasStageData(stageData) {
  if (stageData == null) return false;

  if (stageData instanceof Date) {
    return !Number.isNaN(stageData.getTime());
  }

  if (Array.isArray(stageData)) {
    return stageData.some((item) => hasStageData(item));
  }

  if (typeof stageData === "object") {
    return Object.values(stageData).some((value) => hasStageData(value));
  }

  if (typeof stageData === "string") {
    return stageData.trim() !== "";
  }

  return true;
}

export function getStageCandidates(processes = [], previousStage, stageKey) {
  return (Array.isArray(processes) ? processes : []).filter((process) => {
    if (!process) return false;
    if (process.currentStage === previousStage) return true;
    return hasStageData(process?.[stageKey]);
  });
}

export function buildProcessCodeLabel(process) {
  return process?.inicio?.codigoImportacion || process?.codigoImportacion || process?._id || "";
}

export function toDateObject(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toDateInputValue(value) {
  if (!value) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return trimmed.slice(0, 10);
    }
  }

  const parsed = toDateObject(value);
  return parsed ? parsed.toISOString().slice(0, 10) : "";
}

export function mergeTextValue(nextValue, currentValue = "") {
  if (typeof nextValue !== "string") {
    return currentValue ?? "";
  }

  return nextValue.trim() ? nextValue : currentValue ?? "";
}

export function mergeNumberValue(nextValue, currentValue = null) {
  if (nextValue === "" || nextValue === null || nextValue === undefined) {
    return currentValue ?? null;
  }

  const parsed = Number(nextValue);
  return Number.isFinite(parsed) ? parsed : currentValue ?? null;
}

export function mergeArrayValue(nextValue, currentValue = []) {
  if (Array.isArray(nextValue) && nextValue.length > 0) {
    return nextValue;
  }

  if (Array.isArray(nextValue) && nextValue.length === 0 && !hasStageData(currentValue)) {
    return [];
  }

  return Array.isArray(currentValue) ? currentValue : [];
}
