import { describe, expect, it } from "vitest";

import { INITIAL_FILTERS_STATE } from "@/app/(overview)/constants";
import { columns } from "@/containers/overview/table/view/overview/columns";

const getBreakEvenValue = (creditsIssued: string) => {
  const breakEvenColumn = columns(INITIAL_FILTERS_STATE).find(
    (column) =>
      column.id === "breakEvenCostPerTCO2e" && "accessorFn" in column,
  );

  if (!breakEvenColumn || !("accessorFn" in breakEvenColumn)) {
    throw new Error("Break-even column accessor was not found");
  }

  return breakEvenColumn.accessorFn(
    { creditsIssued, opexNPV: 100 } as unknown as Parameters<
      typeof breakEvenColumn.accessorFn
    >[0],
    0,
  );
};

describe("overview table break-even column", () => {
  it("returns null when credits issued is the string zero", () => {
    expect(getBreakEvenValue("0")).toBeNull();
  });

  it("calculates break-even cost when credits issued is a positive string", () => {
    expect(getBreakEvenValue("4")).toBe(25);
  });
});
