import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Col, Spinner, Alert } from "react-bootstrap";

import { editionForm, alertInfo } from "./NewEdition.module.css";

import { withAuthorization } from "../../Session";

const schema = Yup.object({
  editionYear: Yup.number()
    .lessThan(3000, "Vi er ikke blitt så gamle ennå. Året må være før 3000.")
    .moreThan(1998, "readme ble grunnlagt i 1999, så dette er for tidlig.")
    .required("Utgaveår må fylles ut."),
  editionNumber: Yup.number()
    .lessThan(7, "Dette tallet kan ikke være høyere enn 6.")
    .moreThan(0, "Dette tallet må være høyere enn null.")
    .required("Utgavenummer må fylles ut."),
  editionFile: Yup.mixed()
    .required("Du må ha en utgave å laste opp!")
    .test(
      "file type",
      "Dette må være en PDF-fil",
      value =>
        value && value.name.endsWith(".pdf") && value.type === "application/pdf"
    )
});

function NewEditionPage({ firebase }) {
  function handleSubmit(values, { setSubmitting, setStatus }) {
    const { editionYear, editionNumber, editionFile } = values;
    const fileToUpload = new File(
      [editionFile],
      `${editionYear}-0${editionNumber}.pdf`,
      { type: editionFile.type }
    );
    setSubmitting(true);
    firebase.uploadEdition(fileToUpload, () => {
      setSubmitting(false);
      setStatus({ success: true });
    });
  }

  const now = new Date();
  const year = now.getFullYear();

  return (
    <>
      <h1>Ny utgave</h1>
      <Formik
        validationSchema={schema}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        initialValues={{
          editionYear: year,
          editionNumber: 1,
          editionFile: undefined
        }}
        initialStatus={{ success: false }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          isValid,
          errors,
          status,
          isSubmitting,
          setValues
        }) => (
          <Form className={editionForm} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Utgaveår</Form.Label>
                <Form.Control
                  placeholder="Utgaveår"
                  type="number"
                  name="editionYear"
                  value={values.editionYear}
                  onChange={handleChange}
                  isValid={touched.editionYear && !errors.editionYear}
                  isInvalid={!!errors.editionYear}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editionYear}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Utgavenummer</Form.Label>
                <Form.Control
                  placeholder="Utgavenummer"
                  type="number"
                  name="editionNumber"
                  value={values.editionNumber}
                  onChange={handleChange}
                  isValid={touched.editionNumber && !errors.editionNumber}
                  isInvalid={!!errors.editionNumber}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.editionNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group>
                <Form.Control
                  name="editionFile"
                  type="file"
                  onChange={event => {
                    const newValues = { ...values }; // copy the original object
                    newValues.editionFile = event.currentTarget.files[0];
                    setValues(newValues);
                  }}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {errors.editionFile}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button
              variant="primary"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : null}
              Last opp utgave
            </Button>
            {status.success ? (
              <Alert className={alertInfo} variant="primary">
                Opplasting fullført!
                <br />
                Merk at det kan ta litt tid før utgaven dukker opp på forsiden.
              </Alert>
            ) : null}
          </Form>
        )}
      </Formik>
    </>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewEditionPage);
