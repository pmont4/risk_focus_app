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

    return {
        useGetAll,
    };

}
