package com.onat.jurist.lawyer.repository;

import com.onat.jurist.lawyer.entity.AideJudiciaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AideJudiciaireRepository extends JpaRepository<AideJudiciaire, Long> {

    boolean existsByNumeroDossier(String numeroDossier);

    Optional<AideJudiciaire> findByNumeroDossier(String numeroDossier);

    List<AideJudiciaire> findAllByAvocatAssigneId(Long avocatId);

    long countByAvocatAssigneId(Long avocatId);

    @Query("SELECT MAX(aj.assignedAt) FROM AideJudiciaire aj WHERE aj.avocatAssigne.id = :avocatId")
    LocalDateTime findLastAssignmentDateByAvocatId(@Param("avocatId") Long avocatId);
}
