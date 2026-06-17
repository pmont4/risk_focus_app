import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useReportMutation } from '../../query/mutation/useReportMutation';
import '../../css/PonderationReportView.css';

export const PonderationReportView = ({ reportData, onClose, getSwalTarget }) => {
  const { updatePonderation } = useReportMutation();

  const processAreas = (dataAreas) => {
    const processed = JSON.parse(JSON.stringify(dataAreas || []));
    return processed;
  };

  const [areas, setAreas] = useState(() => processAreas(reportData.areas));
  
  const CATEGORY_ORDER = [
    "AMENAZAS NATURALES - GEOLÓGICAS E HIDROMETEOROLÓGICAS",
    "AMENAZAS INDUSTRIALES",
    "AMENAZAS OCUPACIONALES",
    "AMENAZA TERRORISMO / FACTOR HUMANO",
    "AMENAZAS AMBIENTE EXTERNO ORGANIZACIONAL"
  ];

  const hazards = [...(reportData.hazards || [])].sort((a, b) => {
    const typeA = a.typeHazard?.nameTypeHazard || "";
    const typeB = b.typeHazard?.nameTypeHazard || "";
    const indexA = CATEGORY_ORDER.indexOf(typeA);
    const indexB = CATEGORY_ORDER.indexOf(typeB);
    
    if (indexA !== -1 && indexB !== -1) {
      if (indexA === indexB) {
        return (a.nameHazard || "").localeCompare(b.nameHazard || "");
      }
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return typeA.localeCompare(typeB);
  });

  useEffect(() => {
    setAreas(processAreas(reportData.areas));
  }, [reportData]);

  const handleCellClick = (areaIndex, subAreaIndex, hazardId, type, value) => {
    setAreas(prevAreas => {
      const newAreas = [...prevAreas];
      const subArea = { ...newAreas[areaIndex].subAreas[subAreaIndex] };
      subArea.ponderations = [...subArea.ponderations];

      let ponderationIndex = subArea.ponderations.findIndex(p => p.hazard.idHazard === hazardId);

      if (ponderationIndex === -1) {
        const hazard = hazards.find(h => h.idHazard === hazardId);
        const newPonderation = {
          idPonderation: Date.now(),
          idSubArea: subArea.idSubArea,
          hazard: hazard,
          impact: 1,
          probability: 1,
          ponderationScore: 1
        };
        subArea.ponderations.push(newPonderation);
        ponderationIndex = subArea.ponderations.length - 1;
      }

      const ponderation = { ...subArea.ponderations[ponderationIndex] };
      if (type === 'impact') ponderation.impact = value;
      if (type === 'probability') ponderation.probability = value;
      ponderation.ponderationScore = (ponderation.impact || 0) * (ponderation.probability || 0);

      subArea.ponderations[ponderationIndex] = ponderation;
      newAreas[areaIndex].subAreas[subAreaIndex] = subArea;

      return newAreas;
    });
  };

  const calculateTotal = (hazardId) => {
    let total = 0;
    areas.forEach(area => {
      area.subAreas.forEach(subArea => {
        const pond = subArea.ponderations.find(p => p.hazard.idHazard === hazardId);
        if (pond) {
          total += (pond.ponderationScore || 0);
        }
      });
    });
    return total;
  };

  const calculateMaxTotal = () => {
    let totalSubAreas = 0;
    areas.forEach(area => {
      if (area.subAreas) {
        totalSubAreas += area.subAreas.length;
      }
    });
    return totalSubAreas * 16;
  };

  const getRiskLevelClass = (score, maxScore) => {
    if (maxScore === 0) return 'risk-low';
    const percentage = score / maxScore;
    if (percentage >= 0.6) return 'risk-high';
    if (percentage >= 0.4) return 'risk-med-high';
    if (percentage >= 0.2) return 'risk-med-low';
    return 'risk-low';
  };

  const getHazardTypeClass = (typeName) => {
    if (!typeName) return '';
    const upper = typeName.toUpperCase();
    if (upper.includes("TERRORISMO") || upper.includes("FACTOR HUMANO")) return "hazard-terror";
    if (upper.includes("AMBIENTE EXTERNO")) return "hazard-external";
    if (upper.includes("INDUSTRIALES")) return "hazard-industrial";
    if (upper.includes("NATURALES")) return "hazard-natural";
    if (upper.includes("OCUPACIONALES")) return "hazard-occupational";
    return "";
  };

  const handleSave = () => {
    const updatedReport = {
      ...reportData,
      areas: areas
    };

    updatePonderation(true, updatedReport, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "¡Guardado con éxito!",
          text: "La matriz de ponderación se ha actualizado correctamente.",
          confirmButtonColor: '#3085d6',
          timer: 2000,
        }).then(() => {
          if (onClose) onClose();
        });
      },
      onError: (error) => {
        console.error("Error updating ponderation:", error);
        Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: error?.response?.data?.message || "Ocurrió un error inesperado al guardar la matriz.",
          confirmButtonColor: '#d33',
        });
      }
    });
  };

  return (
    <div className="ponderation-report-container">
      <div className="report-header">
        <h2 className="report-title">Matriz de Ponderación de Amenazas</h2>
        <button className="save-button" onClick={handleSave}>
          <svg className="save-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar Cambios
        </button>
      </div>
      <div className="table-responsive">
        <table className="ponderation-table">
          <thead>
            <tr>
              <th colSpan="2" rowSpan="3" className="corner-header">Elementos sujetos a Amenazas</th>
              {hazards.map(hazard => (
                <th key={hazard.idHazard} colSpan="10" className={`hazard-header ${getHazardTypeClass(hazard.typeHazard?.nameTypeHazard)}`}>
                  <div className="hazard-type">{hazard.typeHazard.nameTypeHazard}</div>
                  <div className="hazard-name">{hazard.nameHazard}</div>
                </th>
              ))}
            </tr>
            <tr>
              {hazards.map(hazard => (
                <React.Fragment key={`subhead-${hazard.idHazard}`}>
                  <th colSpan="4" className="impact-header">Impacto</th>
                  <th colSpan="4" className="probability-header">Probabilidad</th>
                  <th rowSpan="2" className="score-header">Ponderación</th>
                  <th rowSpan="2" className="max-score-header">Puntuación<br />máxima</th>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              {hazards.map(hazard => (
                <React.Fragment key={`levels-${hazard.idHazard}`}>
                  <th className="level-col section-start" title="Muy Alto"><span className="vertical-text">Muy Alto</span></th>
                  <th className="level-col" title="Alto"><span className="vertical-text">Alto</span></th>
                  <th className="level-col" title="Medio"><span className="vertical-text">Medio</span></th>
                  <th className="level-col" title="Bajo"><span className="vertical-text">Bajo</span></th>

                  <th className="level-col prob-start" title="Muy Alta"><span className="vertical-text">Muy Alta</span></th>
                  <th className="level-col" title="Alta"><span className="vertical-text">Alta</span></th>
                  <th className="level-col" title="Media"><span className="vertical-text">Media</span></th>
                  <th className="level-col" title="Baja"><span className="vertical-text">Baja</span></th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {areas.map((area, aIndex) => (
              <React.Fragment key={area.idArea}>
                <tr className="area-row">
                  <td colSpan="2" className="area-name"><strong>{aIndex + 1}. {area.areaName}</strong></td>
                  {hazards.map(hazard => (
                    <React.Fragment key={`empty-${hazard.idHazard}`}>
                      <td colSpan="4" className="area-empty-cells section-start"></td>
                      <td colSpan="4" className="area-empty-cells prob-start"></td>
                      <td className="area-empty-cells score-start"></td>
                      <td className="area-empty-cells"></td>
                    </React.Fragment>
                  ))}
                </tr>
                {area.subAreas.map((subArea, saIndex) => (
                  <tr key={subArea.idSubArea} className="subarea-row">
                    <td className="subarea-indent"></td>
                    <td className="subarea-name">{aIndex + 1}.{saIndex + 1}. {subArea.nameSubArea}</td>

                    {hazards.map(hazard => {
                      const pond = subArea.ponderations.find(p => p.hazard.idHazard === hazard.idHazard);
                      const imp = pond ? pond.impact : 0;
                      const prob = pond ? pond.probability : 0;
                      const score = pond ? pond.ponderationScore : 0;

                      return (
                        <React.Fragment key={`cells-${subArea.idSubArea}-${hazard.idHazard}`}>
                          {/* Impacto: 4, 3, 2, 1 */}
                          <td className={`clickable-cell section-start ${imp === 4 ? 'selected level-4' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'impact', 4)}></td>
                          <td className={`clickable-cell ${imp === 3 ? 'selected level-3' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'impact', 3)}></td>
                          <td className={`clickable-cell ${imp === 2 ? 'selected level-2' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'impact', 2)}></td>
                          <td className={`clickable-cell ${imp === 1 ? 'selected level-1' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'impact', 1)}></td>

                          {/* Probabilidad: 4, 3, 2, 1 */}
                          <td className={`clickable-cell prob-start ${prob === 4 ? 'selected level-4' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'probability', 4)}></td>
                          <td className={`clickable-cell ${prob === 3 ? 'selected level-3' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'probability', 3)}></td>
                          <td className={`clickable-cell ${prob === 2 ? 'selected level-2' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'probability', 2)}></td>
                          <td className={`clickable-cell ${prob === 1 ? 'selected level-1' : ''}`} onClick={() => handleCellClick(aIndex, saIndex, hazard.idHazard, 'probability', 1)}></td>

                          <td className="score-cell score-start">{score > 0 ? score : ''}</td>
                          <td className="max-score-cell">16</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="2" className="total-label"><strong>Totales</strong></td>
              {hazards.map(hazard => {
                const totalScore = calculateTotal(hazard.idHazard);
                const maxTotal = calculateMaxTotal();
                const riskClass = getRiskLevelClass(totalScore, maxTotal);

                return (
                  <React.Fragment key={`total-${hazard.idHazard}`}>
                    <td colSpan="4" className="total-empty-cells section-start"></td>
                    <td colSpan="4" className="total-empty-cells prob-start"></td>
                    <td className={`total-score-cell score-start ${riskClass}`}><strong>{totalScore}</strong></td>
                    <td className={`total-max-score-cell ${riskClass}`}><strong>{maxTotal}</strong></td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
