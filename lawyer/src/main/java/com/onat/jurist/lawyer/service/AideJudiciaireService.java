package com.onat.jurist.lawyer.service;

import com.onat.jurist.lawyer.dto.in.AideJudiciaireRequestDTO;
import com.onat.jurist.lawyer.dto.out.AideJudiciaireResponseDTO;
import com.onat.jurist.lawyer.dto.out.EligibleAvocatResponseDTO;
import com.onat.jurist.lawyer.entity.AideJudiciaire;
import com.onat.jurist.lawyer.entity.Avocat;
import com.onat.jurist.lawyer.exception.ResourceNotFoundException;
import com.onat.jurist.lawyer.repository.AideJudiciaireRepository;
import com.onat.jurist.lawyer.repository.AvocatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AideJudiciaireService {

    private final AideJudiciaireRepository repo;
    private final AvocatRepository avocatRepository;

    @Transactional
    public AideJudiciaireResponseDTO create(AideJudiciaireRequestDTO dto) {
        if (repo.existsByNumeroDossier(dto.getNumeroDossier())) {
            throw new IllegalArgumentException("Une aide judiciaire avec ce numéro de dossier existe déjà.");
        }

        Avocat avocat = null;
        LocalDateTime assignedAt = null;
        if (dto.getAvocatId() != null) {
            avocat = avocatRepository.findById(dto.getAvocatId())
                    .orElseThrow(() -> new EntityNotFoundException("Avocat non trouvé"));
            if (!avocat.isAccepteAideJudiciaire()) {
                throw new IllegalArgumentException("Cet avocat n'accepte pas l'aide judiciaire.");
            }
            assignedAt = LocalDateTime.now();
        }

        AideJudiciaire aj = AideJudiciaire.builder()
                .numeroDossier(dto.getNumeroDossier())
                .cour(dto.getCour())
                .circuit(dto.getCircuit())
                .nomDemandeur(dto.getNomDemandeur())
                .dateDecision(dto.getDateDecision())
                .dateAudience(dto.getDateAudience())
                .avocatAssigne(avocat)
                .assignedAt(assignedAt)
                .build();

        repo.save(aj);
        log.info("🆕 Legal aid created: {}", aj.getNumeroDossier());
        return mapToDTO(aj);
    }

    public List<AideJudiciaireResponseDTO> getAll() {
        return repo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public AideJudiciaireResponseDTO getById(Long id) {
        AideJudiciaire aj = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aide judiciaire non trouvée avec l'id: " + id));
        return mapToDTO(aj);
    }

    @Transactional
    public AideJudiciaireResponseDTO update(Long id, AideJudiciaireRequestDTO dto) {
        AideJudiciaire aj = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aide judiciaire non trouvée avec l'id: " + id));

        // If number changed, check uniqueness
        if (!aj.getNumeroDossier().equals(dto.getNumeroDossier()) && repo.existsByNumeroDossier(dto.getNumeroDossier())) {
            throw new IllegalArgumentException("Une aide judiciaire avec ce numéro de dossier existe déjà.");
        }

        aj.setNumeroDossier(dto.getNumeroDossier());
        aj.setCour(dto.getCour());
        aj.setCircuit(dto.getCircuit());
        aj.setNomDemandeur(dto.getNomDemandeur());
        aj.setDateDecision(dto.getDateDecision());
        aj.setDateAudience(dto.getDateAudience());

        if (dto.getAvocatId() != null) {
            if (aj.getAvocatAssigne() == null || !aj.getAvocatAssigne().getId().equals(dto.getAvocatId())) {
                Avocat avocat = avocatRepository.findById(dto.getAvocatId())
                        .orElseThrow(() -> new EntityNotFoundException("Avocat non trouvé"));
                if (!avocat.isAccepteAideJudiciaire()) {
                    throw new IllegalArgumentException("Cet avocat n'accepte pas l'aide judiciaire.");
                }
                aj.setAvocatAssigne(avocat);
                aj.setAssignedAt(LocalDateTime.now());
            }
        } else {
            aj.setAvocatAssigne(null);
            aj.setAssignedAt(null);
        }

        repo.save(aj);
        log.info("✏️ Updated legal aid: {}", aj.getNumeroDossier());
        return mapToDTO(aj);
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Aide judiciaire non trouvée avec l'id: " + id);
        }
        repo.deleteById(id);
        log.info("🗑️ Deleted legal aid with id: {}", id);
    }

    @Transactional
    public AideJudiciaireResponseDTO assignLawyer(Long id, Long avocatId) {
        AideJudiciaire aj = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aide judiciaire non trouvée avec l'id: " + id));

        if (avocatId == null) {
            aj.setAvocatAssigne(null);
            aj.setAssignedAt(null);
        } else {
            Avocat avocat = avocatRepository.findById(avocatId)
                    .orElseThrow(() -> new EntityNotFoundException("Avocat non trouvé"));
            if (!avocat.isAccepteAideJudiciaire()) {
                throw new IllegalArgumentException("Cet avocat n'accepte pas l'aide judiciaire.");
            }
            aj.setAvocatAssigne(avocat);
            aj.setAssignedAt(LocalDateTime.now());
        }

        repo.save(aj);
        log.info("🧑 Manually assigned lawyer id: {} to legal aid: {}", avocatId, aj.getNumeroDossier());
        return mapToDTO(aj);
    }

    public List<EligibleAvocatResponseDTO> getEligibleLawyersSortedByPriority() {
        List<Avocat> eligibleAvocats = avocatRepository.findByAccepteAideJudiciaireTrue();

        List<EligibleAvocatResponseDTO> dtoList = eligibleAvocats.stream()
                .map(avocat -> {
                    long count = repo.countByAvocatAssigneId(avocat.getId());
                    LocalDateTime lastAssigned = repo.findLastAssignmentDateByAvocatId(avocat.getId());
                    return EligibleAvocatResponseDTO.builder()
                            .id(avocat.getId())
                            .nom(avocat.getNom())
                            .prenom(avocat.getPrenom())
                            .identifiant(avocat.getIdentifiant())
                            .email(avocat.getEmail())
                            .telephone(avocat.getTelephone())
                            .region(avocat.getRegion())
                            .aideJudiciaireCount(count)
                            .lastAssignedAt(lastAssigned)
                            .build();
                })
                .collect(Collectors.toList());

        // Sort: count ascending, then lastAssignedAt ascending (nulls first)
        dtoList.sort((a, b) -> {
            int compareCount = Long.compare(a.getAideJudiciaireCount(), b.getAideJudiciaireCount());
            if (compareCount != 0) {
                return compareCount;
            }
            if (a.getLastAssignedAt() == null && b.getLastAssignedAt() == null) {
                return 0;
            }
            if (a.getLastAssignedAt() == null) {
                return -1; // nulls first
            }
            if (b.getLastAssignedAt() == null) {
                return 1;
            }
            return a.getLastAssignedAt().compareTo(b.getLastAssignedAt());
        });

        // Set priority score dynamically based on position (1 = highest priority)
        for (int i = 0; i < dtoList.size(); i++) {
            dtoList.get(i).setPriorityScore(i + 1);
        }

        return dtoList;
    }

    private AideJudiciaireResponseDTO mapToDTO(AideJudiciaire aj) {
        aj.updateStatusAndDates();
        return AideJudiciaireResponseDTO.builder()
                .id(aj.getId())
                .numeroDossier(aj.getNumeroDossier())
                .cour(aj.getCour())
                .circuit(aj.getCircuit())
                .nomDemandeur(aj.getNomDemandeur())
                .dateDecision(aj.getDateDecision())
                .dateAudience(aj.getDateAudience())
                .assignedAt(aj.getAssignedAt())
                .status(aj.getStatus())
                .avocatId(aj.getAvocatAssigne() != null ? aj.getAvocatAssigne().getId() : null)
                .avocatNom(aj.getAvocatAssigne() != null ? aj.getAvocatAssigne().getNom() + " " + aj.getAvocatAssigne().getPrenom() : null)
                .build();
    }
}
