/**
 * @jest-environment node // the default environment is jsdom, which is for browser testing, but we are testing in node
 */
import { LocationService } from "@/services/LocationService";
import mongoose from "mongoose";
import { LocationModel } from "@/models/LocationModel";

const mockedMongooseConnect = jest.fn();
jest.mock("mongoose", () => {
  return {
    ...jest.requireActual("mongoose"),
    __esModule: true,
    connect: jest.fn((...args: unknown[]) => mockedMongooseConnect(...args)),
  };
});

describe("Test LocationService", () => {
  describe("getInstance", () => {
    it("should return and set an instance of LocationService when there is no instance", async () => {
      // Act
      const locationService = await LocationService.getInstance();

      // Assert
      expect(locationService).toBeInstanceOf(LocationService);
      expect(LocationService.instance).toBeInstanceOf(LocationService);
    });

    it("should return the static instance of LocationService when there is an instance", async () => {
      // Arrange
      const previouslyCreatedInstance = LocationService.instance;

      // Act
      const locationService = await LocationService.getInstance();

      // Assert
      expect(locationService).toBeInstanceOf(LocationService);
      expect(locationService).toBe(previouslyCreatedInstance);
    });

    it("should connect to the database by using the MONGO_DB_URI environment variable when there is no instance", async () => {
      // Arrange
      // set the environment mongo db uri
      const mongoDbUri = "mongodb://localhost:27017/test";
      process.env.MONGO_DB_URI = mongoDbUri;
      // delete the instance so that the instance is created again and the database is connected again
      // @ts-expect-error // this is a hack to delete the instance, it's fine during testing
      delete LocationService.instance;

      // Act
      await LocationService.getInstance();

      // Assert
      expect(mockedMongooseConnect).toHaveBeenLastCalledWith(mongoDbUri);
    });
  });

  describe("createLocation", () => {
    it("should create a LocationModel with the provided location", async () => {
      // Arrange
      const locationService = await LocationService.getInstance();
      const location = {
        name: "test",
        latitude: 1,
        longitude: 2,
        address: "test",
      };
      const mockedLocationModelCreate = jest
        .spyOn(LocationModel, "create")
        .mockImplementation(
          () =>
            Promise.resolve(location) as unknown as ReturnType<
              typeof LocationModel.create
            >
        );

      // Act
      await locationService.createLocation(location);

      // Assert
      const lastCreateCall =
        mockedLocationModelCreate.mock.calls[
          mockedLocationModelCreate.mock.calls.length - 1
        ];
      expect(lastCreateCall[0]).toMatchObject({
        cuid: expect.any(String),
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
      });
    });

    it("should return the created location with the proper fields", async () => {
      // Arrange
      const locationService = await LocationService.getInstance();
      const location = {
        name: "test",
        latitude: 1,
        longitude: 2,
        address: "test",
      };
      const mockedLocationModelCreate = jest
        .spyOn(LocationModel, "create")
        .mockImplementation(
          () =>
            Promise.resolve(location) as unknown as ReturnType<
              typeof LocationModel.create
            >
        );

      // Act
      const result = await locationService.createLocation(location);

      // Assert
      expect(result).toHaveProperty("cuid");
      expect(result).toHaveProperty("name", location.name);
      expect(result).toHaveProperty("latitude", location.latitude);
      expect(result).toHaveProperty("longitude", location.longitude);
      expect(result).toHaveProperty("address", location.address);
      expect(result).not.toHaveProperty("_id");
      expect(result).not.toHaveProperty("__v");
    });
  });

  describe("getLocations", () => {
    it("should return all locations with the proper fields", async () => {
      // Arrange
      const locationService = await LocationService.getInstance();
      const locations = [
        {
          cuid: "test",
          name: "test",
          latitude: 1,
          longitude: 2,
          address: "test",
        },
        {
          cuid: "test2",
          name: "test2",
          latitude: 3,
          longitude: 4,
          address: "test2",
        },
      ];

      const mockedLocationModelFind = jest
        .spyOn(LocationModel, "find")
        .mockImplementation(
          () =>
            Promise.resolve(locations) as unknown as ReturnType<
              typeof LocationModel.find
            >
        );

      // Act
      const result = await locationService.getLocations();

      // Assert
      expect(result).toMatchObject(locations);
      // check that the fields are correct by checking the last call to the find function specifies the proper projection
      const lastFindCall =
        mockedLocationModelFind.mock.calls[
          mockedLocationModelFind.mock.calls.length - 1
        ];
      // @ts-expect-error // this is a hack to access the projection, it's fine during testing
      expect(lastFindCall[1]).toMatchObject({
        _id: 0,
        __v: 0,
      });
    });
  });

  describe("deleteLocation", () => {
    it("should delete the location with the provided cuid", async () => {
      // Arrange
      const locationService = await LocationService.getInstance();
      const cuid = "test";
      const mockedLocationModelDeleteOne = jest
        .spyOn(LocationModel, "deleteOne")
        .mockImplementation(
          () =>
            Promise.resolve({}) as unknown as ReturnType<
              typeof LocationModel.deleteOne
            >
        );

      // Act
      await locationService.deleteLocation(cuid);

      // Assert
      const lastDeleteOneCall =
        mockedLocationModelDeleteOne.mock.calls[
          mockedLocationModelDeleteOne.mock.calls.length - 1
        ];
      expect(lastDeleteOneCall[0]).toMatchObject({
        cuid,
      });
    });
  });
});
