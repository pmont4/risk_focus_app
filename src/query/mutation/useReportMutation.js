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

    const createBaseReportMutation = useMutation({
        mutationKey: ['report', 'createBaseReport'],
        mutationFn: (payload) => reportyAPI_GetAll.post('', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => [data, ...(curr || [])]);
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

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

    const updateCriteriaMutation = useMutation({
        mutationKey: ['report', 'updateCriteria'],
        mutationFn: (payload) => reportyAPI_GetAll.put('/updatecriteria', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idReport === data.idReport ? data : it));
            qc.invalidateQueries({ queryKey: reportKeys.reports() });
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const updateProbabilityCriteriaMutation = useMutation({
        mutationKey: ['report', 'updateProbabilityCriteria'],
        mutationFn: (payload) => reportyAPI_GetAll.put('/updateprobability', payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idReport === data.idReport ? data : it));
            qc.invalidateQueries({ queryKey: reportKeys.reports() });
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const updateAreaAndSubareaMutation = useMutation({
        mutationKey: ['report', 'updateareasponderation'],
        mutationFn: ({ ponderation, payload }) => reportyAPI_GetAll.put(`/updateareasponderation/${ponderation}`, payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idReport === data.idReport ? data : it));
            qc.invalidateQueries({ queryKey: reportKeys.reports() });
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const updatePonderationMutation = useMutation({
        mutationKey: ['report', 'updateponderation'],
        mutationFn: ({ ponderation, payload }) => reportyAPI_GetAll.put(`/updateareasponderation/${ponderation}`, payload).then(res => res.data),

        onSuccess(data) {
            patchAllLists((curr) => curr?.map(it => it.idReport === data.idReport ? data : it));
            qc.invalidateQueries({ queryKey: reportKeys.reports() });

            const { reportToken, plant } = data;
            if (reportToken) {
                const today = new Date();
                const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
                const plantName = plant?.namePlant || 'Reporte';

                const content = `// IMPORTANTE: Por favor, guarde este archivo .txt de manera segura.\n\nToken: ${reportToken}\nFecha de generacion: ${today.toLocaleDateString()}`;
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${plantName}_token_${formattedDate}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        },

        async onSettled() {
            await qc.invalidateQueries({ queryKey: baseKey, refetchType: 'active' });
        },
    });

    const createBaseReport = (payload, opts) => createBaseReportMutation.mutate(payload, opts);
    const updateHazards = (payload, opts) => updateHazardsMutation.mutate(payload, opts);
    const updateCriteria = (payload, opts) => updateCriteriaMutation.mutate(payload, opts);
    const updateProbability = (payload, opts) => updateProbabilityCriteriaMutation.mutate(payload, opts);
    const updateAreaAndSubarea = (ponderation, payload, opts) => updateAreaAndSubareaMutation.mutate({ ponderation, payload }, opts);
    const updatePonderation = (ponderation, payload, opts) => updatePonderationMutation.mutate({ ponderation, payload }, opts);

    return { createBaseReport, updateHazards, updateCriteria, updateProbability, updateAreaAndSubarea, updatePonderation }

}
