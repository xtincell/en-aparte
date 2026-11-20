# En aparté

En aparté vous aide à choisir une sortie ou un moment à partager. Indiquez un lieu, un jour et une envie. L’accueil propose jusqu’à trois idées avec leurs raisons, leurs tarifs et les points à vérifier. Vous pouvez modifier une préférence, demander une alternative ou ajouter un moment à votre programme.

**[Télécharger En-aparte.html](https://github.com/xtincell/en-aparte/raw/refs/heads/main/En-aparte.html)**, puis ouvrez le fichier dans un navigateur récent. Le moteur, le catalogue et le programme fonctionnent hors ligne. L’ouverture d’une source externe nécessite une connexion.

## Choisir pour une personne ou pour un groupe

1. Sélectionnez la ville, la date et, si vous le souhaitez, le budget global et sa devise.
2. Choisissez **Sur place** ou **À distance**, puis une envie. **En douceur** privilégie l’effort faible, l’assise, le calme et la possibilité d’écourter. La marche, l’abri et la logistique comptent aussi. Le critère peu sucré s’applique seulement aux activités qui comportent un repas ou une boisson.
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

Le programme, le lieu, le budget et les favoris sont conservés dans le stockage local du navigateur lorsqu’il est autorisé. Les critères des personnes sont temporaires. L’édition publique possède ses propres clés de stockage. **Exporter le programme** produit un texte avec les heures et les montants. Le fichier contient ce que vous avez personnellement saisi. **Exporter les critères des activités (JSON)** produit uniquement les profils du catalogue. Le logiciel ne demande aucun renseignement de santé.

## Données et fonctionnement du moteur

Le catalogue réunit 91 fiches compilées le 17 novembre 2026, dont 89 pour Abidjan et ses environs et 2 pour Douala. Les conditions d’ouverture et la disponibilité sont à reconfirmer. Pour le samedi 21 novembre à Abidjan, le filtre de date retient 86 fiches. Les cinq paires de doublons explicites ramènent la sélection à 81 groupes. Écarter aussi les trois dates restant signalées comme incertaines donne 78 groupes. Les données disponibles ne permettent pas de justifier 77. Le catalogue général conserve chaque fiche.

Le profil d’une activité contient son identifiant, son format, ses métadonnées de lieu, date, prix, devise et provenance, et dix critères. Chaque critère porte une valeur qualitative et une justification. `source` renvoie à une information explicitement mentionnée, `deduit` à une hypothèse tirée du format, `inconnu` à une information à vérifier et `na` à un critère sans objet. Une place assise probable, un plat salé ou une musique annoncée ne permettent pas de garantir le confort, la teneur en sucre ou le niveau sonore.

Le moteur applique d’abord la ville, la date, le mode, la durée connue et les contraintes attestées. Les options incertaines sont traitées séparément des incompatibilités documentées. Les critères pertinents sont pondérés et les déductions pèsent moins que les informations explicites. Le classement protège en priorité la personne la moins bien servie, utilise la moyenne pour départager, puis cherche des formats différents parmi les options proches. Aucun pourcentage de compatibilité n’est présenté au lecteur.

Le format « quelques exemples puis un ajustement » s’inspire des travaux sur l’expression des préférences à partir d’exemples. [Viappiani, Pu et Faltings](https://doi.org/10.3233/AIC-2008-0433). La prise en compte de la personne la moins satisfaite s’appuie sur les travaux sur les stratégies de décision en groupe. [Masthoff](https://doi.org/10.1023/B:USER.0000010138.79319.fd).

## Vérification

Le contrôle de parcours vérifie le démarrage, les dates, les doublons, les alternatives, les préférences opposées, les deux devises, l’ajout et la sauvegarde, les moments communs et le passage au jour suivant. Les liens sources et l’inventaire ne sont pas actualisés en direct.
