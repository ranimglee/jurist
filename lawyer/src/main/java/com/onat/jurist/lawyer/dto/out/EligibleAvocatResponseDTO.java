package com.onat.jurist.lawyer.dto.out;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EligibleAvocatResponseDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String identifiant;
    private String email;
    private String telephone;
    private String region;
    private long aideJudiciaireCount;
    private LocalDateTime lastAssignedAt;
    private int priorityScore; // Dynamic score: e.g. lower count and older assignment = higher rank
}
