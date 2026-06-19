import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { reportKeys } from './keys/reportKeys';
import { reportyAPI_GetAll } from './api/API';

export const useReportQuery = () => {

    const useGetAll = () => {
        return useQuery({
            queryKey: reportKeys.reports(),
            placeholderData: keepPreviousData,
            queryFn: async () => {
                const res = await reportyAPI_GetAll.get('');
                if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

                const data = res.data;
                const arrayData = Array.isArray(data) ? data : [data];

                return arrayData;
            },
            staleTime: 30_000,
            refetchOnWindowFocus: true,
        });
    }

    const useGetById = (idReport) => {
        return useQuery({
            queryKey: reportKeys.reportById(idReport),
            placeholderData: keepPreviousData,
            queryFn: async () => {
                const res = await reportyAPI_GetAll.get(`/${idReport}`);

                if (res.status !== 200) throw new Error(`HTTP ${res.status}`);

                const data = res.data;
                const arrayData = Array.isArray(data) ? data : [data];

                return arrayData;
            },
            staleTime: 30_000,
            refetchOnWindowFocus: true,
        });
    }

    const downloadExcel = async (idReport) => {
        try {
            const response = await reportyAPI_GetAll.get(`/excel/${idReport}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = `situacion_actual_estrategias_${idReport}.xlsx`;
            if (contentDisposition && contentDisposition.indexOf('filename=') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    fileName = matches[1].replace(/['"]/g, '');
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);

            link.click();

            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error(`Error al descargar el reporte: ${error}`);
        }
    }

    return {
        useGetAll,
        useGetById,
        downloadExcel
    };

}
