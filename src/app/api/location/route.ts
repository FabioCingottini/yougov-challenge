import { NextResponse } from "next/server";
import { LocationService } from "@/services/LocationService";

/**
 * GET /api/location, return a list of all locations.
 * If an error occurs, return a 500.
 *
 * @constructor
 */
export async function GET() {
  try {
    const locationService = await LocationService.getInstance();
    const locations = await locationService.getLocations();
    return NextResponse.json(locations, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/location, given a name, latitude, longitude, and address, create a new location.
 * If any of the fields are missing or invalid, return a 400.
 * If an error occurs, return a 500.
 *
 * @param request - The incoming request object
 */
export async function POST(request: Request) {
  try {
    const res = await request.json();
    const { name, latitude, longitude, address } = res;
    // basic field validation
    const isNameValid = typeof name === "string" && name.length > 0;
    const isLatitudeValid =
      typeof latitude === "number" && latitude <= 90 && latitude >= -90;
    const isLongitudeValid =
      typeof longitude === "number" && longitude <= 180 && longitude >= -180;
    const isAddressValid = typeof address === "string" && address.length > 0;
    // if any of the fields are invalid, return a 400
    if (
      !isNameValid ||
      !isLatitudeValid ||
      !isLongitudeValid ||
      !isAddressValid
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // everything is valid, create the location
    const locationService = await LocationService.getInstance();
    const createdLocation = await locationService.createLocation({
      name,
      latitude,
      longitude,
      address,
    });
    return NextResponse.json(createdLocation, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
