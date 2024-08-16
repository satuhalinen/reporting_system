import renderFormattedNumber from "../helpers";
import { expect, test, describe } from "vitest";

describe("Test cases for renderFormattedNumber", () => {
  test("hours is type of number and has two decimals", () => {
    expect(renderFormattedNumber(1.11)).toEqual("1,11");
  });
  test("hours is type of number and has no decimals", () => {
    expect(renderFormattedNumber(1)).toEqual("1,0");
  });
  test("hours is type of number and has one decimal", () => {
    expect(renderFormattedNumber(1.1)).toEqual("1,1");
  });
  test("hours is type of string", () => {
    expect(renderFormattedNumber("test")).toEqual("test");
  });
  test("hours is type of boolean", () => {
    expect(renderFormattedNumber(true)).toEqual(true);
  });
  test("hours is type of boolean", () => {
    expect(renderFormattedNumber(null)).toEqual(null);
  });
  test("hours is type of undefined", () => {
    expect(renderFormattedNumber(undefined)).toEqual(undefined);
  });
});
