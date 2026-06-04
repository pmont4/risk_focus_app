import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "../keys/reportKeys";
import { reportyAPI_GetAll } from "../api/API";

export const useReportMutation = () => {

    const qc = useQueryClient();

    const baseKey = reportKeys.all;

    const patchAllLists = (updater) => {
        const matches = qc.getQueriesData({ queryKey: baseKey });
        matches.forEach(([key, _data]) => {
            qc.setQueryData(key, (curr = []) => updater(curr));
        });
    }

    const updateHazardsMutation = useMutation({
        mutationKey: ['report', 'updateHazards'],
        mutationFn: (payload) => reportyAPI_GetAll.put('/updatehazards', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idReport === data.idReport ? data : it));
            qc.invalidateQueries({ queryKey: reportKeys.reports() });
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const updateHazards = (payload, opts) => updateHazardsMutation.mutate(payload, opts);

    return { updateHazards }

}
