import renderFormattedNumber from "../helpers";
import { expect, test, describe } from "vitest";

const finnishThousandSeparator = String.fromCharCode(160);

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
  test("hours is missing", () => {
    expect(renderFormattedNumber()).toEqual(undefined);
  });
  test("hours is type of number and at least 1000", () => {
    const formattedNumber = renderFormattedNumber(1000);
    const expected = "1" + finnishThousandSeparator + "000,0";
    expect(formattedNumber).toEqual(expected);
  });
});
