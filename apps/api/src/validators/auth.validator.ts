import { loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from '../dtos/auth.dto';

export const authValidators = {
  login: loginSchema,
  register: registerSchema,
  changePassword: changePasswordSchema,
  forgotPassword: forgotPasswordSchema,
  resetPassword: resetPasswordSchema,
};
