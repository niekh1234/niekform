export type Project = {
  id: string;
  createdAt: Date;
  name: string;
  description: string;
  forms: Form[];
};

export type Form = {
  id: string;
  createdAt: Date;
  name: string;
  fields: Field[];
  submissionCount: number;
  notificationSettings: any;
};

export type Field = {
  id: string;
  createdAt: Date;
  key: string;
  label: string;
  type: string;
  required: boolean;
};

export type Submission = {
  id: string;
  createdAt: Date;
  data: any;
  formId: string;
};

export type Session = {
  id: string;
  email: string;
  name: string;
  roleId: string;
  createdAt: number;
  maxAge: number;
};
