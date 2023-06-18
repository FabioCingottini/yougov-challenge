import { render, screen } from "@testing-library/react";
import { Modal } from "@/app/components/Modal";
import styles from "@/app/components/Modal/Modal.module.scss";

describe("Modal", () => {
  it("should render correctly", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByTestId("modal-overlay")).toBeInTheDocument();
  });

  it("should render with proper classname when isModalOpen is true", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByTestId("modal-overlay")).toHaveClass(styles.open);
  });

  it("should render with proper classname when isModalOpen is false", () => {
    // Act
    render(
      <Modal
        isModalOpen={false}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByTestId("modal-overlay")).not.toHaveClass(styles.open);
  });

  it("Should render an h3 with the title", async () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByText("modal title")).toBeInTheDocument();
  });

  it("Should render a primary button with the labelButtonPrimary", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByText("primary button")).toBeInTheDocument();
  });

  it("Should render a secondary button with the labelButtonSecondary", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        labelButtonSecondary={"secondary button"}
        onClickButtonPrimary={() => {}}
        onClickButtonSecondary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByText("secondary button")).toBeInTheDocument();
  });

  it("Should call onClickOverlay when clicking on the overlay", () => {
    // Arrange
    const mockedOnClickOverlay = jest.fn();

    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={mockedOnClickOverlay}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );
    screen.getByTestId("modal-overlay").click();

    // Assert
    expect(mockedOnClickOverlay).toHaveBeenCalled();
  });

  it("Should call onClickClose when clicking on the close button", () => {
    // Arrange
    const mockedOnClickClose = jest.fn();

    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={mockedOnClickClose}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );
    screen.getByLabelText("Close").click();

    // Assert
    expect(mockedOnClickClose).toHaveBeenCalled();
  });

  it("Should call onClickButtonPrimary when clicking on the primary button", () => {
    // Arrange
    const mockedOnClickButtonPrimary = jest.fn();

    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={mockedOnClickButtonPrimary}
      >
        modal body
      </Modal>
    );
    screen.getByText("primary button").click();

    // Assert
    expect(mockedOnClickButtonPrimary).toHaveBeenCalled();
  });

  it("Should call onClickButtonSecondary when clicking on the secondary button", () => {
    // Arrange
    const mockedOnClickButtonSecondary = jest.fn();

    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        labelButtonSecondary={"secondary button"}
        onClickButtonPrimary={() => {}}
        onClickButtonSecondary={mockedOnClickButtonSecondary}
      >
        modal body
      </Modal>
    );
    screen.getByText("secondary button").click();

    // Assert
    expect(mockedOnClickButtonSecondary).toHaveBeenCalled();
  });

  it("Should disable the primary button when isButtonPrimaryDisabled is true", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        isButtonPrimaryDisabled={true}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByText("primary button")).toBeDisabled();
  });

  it("Should not disable the primary button when isButtonPrimaryDisabled is false", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        isButtonPrimaryDisabled={false}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.getByText("primary button")).not.toBeDisabled();
  });

  it("Should not render the secondary button when labelButtonSecondary and onClickButtonSecondary are not passed", () => {
    // Act
    render(
      <Modal
        isModalOpen={true}
        title={"modal title"}
        onClickClose={() => {}}
        onClickOverlay={() => {}}
        labelButtonPrimary={"primary button"}
        onClickButtonPrimary={() => {}}
      >
        modal body
      </Modal>
    );

    // Assert
    expect(screen.queryByText("secondary button")).not.toBeInTheDocument();
  });
});
