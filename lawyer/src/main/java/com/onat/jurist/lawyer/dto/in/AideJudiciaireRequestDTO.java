package com.onat.jurist.lawyer.dto.in;

import com.onat.jurist.lawyer.entity.Circuit;
import com.onat.jurist.lawyer.entity.Cour;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AideJudiciaireRequestDTO {

    @NotBlank(message = "Le numéro de dossier est obligatoire")
    private String numeroDossier;

    @NotNull(message = "La cour est obligatoire")
    private Cour cour;

    @NotNull(message = "Le circuit est obligatoire")
    private Circuit circuit;

    @NotBlank(message = "Le nom du demandeur est obligatoire")
    private String nomDemandeur;

    @NotNull(message = "La date de décision est obligatoire")
    private LocalDate dateDecision;

    @NotNull(message = "La date d'audience est obligatoire")
    private LocalDate dateAudience;

    private Long avocatId;
}
