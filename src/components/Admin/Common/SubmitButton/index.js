import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { submitButton, submitSpinner } from "./SubmitButton.module.css";

function SubmitButton({ isValid, isSubmitting, buttonText }) {
  return (
    <Button
      variant="primary"
      type="submit"
      disabled={!isValid || isSubmitting}
      className={submitButton}
    >
      {isSubmitting ? (
        <Spinner
          className={submitSpinner}
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : null}
      {buttonText}
    </Button>
  );
}

export default SubmitButton;
