import Exporter from 'lib/server/providers/export';

export default class JSONExporter extends Exporter {
  public export() {
    const jsonData = this.format();

    return this.pack(jsonData);
  }

  private format() {
    if (this.data.length === 0) {
      return '{}';
    }

    const submissions = this.data.map((submission) => {
      return {
        createdAt: submission.createdAt,
        ...submission.rawdata,
      };
    });

    return JSON.stringify(submissions);
  }

  private pack(jsonData: string) {
    return Buffer.from(jsonData, 'utf-8');
  }
}
