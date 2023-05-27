import * as yup from 'yup';

const signUpValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .trim()
    .typeError('Required')
    .required('Required'),
  password: yup
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
    .typeError('Required')
    .required('Required'),
  confirmPassword: yup
    .string()
    .test(
      'confirmPassword',
      'Passwords must match',
      (password, context) => password === context.parent.password,
    ),
});

const loginValidationSchema = Yup.object({
  username: Yup.string().typeError('Required').required('Required'),
  password: Yup.string().typeError('Required').required('Required'),
});

export { signUpValidationSchema, loginValidationSchema };
