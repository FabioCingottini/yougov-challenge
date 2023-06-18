import { FC } from "react";
import { Location } from "@/types";
import { Modal } from "@/app/components/Modal";

/**
 * @typedef {object} DeleteLocationModalProps
 * @property isModalOpen - Whether the modal is open or not
 * @property closeModal - Function that will be called when the user clicks on the close button or the overlay
 * @property onConfirmDelete - Function that will be called when the user clicks on the delete button
 * @property location - Location that will be deleted, it will be used to show the name and address of the location
 */
interface DeleteLocationModal {
  isModalOpen: boolean;
  closeModal: () => void;
  onConfirmDelete: () => void;
  location?: Location;
}

/**
 * Modal that allows the user to delete a location, it will show a confirmation message with the name and address of
 * the location that will be deleted.
 *
 * @param {DeleteLocationModalProps} props - Component props
 *
 * @constructor
 */
export const DeleteLocationModal: FC<DeleteLocationModal> = ({
  isModalOpen,
  onConfirmDelete,
  location,
  closeModal,
}) => {
  return (
    <Modal
      isModalOpen={isModalOpen}
      title="Delete location"
      onClickClose={closeModal}
      labelButtonPrimary="Delete"
      labelButtonSecondary="Cancel"
      onClickButtonPrimary={onConfirmDelete}
      onClickButtonSecondary={closeModal}
      onClickOverlay={closeModal}
    >
      <p>
        Are you sure you want to delete {location?.name} with address{" "}
        {location?.address}?
      </p>
    </Modal>
  );
};
