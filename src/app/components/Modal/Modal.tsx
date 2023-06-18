import { FC, ReactNode } from "react";
import cn from "classnames";
import styles from "./modal.module.scss";

/**
 * @typedef {object} ModalProps
 * @property isModalOpen - Whether the modal is open or not
 * @property title - Title of the modal displayed in the header
 * @property onClickClose - Function that will be called when the user clicks on the close button
 * @property onClickOverlay - Function that will be called when the user clicks on the overlay
 * @property labelButtonPrimary - Label of the primary button
 * @property labelButtonSecondary - Label of the secondary button
 * @property isButtonPrimaryDisabled - Whether the primary button is disabled or not
 * @property onClickButtonPrimary - Function that will be called when the user clicks on the primary button
 * @property onClickButtonSecondary - Function that will be called when the user clicks on the secondary button
 * @property children - Content of the modal
 */
type ModalProps = {
  isModalOpen: boolean;
  title: string;
  onClickClose: () => void;
  onClickOverlay: () => void;
  labelButtonPrimary: string;
  labelButtonSecondary?: string;
  isButtonPrimaryDisabled?: boolean;
  onClickButtonPrimary: () => void;
  onClickButtonSecondary?: () => void;
  children: ReactNode;
};

/**
 * Modal component that will be used to display a modal with a header, body and footer.
 * The header will contain a title and a close button.
 * The body will contain the content of the modal, it will be passed as a children prop.
 * The footer will contain the primary and secondary buttons.
 * When labelButtonSecondary and onClickButtonSecondary are both passed, the secondary button will be displayed.
 *
 * @param {ModalProps} props - Component props
 *
 * @constructor
 */
export const Modal: FC<ModalProps> = (props) => {
  return (
    <>
      <div
        data-testid="modal-overlay"
        className={cn(styles.overlay, {
          [styles.open]: props.isModalOpen,
        })}
        onClick={props.onClickOverlay}
      />
      <dialog
        className={cn("card", styles.modal, {
          [styles.open]: props.isModalOpen,
        })}
      >
        <div className={cn("card-header", styles.modalHeader)}>
          <h3 className={styles.modalTitle}>{props.title}</h3>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={props.onClickClose}
          />
        </div>
        <div className={cn("card-body", styles.modalBody)}>
          {props.children}
        </div>
        <div className={cn("card-footer", styles.modalFooter)}>
          {props.labelButtonSecondary && props.onClickButtonSecondary && (
            <button
              type="button"
              className={cn("btn btn-outline-primary", styles.modalButton)}
              onClick={props.onClickButtonSecondary}
            >
              {props.labelButtonSecondary}
            </button>
          )}
          <button
            disabled={props.isButtonPrimaryDisabled}
            type="button"
            className={cn("btn btn-primary ", styles.modalButton)}
            onClick={props.onClickButtonPrimary}
          >
            {props.labelButtonPrimary}
          </button>
        </div>
      </dialog>
    </>
  );
};
