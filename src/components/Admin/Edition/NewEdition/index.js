import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Col, Alert, ProgressBar, Fade } from "react-bootstrap";
import SubmitButton from "../../Common/SubmitButton";
import { withAuthorization } from "../../../Session";

import { editionForm, alertInfo, progressBar } from "./NewEdition.module.css";

const schema = Yup.object().shape({
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
      (value) =>
        value && value.name.endsWith(".pdf") && value.type === "application/pdf"
    ),
  listingslop: Yup.bool(),
});

function NewEditionPage({ firebase }) {
  function handleSubmit(values, { setSubmitting, setStatus }) {
    const { editionYear, editionNumber, editionFile, listingslop } = values;
    const fileToUpload = new File(
      [editionFile],
      `${editionYear}-0${editionNumber}.pdf`,
      { type: editionFile.type }
    );
    setSubmitting(true);
    firebase.uploadEdition(
      fileToUpload,
      listingslop,
      () => {
        setSubmitting(false);
        setStatus({ success: true, progress: 100 });
      },
      () => setStatus({ error: true }),
      (progress) => setStatus({ progress: progress })
    );
  }

  const now = new Date();
  const year = now.getFullYear();

  return (
    <>
      <Fade appear in>
        <h1>Ny utgave</h1>
      </Fade>
      <Formik
        validationSchema={schema}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
        initialValues={{
          editionYear: year,
          editionNumber: 1,
          editionFile: undefined,
          listingslop: false,
        }}
        initialStatus={{ success: false, error: false, progress: 0 }}
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
          setValues,
          resetForm,
          setStatus,
        }) => {
          return (
            <Fade appear in>
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
                      onChange={(event) => {
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
                <Form.Group>
                  <Form.Check
                    type="switch"
                    name="listingslop"
                    label="Listingsløputgave"
                    onChange={handleChange}
                    id="validationFormik0"
                  />
                </Form.Group>
                <SubmitButton
                  buttonText="Last opp utgave"
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />

                {isSubmitting || status.success ? (
                  <ProgressBar
                    className={progressBar}
                    striped
                    animated={isSubmitting}
                    now={status.progress}
                    label={`${status.progress.toFixed(0)}%`}
                  />
                ) : null}
                {status.error ? (
                  <Alert className={alertInfo} variant="error">
                    Noe gikk galt!
                    <br />
                    Vent litt, og prøv igjen. Dersom problemet vedvarer, kontakt
                    ansvarlig utvikler.
                    <hr />
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          resetForm();
                          setStatus({
                            success: false,
                            error: false,
                            progress: 0,
                          });
                        }}
                      >
                        Prøv igjen
                      </Button>
                    </div>
                  </Alert>
                ) : null}
                {status.success ? (
                  <Alert className={alertInfo} variant="primary">
                    Opplasting fullført!
                    <br />
                    Merk at det kan ta litt tid før utgaven dukker opp på
                    forsiden.
                  </Alert>
                ) : null}
              </Form>
            </Fade>
          );
        }}
      </Formik>
    </>
  );
}

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(NewEditionPage);
