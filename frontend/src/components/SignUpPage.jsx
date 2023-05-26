import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Form, FormGroup, FormControl, FormLabel, FormFeedback, Button } from 'react-bootstrap';
import classNames from 'classnames';
import ImageSignUp from '../images/sign-up-avatar.png';

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedRegistration, setFailedRegistration] = useState(false);
  const usernameRef = useRef(null);
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .required(t('fieldRequired')),
      password: Yup.string()
        .min(8, t('minPasswordLength'))
        .required(t('fieldRequired')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], t('passwordsDoNotMatch'))
        .required(t('fieldRequired')),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setIsSubmitting(true);
      // make an API call to submit the form data
      setTimeout(() => {
        setFailedRegistration(true);
        setIsSubmitting(false);
      }, 1000);
    },
  });

  const onSubmitHandler = (event) => {
    formik.handleSubmit(event);
    if (formik.isValidating || formik.isValid || isSubmitting) {
      return;
    }
    usernameRef.current.focus();
  };

  const formClassName = classNames('w-50', {
    'is-invalid': failedRegistration,
  });

  const usernameInvalid = formik.errors.username && formik.touched.username;
  const passwordInvalid = formik.errors.password && formik.touched.password;
  const confirmPasswordInvalid = (formik.errors.confirmPassword && formik.touched.confirmPassword) || failedRegistration;

  return (
    <Container className="container-fluid h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <img
                  src={ImageSignUp}
                  className="rounded-circle"
                  alt={t('registrationAvatar')}
                />
              </div>
              <Form className={formClassName}>
                <h1 className="text-center mb-4">{t('signUp')}</h1>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    id="username"
                    name="username"
                    ref={usernameRef}
                    placeholder={t('signUpPage.username')}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    isInvalid={usernameInvalid}
                  />
                  <FormLabel htmlFor="username">
                    {t('signUpPage.username')}
                  </FormLabel>
                  <FormFeedback type="invalid">
                    {formik.errors.username || null}
                  </FormFeedback>
                </FormGroup>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    type="password"
                    id="password"
                    name="password"
                    placeholder={t('signUpPage.minPasswordLenght')}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    isInvalid={passwordInvalid}
                  />
                  <FormLabel htmlFor="password">{t('password')}</FormLabel>
                    <FormFeedback type="invalid">
                      {formik.errors.password || null}
                    </FormFeedback>
                </FormGroup>
                <FormGroup className="form-floating mb-3">
                  <FormControl
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={t('signUpPage.minPasswordLenght')}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                    isInvalid={confirmPasswordInvalid}
                  />
                  <FormLabel htmlFor="confirmPassword">{t('signUpPage.repeatPassword')}</FormLabel>
                    <FormFeedback type="invalid">
                      {formik.errors.confirmPassword || t('signUpPage.existingUser')}
                    </FormFeedback>
                  </FormGroup>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-100"
                    variant="outline-primary"
                    onClick={onSubmitHandler}
                  >
                    {t('signUpPage.signUp')}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
};

export default SignUp;
