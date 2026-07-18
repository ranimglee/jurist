package com.onat.jurist.lawyer.dto.out;

import com.onat.jurist.lawyer.entity.Circuit;
import com.onat.jurist.lawyer.entity.Cour;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AideJudiciaireResponseDTO {
    private Long id;
    private String numeroDossier;
    private Cour cour;
    private Circuit circuit;
    private String nomDemandeur;
    private LocalDate dateDecision;
    private LocalDate dateAudience;
    private LocalDateTime assignedAt;
    private Long avocatId;
    private String avocatNom;
    private com.onat.jurist.lawyer.entity.AideJudiciaireStatus status;
}
