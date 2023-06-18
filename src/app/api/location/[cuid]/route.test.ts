/**
 * @jest-environment node // the default environment is jsdom, which is for browser testing, but we are testing in node
 */
import { DELETE as deleteLocation } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { LocationService } from "@/services/LocationService";

// mock the NextResponse.json function so we can check what it was called with proper parameters
const mockedNextResponseJson = jest.fn();
jest.spyOn(NextResponse, "json").mockImplementation(mockedNextResponseJson);

// mock the console.error function so we can check what it was called with proper parameters
const mockedConsoleError = jest.fn();
jest
  .spyOn(global.console, "error")
  .mockImplementation((...args: unknown[]) => mockedConsoleError(...args));

// mock the LocationService.getInstance function so we can return a mocked instance
const mockedLocationServiceDeleteLocation = jest.fn();
const mockedLocationServiceInstance = {
  deleteLocation: mockedLocationServiceDeleteLocation,
} as unknown as LocationService;
jest
  .spyOn(LocationService, "getInstance")
  .mockResolvedValue(Promise.resolve(mockedLocationServiceInstance));

describe("Location route", () => {
  describe("DELETE /api/location/[cuid]", () => {
    it("should return a 400 if the cuid is not valid", async () => {
      // Arrange
      const mockedRequest = {
        params: {
          cuid: "",
        },
      };

      // Act
      await deleteLocation({} as NextRequest, mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      );
    });

    it("should return a 202 if the location is deleted", async () => {
      // Arrange
      const mockedRequest = {
        params: {
          cuid: "1",
        },
      };
      mockedLocationServiceDeleteLocation.mockResolvedValueOnce(
        Promise.resolve()
      );

      // Act
      await deleteLocation({} as NextRequest, mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        {},
        { status: 202 }
      );
    });

    it("should return a 500 if an error occurs", async () => {
      // Arrange
      const mockedRequest = {
        params: {
          cuid: "1",
        },
      };
      mockedLocationServiceDeleteLocation.mockRejectedValueOnce("my error");

      // Act
      await deleteLocation({} as NextRequest, mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        { error: "Something went wrong" },
        { status: 500 }
      );
    });

    it("should log the error if an error occurs", async () => {
      // Arrange
      const mockedRequest = {
        params: {
          cuid: "1",
        },
      };
      mockedLocationServiceDeleteLocation.mockRejectedValueOnce("my error");

      // Act
      await deleteLocation({} as NextRequest, mockedRequest);

      // Assert
      expect(mockedConsoleError).toHaveBeenLastCalledWith("my error");
    });
  });
});
