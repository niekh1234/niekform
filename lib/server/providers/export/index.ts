import { Submission } from 'lib/types';

export default abstract class Exporter {
  data: Submission[];

  constructor(data: Submission[]) {
    this.data = data;
  }

  abstract export(): Buffer;
}
