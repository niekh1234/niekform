import { Field, FieldType } from '@prisma/client';

export const validateSubmission = (formFields: Field[], submission: any) => {
  const errors: any = {};

  formFields.forEach((field) => {
    const fieldName = field.key;

    if (field.required && !submission[fieldName]) {
      errors[fieldName] = 'Required';
    }

    if (field.type === FieldType.EMAIL && submission[fieldName]) {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!emailRegex.test(submission[fieldName])) {
        errors[fieldName] = 'Invalid email';
      }

      return;
    }

    if (field.type === FieldType.NUMBER && submission[fieldName]) {
      const numberRegex = /^[0-9]+$/;

      if (!numberRegex.test(submission[fieldName])) {
        errors[fieldName] = 'Invalid number';
      }

      return;
    }
  });

  return { errors, valid: Object.keys(errors).length === 0 };
};

export const cleanSubmission = (formFields: Field[], submission: any) => {
  const clean: any = {};

  formFields.forEach((field) => {
    const fieldName = field.key;

    clean[fieldName] = null;

    if (submission[fieldName]) {
      clean[fieldName] = submission[fieldName];

      if (field.type === FieldType.CHECKBOX) {
        clean[fieldName] = !!submission[fieldName];
      }
    }
  });

  return clean;
};
