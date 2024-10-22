import * as Yup from 'yup';
import i18n from '@/internationalization';
const today = new Date();
const sixteenYearsAgo = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());

export const RegisterSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2,i18n.t("registerSchema.firstName.min") )
    .matches(/^[A-Za-z]+$/, i18n.t("registerSchema.firstName.matches"))
    .required(i18n.t("registerSchema.firstName.required") ),
  lastName: Yup.string()
    .min(2, i18n.t("registerSchema.lastName.min"))
    .matches(/^[A-Za-z]+$/, i18n.t("registerSchema.lastName.matches"))
    .required(i18n.t("registerSchema.lastName.required")),
  password: Yup.string()
    .min(8, i18n.t("registerSchema.password.min"))
    .required(i18n.t("registerSchema.password.required")),
  gender: Yup.string().oneOf(['Male', 'Female']).required(i18n.t("registerSchema.gender.oneOf")),
  dob: Yup.date()
    .max(sixteenYearsAgo, i18n.t("registerSchema.dob.max"))
    .required(i18n.t("registerSchema.dob.required")),
});
