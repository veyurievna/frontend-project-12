import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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

  const userIdKey = 'userId';
  const signUpError = t('signUpPage.signUpError');
  const minUsernameLenght = t('signUpPage.minUsernameLenght');
  const maxUsernameLenght = t('signUpPage.maxUsernameLenght');
  const minPasswordLenght = t('signUpPage.minPasswordLenght');
  const required = t('required');
  const redirectToChatPage = () => navigate(getRoutes.chatPagePath());

  const registrationValidation = yup.object().shape({
    username: yup.string().min(3, minUsernameLenght).max(20, maxUsernameLenght).trim().typeError(required).required(required),
    password: yup.string().trim().min(6, minPasswordLenght).typeError(required).required(required),
    confirmPassword: yup.string().oneOf([yup.ref('password')], t('signUpPage.confirmPassword')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationValidation,
    onSubmit: async ({ username, password }) => {
      setFailedRegistration(false);
      try {
        const { data } = await axios.post(getRoutes.signupPath(), { username, password });
        logIn(data);
        localStorage.setItem(userIdKey, JSON.stringify(data));
        redirectToChatPage();
      } catch (err) {
        if (err.response.status === 409) {
          setFailedRegistration(true);
          usernameRef.current.select();
        } else {
          redirectToChatPage();
        }
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  return (
    <Container fluid className="h-100 m-0 p-0">
      <Row className="h-100 m-0 p-0">
        <Col md={7} className="d-none d-md-block">
          <div
            className="h-100"
            style={{
              backgroundImage: `url(${ImageSignUp})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </Col>
        <Col md={5}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex h-100 flex-column justify-content-center align-items-center">
              <h2>{t('signUpPage.signUp')}</h2>
              <Form onSubmit={formik.handleSubmit}>
                <FormGroup>
                  <FormLabel>{t('signUpPage.username')}</FormLabel>
                  <FormControl
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    name="username"
                    ref={usernameRef}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-danger">{formik.errors.username}</div>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('signUpPage.password')}</FormLabel>
                  <FormControl
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    name="password"
                    type="password"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger">{formik.errors.password}</div>
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <FormLabel>{t('signUpPage.confirmPassword')}</FormLabel>
                  <FormControl
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    name="confirmPassword"
                    type="password"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                    <div className="text-danger">{formik.errors.confirmPassword}</div>
                  ) : null}
                </FormGroup>
                {failedRegistration && <div className="text-danger">{signUpError}</div>}
                <Button
                  className="mt-4"
                  variant="primary"
                  type="submit"
                  disabled={!formik.dirty || formik.isSubmitting}
                >
                  {formik.isSubmitting ? t('loading') : t('signUpPage.signUp')}
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
