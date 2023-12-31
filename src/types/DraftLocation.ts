import { Location } from "./Location";

/**
 * A draft location is a location that is not yet saved in the database, it does not have a CUID yet because that
 * should be generated by the proper service at creation time.
 */
export type DraftLocation = Omit<Location, "cuid">;
