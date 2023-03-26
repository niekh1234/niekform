export type Project = {
  id: string;
  createdAt: Date;
  name: string;
  description: string;
  forms: Form[];
  invites: Invite[];
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
  rawdata: any;
  formId: string;
};

export type Invite = {
  id: string;
  email: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  projectId: string;
};
