import { Submission } from 'lib/types';
import Exporter from 'lib/server/services/export';
import CSVExporter from 'lib/server/services/export/csv';
import JSONExporter from 'lib/server/services/export/json';

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
