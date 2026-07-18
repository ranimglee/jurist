package com.onat.jurist.lawyer.service;

import com.onat.jurist.lawyer.entity.*;
import com.onat.jurist.lawyer.repository.AdminNotificationRepository;
import com.onat.jurist.lawyer.repository.AffaireRepository;
import com.onat.jurist.lawyer.repository.AvocatRepository;
import com.onat.jurist.lawyer.repository.EmailNotificationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AcceptanceServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @Mock
    private AffaireRepository affaireRepo;

    @Mock
    private AvocatRepository avocatRepo;

    @Mock
    private EmailNotificationRepository emailRepo;

    @Mock
    private AffaireAssignmentService assignmentService;

    @Mock
    private AdminNotificationRepository adminNotificationRepo;

    @InjectMocks
    private AcceptanceService service;


    // Helper
    private Affaire affaire(Long id, Avocat av) {
        Affaire a = new Affaire();
        a.setId(id);
        a.setAvocatAssigne(av);
        return a;
    }


    // -------------------------------------------------------------------------
    // ACCEPTATION
    // -------------------------------------------------------------------------
    @Test
    void shouldAcceptAffaire() {
        Avocat av = new Avocat();
        av.setId(1L);
        av.setAffairesAcceptees(0);
        av.setAffairesEnCours(0);

        Affaire af = affaire(10L, av);

        EmailNotification notif = new EmailNotification();
        notif.setAffaire(af);
        notif.setAvocat(av);

        when(affaireRepo.findById(10L)).thenReturn(Optional.of(af));
        when(avocatRepo.findById(1L)).thenReturn(Optional.of(av));
        when(emailRepo.findByAffaireAndAvocat(af, av)).thenReturn(Optional.of(notif));

        service.acceptAffaire(10L, 1L);

        assertThat(af.getStatut()).isEqualTo(StatutAffaire.ACCEPTEE);
        assertThat(av.getAffairesEnCours()).isEqualTo(1);
        assertThat(av.getAffairesAcceptees()).isEqualTo(1);
        assertThat(notif.isAccepted()).isTrue();

        verify(adminNotificationRepo).save(any(AdminNotification.class));
    }


    // -------------------------------------------------------------------------
    // REFUS
    // -------------------------------------------------------------------------
    @Test
    void shouldRefuseAffaireAndReassignToNext() {
        Avocat av = new Avocat();
        av.setId(1L);
        av.setAffairesRefusees(0);

        Affaire af = affaire(11L, av);

        EmailNotification notif = new EmailNotification();
        notif.setAffaire(af);
        notif.setAvocat(av);

        when(affaireRepo.findById(11L)).thenReturn(Optional.of(af));
        when(avocatRepo.findById(1L)).thenReturn(Optional.of(av));
        when(emailRepo.findByAffaireAndAvocat(af, av)).thenReturn(Optional.of(notif));

        service.refuseAffaire(11L, 1L);

        assertThat(av.getAffairesRefusees()).isEqualTo(1);
        assertThat(af.getAvocatAssigne()).isNull();
        assertThat(notif.isAccepted()).isFalse();

        verify(adminNotificationRepo).save(any(AdminNotification.class));
        verify(assignmentService).assignBestLawyer(af);
    }


    // -------------------------------------------------------------------------
    // TOKEN VALIDATION
    // -------------------------------------------------------------------------
    @Test
    void shouldValidateToken() {
        EmailNotification notif = new EmailNotification();
        Affaire af = affaire(100L, null);
        notif.setAffaire(af);
        notif.setActionToken("abc123");
        notif.setTokenExpiry(LocalDateTime.now().plusMinutes(30));

        when(emailRepo.findByActionToken("abc123")).thenReturn(Optional.of(notif));

        assertThat(service.verifyToken(100L, "abc123")).isTrue();
    }

    @Test
    void shouldRejectExpiredToken() {
        EmailNotification notif = new EmailNotification();
        notif.setActionToken("t1");
        notif.setTokenExpiry(LocalDateTime.now().minusMinutes(2));
        notif.setAffaire(affaire(200L, null));

        when(emailRepo.findByActionToken("t1")).thenReturn(Optional.of(notif));

        assertThat(service.verifyToken(200L, "t1")).isFalse();
    }
}
