import { useCallback, useEffect, useState } from "react";
import { Location } from "@/types";

/**
 * @typedef {Object} ReturnValueUseLocations
 * @property locations - The locations fetched from the API as an array of Location objects
 * @property refreshLocations - A function that can be called to refresh the locations, by calling the API again
 */
interface ReturnValueUseLocations {
  locations: Location[];
  refreshLocations: () => Promise<void>;
}

/**
 * A custom hook that fetches the locations from the /api/location endpoint and returns them, along with a function
 * that can be called to refresh the locations, by calling the API again
 *
 * @returns {ReturnValueUseLocations} - An object containing the locations and a function to refresh them
 */
export function useLocations(): ReturnValueUseLocations {
  const [locations, setLocations] = useState<Location[]>([]);

  // define a function that can be called to call the API and get the locations
  const performApiRequest = useCallback(async () => {
    const response = await fetch("/api/location", {
      method: "GET",
    });
    const fetchedLocations = await response.json();
    setLocations(fetchedLocations);
  }, []);

  // call the previously defined function when the component mounts
  useEffect(() => {
    performApiRequest();
  }, [performApiRequest]);

  return {
    locations,
    refreshLocations: performApiRequest,
  };
}
