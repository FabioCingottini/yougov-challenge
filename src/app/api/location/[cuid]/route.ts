import { NextResponse } from "next/server";
import { LocationService } from "@/services/LocationService";

/**
 * GET /api/location/[cuid], given a cuid, delete the location with that cuid if it exists.
 * If the cuid is not valid, return a 400.
 * if an error occurs, return a 500.
 *
 * @param _ - The incoming request object
 * @param params - The params object contains the cuid
 */
export async function DELETE(
  _: Request,
  { params }: { params: { cuid: string } }
) {
  try {
    const { cuid } = params;
    // basic field validation
    const isCuidValid = typeof cuid === "string" && cuid.length > 0;
    if (!isCuidValid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // everything is valid, delete the location
    const locationService = await LocationService.getInstance();
    await locationService.deleteLocation(cuid);
    return NextResponse.json({}, { status: 202 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
