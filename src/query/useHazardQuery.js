import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { hazardKeys } from "./keys/hazardKeys";
import { hazardsAPI } from "./api/API";

export const useHazardQuery = () => {

    const useGetAll = () => {
        return useQuery({
            queryKey: hazardKeys.hazards(),
            placeholderData: keepPreviousData,
            queryFn: async () => {
                const res = await hazardsAPI.get('');
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
