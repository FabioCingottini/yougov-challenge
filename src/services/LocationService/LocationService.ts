import * as mongoose from "mongoose";
import { LocationModel } from "@/models/LocationModel";
import { DraftLocation } from "@/types";
import cuid from "cuid";

/**
 * A service that handles the logic for interacting with the LocationModel.
 * Is a singleton, so that the connection to the database is only opened once.
 * In case the application complexity grows, it is a good idea to let the connection
 * to the database handled by a separate service.
 *
 * @class LocationService
 */
export class LocationService {
  static instance: LocationService;

  /**
   * Returns the singleton instance of the LocationService, if there is none, it creates one and opens a connection to
   * the database
   */
  static async getInstance() {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
      await mongoose.connect(process.env.MONGO_DB_URI as string);
    }
    return LocationService.instance;
  }

  /**
   * Creates a new location in the database, based on the provided location object, it also generates a cuid for the
   * location and returns the created location.
   * The created location does not contain the _id and __v fields, as they are not needed by the client and generally
   * should not be exposed to the client.
   *
   * @param location - The location object that will be used to create the location in the database
   *
   * @returns createdLocation - The created location object, without the _id and __v fields
   */
  async createLocation(location: DraftLocation) {
    const locationModel = new LocationModel({
      cuid: cuid(),
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
    });
    const createdLocation = await LocationModel.create(locationModel);
    return {
      cuid: createdLocation.cuid,
      name: createdLocation.name,
      latitude: createdLocation.latitude,
      longitude: createdLocation.longitude,
      address: createdLocation.address,
    };
  }

  /**
   * Returns all the locations from the database, without the _id and __v fields, as they are not needed by the client
   * and generally should not be exposed to the client.
   *
   * @returns locations - An array of all the locations in the database, without the _id and __v fields
   */
  async getLocations() {
    return LocationModel.find({}, { _id: 0, __v: 0 });
  }

  /**
   * Given a cuid, deletes the location with that cuid from the database
   *
   * @param cuid
   */
  async deleteLocation(cuid: string) {
    await LocationModel.deleteOne({ cuid });
  }
}
