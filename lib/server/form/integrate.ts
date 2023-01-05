import { FieldType } from '@prisma/client';
import { Field, Form } from 'lib/types';

export const generateHTMLForm = (form: Form) => {
  return `<form action="${process.env.NEXT_PUBLIC_SITE_URL}/api/f/${form.id}" method="POST">
${form.fields
  .map(
    (field) => `  <label for="${field.key}">${field.label}</label>
  <input id="${field.key}" type="${getFieldType(field)}" name="${field.key}" ${
      field.required ? 'required' : ''
    }></input>`
  )
  .join('\n')}

  <input type="text" name="a_password" style="display:none !important" tabindex="-1" autocomplete="off">
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
