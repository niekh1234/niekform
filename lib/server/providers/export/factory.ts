import { Submission } from 'lib/types';
import Exporter from 'lib/server/providers/export';
import CSVExporter from 'lib/server/providers/export/csv';
import JSONExporter from 'lib/server/providers/export/json';

export default class ExportFactory {
  public static make(type: string, data: Submission[]): Exporter {
    switch (type) {
      case 'csv':
        return new CSVExporter(data);
      case 'json':
        return new JSONExporter(data);
      default:
        return new CSVExporter(data);
    }
  }
}
