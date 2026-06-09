import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { typeHazardKeys } from "./keys/typeHazardKeys";
import { typeHazardAPI } from "./api/API";

export const useTypeHazardQuery = () => {


    const useGetAll = () => {
        return useQuery({
            queryKey: typeHazardKeys.types(),
            placeholderData: keepPreviousData,
            queryFn: async () => {
                const res = await typeHazardAPI.get('');
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
