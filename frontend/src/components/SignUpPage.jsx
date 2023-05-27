import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from 'react-bootstrap';

import { signUp } from '../../store/auth';
import ImageSignUp from '../../assets/images/signup.png';

const SignUp = () => {
  const { t } = useTranslation();
  const [failedRegistration, setFailedRegistration] = useState(false);
  const [submited, setSubmited] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const usernameRef = useRef(null);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t("validationMessages.required"))
      .min(3, t("validationMessages.minLenght", { lenght: 3 })),
    password: Yup.string()
      .required(t("validationMessages.required"))
      .min(6, t("validationMessages.minLenght", { lenght: 6 })),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validationMessages.passwordsDoNotMatch'))
      .required(t("validationMessages.required")),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmited(true);
        await dispatch(signUp(values.username, values.password));
        setSubmited(false);
        history.push('/');
      } catch (error) {
        setFailedRegistration(true);
        setSubmited(false);
        usernameRef.current.focus();
      }
    },
  });

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
                  alt="Registratiion Avatar"
                />
              </div>
              <Form className="w-50">
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
                    disabled={submited}
                    isInvalid={
                      (formik.errors.username && formik.touched.username)
                      || failedRegistration
                    }
                  />
                  <FormLabel htmlFor="username">
                    {t('signUpPage.username')}
                  </FormLabel>
                  <Form.Control.Feedback
                    type="invalid"
                    className="invalid-feedback"
                  >
                    {formik.errors.username || null}
                  </Form.Control.Feedback>
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
                    disabled={submited}
                    isInvalid={
                      (formik.errors.password && formik.touched.password)
                      || failedRegistration
                    }
                  />
                  <FormLabel htmlFor="password">{t('password')}</FormLabel>
                  <Form.Control.Feedback
                    type="invalid"
                    className="invalid-feedback"
                  >
                    {formik.errors.password || null}
                  </Form.Control.Feedback>
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
                    disabled={submited}
                    isInvalid={
                      (formik.errors.confirmPassword
                        && formik.touched.confirmPassword)
                      || failedRegistration
                    }
                  />
                  <FormLabel htmlFor="confirmPassword">{t('signUpPage.repeatPassword')}</FormLabel>
                  <Form.Control.Feedback
                    type="invalid"
                    className="invalid-feedback"
                  >
                    {formik.errors.confirmPassword || t('signUpPage.existingUser')}
                  </Form.Control.Feedback>
                </FormGroup>
                <Button
                  type="submit"
                  disabled={submited}
                  className="w-100"
                  variant="outline-primary"
                  onClick={formik.handleSubmit}
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
