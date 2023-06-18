import { FC, useEffect, useRef } from "react";
import { Location } from "@/types";
import { Modal } from "@/app/components/Modal";
import { Loader } from "@googlemaps/js-api-loader";
import styles from "./viewLocationModal.module.scss";

/**
 * @typedef {object} ViewLocationModalProps
 * @property isModalOpen - Whether the modal is open or not
 * @property closeModal - Function that will be called when the user clicks on the close button or the overlay
 * @property location - Location that will be shown, it will be used to show the name and address of the location
 */
interface ViewLocationModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  location: Location;
}

/**
 * Modal that allows the user to view a location, it will show a map with the location.
 * The map will be created using the Google Maps API.
 *
 * @param {ViewLocationModalProps} props - Component props
 *
 * @constructor
 */
export const ViewLocationModal: FC<ViewLocationModalProps> = ({
  isModalOpen,
  location,
  closeModal,
}) => {
  // Ref to the div that will contain the map
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Maps API
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      version: "3",
    });

    // Import the libraries that we will use
    // We need to import the maps library and the marker library to be able to create a map and add a marker to it
    Promise.all([
      loader.importLibrary("maps"),
      loader.importLibrary("marker"),
    ]).then(([GoogleMap, GoogleMarker]) => {
      // If the ref is not set, we can't create the map
      if (!mapContainerRef.current) return;
      // Create the map centered in the location that we want to show, the zoom will is arbitrary
      const map = new GoogleMap.Map(mapContainerRef.current, {
        center: {
          lat: location.latitude,
          lng: location.longitude,
        },
        zoom: 15,
      });

      // Create the marker and add it to the map by passing the map instance
      new GoogleMarker.Marker({
        map,
        title: location.name,
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
    });
  }, [location.latitude, location.longitude, location.name]);

  return (
    <Modal
      isModalOpen={isModalOpen}
      title={"View location"}
      onClickClose={closeModal}
      onClickOverlay={closeModal}
      labelButtonPrimary={"Close"}
      onClickButtonPrimary={closeModal}
    >
      <div className="col-12">
        <p>
          <strong>Name:</strong> {location.name}
        </p>
      </div>
      <div className="col-12">
        <p>
          <strong>Address:</strong> {location.address}
        </p>
      </div>
      <section className={styles.sectionMapContainer}>
        <div ref={mapContainerRef} className={styles.mapContainer} />
      </section>
    </Modal>
  );
};
