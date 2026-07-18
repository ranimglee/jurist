package com.onat.jurist.lawyer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "aides_judiciaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AideJudiciaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String numeroDossier;

    @Enumerated(EnumType.STRING)
    private Cour cour;

    @Enumerated(EnumType.STRING)
    private Circuit circuit;

    private String nomDemandeur;

    private LocalDate dateDecision;

    private LocalDate dateAudience;

    private LocalDateTime assignedAt;

    @ManyToOne
    @JoinColumn(name = "avocat_id")
    private Avocat avocatAssigne;

    @Enumerated(EnumType.STRING)
    private AideJudiciaireStatus status;

    @PrePersist
    @PreUpdate
    public void updateStatusAndDates() {
        if (this.avocatAssigne != null) {
            this.status = AideJudiciaireStatus.ASSIGNED;
            if (this.assignedAt == null) {
                this.assignedAt = LocalDateTime.now();
            }
        } else {
            this.status = AideJudiciaireStatus.UNASSIGNED;
            this.assignedAt = null;
        }
    }
}