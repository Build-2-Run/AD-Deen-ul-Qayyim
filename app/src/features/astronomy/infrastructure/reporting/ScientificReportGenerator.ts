import { PlatformValidationReport } from '../validation/ValidationRunner';

export class ScientificReportGenerator {
  public static generateMarkdownReport(report: PlatformValidationReport): string {
    const lines: string[] = [];

    lines.push('# Scientific Data Infrastructure & Platform Audit Report');
    lines.push(`**Generated At**: ${report.timestamp}`);
    lines.push(`**Overall Pass Rate**: ${report.overallPassRatePercentage}%`);
    lines.push(`**Total Validation Suites**: ${report.totalSuites}\n`);

    lines.push('| Validation Suite | Tests | Passed | Failed | Pass Rate | Status | Execution Time |');
    lines.push('| :--- | :---: | :---: | :---: | :---: | :---: | :---: |');

    for (const s of report.suites) {
      lines.push(
        `| ${s.suiteName} | ${s.totalTests} | ${s.passedTests} | ${s.failedTests} | ${s.passRatePercentage}% | ${s.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED'} | ${s.executionTimeMs} ms |`
      );
    }

    lines.push('\n> [!NOTE]\n> All astronomical engines operate under immutable coordinate models with complete scientific provenance traceability.');

    return lines.join('\n');
  }
}
