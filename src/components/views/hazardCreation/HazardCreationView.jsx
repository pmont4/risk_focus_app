import { useState } from "react";
import { useHazardMutation } from "../../../query/mutation/useHazardMutation";
import { useTypeHazardQuery } from "../../../query/useTypeHazardQuery";
import Swal from "sweetalert2";

export const HazardCreationView = ({ onClose, getSwalTarget }) => {

    const { create } = useHazardMutation();
    const { useGetAll } = useTypeHazardQuery();

    const { data: typesHazard = [], isLoading: typesLoading } = useGetAll();

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500,
        didOpen: (toast) => {
            toast.style.zIndex = 9999;
        }
    });

    const [formData, setFormData] = useState({
        nameHazard: '',
        idTypeHazard: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            nameHazard: formData.nameHazard,
            typeHazard: {
                idTypeHazard: formData.idTypeHazard
            }
        };

        create(payload, {
            onSuccess: () => {
                Toast.fire({
                    icon: 'success',
                    title: 'Amenaza creada correctamente'
                });
                if (onClose) onClose(true);
            },
            onError: () => {
                Toast.fire({
                    icon: 'error',
                    title: 'Error al crear amenaza'
                });
            },
            onSettled: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-2 px-1">
            <div className="form-group">
                <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                    Nombre de la Amenaza <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    placeholder="Ej. Sismo, Incendio..."
                    name="nameHazard"
                    value={formData.nameHazard}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                />
            </div>

            <div className="form-group">
                <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                    Tipo de Amenaza <span className="text-danger">*</span>
                </label>
                <select
                    className="form-select form-select-lg border-0 bg-light"
                    name="idTypeHazard"
                    value={formData.idTypeHazard}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                >
                    <option value="" disabled>Seleccione un tipo</option>
                    {typesLoading ? (
                        <option value="" disabled>Cargando tipos...</option>
                    ) : (
                        typesHazard.map(type => (
                            <option key={type.idTypeHazard} value={type.idTypeHazard}>
                                {type.nameTypeHazard}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                <button
                    type="submit"
                    className="btn px-4 fw-medium text-white shadow-sm d-flex align-items-center"
                    style={{ backgroundColor: '#198754', borderRadius: '8px' }}
                    disabled={isSubmitting || typesLoading}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-lg me-2"></i> Guardar Amenaza
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
