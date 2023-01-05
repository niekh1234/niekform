import { FieldType } from '@prisma/client';
import { Field, Form } from 'lib/types';

export const generateHTMLForm = (form: Form) => {
  return `<form action="${process.env.NEXT_PUBLIC_SITE_URL}/api/f/${form.id}" method="POST">
${form.fields
  .map(
    (field) => `  <label for="${field.key}">${field.label}</label>
  <${getHtmlFieldTag(field)} id="${field.key}" type="${getFieldType(field)}" name="${field.key}" ${
      field.required ? 'required' : ''
    }></${getHtmlFieldTag(field)}>`
  )
  .join('\n')}

  <input type="text" name="a_password" style="display:none !important" tabindex="-1" autocomplete="off"></input>
  <button type="submit">Submit</button>
</form>`;
};

const getFieldType = (field: Field) => {
  switch (field.type) {
    case FieldType.EMAIL:
      return 'email';
    case FieldType.NUMBER:
      return 'number';
    case FieldType.CHECKBOX:
      return 'checkbox';
    default:
      return 'text';
  }
};

const getHtmlFieldTag = (field: Field) => {
  switch (field.type) {
    case FieldType.CHECKBOX:
      return 'input';
    default:
      return 'textarea';
  }
};
