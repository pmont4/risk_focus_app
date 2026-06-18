export const reportKeys = {
    all: ['report_keys'],
    reports: () => [...reportKeys.all, 'reports'],
    reportById: (idReport) => [...reportKeys.reports(), idReport]
}