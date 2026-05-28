import { useMutation, useQueryClient } from "@tanstack/react-query"
import { plantKeys } from "../plantKeys";
import { plantAPI } from "../api/API";

export const usePlantMutation = () => {

    const qc = useQueryClient();

    const baseKey = plantKeys.all;

    const patchAllLists = (updater) => {
        const matches = qc.getQueriesData({ queryKey: baseKey });
        matches.forEach(([key, _data]) => {
            qc.setQueryData(key, (curr = []) => updater(curr));
        });
    }

    const createMutation = useMutation({
        mutationKey: ['plants', 'create'],
        mutationFn: (payload) => plantAPI.post('', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => [data, ...(curr || [])]);
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const updateMutation = useMutation({
        mutationKey: ['plants', 'update'],
        mutationFn: (payload) => plantAPI.put('', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idPlant === data.idPlant ? data : it));
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const create = (payload, opts) => createMutation.mutate(payload, opts);
    const update = (payload, opts) => updateMutation.mutate(payload, opts);

    return { create, update }

}
