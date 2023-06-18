"use client";

import React, { useState } from "react";
import cn from "classnames";
import styles from "./page.module.scss";
import { LocationsTable } from "@/app/components/LocationsTable";
import { Location } from "@/types";
import { useLocations } from "@/app/hooks/useLocations";
import { ViewLocationModal } from "@/app/components/ViewLocationModal";
import { AddLocationModal } from "@/app/components/AddLocationModal";
import { DeleteLocationModal } from "@/app/components/DeleteLocationModal";

/**
 * Page at the root of the application, it will show a table with all the locations that the user has added.
 * Is responsible for showing the modals to add, view and delete a location.
 *
 * @constructor
 */
export default function Home() {
  // pieces of state that will control the visibility of the modals
  const [isModalAddLocationOpen, setIsModalAddLocationOpen] = useState(false);
  const [isModalViewLocationOpen, setIsModalViewLocationOpen] = useState(false);
  const [isModalDeleteLocationOpen, setIsModalDeleteLocationOpen] =
    useState(false);

  // piece of state that will control the location that is being focused, this is used to show the location in the
  // view and delete modals
  const [focusedLocation, setFocusedLocation] = useState<Location>();

  // the array of locations and the function to refresh them
  const { locations, refreshLocations } = useLocations();

  return (
    <>
      <main className={cn(styles.main, "container")}>
        <div className="row">
          <div className="col-12">
            <h1 className={styles.title}>MyLocations</h1>
            <p className={styles.description}>
              Here you can find all your favorite locations, edit them, add new
              ones or delete them.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <button
              className={cn("btn btn-primary", styles.buttonAddNewLocation)}
              onClick={() => setIsModalAddLocationOpen(true)}
            >
              Add new location
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <LocationsTable
              locations={locations}
              onClickViewLocation={(location) => {
                // when the user clicks on the view button, we set the focused location and open the modal
                setFocusedLocation(location);
                setIsModalViewLocationOpen(true);
              }}
              onClickDeleteLocation={(location) => {
                // when the user clicks on the delete button, we set the focused location and open the modal
                setFocusedLocation(location);
                setIsModalDeleteLocationOpen(true);
              }}
            />
          </div>
        </div>
      </main>
      {focusedLocation && (
        <ViewLocationModal
          isModalOpen={isModalViewLocationOpen}
          closeModal={() => setIsModalViewLocationOpen(false)}
          location={focusedLocation}
        />
      )}
      <AddLocationModal
        isModalOpen={isModalAddLocationOpen}
        closeModal={() => setIsModalAddLocationOpen(false)}
        onSubmit={async (location) => {
          // when the user submits the form, we send the data to the server,
          // refresh the locations so the new one is shown and close the modal
          await fetch("/api/location", {
            method: "POST",
            body: JSON.stringify(location),
          });
          await refreshLocations();
          setIsModalAddLocationOpen(false);
        }}
      />
      <DeleteLocationModal
        isModalOpen={isModalDeleteLocationOpen}
        closeModal={() => setIsModalDeleteLocationOpen(false)}
        onConfirmDelete={async () => {
          // when the user confirms the delete, we send the request to the server,
          // refresh the locations so the deleted one is not shown and close the modal
          await fetch(`/api/location/${focusedLocation?.cuid}`, {
            method: "DELETE",
          });
          await refreshLocations();
          setIsModalDeleteLocationOpen(false);
        }}
        location={focusedLocation}
      />
    </>
  );
}
