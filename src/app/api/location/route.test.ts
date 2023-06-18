/**
 * @jest-environment node // the default environment is jsdom, which is for browser testing, but we are testing in node
 */
import { GET as getLocations, POST as postLocation } from "./route";
import { LocationService } from "@/services/LocationService";
import { NextRequest, NextResponse } from "next/server";

// mock the NextResponse.json function so we can check what it was called with proper parameters
const mockedNextResponseJson = jest.fn();
jest.spyOn(NextResponse, "json").mockImplementation(mockedNextResponseJson);

// mock the console.error function so we can check what it was called with proper parameters
const mockedConsoleError = jest.fn();
jest
  .spyOn(global.console, "error")
  .mockImplementation((...args: unknown[]) => mockedConsoleError(...args));

// mock the LocationService.getInstance function so we can return a mocked instance
const mockedLocationServiceGetLocations = jest.fn();
const mockedLocationServiceInstance = {
  getLocations: mockedLocationServiceGetLocations,
} as unknown as LocationService;
jest
  .spyOn(LocationService, "getInstance")
  .mockResolvedValue(Promise.resolve(mockedLocationServiceInstance));

describe("Location route", () => {
  describe("GET /api/location", () => {
    it("should return a list of locations", async () => {
      // Arrange
      const mockedLocations = [
        {
          id: "1",
          name: "Location 1",
          latitude: 1,
          longitude: 1,
          address: "Address 1",
        },
        {
          id: "2",
          name: "Location 2",
          latitude: 2,
          longitude: 2,
          address: "Address 2",
        },
      ];
      mockedLocationServiceGetLocations.mockResolvedValueOnce(
        Promise.resolve(mockedLocations)
      );

      // Act
      await getLocations();

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(mockedLocations, {
        status: 200,
      });
    });

    it("should return a 500 if an error occurs", async () => {
      // Arrange
      mockedLocationServiceGetLocations.mockRejectedValueOnce("my error");

      // Act
      await getLocations();

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        { error: "Something went wrong" },
        { status: 500 }
      );
    });

    it("should log the error if an error occurs", async () => {
      // Arrange
      mockedLocationServiceGetLocations.mockRejectedValueOnce("my error");

      // Act
      await getLocations();

      // Assert
      expect(mockedConsoleError).toHaveBeenLastCalledWith("my error");
    });
  });

  describe("POST /api/location", () => {
    it("should return a 400 if any of the fields are missing", async () => {
      // Arrange
      const mockedRequest = {
        json: jest.fn().mockResolvedValueOnce({}),
      } as unknown as NextRequest;

      // Act
      await postLocation(mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        { error: "Missing required fields" },
        { status: 400 }
      );
    });

    it("should create a location and return it if all fields are valid", async () => {
      // Arrange
      const mockedRequest = {
        json: jest.fn().mockResolvedValueOnce({
          name: "Location 1",
          latitude: 1,
          longitude: 1,
          address: "Address 1",
        }),
      } as unknown as NextRequest;
      const mockedCreatedLocation = {
        id: "1",
        name: "Location 1",
        latitude: 1,
        longitude: 1,
        address: "Address 1",
      };
      const mockedLocationServiceCreateLocation = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(mockedCreatedLocation));
      const mockedLocationServiceInstance = {
        createLocation: mockedLocationServiceCreateLocation,
      } as unknown as LocationService;
      jest
        .spyOn(LocationService, "getInstance")
        .mockResolvedValue(Promise.resolve(mockedLocationServiceInstance));

      // Act
      await postLocation(mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        mockedCreatedLocation,
        { status: 201 }
      );
    });

    it("should return a 500 if an error occurs", async () => {
      // Arrange
      const mockedRequest = {
        json: jest.fn().mockResolvedValueOnce({
          name: "Location 1",
          latitude: 1,
          longitude: 1,
          address: "Address 1",
        }),
      } as unknown as NextRequest;
      const mockedLocationServiceCreateLocation = jest
        .fn()
        .mockRejectedValueOnce("my error");
      const mockedLocationServiceInstance = {
        createLocation: mockedLocationServiceCreateLocation,
      } as unknown as LocationService;
      jest
        .spyOn(LocationService, "getInstance")
        .mockResolvedValue(Promise.resolve(mockedLocationServiceInstance));

      // Act
      await postLocation(mockedRequest);

      // Assert
      expect(mockedNextResponseJson).toHaveBeenLastCalledWith(
        { error: "Something went wrong" },
        { status: 500 }
      );
    });

    it("should log the error if an error occurs", async () => {
      // Arrange
      const mockedRequest = {
        json: jest.fn().mockResolvedValueOnce({
          name: "Location 1",
          latitude: 1,
          longitude: 1,
          address: "Address 1",
        }),
      } as unknown as NextRequest;
      const mockedLocationServiceCreateLocation = jest
        .fn()
        .mockRejectedValueOnce("my error");
      const mockedLocationServiceInstance = {
        createLocation: mockedLocationServiceCreateLocation,
      } as unknown as LocationService;
      jest
        .spyOn(LocationService, "getInstance")
        .mockResolvedValue(Promise.resolve(mockedLocationServiceInstance));

      // Act
      await postLocation(mockedRequest);

      // Assert
      expect(mockedConsoleError).toHaveBeenLastCalledWith("my error");
    });
  });
});
