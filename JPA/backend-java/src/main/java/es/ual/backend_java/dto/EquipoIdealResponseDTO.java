package es.ual.backend_java.dto;

import lombok.Data;
import java.util.List;

@Data
public class EquipoIdealResponseDTO {
    private String formacion;
    private List<JugadorSeleccionadoDTO> once_ideal;
    private String analisis_tactico;
}