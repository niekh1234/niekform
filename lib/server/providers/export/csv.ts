import Exporter from 'lib/server/providers/export';
import { Submission } from 'lib/types';

export default class CSVExporter extends Exporter {
  public export() {
    const csv = this.format();

    return this.pack(csv);
  }

  private format() {
    if (this.data.length === 0) {
      return '';
    }

    let csv = this.getHeaders(this.data[0]);

    this.data.forEach((row) => {
      csv += this.formatRow(row);
    });

    return csv;
  }

  private getHeaders(firstSubmission: Submission) {
    return ['createdAt', Object.keys(firstSubmission.rawdata).join(',')].join(',') + '\n';
  }

  private formatRow(row: Submission) {
    return (
      [
        row.createdAt.toISOString(),
        ...Object.values(row.rawdata).map((value: any) => `"${value}"`),
      ].join(',') + '\n'
    );
  }

  private pack(csv: string) {
    return Buffer.from(csv, 'utf-8');
  }
}
