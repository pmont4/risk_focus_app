import { useState, useEffect } from "react";
import { usePlantMutation } from "../../../query/mutation/usePlantMutation";
import Swal from "sweetalert2";

export const PlantCreationForm = ({ onClose, getSwalTarget, plant }) => {

    const { create, update } = usePlantMutation();

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        target: getSwalTarget?.(),
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2500,
    });

    const [formData, setFormData] = useState({
        idPlant: plant?.idPlant || 0,
        namePlant: plant?.namePlant || '',
        latitudePlant: plant?.latitudePlant || '',
        longitudePlant: plant?.longitudePlant || '',
        addressPlant: plant?.addressPlant || ''
    });

    useEffect(() => {
        if (plant) {
            setFormData({
                idPlant: plant.idPlant || 0,
                namePlant: plant.namePlant || '',
                latitudePlant: plant.latitudePlant || '',
                longitudePlant: plant.longitudePlant || '',
                addressPlant: plant.addressPlant || ''
            });
        }
    }, [plant]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [geoMode, setGeoMode] = useState('decimal');
    const [sexaLat, setSexaLat] = useState({ deg: '', min: '', sec: '', dir: 'N' });
    const [sexaLng, setSexaLng] = useState({ deg: '', min: '', sec: '', dir: 'W' });

    const handleSexaLatChange = (e) => setSexaLat(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSexaLngChange = (e) => setSexaLng(prev => ({ ...prev, [e.target.name]: e.target.value }));

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

        const submitAction = plant ? update : create;
        const successMsg = plant ? 'Planta actualizada correctamente' : 'Planta creada correctamente';
        const errorMsg = plant ? 'Error al actualizar planta' : 'Error al crear planta';

        let finalLat = formData.latitudePlant;
        let finalLng = formData.longitudePlant;

        if (geoMode === 'sexagesimal') {
            finalLat = `${sexaLat.deg || 0}°${sexaLat.min || 0}'${sexaLat.sec || 0}"${sexaLat.dir}`;
            finalLng = `${sexaLng.deg || 0}°${sexaLng.min || 0}'${sexaLng.sec || 0}"${sexaLng.dir}`;
        } else {
            finalLat = finalLat ? parseFloat(finalLat).toFixed(4) : "";
            finalLng = finalLng ? parseFloat(finalLng).toFixed(4) : "";
        }

        submitAction({
            idPlant: formData.idPlant,
            namePlant: formData.namePlant,
            latitudePlant: finalLat,
            longitudePlant: finalLng,
            addressPlant: formData.addressPlant
        }, {
            onSuccess: () => {
                Toast.fire({
                    icon: 'success',
                    title: successMsg
                });
                if (onClose) onClose(true);
            },
            onError: () => {
                Toast.fire({
                    icon: 'error',
                    title: errorMsg
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
                    Nombre de la Planta <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    placeholder="Ej. Planta Central Sur"
                    name="namePlant"
                    value={formData.namePlant}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                />
            </div>

            <div className="form-group">
                <label className="form-label fw-semibold text-secondary mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                    Dirección <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    className="form-control form-control-lg border-0 bg-light"
                    placeholder="Ej. Ciudad, Región"
                    name="addressPlant"
                    value={formData.addressPlant}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                />
            </div>

            <div className="form-group mb-2">
                <div className="d-flex justify-content-between align-items-center mb-3 mt-1">
                    <label className="form-label fw-semibold text-secondary mb-0" style={{ fontSize: '0.85rem', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                        Geolocalización
                    </label>
                    <div className="btn-group btn-group-sm shadow-sm" role="group" style={{ borderRadius: '6px' }}>
                        <input type="radio" className="btn-check" name="geoMode" id="geoDecimal" checked={geoMode === 'decimal'} onChange={() => setGeoMode('decimal')} />
                        <label className="btn btn-outline-secondary" htmlFor="geoDecimal" style={{ fontSize: '0.8rem' }}>Decimal</label>

                        <input type="radio" className="btn-check" name="geoMode" id="geoSexa" checked={geoMode === 'sexagesimal'} onChange={() => setGeoMode('sexagesimal')} />
                        <label className="btn btn-outline-secondary" htmlFor="geoSexa" style={{ fontSize: '0.8rem' }}>Sexagesimal</label>
                    </div>
                </div>

                {geoMode === 'decimal' ? (
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <input
                                type="number"
                                step="0.0001"
                                className="form-control form-control-lg border-0 bg-light"
                                placeholder="Latitud (ej. 14.6349)"
                                name="latitudePlant"
                                value={formData.latitudePlant}
                                onChange={handleChange}
                                style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                            />
                        </div>
                        <div className="col-sm-6">
                            <input
                                type="number"
                                step="0.0001"
                                className="form-control form-control-lg border-0 bg-light"
                                placeholder="Longitud (ej. -90.5069)"
                                name="longitudePlant"
                                value={formData.longitudePlant}
                                onChange={handleChange}
                                style={{ fontSize: '1rem', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.04)', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3 p-3 bg-light" style={{ borderRadius: '8px', border: '1px solid #e9ecef' }}>
                        <div>
                            <span className="d-block mb-1 text-secondary fw-semibold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Latitud</span>
                            <div className="d-flex gap-2">
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Grados" name="deg" value={sexaLat.deg} onChange={handleSexaLatChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">°</span>
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Min" name="min" value={sexaLat.min} onChange={handleSexaLatChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">'</span>
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Seg" name="sec" value={sexaLat.sec} onChange={handleSexaLatChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">"</span>
                                <select className="form-select form-select-sm border-0 bg-white shadow-sm" name="dir" value={sexaLat.dir} onChange={handleSexaLatChange} style={{ width: '70px', borderRadius: '6px' }}>
                                    <option value="N">N</option>
                                    <option value="S">S</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <span className="d-block mb-1 text-secondary fw-semibold" style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Longitud</span>
                            <div className="d-flex gap-2">
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Grados" name="deg" value={sexaLng.deg} onChange={handleSexaLngChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">°</span>
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Min" name="min" value={sexaLng.min} onChange={handleSexaLngChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">'</span>
                                <input type="number" className="form-control form-control-sm border-0 text-center" placeholder="Seg" name="sec" value={sexaLng.sec} onChange={handleSexaLngChange} style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,.05)', borderRadius: '6px' }} />
                                <span className="align-self-center text-secondary fw-bold">"</span>
                                <select className="form-select form-select-sm border-0 bg-white shadow-sm" name="dir" value={sexaLng.dir} onChange={handleSexaLngChange} style={{ width: '70px', borderRadius: '6px' }}>
                                    <option value="E">E</option>
                                    <option value="W">W</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
                <button
                    type="submit"
                    className="btn px-4 fw-medium text-white shadow-sm d-flex align-items-center"
                    style={{ backgroundColor: plant ? '#0d6efd' : '#198754', borderRadius: '8px' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {plant ? 'Actualizando...' : 'Guardando...'}
                        </>
                    ) : (
                        <>
                            <i className={plant ? "bi bi-pencil-square me-2" : "bi bi-check-lg me-2"}></i> {plant ? 'Actualizar Planta' : 'Guardar Planta'}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}