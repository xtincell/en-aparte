# En aparté

En aparté compose des rendez-vous pour une à six personnes. Le catalogue public compte 91 fiches locales, complétées par des formats à organiser chez vous. Le moteur assemble des étapes, chiffre ce qui est connu dans chaque devise et affiche les horaires des villes concernées.

**[Télécharger En-aparte.html](https://github.com/xtincell/en-aparte/raw/refs/heads/main/En-aparte.html)**, puis ouvrez le fichier dans un navigateur récent. Le moteur, le catalogue et le programme fonctionnent hors ligne. L’ouverture d’une source externe nécessite une connexion.

## Préparer un rendez-vous ou découvrir une occasion

**Préparer un rendez-vous** part de vos participants, de vos horaires et de votre budget. **Explorer les occasions** permet de découvrir des programmes déjà écrits avant de personnaliser l’un d’eux. **Choisir une activité** permet de choisir une seule activité et de construire sa journée à la main.

Les occasions sont classées selon quatre degrés de spécificité, de 1 (courant) à 4 (ultra-spécifique). Ce degré indique à quel point la situation est précise. Par exemple, « Un rendez-vous à deux » se trouve au degré 1, « Une promotion ou une réussite » au degré 2, « Fêter ensemble dans plusieurs villes » au degré 3 et « À distance, à votre rythme » au degré 4. Chaque degré laisse une place aux goûts individuels. Le mode sur place ou à distance, le nombre de participants et le rythme souhaité guident le choix. Une même occasion propose plusieurs façons de la vivre. Pour un anniversaire, un moment intime et une célébration animée peuvent répondre à des envies très différentes.

### Donner au moteur les bonnes informations

Indiquez la personne à célébrer, s’il y en a une. Dans le carnet facultatif, une **préférence déclarée** vient de la personne. Une **supposition** vient de l’organisateur et garde un poids souple. N’utilisez **Indispensable déclaré** que si la personne a exprimé cette contrainte. Pour une surprise, vous pouvez laisser un goût inconnu.

Un choix **pour cette occasion** prime sur l’habitude correspondante. « Sans importance ce jour-là » la neutralise temporairement. Pour retrouver un profil plus tard, enregistrez explicitement ses habitudes sur votre appareil. Vous pouvez ensuite les mettre à jour ou supprimer le profil du carnet. Le rôle dans ce rendez-vous et les ajustements du jour restent propres à la préparation.

### Lire le programme dans son ensemble

Chaque variante propose une suite de moments. Lisez les heures, la durée de chaque étape, les transitions et le budget avant de choisir. Pour un moment commun à distance, vérifiez l’heure locale de chaque ville, en particulier lorsqu’une étape passe minuit. Une activité individuelle concerne seulement la personne qui la pratique.

- **Rythme.** Le moteur tient compte de l’effort de chaque étape et de ce qui précède. Une pause ou une fin anticipée peuvent rendre le programme plus agréable. Une option souple peut être choisie sans donner de motif personnel.
- **Trajet.** Deux lieux successifs peuvent nécessiter un déplacement. Une marge saisie est une hypothèse de planification. Vérifiez la durée réelle, les adresses et le coût du transport avant de retenir l’enchaînement. Une durée renseignée ne chiffre pas automatiquement la course.
- **Budget.** À Abidjan, les montants sont en XOF. À Douala, ils sont en XAF. Répartissez votre budget entre les deux enveloppes. Par exemple, une part XOF de 60 % réserve 60 % de l’enveloppe nominale à Abidjan et les 40 % restants à Douala. Les coûts connus sont additionnés dans chaque devise. Un tarif absent, un transfert à chiffrer ou une formule de groupe incertaine laisse un montant à vérifier.
- **Conditions.** Une réservation préalable, un horaire partiel ou un prix encore inconnu figure parmi les réserves. Une annonce reportée est écartée de sa date initiale. Un calcul compatible avec la plage horaire choisie ne confirme pas l’ouverture du lieu ni la présence de places.

Pour modifier une proposition, **verrouillez** l’étape que vous tenez à garder et **remplacez** celle qui vous convient moins. Vous pouvez aussi **retirer les étapes facultatives** pour raccourcir le programme. Relisez ensuite l’enchaînement et les deux totaux. Si une étape verrouillée empêche la composition, modifiez la contrainte ou déverrouillez-la. Sauvegardez la variante choisie dans **Mon programme**.

### Reprendre une préparation privée en JSON

L’import permet de reprendre les paramètres sans les publier dans le catalogue. `occasion` identifie le modèle. Les champs `jour`, `debut` et `fin` donnent le jour et la plage horaire dans la ville de référence. `ville` est cette première ville, `autre` la deuxième, et `participants` le nombre de personnes. `budget` donne l’enveloppe globale et `partXOF` le pourcentage réservé aux dépenses en XOF, entre 0 et 100. Vérifiez ces valeurs dans le formulaire après l’import.


## Choisir une activité pour une personne ou pour un groupe

1. Sélectionnez la ville, la date et, si vous le souhaitez, le budget global et sa devise.
2. Ouvrez **Choisir une activité**. Choisissez **Sur place** ou **À distance**, puis une envie. **En douceur** privilégie l’effort faible, l’assise, le calme et la possibilité d’écourter. La marche, l’abri et la logistique comptent aussi. Le critère peu sucré s’applique seulement aux activités qui comportent un repas ou une boisson.
3. Pour une décision à plusieurs, indiquez le nombre de personnes (jusqu’à six). Dans **Mes critères et ceux du groupe**, attribuez à chacun des préférences ou des indispensables. **Pour qui cherchez-vous ?** permet ensuite d’organiser un moment pour tout le groupe ou pour une seule personne.
4. Lisez **Premier choix**, **Autre possibilité** et **Pistes à vérifier**. **Une autre idée** écarte cette suggestion pour la recherche en cours. **Autres idées** renouvelle la sélection et **Revoir les idées précédentes** annule le dernier retrait. **Plus calme** et **Priorité au prix** modifient le classement.
5. Ouvrez une fiche pour vérifier ses sources ou sélectionnez **Ajouter au programme**. **Tout le catalogue** donne accès aux fiches de la ville et du jour choisis, à la recherche, aux centres d’intérêt et aux favoris.

## Composer une journée entre plusieurs lieux

Pour un repas partagé, sélectionnez **À distance**, **Manger ensemble**, la deuxième ville et une heure de début dans la première ville. La carte indique ce que les participants doivent organiser. L’ajout crée une seule étape commune. Le programme affiche l’heure dans les deux villes et tient compte d’un éventuel changement de date à minuit.

Pour un second moment, changez l’envie et la durée disponible. Un dessin à partager peut se faire en direct ou en différé. En sélectionnant **15 min**, vous obtenez un créneau adapté au format. Vous pouvez ensuite revenir sur **Sur place**, sélectionner une seule personne et ajouter une activité locale à sa journée. Les notes, heures, durées et coûts se modifient dans **Mon programme**.

Les sept formats à distance reposent sur des consignes éditoriales réalisables entre participants. Chacun vérifie son matériel, ses accès et ses dépenses. Les 91 fiches locales décrivent des lieux ou événements sourcés. Une possibilité de prendre des photos dans un musée, par exemple, ne constitue pas une offre de visite en ligne.

## Budget, programme et sauvegarde

La marge provisoire soustrait du plafond les montants déjà renseignés dans la même devise. Les coûts inconnus, les frais de déplacement et les éventuels suppléments restent visibles ou à saisir. Les prix par personne, par formule et par jeton appellent des hypothèses différentes. Lorsque le total d’un groupe est incertain, la carte le signale. Saisir un zéro et laisser un montant vide ont des effets distincts.

Le programme sépare les XOF et les XAF. **Comparer deux lieux** permet de tester le chevauchement de deux créneaux locaux, y compris entre Abidjan et Douala. **Moment ou frais libres** permet d’inscrire un transport ou une étape de votre choix. Le volet **Mon programme** est accessible en bas de l’écran sur mobile.

Le programme, le lieu, le budget et les favoris sont conservés dans le stockage local du navigateur lorsqu’il est autorisé. Les règles du jour restent temporaires. Le carnet enregistre les habitudes des profils que vous choisissez de conserver. Quand vous ajoutez un programme, les paramètres de son occasion sont aussi conservés sur cet appareil. L’édition publique possède ses propres clés de stockage. **Exporter le programme** produit un texte avec les heures et les montants. Le fichier contient ce que vous avez personnellement saisi. **Exporter les critères des activités (JSON)** produit uniquement les profils du catalogue. Le logiciel ne demande aucun renseignement de santé.

## Données et fonctionnement du moteur

Le catalogue conserve ses 91 fiches historiques, dont 89 pour Abidjan et ses environs et 2 pour Douala. Le samedi 21 novembre 2026 à Abidjan, le filtre retient 84 fiches après exclusion de trois activités hors date et des deux fiches du concert Maïmouna × Biama reporté (opt-002 et opt-076). Les quatre paires de doublons encore présentes ramènent ce total à 80 groupes distincts. Écarter les trois dates non établies (opt-072, opt-074 et opt-077) donne 77 groupes. Pour chacun, l’ouverture et la disponibilité restent à reconfirmer.

Le report figure dans l’agenda de Woya. La publication de Tikerama du 17 novembre annonce le samedi 24 avril 2027 au Dôme de Treichville. Les anciennes pages de vente affichent encore novembre. Dans le catalogue, le classement et chacun des deux sélecteurs de comparaison, le concert réapparaît uniquement à la date annoncée, avec son horaire, ses tarifs et sa billetterie à confirmer. [Agenda Woya](https://www.woya.me/fr/programme/abidjan) · [Annonce Tikerama relayée sur Globuya](https://www.globuya.com/CI/Unknown/119181537788784/Tikerama)

Le profil d’une activité contient son identifiant, son format, ses métadonnées de lieu, date, prix, devise et provenance, et quatorze critères. Les dix critères du catalogue sont complétés par la conversation, l’intimité, la participation en différé et le niveau de préparation. L’export JSON comprend aussi la provenance des horaires, durées, prix et conditions ainsi que le rôle possible de la fiche dans un programme. Chaque critère porte une valeur qualitative et une justification. `source` renvoie à une information explicitement mentionnée, `deduit` à une hypothèse tirée du format, `inconnu` à une information à vérifier et `na` à un critère sans objet. Une place assise probable, un plat salé ou une musique annoncée ne permettent pas de garantir le confort, la teneur en sucre ou le niveau sonore.

Le moteur applique d’abord la ville, la date, le mode, la durée connue et les contraintes attestées. Les options incertaines sont traitées séparément des incompatibilités documentées. Les critères pertinents sont pondérés et les déductions pèsent moins que les informations explicites. Le classement protège en priorité la personne la moins bien servie, utilise la moyenne pour départager, puis cherche des formats différents parmi les options proches. Aucun pourcentage de compatibilité n’est présenté au lecteur.

Le format « quelques exemples puis un ajustement » s’inspire des travaux sur l’expression des préférences à partir d’exemples. [Viappiani, Pu et Faltings](https://doi.org/10.3233/AIC-2008-0433). La prise en compte de la personne la moins satisfaite s’appuie sur les travaux sur les stratégies de décision en groupe. [Masthoff](https://doi.org/10.1023/B:USER.0000010138.79319.fd).

## Vérification

Le contrôle de parcours vérifie le démarrage, les dates, les doublons, les alternatives, les préférences opposées, les deux devises, l’ajout et la sauvegarde, les moments communs et le passage au jour suivant. Les 18 tests de logique se lancent avec `node tests/programmes.mjs`. Les tests `tests/parcours.mjs` et `tests/occasions.mjs` ouvrent le véritable HTML dans Chromium, y compris aux largeurs 320 et 390 pixels. La configuration de GitHub Actions installe Playwright et enchaîne les trois suites.

Le compositeur explore des enchaînements dans le créneau, réserve du temps pour les trajets et compare les montants aux enveloppes. Avec un trajet non saisi, il propose une marge indicative à vérifier. Une fourchette d’ouverture est distincte de la durée d’une visite. Cette représentation du temps s’appuie sur les fenêtres de visite et les temps de transit. [Documentation OR-Tools sur les fenêtres horaires](https://developers.google.com/optimization/routing/vrptw).
