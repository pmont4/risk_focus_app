import { useMutation, useQueryClient } from "@tanstack/react-query"
import { hazardKeys } from "../keys/hazardKeys";
import { hazardsAPI } from "../api/API";

export const useHazardMutation = () => {

    const qc = useQueryClient();

    const baseKey = hazardKeys.all;

    const patchAllLists = (updater) => {
        const matches = qc.getQueriesData({ queryKey: baseKey });
        matches.forEach(([key, _data]) => {
            qc.setQueryData(key, (curr = []) => updater(curr));
        });
    }

    const createMutation = useMutation({
        mutationKey: ['hazards', 'create'],
        mutationFn: (payload) => hazardsAPI.post('', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => [data, ...(curr || [])]);
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const create = (payload, opts) => createMutation.mutate(payload, opts);

    return { create }

}
