import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Language = "fr" | "ar";

type Translations = Record<Language, Record<string, string>>;

const translations: Translations = {
  fr: {
    "lang.fr": "Français",
    "lang.ar": "العربية",
    
    "charts.monthlyTrends.title": "Évolution mensuelle",
  "charts.monthlyTrends.cases": "Affaires créées",
  "charts.monthlyTrends.completed": "Affaires terminées",

  "month.jan": "Jan",
  "month.feb": "Fév",
  "month.mar": "Mar",
  "month.apr": "Avr",
  "month.may": "Mai",
  "month.jun": "Juin",
    // Navbar
    "navbar.account": "Mon Compte",
    "navbar.changePassword": "Changer le mot de passe",
    "navbar.logout": "Se déconnecter",
    "navbar.logout.success": "Déconnexion réussie",

    // Login
    "login.title": "Responsable Distribution",
    "login.subtitle": "Accès sécurisé à votre espace professionnel",
    "login.email": "Email",
    "login.email.placeholder": "votre@email.com",
    "login.password": "Mot de passe",
    "login.password.placeholder": "••••••••",
    "login.remember": "Se souvenir",
    "login.forgot": "Mot de passe oublié ?",
    "login.submit": "Se connecter",
    "login.footer": "© 2026 Ordre National Des Avocats De Tunisie. Tous droits réservés.",
    "login.ssl": "Connexion sécurisée SSL",
    "login.fillAll": "Veuillez remplir tous les champs",
    "login.invalid": "Identifiants incorrects",
    "login.success": "Connexion réussie",
    "login.error": "Erreur lors de la connexion",

    // Auth
    "auth.checking": "Vérification de l'authentification...",

    // Home / Index
    "home.hero.title": "Ordre National des Avocats de Tunisie",
    "home.hero.subtitle": "Au service de la justice, de l'équité et de l'État de droit",
    "home.hero.admin": "Espace Administrateur",
    "home.hero.more": "En savoir plus",

    "home.mission.title": "Notre Mission",
    "home.mission.text":
      "L'Ordre National des Avocats de Tunisie est l'instance représentative de la profession d'avocat, garante de l'éthique, de l'indépendance et de l'excellence dans l'exercice du droit.",
    "home.mission.card1.title": "Justice et Équité",
    "home.mission.card1.text":
      "Défendre les droits fondamentaux et garantir l'accès à une justice équitable pour tous les citoyens.",
    "home.mission.card2.title": "Excellence Professionnelle",
    "home.mission.card2.text":
      "Promouvoir la formation continue et l'excellence dans l'exercice de la profession d'avocat.",
    "home.mission.card3.title": "État de Droit",
    "home.mission.card3.text":
      "Contribuer au renforcement de l'État de droit et au respect des principes démocratiques.",

    "home.services.title": "Services en Ligne",
    "home.services.subtitle": "Accédez à nos services numériques pour une gestion moderne et efficace",
    "home.services.lawyers.title": "Annuaire des Avocats",
    "home.services.lawyers.text":
      "Consultez la liste complète des avocats inscrits et leurs spécialités",
    "home.services.cases.title": "Gestion des Affaires",
    "home.services.cases.text": "Système de gestion et d'assignation des affaires juridiques",

    "home.contact.title": "Nous Contacter",
    "home.contact.subtitle": "L'Ordre National des Avocats de Tunisie est à votre écoute",
    "home.contact.phone": "Téléphone",
    "home.contact.email": "Email",
    "home.contact.address": "Adresse",

  "pdf.title": "Dossier Juridique",
  "pdf.subtitle": "Document officiel - Affaire N° {{caseNumber}}",
  "pdf.caseType": "Type d'affaire",
  "pdf.creationDate": "Date de création",
  "pdf.courtDate": "Date d'audience",
  "pdf.currentStatus": "Statut actuel",
  "pdf.accusedName": "Nom de l'accusé",
  "pdf.lawyer": "Avocat assigné",
  "pdf.description": "Description de l'affaire",
  "pdf.notProvided": "Non renseigné",
  "pdf.noLawyer": "Aucun avocat assigné",
  "pdf.notScheduled": "Non planifiée",
  "pdf.generatedText": "Ce document est généré automatiquement...",
  "pdf.generatedOn": "Généré le {{date}}",
  "pdf.download": "Télécharger PDF",

  "status.en_attente": "En attente",
  "status.en_cours": "En cours",
  "status.acceptee": "Acceptée",
  "status.refusee": "Refusée",
  "status.cloturee": "Clôturée",

    "home.footer.about":
      "Ordre National des Avocats de Tunisie - Au service de la justice depuis toujours",
    "home.footer.links": "Liens Utiles",
    "home.footer.aboutLink": "À propos",
    "home.footer.news": "Actualités",
    "home.footer.publications": "Publications",
    "home.footer.contact": "Contact",
    "home.footer.legal": "Mentions Légales",
    "home.footer.terms": "Conditions d'utilisation",
    "home.footer.privacy": "Politique de confidentialité",
    "home.footer.mentions": "Mentions légales",
    "home.footer.copyright":
      "© 2026 Ordre National Des Avocats De Tunisie. Tous droits réservés.",

    // Sidebar / Layout
    "sidebar.organizationName":"Ordre National Des avocats de Nabeul",
    "sidebar.tagline": "Section Régionale des Avocats de Nabeul",
    "sidebar.nav.dashboard": "Dashboard",
    "sidebar.nav.lawyers": "Avocats",
    "sidebar.nav.cases": "Affaires",
    "sidebar.admin": "Admin",
    "sidebar.admin.email": "admin@onat.tn",
    "sidebar.logout": "Se déconnecter",
"charts.yearlyTrends.title": "Évolution annuelle des inscriptions des avocats",
      "charts.yearlyTrends.lawyers": "Avocats",
    
  
    // Dashboard
    "dashboard.title": "Tableau de bord",
    "dashboard.subtitle": "Vue d'ensemble de votre gestion juridique",
    "dashboard.stats.lawyers": "Avocats enregistrés",
    "dashboard.stats.casesTotal": "Affaires totales",
    "dashboard.stats.casesActive": "Affaires en cours",
    "dashboard.stats.casesCompleted": "Affaires terminées",
    "dashboard.stats.casesAssigned": "Affaires assignées",
    "dashboard.stats.casesUnassigned": "Affaires non assignées",
    "dashboard.stats.pendingCases": "Affaires en attente",

    // Lawyers page
    "lawyers.title": "Gestion des avocats",
    "lawyers.subtitle": "Ajoutez, modifiez et gérez votre équipe d'avocats",
    "lawyers.add": "Ajouter un avocat",
    "lawyers.exportPdf": "Export PDF",
    "lawyers.exportExcel": "Export Excel",
    "lawyers.stats.total": "Total Avocats",
    "lawyers.stats.active": "Actifs",
    "lawyers.stats.specialties": "Spécialités",
    "lawyers.loading.title": "Chargement des données...",
    "lawyers.loading.subtitle": "Veuillez patienter un instant",
    "lawyers.empty.title": "Aucun avocat enregistré",
    "lawyers.empty.subtitle":
      "Commencez par ajouter votre premier avocat pour gérer votre équipe juridique",
    "lawyers.empty.button": "Ajouter votre premier avocat",
    "lawyers.list.title": "Liste des avocats",
    "lawyers.list.count": "{count} avocat{suffix} au total",
    "lawyers.toast.loadError": "Erreur lors du chargement des avocats",
    "lawyers.toast.saveError": "Erreur lors de l'enregistrement",
    "lawyers.toast.saveCreate": "Avocat ajouté avec succès",
    "lawyers.toast.saveUpdate": "Avocat modifié avec succès",
    "lawyers.toast.deleteSuccess": "Avocat supprimé avec succès",
    "lawyers.toast.deleteError": "Erreur lors de la suppression",
    "lawyers.toast.exportPdfSuccess": "PDF téléchargé !",
    "lawyers.toast.exportPdfError":
      "Erreur lors du téléchargement du PDF",
    "lawyers.toast.exportExcelSuccess": "Excel téléchargé !",
    "lawyers.toast.exportExcelError":
      "Erreur lors du téléchargement du fichier Excel",
"cases.modal.assignment": "Méthode d'affectation",
"cases.modal.assignment.automatic": "Automatique ",
"cases.modal.assignment.manual": "Manuelle",
"cases.modal.selectLawyer": "Sélectionner un avocat",  
"cases.modal.selectLawyerPlaceholder": "Choisissez un avocat...", 
      "lawyers.table.inProgress": "en cours",

  
    // Lawyers table
    "lawyers.table.searchPlaceholder":
      "Rechercher par nom, email ou région...",
    "lawyers.table.results": "{count} résultat{suffix}",
    "lawyers.table.empty.title": "Aucun avocat enregistré",
    "lawyers.table.empty.subtitle":
      "Commencez par créer votre premier avocat pour le voir apparaître ici.",
    "lawyers.table.emptyFiltered.title": "Aucun résultat trouvé",
    "lawyers.table.emptyFiltered.subtitle":
      "Essayez d'ajuster vos filtres de recherche pour trouver ce que vous cherchez.",
    "lawyers.table.resetFilters": "Réinitialiser les filtres",
    "lawyers.table.columns.name": "Nom & Prénom",
    "lawyers.table.columns.identifiant": "Numéro d'inscription",

        "common.thisMonth": "ce mois ",
  "charts.lawyerPerformance.title": "Performance des avocats",
  "charts.lawyerPerformance.legend.total": "Total",
  "charts.lawyerPerformance.legend.completed": "Terminées",
  "charts.lawyerPerformance.legend.active": "En cours",
    "lawyers.table.columns.contact": "Contact",
    "lawyers.table.columns.region": "Région",
    "lawyers.table.columns.registration": "Inscription",
    "lawyers.table.columns.cases": "Affaires",
    "lawyers.table.columns.performance": "Performance",
    "lawyers.table.columns.actions": "Actions",
     "charts.caseStatus.title": "Répartition des affaires",
     
  "case.status.en_attente": "En attente",
  "case.status.en_cours": "en_cours",
  "case.status.acceptee": "Acceptées",
  "case.status.cloturee": "Terminées",
  "case.status.refusee": "Refusée",

  "charts.casesByType.title": "Répartition par type d'affaire",
  "charts.casesByRegion.title": "Affaires par région",
  "charts.casesByRegion.legend.cases": "Affaires",
  "charts.lawyersByRegion.title": "Avocats par région",
  "charts.lawyersByRegion.legend.lawyers": "Avocats",
  "charts.monthlyCasesTrends.title": "Tendances mensuelles des affaires",
  "charts.monthlyCasesTrends.cases": "Affaires",

    // Lawyers modal
    "lawyers.modal.title.edit": "Modifier l'avocat",
    "lawyers.modal.title.create": "Ajouter un avocat",
    "lawyers.modal.subtitle.edit":
      "Mettez à jour les informations de l'avocat",
    "lawyers.modal.subtitle.create":
      "Remplissez les informations du nouvel avocat",
    "lawyers.modal.section.personal": "Informations personnelles",
    "lawyers.modal.section.contact": "Informations de contact",
    "lawyers.modal.section.location": "Localisation",
    "lawyers.modal.firstName": "Prénom",
    "lawyers.modal.identifiant": "Numéro d'inscription",
    "lawyers.modal.identifiant.placeholder": "Ex:00000",
    "lawyers.modal.firstName.placeholder": "Ex: Jean",
    "lawyers.modal.lastName": "Nom",
    "lawyers.modal.lastName.placeholder": "Ex: Dupont",
    "lawyers.modal.email": "Email",
    "lawyers.modal.email.placeholder": "exemple@email.com",
    "lawyers.modal.phone": "Téléphone",
    "lawyers.modal.phone.placeholder": "+216 12 345 678",
    "lawyers.modal.region": "Région",
    "lawyers.modal.region.placeholder": "Ex: Tunis",
    "lawyers.modal.address": "Adresse complète",
    "lawyers.modal.address.placeholder":
      "Ex: 123 Avenue Habib Bourguiba, Tunis",
    "lawyers.modal.registrationDate": "Date d'inscription",
    "lawyers.modal.registrationDate.help":
      "Date à laquelle l'avocat a rejoint le cabinet",
    "lawyers.modal.cancel": "Annuler",
    "lawyers.modal.save": "Enregistrer",
    "lawyers.modal.error.email": "Email invalide",
    "lawyers.modal.error.phone": "Numéro de téléphone invalide",
    "lawyers.modal.error.minChars": "Minimum 2 caractères",
"cases.modal.searchLawyer": "Rechercher un avocat...",
"cases.modal.noLawyerFound": "Aucun avocat trouvé",
"cases.modal.error.lawyerRequired": "Veuillez sélectionner un avocat",
"cases.modal.assignmentLocked": "Impossible de changer l'avocat assigné sauf si le statut est en attente",
    // Cases page
    "cases.title": "Gestion des affaires",
    "cases.subtitle":
      "Créez et gérez les affaires judiciaires en toute simplicité",
    "cases.new": "Nouvelle affaire",
    "cases.stats.total": "Total des affaires",
    "cases.stats.en_attente": "En attente",
    "cases.stats.acceptee": "Acceptées",
    "cases.stats.cloturee": "Terminées",
    "cases.list.title": "Liste des affaires",
    "cases.list.count": "{count} affaire{suffix} au total",
    "cases.toast.loadError": "Erreur de chargement des affaires",
    "cases.toast.deleteSuccess": "Affaire supprimée",
    "cases.toast.deleteError": "Erreur lors de la suppression",
    "cases.toast.updateError": "Erreur lors de la modification",
    "cases.toast.updateSuccess": "Affaire modifiée",
    "cases.toast.createError": "Erreur lors de la création",
    "cases.toast.createSuccess": "Affaire créée",
    "cases.toast.saveError": "Erreur lors de l'enregistrement",

    // Cases table
    "cases.table.searchPlaceholder":
      "Rechercher par numéro, titre, type ou avocat...",
    "cases.table.status.all": "Tous les statuts",
    "cases.table.loading": "Chargement...",
    "cases.table.results": "{count} résultat{suffix}",
    "cases.table.empty.title": "Aucune affaire enregistrée",
    "cases.table.empty.subtitle":
      "Commencez par créer votre première affaire pour la voir apparaître ici.",
    "cases.table.emptyFiltered.title": "Aucun résultat trouvé",
    "cases.table.emptyFiltered.subtitle":
      "Essayez d'ajuster vos filtres de recherche pour trouver ce que vous cherchez.",
    "cases.table.resetFilters": "Réinitialiser les filtres",
    "cases.table.columns.number": "N° Affaire",
    "cases.table.columns.title": "Accusation",
    "cases.table.columns.type": "Type",
    "cases.table.columns.courtDate": "Audience",
    "cases.table.columns.status": "Statut",
    "cases.table.columns.lawyer": "Avocat assigné",
    "cases.table.columns.actions": "Actions",
    "cases.table.unassigned": "Non assigné",

    // Cases status labels
    "cases.status.en_attente": "En attente",
    "cases.status.en_cours": "En cours",
    "cases.status.acceptee": "Acceptée",
    "cases.status.refusee": "Refusée",
    "cases.status.cloturee": "Cloturée",

  "navbar.notifications": "Notifications",
    "navbar.noNotifications": "Aucune notification",
  
    // Cases modal
    "cases.modal.title.edit": "Modifier l'affaire",
    "cases.modal.title.create": "Créer une nouvelle affaire",
    "cases.modal.number": "Numéro",
    "cases.modal.number.placeholder": "Ex: AFF-2024-001",
    "cases.modal.title": "Accusation",
    "cases.modal.title.placeholder": "Ex: Affaire de fraude fiscale",
    "cases.modal.type": "Type d'affaire",
    "cases.modal.type.placeholder": "Sélectionnez un type",

    "cases.modal.type.criminel": "Criminel",
   "cases.modal.type.enquete": "Enquête",
  "cases.modal.type.enqueteur_preliminaire": "Enquêteur préliminaire",

    "cases.modal.accused": "Nom de l'accusé",
    "cases.modal.accused.placeholder": "Ex: Jean Dupont",
    "cases.modal.courtDate": "Date d'audience",
    "cases.modal.cancel": "Annuler",
    "cases.modal.save": "Enregistrer",
"cases.modal.saving": "Enregistrement en cours...",
    "cases.modal.error.numberRequired": "Numéro obligatoire",
    "cases.modal.error.titleRequired": "Titre obligatoire",
    "cases.modal.error.min3": "Minimum 3 caractères",
    "cases.modal.error.accusedRequired":
      "Nom de l'accusé obligatoire",
    "cases.modal.error.min2": "Minimum 2 caractères",
    "cases.modal.error.courtDateRequired":
      "Date d'audience obligatoire",

    // Forgot password
    "forgot.title": "Réinitialiser le mot de passe",
    "forgot.subtitle":
      "Entrez votre adresse email pour recevoir un lien de réinitialisation",
    "forgot.emailLabel": "Email",
    "forgot.emailPlaceholder": "votre@email.com",
    "forgot.submit": "Envoyer le lien",
    "forgot.backToLogin": "Retour à la page de connexion",
    "forgot.footer":
      "© 2026 Ordre National Des Avocats De Tunisie. Tous droits réservés.",
    "forgot.error.empty": "Veuillez entrer votre email",
    "forgot.error.request": "Erreur lors de l'envoi de la demande",
    "forgot.success": "Un email de réinitialisation a été envoyé !",
    "forgot.error.unknown": "Erreur inconnue",

    // Change password
    "password.header.title": "Sécurité du compte",
    "password.header.subtitle":
      "Modifiez votre mot de passe pour protéger votre compte",
    "password.notice.title": "Conseil de sécurité",
    "password.notice.text":
      "Utilisez un mot de passe unique que vous n'utilisez pas pour d'autres comptes. Changez votre mot de passe régulièrement pour maintenir la sécurité.",
    "password.current": "Mot de passe actuel",
    "password.current.placeholder": "Entrez votre mot de passe actuel",
    "password.new": "Nouveau mot de passe",
    "password.new.placeholder": "Entrez votre nouveau mot de passe",
    "password.strength.label": "Force du mot de passe:",
    "password.strength.weak": "Faible",
    "password.strength.medium": "Moyen",
    "password.strength.good": "Bon",
    "password.strength.excellent": "Excellent",
    "password.requirements.title": "Votre mot de passe doit contenir:",
    "password.requirements.length": "Au moins 8 caractères",
    "password.requirements.uppercase": "Une lettre majuscule",
    "password.requirements.lowercase": "Une lettre minuscule",
    "password.requirements.number": "Un chiffre",
    "password.requirements.special":
      "Un caractère spécial (!@#$%...)",
    "password.confirm": "Confirmer le nouveau mot de passe",
    "password.confirm.placeholder":
      "Confirmez votre nouveau mot de passe",
    "password.confirm.mismatch": "Les mots de passe ne correspondent pas",
    "password.confirm.match": "Les mots de passe correspondent",
    "password.submit.loading": "Chargement...",
    "password.submit.label": "Changer le mot de passe",
    "password.cancel": "Annuler",
    "password.error.empty": "Veuillez remplir tous les champs",
    "password.error.mismatch":
      "Les nouveaux mots de passe ne correspondent pas",
    "password.error.weak":
      "Votre mot de passe n'est pas assez fort",
    "password.success": "Mot de passe changé avec succès !",
    "password.error.generic":
      "Erreur lors du changement de mot de passe",
    "password.tips.title": "Conseils de sécurité supplémentaires",
    "password.tips.1":
      "N'utilisez jamais le même mot de passe pour plusieurs comptes",
    "password.tips.2":
      "Activez l'authentification à deux facteurs pour une sécurité accrue",
    "password.tips.3":
      "Changez votre mot de passe tous les 3 à 6 mois",
    "password.tips.4":
      "Utilisez un gestionnaire de mots de passe pour les stocker en toute sécurité",

    // Not found
    "notfound.title": "404",
    "notfound.message": "Oups ! Page introuvable",
    "notfound.back": "Retour à l'accueil",
      "reset.title": "Réinitialiser le mot de passe",
  "reset.subtitle": "Entrez un nouveau mot de passe pour votre compte",
  "reset.newPassword": "Nouveau mot de passe",
  "reset.newPasswordPlaceholder": "Entrez votre nouveau mot de passe",
  "reset.confirmPassword": "Confirmer le mot de passe",
  "reset.confirmPasswordPlaceholder": "Confirmez votre mot de passe",
  "reset.submit": "Réinitialiser le mot de passe",
  "reset.backToLogin": "Retour à la connexion",
  "reset.footer": "© 2026 Ordre National Des Avocats De Tunisie. Tous droits réservés.",

  "reset.successTitle": "Succès",
  "reset.success": "Votre mot de passe a été réinitialisé avec succès.",

  "reset.error.title": "Erreur",
  "reset.error.empty": "Veuillez remplir tous les champs.",
  "reset.error.mismatch": "Les mots de passe ne correspondent pas.",
  "reset.error.request": "Impossible de réinitialiser le mot de passe.",
  "reset.error.unknown": "Une erreur inconnue est survenue.",

  "lawyerDetails.contactInfo": "Informations de contact",
  "lawyerDetails.email": "Email",
  "lawyerDetails.phone": "Téléphone",
  "lawyerDetails.region": "Région",
  "lawyerDetails.address": "Adresse",
  "lawyerDetails.assignedCases": "Affaires assignées",
  "lawyerDetails.noCases": "Aucune affaire assignée",
  "lawyerDetails.loadingCases": "Chargement des affaires...",
  "lawyerDetails.error": "Erreur",
  "lawyerDetails.lawyer": "Avocat",
  "lawyerDetails.close": "Fermer",
  "lawyerDetails.createdOn": "Créé le",
  "lawyerDetails.courtDate": "Audience",

   "deleteLawyerModal.title": "Confirmer la suppression",
  "deleteLawyerModal.message": "Voulez-vous vraiment supprimer l'avocat {name} ?",
  "deleteLawyerModal.cancel": "Annuler",
  "deleteLawyerModal.confirm": "Supprimer",
   "deleteCaseModal.title": "Confirmer la suppression",
  "deleteCaseModal.message": "Voulez-vous vraiment supprimer l'affaire {caseNumber} ?",
  "deleteCaseModal.cancel": "Annuler",
  "deleteCaseModal.confirm": "Supprimer",
    "pdfModal.title": "Dossier Juridique",
  "pdfModal.ref": "Document officiel - Affaire N° {caseNumber}",
  "pdfModal.caseType": "Type d'affaire",
  "pdfModal.createdAt": "Date de création",
  "pdfModal.courtDate": "Date d'audience",
  "pdfModal.status": "Statut actuel",
  "pdfModal.accusedName": "Nom de l'accusé",
  "pdfModal.assignedLawyer": "Avocat assigné",
  "pdfModal.description": "Description de l'affaire",
  "pdfModal.signature": "Signature numérique",
  "pdfModal.signatureText": "Signez ci-dessous pour authentifier ce document",
  "pdfModal.signatureSaved": "Signature enregistrée",
  "pdfModal.footerInfo": "Ce document est généré automatiquement et constitue un récapitulatif officiel de l'affaire. Généré le {dateTime}",
  "pdfModal.close": "Fermer",
  "pdfModal.download": "Télécharger PDF",
  "pdfModal.ready": "Document prêt à être téléchargé",
  "pdfModal.notPlanned": "Non planifiée",
  "cases.table.columns.sousType":"Sous-type",
  "cases.modal.sousType":"Sous-type ",
  "cases.modal.sousType.placeholder":" Sélectioner un sous-type",
"navbar.mute": "Couper le son",

      "cases.sousType.TRIBUNAL_PREMIERE_INSTANCE_NABEUL": "Tribunal de première instance de Nabeul",
      "cases.sousType.TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA": "Tribunal de première instance de Grombalia",
      "cases.sousType.COUR_APPEL_NABEUL": "Cour d’appel de Nabeul",
      "cases.sousType.NABEUL": "Nabeul",
      "cases.sousType.ZAGHOUAN": "Zaghouan",
      "cases.sousType.zaghouan": "Zaghouan",
      "cases.sousType.GROMBALIA": "Grombalia",
            "cases.sousType.tribunal_premiere_instance_nabeul": "Tribunal de première instance de Nabeul",
      "cases.sousType.tribunal_premiere_instance_grombalia": "Tribunal de première instance de Grombalia",
      "cases.sousType.cour_appel_nabeul": "Cour d’appel de Nabeul",
      "cases.sousType.nabeul": "Nabeul",
  
      "cases.sousType.grombalia": "Grombalia",
    
  "pagination.prev": "Précédent",
      
  "pagination.next": "Suivant",
      
  "pagination.pageOf": "Page {{current}} sur {{total}}",
  "cases.types.CRIMINEL": "Criminel",
  "cases.types.ENQUETE": "Enquête",
  "cases.types.ENQUETEUR_PRELIMINAIRE": "Enquête préliminaire",

  // Legal Aid (Aide Judiciaire) - French
  "sidebar.nav.aides": "Aides Judiciaires",
  "aides.title": "Aides Judiciaires",
  "aides.subtitle": "Gérez les dossiers d'aide judiciaire et attribuez-les aux avocats éligibles",
  "aides.new": "Nouvelle aide judiciaire",
  "aides.stats.total": "Total des aides",
  "aides.stats.assigned": "Assignées",
  "aides.stats.unassigned": "Non assignées",
  "aides.list.title": "Liste des dossiers d'aide judiciaire",
  "aides.list.count": "{count} dossier{suffix} au total",
  "aides.toast.loadError": "Erreur lors du chargement des aides judiciaires",
  "aides.toast.deleteSuccess": "Aide judiciaire supprimée avec succès",
  "aides.toast.deleteError": "Erreur lors de la suppression",
  "aides.toast.createSuccess": "Aide judiciaire créée avec succès",
  "aides.toast.updateSuccess": "Aide judiciaire modifiée avec succès",
  "aides.toast.saveError": "Erreur lors de l'enregistrement",
  "aides.toast.assignSuccess": "Avocat assigné avec succès",
  "aides.toast.assignError": "Erreur lors de l'assignation",
  "aides.table.searchPlaceholder": "Rechercher par numéro, demandeur...",
  "aides.table.columns.number": "N° Dossier",
  "aides.table.columns.applicant": "Demandeur",
  "aides.table.columns.court": "Tribunal / Cour",
  "aides.table.columns.circuit": "Circuit",
  "aides.table.columns.decisionDate": "Date Décision",
  "aides.table.columns.courtDate": "Audience",
  "aides.table.columns.lawyer": "Avocat assigné",
  "aides.table.columns.actions": "Actions",
  "aides.table.unassigned": "Non assignée",
  "aides.modal.title.create": "Créer une aide judiciaire",
  "aides.modal.title.edit": "Modifier l'aide judiciaire",
  "aides.modal.number": "Numéro de dossier",
  "aides.modal.number.placeholder": "Ex: AJ-2026-001",
  "aides.modal.applicant": "Nom du demandeur",
  "aides.modal.applicant.placeholder": "Ex: Kamel Ben Ali",
  "aides.modal.court": "Tribunal / Cour",
  "aides.modal.court.placeholder": "Sélectionnez un tribunal",
  "aides.modal.circuit": "Circuit",
  "aides.modal.circuit.placeholder": "Sélectionnez un circuit",
  "aides.modal.decisionDate": "Date de décision",
  "aides.modal.courtDate": "Date d'audience",
  "aides.modal.cancel": "Annuler",
  "aides.modal.save": "Enregistrer",
  "aides.modal.error.numberRequired": "Numéro obligatoire",
  "aides.modal.error.applicantRequired": "Nom du demandeur obligatoire",
  "aides.modal.error.courtRequired": "Cour obligatoire",
  "aides.modal.error.circuitRequired": "Circuit obligatoire",
  "aides.modal.error.decisionDateRequired": "Date de décision obligatoire",
  "aides.modal.error.courtDateRequired": "Date d'audience obligatoire",
  "aides.assign.modal.title": "Attribuer l'aide judiciaire",
  "aides.assign.modal.subtitle": "Sélectionnez un avocat éligible selon les critères d'équité et de priorité",
  "aides.assign.modal.columns.lawyer": "Avocat",
  "aides.assign.modal.columns.region": "Région",
  "aides.assign.modal.columns.count": "Total Aides",
  "aides.assign.modal.columns.lastAssigned": "Dernière attribution",
  "aides.assign.modal.columns.priority": "Priorité",
  "aides.assign.modal.columns.action": "Assigner",
  "aides.assign.modal.noEligible": "Aucun avocat éligible n'a été trouvé.",
  "aides.assign.modal.loading": "Chargement des avocats éligibles...",
  "aides.assign.modal.priority.high": "Haute",
  "aides.assign.modal.priority.medium": "Moyenne",
  "aides.assign.modal.priority.low": "Basse",
  "aides.cour.TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA": "Tribunal de 1ère instance de Grombalia",
  "aides.cour.TRIBUNAL_PREMIERE_INSTANCE_NABEUL": "Tribunal de 1ère instance de Nabeul",
  "aides.cour.COUR_APPEL_NABEUL": "Cour d'appel de Nabeul",
  "aides.cour.TRIBUNAL_NAHAIYA_GROMBALIA": "Tribunal cantonal de Grombalia",
  "aides.circuit.PENAL": "Pénal",
  "aides.circuit.CIVIL": "Civil",
  "aides.circuit.FAMILLE": "Famille",
  "aides.circuit.URGENT": "Référé (Urgent)",
  "deleteAideModal.title": "Confirmer la suppression",
  "deleteAideModal.message": "Voulez-vous vraiment supprimer le dossier {number} ?",
  "deleteAideModal.cancel": "Annuler",
  "deleteAideModal.confirm": "Supprimer",
  "aides.modal.assignLawyerOptional": "Assigner un avocat (optionnel)",
  "aides.modal.createAndAssign": "Créer et assigner",
  "aides.status.UNASSIGNED": "Non assigné",
  "aides.status.ASSIGNED": "Assigné",
  "aides.assign.modal.reassign": "Réassigner l'avocat",
  "aides.modal.selectLawyerPlaceholder": "Sélectionnez un avocat...",
  },
  ar: {
    "lang.fr": "Français",
    "lang.ar": "العربية",
    "cases.table.columns.sousType":"النوع الفرعي",
    "cases.modal.sousType":"النوع الفرعي",
    "cases.modal.sousType.placeholder": "اختر نوعًا فرعيًا",

  "pagination.prev": "السابق",
  "pagination.next": "التالي",
  "pagination.pageOf": "الصفحة {{current}} من {{total}}",


  "cases.sousType.tribunal_premiere_instance_nabeul": "المحكمة الابتدائية بنابل",
  "cases.sousType.tribunal_premiere_instance_grombalia": "المحكمة الابتدائية بڨرمبالية",
  "cases.sousType.COUR_APPEL_NABEUL": "محكمة الاستئناف بنابل",
   "cases.sousType.TRIBUNAL_PREMIERE_INSTANCE_NABEUL": "المحكمة الابتدائية بنابل",
  "cases.sousType.TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA": "المحكمة الابتدائية بڨرمبالية",
  "cases.sousType.cour_appel_nabeul": "محكمة الاستئناف بنابل",
  "cases.sousType.NABEUL": "نابل",
  "cases.sousType.nabeul": "نابل",
  "cases.sousType.ZAGHOUAN": "زغوان",
  "cases.sousType.zaghouan": "زغوان",

  "cases.sousType.GROMBALIA": "قرمبالية",
  "cases.sousType.grombalia": "قرمبالية",
  "pdfModal.title": "الملف القانوني",
  "pdfModal.ref": "وثيقة رسمية - القضية رقم {caseNumber}",
  "pdfModal.caseType": "نوع القضية",
  "pdfModal.createdAt": "تاريخ الإنشاء",
  "pdfModal.courtDate": "تاريخ الجلسة",
  "pdfModal.status": "الحالة الحالية",
  "pdfModal.accusedName": "اسم المتهم",
  "pdfModal.assignedLawyer": "المحامي المعين",
  "pdfModal.description": " التهمة",
  "pdfModal.signature": "التوقيع الرقمي",
  "pdfModal.signatureText": "وقع أدناه للتحقق من صحة هذه الوثيقة",
  "pdfModal.signatureSaved": "تم حفظ التوقيع",
  "pdfModal.footerInfo": "تم إنشاء هذه الوثيقة تلقائيًا وهي ملخص رسمي للقضية. تم الإنشاء في {dateTime}",
  "pdfModal.close": "إغلاق",
  "pdfModal.download": "تحميل PDF",
  "pdfModal.ready": "الوثيقة جاهزة للتحميل",
  "pdfModal.notPlanned": "غير محددة",

  "status.en_attente": "في الانتظار",
  "status.en_cours": "قيد المعالجة",
  "status.acceptee": "مقبولة",
  "status.refusee": "مرفوضة",
  "status.cloturee": "مغلقة",

    "deleteCaseModal.title": "تأكيد الحذف",
  "deleteCaseModal.message": "هل تريد حقًا حذف القضية {caseNumber}؟",
  "deleteCaseModal.cancel": "إلغاء",
  "deleteCaseModal.confirm": "حذف",
 "charts.monthlyTrends.title": "التطور الشهري",
  "charts.monthlyTrends.cases": "قضايا مُنشأة",
  "charts.monthlyTrends.completed": "قضايا مُنجزة",
  "charts.yearlyTrends.title": "تطور تسجيل المحامين عبر السنوات",
  "charts.yearlyTrends.lawyers": "المحامين",
 "lawyerDetails.contactInfo": "معلومات التواصل",
  "lawyerDetails.email": "البريد الإلكتروني",
  "lawyerDetails.phone": "رقم الهاتف",
  "lawyerDetails.region": "المنطقة",
  "lawyerDetails.address": "العنوان",
  "lawyerDetails.assignedCases": "القضايا المعينة",
  "lawyerDetails.noCases": "لا توجد قضايا معينة",
  "lawyerDetails.loadingCases": "جاري تحميل القضايا...",
  "lawyerDetails.error": "خطأ",
  "lawyerDetails.lawyer": "محامي",
  "lawyerDetails.close": "إغلاق",
  "lawyerDetails.createdOn": "تاريخ الإنشاء",
  "lawyerDetails.courtDate": "تاريخ الجلسة",
  "month.jan": "جانفي",
  "month.feb": "فيفري",
  "month.mar": "مارس",
  "month.apr": "أفريل",
  "month.may": "ماي",
  "month.jun": "جوان",
  "deleteLawyerModal.title": "تأكيد الحذف",
  "deleteLawyerModal.message": "هل تريد حقًا حذف المحامي {name}؟",
  "deleteLawyerModal.cancel": "إلغاء",
  "deleteLawyerModal.confirm": "حذف",

  "charts.casesByType.title": "القضايا حسب النوع",
  "cases.types.CRIMINEL": "جنائية",
  "cases.types.ENQUETE": "تحقيق",
  "cases.types.ENQUETEUR_PRELIMINAIRE": "باحث بداية",
    // Navbar
    "navbar.account": "حسابي",
    "navbar.changePassword": "تغيير كلمة المرور",
    "navbar.logout": "تسجيل الخروج",
    "navbar.logout.success": "تم تسجيل الخروج بنجاح",
    "case.status.en_attente": "في الانتظار",
      "case.status.acceptee": "مقبولة",
      "case.status.refusee": "مرفوضة",
      "case.status.assignee": "مخصصة",
      "case.status.cloturee": "مغلقة",
  
    // Login
    "login.title": "مسؤول التساخير",
    "login.subtitle": "ولوج آمن إلى فضائكم المهني",
    "login.email": "البريد الإلكتروني",
    "login.email.placeholder": "your@email.com",
    "login.password": "كلمة المرور",
    "login.password.placeholder": "••••••••",
    "login.remember": "تذكّرني",
    "login.forgot": "هل نسيت كلمة المرور؟",
    "login.submit": "تسجيل الدخول",
    "login.footer": "© 2026 الهيئة الوطنية للمحامين بتونس. كل الحقوق محفوظة.",
    "login.ssl": "اتصال آمن SSL",
    "login.fillAll": "الرجاء ملء جميع الحقول",
    "login.invalid": "معطيات الدخول غير صحيحة",
    "login.success": "تم تسجيل الدخول بنجاح",
    "login.error": "خطأ أثناء عملية تسجيل الدخول",
"cases.modal.assignment": "طريقة التعيين",
"cases.modal.assignment.automatic": "تلقائي ",
"cases.modal.assignment.manual": "يدوي",
"cases.modal.selectLawyer": "اختر المحامي",  
"cases.modal.selectLawyerPlaceholder": "اختر محامي...", 
    // Auth
    "auth.checking": "التحقق من الهوية...",

    // Home / Index
    "home.hero.title": "الهيئة الوطنية للمحامين بتونس",
    "home.hero.subtitle": "في خدمة العدالة والإنصاف ودولة القانون",
    "home.hero.admin": "فضاء المسؤولين",
    "home.hero.more": "المزيد من المعلومات",

    "home.mission.title": "مهمّتنا",
    "home.mission.text":
      "الهيئة الوطنية للمحامين بتونس هي الهيكل الممثل لمهنة المحاماة، الساهرة على أخلاقياتها واستقلاليتها وجودتها في ممارسة القانون.",
    "home.mission.card1.title": "العدالة والإنصاف",
    "home.mission.card1.text":
      "الدفاع عن الحقوق الأساسية وضمان النفاذ إلى عدالة منصفة لجميع المواطنين.",
    "home.mission.card2.title": "التميّز المهني",
    "home.mission.card2.text":
      "دعم التكوين المستمر وتعزيز التميّز في ممارسة مهنة المحاماة.",
    "home.mission.card3.title": "دولة القانون",
    "home.mission.card3.text":
      "الإسهام في تدعيم دولة القانون واحترام المبادئ الديمقراطية.",

    "home.services.title": "الخدمات الرقمية",
    "home.services.subtitle":
      "استفيدوا من خدماتنا الرقمية من أجل إدارة حديثة وفعّالة",
    "home.services.lawyers.title": "دليل المحامين",
    "home.services.lawyers.text":
      "الاطلاع على القائمة الكاملة للمحامين المسجلين وتخصّصاتهم",
    "home.services.cases.title": "إدارة القضايا",
    "home.services.cases.text": "نظام لإدارة وتوزيع القضايا القانونية",

    "home.contact.title": "اتصلوا بنا",
    "home.contact.subtitle": "الهيئة الوطنية للمحامين بتونس في خدمتكم",
    "home.contact.phone": "الهاتف",
    "home.contact.email": "البريد الإلكتروني",
    "home.contact.address": "العنوان",

    "home.footer.about":
      "الهيئة الوطنية للمحامين بتونس - في خدمة العدالة منذ القدم",
    "home.footer.links": "روابط مفيدة",
    "home.footer.aboutLink": "من نحن",
    "home.footer.news": "الأخبار",
    "home.footer.publications": "المنشورات",
    "home.footer.contact": "اتصل بنا",
    "home.footer.legal": "البيانات القانونية",
    "home.footer.terms": "شروط الاستخدام",
    "home.footer.privacy": "سياسة الخصوصية",
    "home.footer.mentions": "البيانات القانونية",
    "home.footer.copyright":
      "© 2026 الهيئة الوطنية للمحامين بتونس. كل الحقوق محفوظة.",

    // Sidebar / Layout
    // Sidebar / Layout
    "sidebar.organizationName":"الهيئة الوطنية للمحامين ",
    "sidebar.tagline": "الفرع الجهوي للمحامين بنابل", 
       "sidebar.nav.dashboard": "اللوحة الرئيسة",
    "sidebar.nav.lawyers": "المحامين",
    "sidebar.nav.cases": "القضايا",
    "sidebar.admin": "المشرف",
    "sidebar.admin.email": "admin@onat.tn",
    "sidebar.logout": "تسجيل الخروج",

    // Dashboard
    "dashboard.title": "لوحة المتابعة",
    "dashboard.subtitle": "نظرة شاملة على تسييركم القانوني",
    "dashboard.stats.lawyers": "المحامون المسجّلون",
    "dashboard.stats.casesTotal": "إجمالي القضايا",
    "dashboard.stats.casesActive": "القضايا الجارية",
    "dashboard.stats.casesCompleted": "القضايا المغلقة",
    "dashboard.stats.casesAssigned": "القضايا المسندة",
    "dashboard.stats.pendingCases": "القضايا في الانتظار",
"navbar.mute": "كتم الصوت",
  
  "navbar.notifications": "الإشعارات",
    "navbar.noNotifications": "لا توجد إشعارات",
    // Lawyers page
    "lawyers.title": "إدارة المحامين",
    "lawyers.subtitle":
      "أضف، عدّل وتابع فريق المحامين الخاص بك",
    "lawyers.add": "إضافة محامٍ",
    "lawyers.exportPdf": "حفظ كملف PDF",
    "lawyers.exportExcel": "حفظ كملف Excel",
    "lawyers.stats.total": "إجمالي المحامين",
    "lawyers.stats.active": "النشطون",
    "lawyers.stats.specialties": "الاختصاصات",
    "lawyers.loading.title": "جاري تحميل المعطيات...",
    "lawyers.loading.subtitle": "الرجاء الانتظار قليلاً",
    "lawyers.empty.title": "لا يوجد أي محامٍ مسجّل",
    "lawyers.empty.subtitle":
      "ابدأ بإضافة أول محامٍ لتسيير فريقك القانوني",
    "lawyers.empty.button": "إضافة أول محامٍ",
    "lawyers.list.title": "قائمة المحامين",
    "lawyers.list.count": "{count} محامٍ  في المجموع",
    "lawyers.toast.loadError":
      "خطأ أثناء تحميل قائمة المحامين",
    "lawyers.toast.saveError":
      "خطأ أثناء عملية الحفظ",
    "lawyers.toast.saveCreate":
      "تمت إضافة المحامي بنجاح",
    "lawyers.toast.saveUpdate":
      "تم تعديل بيانات المحامي بنجاح",
    "lawyers.toast.deleteSuccess":
      "تم حذف المحامي بنجاح",
    "lawyers.toast.deleteError":
      "خطأ أثناء عملية الحذف",
    "lawyers.toast.exportPdfSuccess":
      "تم تنزيل ملف PDF بنجاح!",
    "lawyers.toast.exportPdfError":
      "خطأ أثناء تنزيل ملف PDF",
    "lawyers.toast.exportExcelSuccess":
      "تم تنزيل ملف Excel بنجاح!",
    "lawyers.toast.exportExcelError":
      "خطأ أثناء تنزيل ملف Excel",
  "charts.lawyerPerformance.title": "أداء المحامين",
  "charts.lawyerPerformance.legend.total": "الإجمالي",
  "charts.lawyerPerformance.legend.completed": "منتهية",
  "charts.lawyerPerformance.legend.active": "قيد المعالجة",
    // Lawyers table
      "lawyers.table.inProgress": " قضايا جارية",

    "lawyers.table.searchPlaceholder":
      "البحث حسب الاسم أو البريد أو الجهة...",
    "lawyers.table.results": "{count} نتيجة",
    "lawyers.table.empty.title": "لا يوجد أي محامٍ مسجّل",
    "lawyers.table.empty.subtitle":
      "ابدأ بإضافة أول محامٍ لظهوره في هذه القائمة.",
    "lawyers.table.emptyFiltered.title": "لا توجد نتائج",
    "lawyers.table.emptyFiltered.subtitle":
      "حاول تعديل معايير البحث للحصول على نتائج.",
    "lawyers.table.resetFilters": "إعادة تعيين التصفية",
    "lawyers.table.columns.name": "الاسم واللقب",
    "lawyers.table.columns.contact": "معلومات الاتصال",
    "lawyers.table.columns.region": "الجهة",
    "lawyers.table.columns.registration": "تاريخ الترسيم",
    "lawyers.table.columns.cases": "القضايا",
    "lawyers.table.columns.performance": "الأداء",
    "lawyers.table.columns.actions": "إجراءات",
    "lawyers.table.columns.identifiant": "عدد الترسيم",

    // Lawyers modal
    "lawyers.modal.title.edit": "تعديل بيانات المحامي",
    "lawyers.modal.title.create": "إضافة محامٍ جديد",
    "lawyers.modal.subtitle.edit":
      "قم بتحديث بيانات هذا المحامي",
    "lawyers.modal.subtitle.create":
      "املأ بيانات المحامي الجديد",
    "lawyers.modal.section.personal": "البيانات الشخصية",
    "lawyers.modal.section.contact": "بيانات الاتصال",
    "lawyers.modal.section.location": "بيانات العنوان",
    "lawyers.modal.firstName": "الاسم",
    "lawyers.modal.firstName.placeholder": "مثال: أحمد",
    "lawyers.modal.identifiant": "عدد الترسيم",
"lawyers.modal.identifiant.placeholder": "مثال: 00000",
"cases.modal.saving": "جارٍ حفظ البيانات...",

    "lawyers.modal.lastName": "اللقب",
    "lawyers.modal.lastName.placeholder": "مثال: بن صالح",
    "lawyers.modal.email": "البريد الإلكتروني",
    "lawyers.modal.email.placeholder": "example@email.com",
    "lawyers.modal.phone": "رقم الهاتف",
    "lawyers.modal.phone.placeholder": "+216 12 345 678",
    "lawyers.modal.region": "الجهة",
    "lawyers.modal.region.placeholder": "مثال: تونس",
    "lawyers.modal.address": "العنوان الكامل",
    "lawyers.modal.address.placeholder":
      "مثال: 123 شارع الحبيب بورقيبة، تونس",
    "lawyers.modal.registrationDate": "تاريخ الترسيم",
    "lawyers.modal.registrationDate.help":
      "تاريخ انضمام المحامي إلى الهيكل",
    "lawyers.modal.cancel": "إلغاء",
    "lawyers.modal.save": "حفظ",
    "lawyers.modal.error.email": "بريد إلكتروني غير صالح",
    "lawyers.modal.error.phone": "رقم هاتف غير صالح",
    "lawyers.modal.error.minChars": "على الأقل حرفان",

    // Cases page
    "cases.title": "إدارة القضايا",
    "cases.subtitle":
      "أنشئ وتابع القضايا بسهولة",
    "cases.new": "قضية جديدة",
    "cases.stats.total": "إجمالي القضايا",
    "cases.stats.en_attente": "في الانتظار",
    "cases.stats.acceptee": "مقبولة",
"cases.stats.cloturee": "منتهية",
    "cases.list.title": "قائمة التساخير ",
    "cases.list.count": "{count} تسخير في المجموع",
    "cases.toast.loadError": "خطأ أثناء تحميل القضايا",
    "cases.toast.deleteSuccess": "تم حذف القضية",
    "cases.toast.deleteError":
      "خطأ أثناء حذف القضية",
    "cases.toast.updateError":
      "خطأ أثناء تعديل القضية",
    "cases.toast.updateSuccess":
      "تم تعديل القضية بنجاح",
    "cases.toast.createError":
      "خطأ أثناء إنشاء القضية",
    "cases.toast.createSuccess":
      "تم إنشاء القضية بنجاح",
    "cases.toast.saveError":
      "خطأ أثناء عملية الحفظ",
      
      

        "charts.caseStatus.title": "توزيع القضايا",


  "charts.casesByRegion.title": "القضايا حسب الجهة",
  "charts.casesByRegion.legend.cases": "القضايا",
  "charts.lawyersByRegion.title": "المحامين حسب الجهة",
  "charts.lawyersByRegion.legend.lawyers": "المحامين",
  "charts.monthlyCasesTrends.title": "تطور القضايا شهريًا",
  "charts.monthlyCasesTrends.cases": "القضايا",

    // Cases table
    "cases.table.searchPlaceholder":
      "البحث حسب عدد القضية، التهمة، النوع أو المحامي...",
    "cases.table.status.all": "جميع الحالات",
    "cases.table.loading": "جاري التحميل...",
    "cases.table.results": "{count} نتيجة",
    "common.thisMonth": "هذا الشهر",
    "cases.table.empty.title": "لا توجد أي قضية مسجّلة",
    "cases.table.empty.subtitle":
      "ابدأ بإنشاء أول قضية لظهورها في هذه القائمة.",
    "cases.table.emptyFiltered.title": "لا توجد نتائج",
    "cases.table.emptyFiltered.subtitle":
      "حاول تعديل معايير البحث للحصول على نتائج.",
    "cases.table.resetFilters": "إعادة تعيين التصفية",
    "cases.table.columns.number": "عدد القضية",
    "cases.table.columns.title": "التهمة",
    "cases.table.columns.type": "النوع",
    "cases.table.columns.courtDate": "تاريخ الجلسة",
    "cases.table.columns.status": "الحالة",
    "cases.table.columns.lawyer": "المحامي المكلّف",
    "cases.table.columns.actions": "إجراءات",
    "cases.table.unassigned": "غير مكلّفة",

    // Cases status labels
    "cases.status.en_attente": "في الانتظار",
    "cases.status.en_cours": "مكلّفة",
    "cases.status.acceptee": "مقبولة",
    "cases.status.refusee": "مرفوضة",
    "cases.status.cloturee": "منتهية",

    // Cases modal
    "cases.modal.title.edit": "تعديل القضية",
    "cases.modal.title.create": "إنشاء قضية جديدة",
    "cases.modal.number": "عدد القضية",
    "cases.modal.number.placeholder": "مثال: 1111",
    "cases.modal.title": "التهمة",
    "cases.modal.title.placeholder": "مثال: قضية تحيّل مالي",
    "cases.modal.type": "نوع القضية",
    "cases.modal.type.placeholder": "اختر نوع القضية",
    "cases.modal.type.criminel": "جنائية",
  "cases.modal.type.enquete": "تحقيق",
  "cases.modal.type.enqueteur_preliminaire": "باحث بداية",
    "cases.modal.accused": "اسم المتهم",
    "cases.modal.accused.placeholder": "مثال: أحمد بن صالح",
    "cases.modal.courtDate": "تاريخ الجلسة",
    "cases.modal.cancel": "إلغاء",
    "cases.modal.save": "حفظ",
    "cases.modal.error.numberRequired": "رقم القضية إجباري",
    "cases.modal.error.titleRequired": "العنوان إجباري",
    "cases.modal.error.min3": "على الأقل 3 أحرف",
    "cases.modal.error.accusedRequired": "اسم المتهم إجباري",
    "cases.modal.error.min2": "على الأقل حرفان",
    "cases.modal.error.courtDateRequired":
      "تاريخ الجلسة إجباري",

  "pdf.title": "الملف القضائي",
  "pdf.subtitle": "وثيقة رسمية - القضية رقم {{caseNumber}}",
  "pdf.caseType": "نوع القضية",
  "pdf.creationDate": "تاريخ الإنشاء",
  "pdf.courtDate": "تاريخ الجلسة",
  "pdf.currentStatus": "الحالة الحالية",
  "pdf.accusedName": "اسم المتهم",
  "pdf.lawyer": "المحامي المعيّن",
  "pdf.description": " التهمة",
  "pdf.notProvided": "غير متوفر",
  "pdf.noLawyer": "لا يوجد محامٍ",
  "pdf.notScheduled": "غير مبرمجة",
  "pdf.generatedText": "تم إنشاء هذا المستند تلقائيًا...",
  "pdf.generatedOn": "تم الإنشاء في {{date}}",
  "pdf.download": "تحميل PDF",

  "status.EN_ATTENTE": "في الانتظار",
  "status.EN_COURS": "قيد المعالجة",
  "status.ACCEPTEE": "مقبولة",
  "status.REFUSEE": "مرفوضة",
  "status.CLOTUREE": "مغلقة",

    // Forgot password
    "forgot.title": "إعادة تعيين كلمة المرور",
    "forgot.subtitle":
      "أدخل بريدك الإلكتروني لتصلك رسالة إعادة التعيين",
    "forgot.emailLabel": "البريد الإلكتروني",
    "forgot.emailPlaceholder": "your@email.com",
    "forgot.submit": "إرسال الرابط",
    "forgot.backToLogin": "الرجوع إلى تسجيل الدخول",
    "forgot.footer":
      "© 2026 الهيئة الوطنية للمحامين بتونس. كل الحقوق محفوظة.",
    "forgot.error.empty": "الرجاء إدخال بريدك الإلكتروني",
    "forgot.error.request":
      "خطأ أثناء إرسال الطلب",
    "forgot.success":
      "تم إرسال رسالة إعادة التعيين!",
    "forgot.error.unknown": "خطأ غير معروف",

    // Change password
    "password.header.title": "أمان الحساب",
    "password.header.subtitle":
      "قم بتغيير كلمة المرور لحماية حسابك",
    "password.notice.title": "نصيحة أمنية",
    "password.notice.text":
      "استخدم كلمة مرور فريدة لا تستعملها في حسابات أخرى، وقم بتغييرها بصفة دورية للحفاظ على الأمان.",
    "password.current": "كلمة المرور الحالية",
    "password.current.placeholder":
      "أدخل كلمة المرور الحالية",
    "password.new": "كلمة المرور الجديدة",
    "password.new.placeholder":
      "أدخل كلمة المرور الجديدة",
    "password.strength.label": "قوة كلمة المرور:",
    "password.strength.weak": "ضعيفة",
    "password.strength.medium": "متوسطة",
    "password.strength.good": "جيدة",
    "password.strength.excellent": "ممتازة",
    "password.requirements.title": "يجب أن تحتوي كلمة المرور على:",
    "password.requirements.length": "8 أحرف على الأقل",
    "password.requirements.uppercase": "حرف واحد كبير على الأقل",
    "password.requirements.lowercase": "حرف واحد صغير على الأقل",
    "password.requirements.number": "رقم واحد على الأقل",
    "password.requirements.special":
      "رمز خاص واحد على الأقل (!@#$%...)",
    "password.confirm": "تأكيد كلمة المرور الجديدة",
    "password.confirm.placeholder":
      "أعد إدخال كلمة المرور الجديدة",
    "password.confirm.mismatch":
      "كلمتا المرور غير متطابقتين",
    "password.confirm.match":
      "كلمتا المرور متطابقتان",
    "password.submit.loading": "جاري المعالجة...",
    "password.submit.label": "تغيير كلمة المرور",
    "password.cancel": "إلغاء",
    "password.error.empty":
      "الرجاء ملء جميع الحقول",
    "password.error.mismatch":
      "كلمتا المرور الجديدتان غير متطابقتين",
    "password.error.weak":
      "كلمة المرور ليست قوية بما يكفي",
    "password.success":
      "تم تغيير كلمة المرور بنجاح!",
    "password.error.generic":
      "حدث خطأ أثناء تغيير كلمة المرور",
    "password.tips.title": "نصائح إضافية للأمان",
    "password.tips.1":
      "لا تستعمل نفس كلمة المرور لأكثر من حساب",
    "password.tips.2":
      "قم بتفعيل المصادقة الثنائية لزيادة الأمان",
    "password.tips.3":
      "غيّر كلمة المرور كل 3 إلى 6 أشهر",
    "password.tips.4":
      "استعمل مدير كلمات مرور لتخزينها بأمان",

    // Not found
    "notfound.title": "404",
    "notfound.message": "عذراً، الصفحة غير موجودة",
    "notfound.back": "العودة إلى الصفحة الرئيسية",
    "reset.title": "إعادة تعيين كلمة المرور",
  "reset.subtitle": "أدخل كلمة مرور جديدة لحسابك",
  "reset.newPassword": "كلمة المرور الجديدة",
  "reset.newPasswordPlaceholder": "أدخل كلمة المرور الجديدة",
  "reset.confirmPassword": "تأكيد كلمة المرور",
  "reset.confirmPasswordPlaceholder": "أعد إدخال كلمة المرور",
  "reset.submit": "إعادة تعيين كلمة المرور",
  "reset.backToLogin": "العودة إلى تسجيل الدخول",
  "reset.footer": "© 2026 الهيئة الوطنية للمحامين بتونس. كل الحقوق محفوظة.",

  "reset.successTitle": "تم بنجاح",
  "reset.success": "تمت إعادة تعيين كلمة المرور بنجاح.",

  "reset.error.title": "خطأ",
  "reset.error.empty": "يرجى ملء جميع الحقول.",
  "reset.error.mismatch": "كلمتا المرور غير متطابقتين.",
  "reset.error.request": "تعذر إعادة تعيين كلمة المرور.",
  "reset.error.unknown": "حدث خطأ غير معروف.",
  "cases.modal.error.lawyerRequired" :" الرجاء اختيار محامي",
  "cases.modal.assignmentLocked":" لا يمكن تغيير المحامي المعين إلا إذا كانت الحالة قيد الانتظار",

  // Legal Aid (Aide Judiciaire) - Arabic
  "sidebar.nav.aides": "المساعدات القضائية",
  "aides.title": "المساعدات القضائية",
  "aides.subtitle": "إدارة ملفات المساعدة القضائية وتعيينها للمحامين المؤهلين",
  "aides.new": "مساعدة قضائية جديدة",
  "aides.stats.total": "إجمالي المساعدات",
  "aides.stats.assigned": "المسندة",
  "aides.stats.unassigned": "غير المسندة",
  "aides.list.title": "قائمة ملفات المساعدة القضائية",
  "aides.list.count": "إجمالي {count} ملف(ات)",
  "aides.toast.loadError": "خطأ أثناء تحميل المساعدات القضائية",
  "aides.toast.deleteSuccess": "تم حذف المساعدة القضائية بنجاح",
  "aides.toast.deleteError": "خطأ أثناء عملية الحذف",
  "aides.toast.createSuccess": "تم إنشاء المساعدة القضائية بنجاح",
  "aides.toast.updateSuccess": "تم تعديل المساعدة القضائية بنجاح",
  "aides.toast.saveError": "خطأ أثناء عملية الحفظ",
  "aides.toast.assignSuccess": "تم تعيين المحامي بنجاح",
  "aides.toast.assignError": "خطأ أثناء عملية التعيين",
  "aides.table.searchPlaceholder": "البحث حسب رقم الملف، الطالب...",
  "aides.table.columns.number": "رقم الملف",
  "aides.table.columns.applicant": "الطالب",
  "aides.table.columns.court": "المحكمة",
  "aides.table.columns.circuit": "الدائرة",
  "aides.table.columns.decisionDate": "تاريخ القرار",
  "aides.table.columns.courtDate": "الجلسة",
  "aides.table.columns.lawyer": "المحامي المعين",
  "aides.table.columns.actions": "الإجراءات",
  "aides.table.unassigned": "غير معينة",
  "aides.modal.title.create": "إنشاء مساعدة قضائية جديدة",
  "aides.modal.title.edit": "تعديل المساعدة القضائية",
  "aides.modal.number": "رقم الملف",
  "aides.modal.number.placeholder": "مثال: AJ-2026-001",
  "aides.modal.applicant": "اسم الطالب",
  "aides.modal.applicant.placeholder": "مثال: كمال بن علي",
  "aides.modal.court": "المحكمة",
  "aides.modal.court.placeholder": "اختر المحكمة",
  "aides.modal.circuit": "الدائرة",
  "aides.modal.circuit.placeholder": "اختر الدائرة",
  "aides.modal.decisionDate": "تاريخ القرار",
  "aides.modal.courtDate": "تاريخ الجلسة",
  "aides.modal.cancel": "إلغاء",
  "aides.modal.save": "حفظ",
  "aides.modal.error.numberRequired": "رقم الملف إجباري",
  "aides.modal.error.applicantRequired": "اسم الطالب إجباري",
  "aides.modal.error.courtRequired": "المحكمة إجبارية",
  "aides.modal.error.circuitRequired": "الدائرة إجبارية",
  "aides.modal.error.decisionDateRequired": "تاريخ القرار إجباري",
  "aides.modal.error.courtDateRequired": "تاريخ الجلسة إجباري",
  "aides.assign.modal.title": "إسناد المساعدة القضائية",
  "aides.assign.modal.subtitle": "اختر محاميًا مؤهلاً وفقًا لمعايير الإنصاف والأولية",
  "aides.assign.modal.columns.lawyer": "المحامي",
  "aides.assign.modal.columns.region": "الجهة",
  "aides.assign.modal.columns.count": "مجموع المساعدات",
  "aides.assign.modal.columns.lastAssigned": "آخر إسناد",
  "aides.assign.modal.columns.priority": "الأولوية",
  "aides.assign.modal.columns.action": "تعيين",
  "aides.assign.modal.noEligible": "لم يتم العثور على محامين مؤهلين.",
  "aides.assign.modal.loading": "جاري تحميل المحامين المؤهلين...",
  "aides.assign.modal.priority.high": "مرتفعة",
  "aides.assign.modal.priority.medium": "متوسطة",
  "aides.assign.modal.priority.low": "منخفضة",
  "aides.cour.TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA": "المحكمة الابتدائية بڨرمبالية",
  "aides.cour.TRIBUNAL_PREMIERE_INSTANCE_NABEUL": "المحكمة الابتدائية بنابل",
  "aides.cour.COUR_APPEL_NABEUL": "محكمة الاستئناف بنابل",
  "aides.cour.TRIBUNAL_NAHAIYA_GROMBALIA": "محكمة الناحية بڨرمبالية",
  "aides.circuit.PENAL": "جزائي",
  "aides.circuit.CIVIL": "مدني",
  "aides.circuit.FAMILLE": "الأسرة",
  "aides.circuit.URGENT": "استعجالي",
  "deleteAideModal.title": "تأكيد الحذف",
  "deleteAideModal.message": "هل تريد حقًا حذف الملف {number}؟",
  "deleteAideModal.cancel": "إلغاء",
  "deleteAideModal.confirm": "حذف",
  "aides.modal.assignLawyerOptional": "تعيين محام (اختياري)",
  "aides.modal.createAndAssign": "إنشاء وتعيين",
  "aides.status.UNASSIGNED": "غير معين",
  "aides.status.ASSIGNED": "معين",
  "aides.assign.modal.reassign": "إعادة تعيين المحامي",
  "aides.modal.selectLawyerPlaceholder": "اختر محامي...",
  },
};

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "juris-assist-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as Language | null)
        : null;
    if (stored === "fr" || stored === "ar") return stored;
    // Default: French
    return "fr";
  });

  const setLang = (value: Language) => {
    setLangState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "ar" ? "ar" : "fr";
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const value = translations[lang][key] ?? translations.fr[key] ?? key;
    if (!vars) return value;
    return Object.entries(vars).reduce((acc, [k, v]) => {
      return acc.replace(`{${k}}`, String(v));
    }, value);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}


