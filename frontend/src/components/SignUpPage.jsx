import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import {
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import ImageSignUp from '../assets/avatar_1.jpg';
import getRoutes from '../routes.js';
import { useAuth } from '../hooks/hooks.js';

const SignUp = () => {
  const [failedRegistration, setFailedRegistration] = useState(false);
  const { t } = useTranslation();
  const usernameRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn } = useAuth();
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const registrationValidation = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signUpPage.minUsernameLenght'))
      .max(20, t('signUpPage.maxUsernameLenght'))
      .trim()
      .typeError(t('required'))
      .required(t('required')),
    password: Yup.string()
      .trim()
      .min(6, t('signUpPage.minPasswordLenght'))
      .typeError(t('required'))
      .required(t('required')),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password')],
      t('signUpPage.confirmPassword'),
    ),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationValidation,
    onSubmit: async (values, { setSubmitting }) => {
      setFailedRegistration(false);
      setSubmitting(true);
      try {
        const { username, password } = values;
        const { data } = await axios.post(getRoutes.signupPath(), { username, password });
        localStorage.setItem('userId', JSON.stringify(data));
        logIn(data);
        const { from } = location.state || { from: { pathname: getRoutes.chatPagePath() } };
        navigate(from);
      } catch (err) {
        if (err.response.status === 409) {
          setFailedRegistration(true);
          usernameRef.current.select();
          setSubmitting(false);
          return;
        }
      }
      setSubmitting(false);
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
                    disabled={isSubmiting}
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
                    disabled={isSubmiting}
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
                    disabled={isSubmiting}
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
