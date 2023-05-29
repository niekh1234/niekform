import { FieldType } from '@prisma/client';
import { Field, Form } from 'lib/types';

export const generateHTMLForm = (form: Form) => {
  return `<form action="${process.env.NEXT_PUBLIC_SITE_URL}/api/f/${form.id}" method="POST">
${form.fields
  .map(
    (field) => `  <label for="${field.key}">${field.label}</label>
  <${getHtmlFieldTag(field)} id="${field.key}" ${getFieldType(field)}name="${field.key}" ${
      field.required ? 'required' : ''
    }></${getHtmlFieldTag(field)}>`
  )
  .join('\n')}
  
  ${getCaptchaSettings(form)}

  <input type="text" name="a_password" style="display:none !important" tabindex="-1" autocomplete="off"></input>
  <button type="submit">Submit</button>
</form>`;
};

export const generateReactCompatibleForm = (form: Form) => {
  return `<form action="${process.env.NEXT_PUBLIC_SITE_URL}/api/f/${form.id}" method="POST">
${form.fields
  .map(
    (field) => `  <label htmlFor="${field.key}">${field.label}</label>
  <${getHtmlFieldTag(field)} id="${field.key}" ${getFieldType(field)} name="${field.key}" ${
      field.required ? 'required' : ''
    }></${getHtmlFieldTag(field)}>`
  )
  .join('\n')}

  ${getCaptchaSettings(form)}
  
  <input type="text" name="a_password" style={{ display: 'none !important' }} tabIndex={-1} autoComplete="off"></input>
  <button type="submit">Submit</button>
</form>`;
};

const getFieldType = (field: Field) => {
  switch (field.type) {
    case FieldType.EMAIL:
      return 'type="email" ';
    case FieldType.NUMBER:
      return 'type="number" ';
    case FieldType.CHECKBOX:
      return 'type="checkbox" ';
    case FieldType.TEXTAREA:
      return '';
    default:
      return 'type="text" ';
  }
};

const getHtmlFieldTag = (field: Field) => {
  switch (field.type) {
    case FieldType.TEXTAREA:
      return 'textarea';
    default:
      return 'input';
  }
};

const getCaptchaSettings = (form: Form) => {
  if (form.settings.captcha?.type === 'turnstile') {
    return `<div class="cf-turnstile" data-sitekey="${form.settings.captcha.siteKey}"></div>`;
  }

  return '';
};
