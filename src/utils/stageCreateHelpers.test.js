import {
  buildProcessCodeLabel,
  getStageCandidates,
  hasStageData,
  toDateInputValue,
} from "./stageCreateHelpers";

describe("stageCreateHelpers", () => {
  it("detects meaningful stage data recursively", () => {
    expect(hasStageData({ fecha: null, texto: "" })).toBe(false);
    expect(hasStageData({ nested: { value: "ok" } })).toBe(true);
    expect(hasStageData([{ foo: "" }, { bar: 3 }])).toBe(true);
  });

  it("keeps previous-stage candidates and also processes with existing stage data", () => {
    const processes = [
      { _id: "1", currentStage: "preembarque", postembarque: {} },
      { _id: "2", currentStage: "aduana", postembarque: { blMaster: "BL-001" } },
      { _id: "3", currentStage: "inicio", postembarque: { fechaRealEmbarque: null } },
    ];

    expect(getStageCandidates(processes, "preembarque", "postembarque")).toEqual([
      processes[0],
      processes[1],
    ]);
  });

  it("builds the process label with stable fallback priority", () => {
    expect(
      buildProcessCodeLabel({
        _id: "1",
        codigoImportacion: "ROOT-001",
        inicio: { codigoImportacion: "INI-001" },
      })
    ).toBe("INI-001");

    expect(buildProcessCodeLabel({ _id: "2", codigoImportacion: "ROOT-002" })).toBe("ROOT-002");
    expect(buildProcessCodeLabel({ _id: "3" })).toBe("3");
  });

  it("normalizes date-like values for dayjs inputs", () => {
    expect(toDateInputValue("2026-02-27T12:00:00.000Z")).toBe("2026-02-27");
    expect(toDateInputValue("")).toBe("");
  });
});
