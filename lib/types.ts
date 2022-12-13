export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  forms: Form[];
};

export type Form = {
  id: string;
  name: string;
  createdAt: Date;
  fields: Field[];
};

export type Field = {
  id: string;
  name: string;
  type: string;
  required: boolean;
};
