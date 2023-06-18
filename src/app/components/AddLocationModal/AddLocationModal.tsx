import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { DraftLocation } from "@/types";
import { Modal } from "@/app/components/Modal";

import styles from "./addLocationModal.module.scss";

/**
 * @typedef {object} AddLocationModalProps
 * @property isModalOpen - Whether the modal is open or not
 * @property closeModal - Function that will be called when the user clicks on the close button or the overlay
 * @property onSubmit - Function that will be called when the user clicks on the add button
 */
interface AddLocationModal {
  isModalOpen: boolean;
  closeModal: () => void;
  onSubmit: (location: DraftLocation) => void;
}

/**
 * Modal that allows the user to add a new location, it will show a form with two inputs, one for the name and another
 * one for the address. The address input will be connected to the Google Places API, so the user can search for an
 * address and select it from the suggestions.
 *
 * @param {AddLocationModalProps} props - Component props
 *
 * @constructor
 */
export const AddLocationModal: FC<AddLocationModal> = ({
  isModalOpen,
  closeModal,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!inputRef.current) return;
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
      version: "3",
    });

    // import the places library
    loader.importLibrary("places").then(async (placesLibrary) => {
      // create the autocomplete instance and connect it to the input
      const autocomplete = new placesLibrary.Autocomplete(
        inputRef.current as HTMLInputElement
      );
      // every time the user selects a place, we will update the state with the new values
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place) return;
        setLatitude(place.geometry.location.lat() as number);
        setLongitude(place.geometry.location.lng() as number);
        setAddress(place.formatted_address as string);
      });
    });
  }, []);

  // we will enable the add button only if all the fields are filled
  const isFormValid = useMemo(() => {
    return locationName && latitude && longitude && address;
  }, [locationName, latitude, longitude, address]);

  // when the modal is closed, we will clean the form
  const cleanForm = useCallback(() => {
    setLatitude(0);
    setLongitude(0);
    setAddress("");
    setLocationName("");
    if (!inputRef.current) return;
    inputRef.current.value = "";
  }, []);

  return (
    <Modal
      isModalOpen={isModalOpen}
      title="Add a new location"
      onClickClose={() => {
        closeModal();
        cleanForm();
      }}
      labelButtonPrimary="Add"
      labelButtonSecondary="Cancel"
      isButtonPrimaryDisabled={!isFormValid}
      onClickButtonPrimary={() => {
        onSubmit({
          latitude,
          longitude,
          address,
          name: locationName,
        });
        cleanForm();
      }}
      onClickButtonSecondary={closeModal}
      onClickOverlay={closeModal}
    >
      <form>
        <div className="col-12">
          <label htmlFor="location-name">Location name</label>
        </div>
        <div className="col-12">
          <input
            className={styles.input}
            id="location-name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Eg: Parent's house"
          />
        </div>
        <div className="col-12">
          <label htmlFor="location-address">Location address</label>
        </div>
        <div className="col-12">
          <input
            id="location-address"
            className={styles.input}
            ref={inputRef}
          />
        </div>
      </form>
    </Modal>
  );
};
