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
  settings: any;
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
  rawdata: any;
  formId: string;
};
