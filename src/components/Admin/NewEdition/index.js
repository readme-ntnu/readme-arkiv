import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Col } from "react-bootstrap";

import { withAuthorization } from "../../Session";

const schema = Yup.object({
  editionYear: Yup.number()
    .lessThan(3000, "Vi er ikke blitt så gamle ennå. Året må være før 3000.")
    .moreThan(1998, "readme ble grunnlagt i 1999, så dette er for tidlig.")
    .required("Utgaveår må fylles ut."),
  editionNumber: Yup.number()
    .lessThan(7, "Dette tallet kan ikke være høyere enn 6.")
    .moreThan(0, "Dette tallet må være høyere enn null.")
    .required("Utgavenummer må fylles ut.")
});

function handleSubmit(values, actions) {
  console.log(values);
}

function NewEditionPage() {
  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, actions) => handleSubmit(values, actions)}
      initialValues={{
        editionYear: 1999,
        editionNumber: 1,
        editionFile: undefined
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md="4">
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
            <Form.Group as={Col} md="4">
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
                value={values.file}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Last opp utgave
          </Button>
        </Form>
      )}
    </Formik>
  );
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(NewEditionPage);
