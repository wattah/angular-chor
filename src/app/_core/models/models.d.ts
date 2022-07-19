// Generated using typescript-generator version 2.0.400 on 2018-09-17 15:17:18.

export interface AdminProductVO {
    id: number;
    priceHt: number;
    status: string;
    family: FamilyVO;
    blocked: boolean;
    tva: string;
    ecoTaxe: number;
    libelleFacture: string;
    prixSurDemande: boolean;
    showingPortal: boolean;
    discountLabel: string;
    discountIncluded: boolean;
    discountFree: boolean;
    included: boolean;
    discountHt: number;
    discountPercent: number;
    warrantyLabel: string;
    isWarranty: boolean;
    customerTarget: string;
    showingAnnualReport: boolean;
    purchasePrice: number;
    purchasePriceReal: number;
    ismodified: boolean;
    pricingType: string;
    pricingTypeReal: string;
    fixedMarginRate: number;
    fixedMarginRateReal: number;
}

export interface ApprovalDocumentVO {
    id: number;
    homologationId: number;
    filename: string;
    name: string;
    receivedAt: Date;
    modifiedAt: Date;
    modifiedBy: number;
    uploadedAt: Date;
    documentTitleId: number;
    documentTitleName: string;
    isValidatedPreHomologation: boolean;
    isValidatedHomologation: boolean;
    type: string;
    documentTypeId: number;
    documentTypeName: string;
    customerNicheIdentifer: string;
    documentTitleTypeId: number;
    file: any;
    portalId: string;
    documentParticipantName: string;
}

export interface AssociatedProductVO {
    id: number;
    sourceId: number;
    ordinal: number;
    destinationLib: string;
    destinationId: number;
    products: ProductVO[];
}

export interface BillLivrableLightVO extends Comparable<BillLivrableLightVO> {
    type: string;
    date: Date;
    fichier: string;
    numero: string;
    univers: string;
    refClient: string;
    archive: boolean;
    url: string;
    dossiers: string[];
    billAmount: number;
}

export interface BillLivrableVO {
    type: BillType;
    date: Date;
    archive: boolean;
    url: string;
    numero: string;
    univers: string;
    clientIdentifier: string;
    billAccountIdentifier: string;
    mainLine: string;
    status: string;
    historiquesStatuts: string;
    controles: string;
    jourFacturation: number;
    prioriteFacturation: number;
    mailNotification: string;
    sendStatus: string;
    sendCancelled: boolean;
    dateSendCancelled: Date;
    customerId: number;
    customerFullName: string;
    deskId: number;
    deskFullName: string;
    requestId: number;
    requestStatus: string;
    justificationControle: string;
    fichier: string;
    billAmount: number;
    historiquesStatusAsList: BillHistoriqueStatus[];
    controlesAsList: string[];
}

export interface CampaignVO {
    id: number;
    name: string;
}

export interface CartItemVO {
    id: number;
    product: ProductVO;
    cartId: number;
    addedById: number;
    modifiedById: number;
    quantity: number;
    ordinal: number;
    addingDate: Date;
    unitPriceHt: number;
    discount: number;
    discountLabel: string;
    tauxTVA: string;
    comment: string;
    commentMandatory: boolean;
    productLabel: string;
    productBillLabel: string;
    productCategory: string;
    unreferencedProductCategoryId: number;
    serial: string;
    warrantyValue: number;
    warrantyLabel: string;
    articleClassLabel: string;
    articleClassId: number;
    refDataArticleClass: ReferenceDataVO;
    proactiveSale: boolean;
    isCommentDisplayOnBill: boolean;
    customerParkItemId: number;
    nomenclature: NomenclatureVO;
    acquisitionPrice: number;
    acquisitionPriceReal: number;
    margin: number;
    marginReal: number;
    deletingDate: Date;
    deletedById: number;
}

export interface CartSavVO {
    id: number;
    requestId: number;
    parkItemId: number;
    isOtherParkItem: any;
    hardwareParkItemId: number;
    isOtherHardware: any;
    manufacturerId: number;
    initiatorRefId: number;
    serial: string;
    description: string;
    isRecover: any;
    restitutionDate: Date;
    expertRefId: number;
    expertUserId: number;
    caseNumber: string;
    refereeingRefId: number;
    manufacturerReturnDate: Date;
    stockReturnDate: Date;
    returnReceivedUserId: number;
    returnDescription: string;
    returnSerial: string;
    smmUserId: number;
}

export interface CartVO {
    id: number;
    createdAt: Date;
    modifiedAt: Date;
    statusModifiedAt: Date;
    request: RequestVO;
    items: CartItemVO[];
    userId: number;
    modifiedById: number;
    status: string;
    billAccountId: string;
    quotationDescription: string;
    billNumber: string;
    parkItemId: number;
    interventionOnLine: boolean;
    quotationPostalAddressId: number;
    deliveryPostalAddressId: number;
    useOfferServiceCounter: boolean;
    orderId: number;
    margin: number;
    marginReal: number;
    orderStatus: string;
    deliveringModeRef: ReferenceDataVO;
    dateAndTimeToAvoid: string;
    desiredDate: Date;
    refDesiredTime: ReferenceDataVO;
    contactForDelivery: string;
    contactMobilePhoneNumber: string;
    confirmationSMS: string;
    coachToNotify: UserVO;
    coachNotificationParnassePhoneNumber: string;
    title: string;
    commandOrders: CommandOrderVO[];
    stockToUse: string;
    deliveryToParnasse: boolean;
    deliveryToRiviera: boolean;
    taskWellClosed: boolean;
    isTaskAutomaticClose: boolean;
    isPrioritized: boolean;
}

export interface ChildVO {
    id: number;
    firstName: string;
    liveAtHome: boolean;
    birthYear: Date;
    customerId: number;
    complement: string;
}

export interface CommandOrderCommentVO {
    id: number;
    createdDate: Date;
    modifiedAt: Date;
    user: UserVO;
    commandOrder: CommandOrderVO;
    commentType: number;
    comment: string;
}

export interface CommandOrderHistoVO {
    statusDate: Date;
    status: string;
    updateDate: Date;
}

export interface CommandOrderLineVO {
    id: number;
    commandOrder: CommandOrderVO;
    status: Status;
    createdDate: Date;
    modifiedAt: Date;
    user: UserVO;
    cartItemId: number;
    articleOrangeReference: string;
    articleOrderedQuantity: number;
}

export interface CommandOrderResultVO {
    commandOrder: CommandOrderVO;
    errorOrInfosMessage: string;
}

export interface CommandOrderVO {
    id: number;
    expeditionDate: Date;
    status: string;
    createdDate: Date;
    sendToPublidispatchDate: Date;
    commandOrderReference: string;
    memberNicheId: string;
    memberPhone: string;
    memberToDeliverName: string;
    memberToDeliverAddress1: string;
    memberToDeliverAddress2: string;
    memberToDeliverAddress3: string;
    memberToDeliverPostalCode: string;
    memberToDeliverCity: string;
    memberToDeliverCountryCode: string;
    coachNotificationEmail: string;
    modifiedAt: Date;
    deliveryAt: Date;
    createdBy: UserVO;
    cartId: number;
    transporterTrackingRef: string;
    transporterTrackingRefLenth: number;
    transporterTrackingPosition: number;
    transporterTrackingDelimiter: string;
    transporterTrackingUrl: string;
    transporterTrackingCode: string;
    transporterTrackingLabel: string;
    commandOrderHisto: CommandOrderHistoVO[];
    commandOrderComments: CommandOrderCommentVO[];
    commandOrderLines: CommandOrderLineVO[];
}

export interface ConfigurationModuleItemVO {
    id: number;
    right: boolean;
    guiComponent: GuiComponentVO;
}

export interface ConfigurationModuleVO {
    id: number;
    label: string;
    description: string;
    module: ModuleVO;
    configurationModuleItems: ConfigurationModuleItemVO[];
    moduleGroup: ModuleGroupVO;
}

export interface ContactMethodVO {
    id: number;
    personId: number;
    value: string;
    description: string;
    isPreferred: boolean;
    contactMethodPostalAddress: PostalAddressVO;
    customerIdentifier: string;
    envelopeCount: number;
    isUseInPeniche: boolean;
    isActive: boolean;
    types: ReferenceDataVO[];
}

export interface CriterionVO {
    id: number;
    label: string;
    familyId: number;
    isActive: boolean;
    values: CriterionValueVO[];
}

export interface CriterionValueVO {
    id: number;
    value: string;
    isActive: boolean;
    criterionId: number;
    criterionLabel: string;
}

export interface CustomerFullVO {
    id: number;
    customer: CustomerVO;
    person: PersonVO;
    personTit: PersonVO;
    holderContracts: CustomerVO[];
}

export interface CustomerHardwareParkItemVO {
    id: number;
    status: string;
    subscriptionDate: Date;
    contactMethodPostalAddressId: number;
    delimitedContactMethodPostalAddress: string;
    createdAt: Date;
    createdById: number;
    createdByFullName: string;
    updatedAt: Date;
    updatedById: number;
    updatedByFullName: string;
    customerId: number;
    terminatedAt: Date;
    terminatedById: number;
    terminatedByFullName: string;
    comments: string;
    productLabel: string;
    associatedLineId: number;
    associatedLineIdentifier: string;
    productId: number;
    product: ProductVO;
    productFamily: FamilyVO;
    facturationLine: FacturationLineVO;
    billAccountIdentifier: string;
    recurrent: boolean;
    toInvoice: boolean;
    alreadyPaidInvoice: boolean;
    unreferencedProductCategory: FamilyVO;
    serial: string;
    masterProductName: string;
    productCategoryName: string;
    productCategoryKey: string;
    productFamilyName: string;
    productSubFamilyName: string;
    productQuantityBlocked: boolean;
    productSerialRequired: boolean;
    productDiscountIncluded: boolean;
    nbOffersAvailable: number;
    hasOffers: boolean;
    maxNbOffers: number;
    customerName: string;
    requestType: string;
    requestId: number;
    billLivrableURL: string;
    billFileName: string;
    billResolution: boolean;
    warrantyLabel: string;
    warrantyValue: number;
    articleClassId: number;
    manufacturerId: number;
    acquisitionPriceReal: number;
    nomenclature: NomenclatureVO;
    customerBeneficeryId: number;
    type: string;
    category: string;
    customerNicheIdentifier: string;
    offerLabel: string;
    customerBeneficeryName: string;
}

export interface CustomerInteractionVO {
    id: number;
    interactionType: string;
    startDate: Date;
    endDate: Date;
    creationDate: Date;
    modificationDate: Date;
    customerId: number;
    status: string;
    typology: string;
    interactionPlace: string;
    creatorId: number;
    creatorName: string;
    actorId: number;
    actorName: string;
    requestId: number;
    requestTitle: string;
    requestAttachedUserName: string;
    requestStatus: string;
    refMediaId: number;
    refMediaLabel: string;
    refMediaLogoName: string;
    interactionReasonId: number;
    interactionReasonLabel: string;
    description: string;
    offerLabel: string;
    message: MessageVO;
    interlocuteur: PersonVO;
}

export interface CustomerInterestVO {
    id: number;
    isInterested: boolean;
    note: number;
    comment: string;
    customerId: number;
    interest: InterestVO;
}

export interface CustomerMaturedDebtVO {
    customerOverdueDebt: PaginatedList<CustomerOverdueDebtVO>;
    totalDebtTtc: string;
    mobileTotalDebtTtc: string;
    servicesTotalDebtTtc: string;
    totalCreditTTC: string;
    customer: CustomerVO;
}

export interface CustomerOverdueDebtVO {
    nicheIdentifier: string;
    universe: string;
    accountNumber: string;
    billNumber: string;
    billingDate: Date;
    dueDate: Date;
    billAmountTTC: string;
    remainingAmountTTC: string;
    unpaidReason: string;
    rejectionReason: string;
    totalCreditTTC: string;
    detteTotalTTC: string;
    detteServiceTTC: string;
    detteMobileTTC: string;
}

export interface CustomerParkItemContractVO {
    id: number;
    customerParkItemId: number;
    universe: string;
    dateCreation: Date;
    dateEngageBegin: Date;
    dateEngageEnd: Date;
    dateLastChange: Date;
    dateChangeSim: Date;
    datePcmLastChange: Date;
    libelleContract: string;
    numLine: string;
    numIpLine: string;
    bss: string;
    boId: string;
    lastUpdatedDate: Date;
    pcm: number;
    stateDoss: string;
    libelleSuspend: string;
    codeStateDoss: string;
    codeSuspend: string;
    numTelSubCard: string;
    puk1: string;
    puk2: string;
    pukSub1: string;
    pukSub2: string;
    typeSimCard: string;
    numImsi: string;
    fixSpecialisation: string;
    addressInstallation: string;
    numSimCard: string;
    numSubSimCard: string;
    numSubDoss: string;
    numAdv: string;
    nextOfferLibelle: string;
    isNextOffer: boolean;
    nextOfferDate: Date;
    codeContract: string;
}

export interface CustomerParkItemServicesOptionsVO {
    id: number;
    customerParkItemId: number;
    dateActivation: Date;
    dateDesactivation: Date;
    lastUpdatedDate: Date;
    universe: number;
    state: number;
    code: string;
    isIncludeInOffer: boolean;
    libelle: string;
    codeType: string;
    libelleType: string;
}

export interface CustomerParkItemTerminalMobileVO {
    id: number;
    customerParkItemId: number;
    dateFirstUse: Date;
    dateBuy: Date;
    description: string;
    isBought: boolean;
    numImei: string;
    origin: string;
    lastUpdatedDate: Date;
    customerName: string;
    webServiceIdentifier: string;
    customerId: number;
}

export interface CustomerParkItemVO {
    id: number;
    name: string;
    creatorId: number;
    webServiceIdentifier: string;
    customerId: number;
    customerBeneficiairyId: number;
    modifierId: number;
    webService: number;
    customerIdentifier: string;
    customerLastNameFirstName: string;
    beneficiaryLastNameFirstName: string;
    account: string;
    comment: string;
    modificationDate: Date;
    universe: string;
    userId: number;
    userName: string;
    num50d: string;
    dateSubscription: Date;
    dateCancellation: Date;
    dateUnnumbered: Date;
    customerParkItemServicesOptions: CustomerParkItemServicesOptionsVO[];
    customerParkItemTerminalMobile: CustomerParkItemTerminalMobileVO[];
    customerParkItemContract: CustomerParkItemContractVO;
    numDoss: string;
    libelleContract: string;
    codeContract: string;
    numClient: string;
    lastUpdatedDate: Date;
    reason: string;
    nicheContractStatus: string;
    newNicheContractStatus: string;
    newDateSubscription: Date;
    newNumber: string;
    offers: NestedOfferVO[];
    nameCustomerFromWebservice: string;
    civilityFromWebservice: string;
    address1FromWebservice: string;
    address2FromWebservice: string;
    address3FromWebservice: string;
    address4FromWebservice: string;
    countryFromWebservice: string;
    cityFromWebservice: string;
    postalCodeFromWebservice: string;
    modePaymentFromWebservice: string;
    cleRIBFromWebservice: string;
    codeGuichetFromWebservice: string;
    codeBanqueFromWebservice: string;
    nomTitulaireFromWebservice: string;
    numCompteFromWebservice: string;
    isAccountFoundInPeniche: boolean;
    lineOrigin: ReferenceDataVO;
    authorizedRenewal: boolean;
    isRestrictedOffer: boolean;
    hasRenewalPeriod: boolean;
    lineHolder: ReferenceDataVO;
    isParnasseNumber: boolean;
    linkedParkItemId: number;
    linkedParkItemLabel: string;
    lineHolderName: string;
    renewalMobileClassification: number;
    dateRenewal: Date;
    renewalBeginDate: Date;
    renewalEndDate: Date;
    benefStatus: number;
}

export interface CustomerRecoveryVO {
    id: number;
    nicheIdentifier: string;
    firstName: string;
    lastName: string;
    fullName: string;
    recoveryProfil: string;
    status: string;
    mobileBalance: number;
    internetBalance: number;
    serviceBalance: number;
    fixeBalance: number;
    globalBalance: number;
    requestId: number;
    mobileRepresentedAmount: number;
    internetRepresentedAmount: number;
    serviceRepresentedAmount: number;
    fixeRepresentedAmount: number;
    dateMajMobile: string;
    dateMajFixe: string;
    dateMajService: string;
    dateMajInternet: string;
}

export interface CustomerReferentVO {
    id: number;
    customerId: number;
    userId: number;
    userName: string;
    roleId: number;
    roleName: string;
    lastName: string;
    firstName: string;
    currentAbsence: AbsenceLight;
    email: string;
    parnasseEmail: string;
}

export interface CustomerVO {
    id: number;
    companyCustomerId: number;
    customerAffiliates: CustomerVO[];
    drakkarIdentifier: string;
    status: number;
    categoryCustomer: string;
    creationDate: Date;
    statusChangeDate: Date;
    prospectingAdmissionDate: Date;
    nicheAdmissionDate: Date;
    dateHomologation: Date;
    cancellationDate: Date;
    prospectionKoDate: Date;
    adhesionStep: string;
    fieldOfActivity: string;
    siret: string;
    coachRefId: number;
    coachRefName: string;
    membreDejaRencontre: boolean;
    eligibilite: boolean;
    compteRenduEnvoye: boolean;
    propositionAdhesionEnvoye: boolean;
    clientSigne: boolean;
    referents: CustomerReferentVO[];
    personCustomerRoles: PersonCustomerRoleVO[];
    persons: PersonVO[];
    createdById: number;
    interlocutor: string;
    statusChangedBy: number;
    context: string;
    lastContact: Date;
    customerParkItems: CustomerParkItemVO[];
    recoveryProfil: string;
    recoveryComment: string;
    recoveryExtensionAllowed: boolean;
    recoveryExtensionComment: string;
    contractCessionDate: Date;
    serviceAccess: string;
    refMembershipReason: ReferenceDataVO;
    refProspectionKoReason: ReferenceDataVO;
    refCancellationReason: ReferenceDataVO;
    freeManagement: string;
    newsletter: boolean;
    statutVente: ReferenceDataVO;
    commentaireVente: string;
    isComplaint: boolean;
    complaintValue: string;
    dateDebutComplaint: Date;
    dateFinComplaint: Date;
    isSensible: boolean;
    refJobPosition: ReferenceDataVO;
    children: ChildVO[];
    notHomologatedReasons: ReferenceDataVO[];
    acceptanceDate: Date;
    paymentDate: Date;
    isMemberValidated: boolean;
    nicheIdentifier: string;
    commiteeOfSelectionComment: string;
    dateOfTechnicalStudy: Date;
    selectionCommitteeDecision: boolean;
    installationDate: Date;
    realisationStatus: string;
    debtFlag: boolean;
    debtManualRecovery: boolean;
    debtDelay: boolean;
    debtDelayComment: string;
    customerHardwareParkItems: CustomerHardwareParkItemVO[];
    selectionCommitteeDate: Date;
    acquisitionCanals: AcquisitionCanalLight[];
    companyCustomerLastNameFirstName: string;
    companyCustomerFullName: string;
    companyCustomerRealName: string;
    companyCustomerFirstName: string;
    companyCustomerLastName: string;
    counter: number;
    offerLabel: string;
    offresService: CustomerHardwareParkItemVO[];
    prestations: CustomerHardwareParkItemVO[];
    materiels: CustomerHardwareParkItemVO[];
    idsActualBeneficiaries: number[];
    companyCustomerCrmName: string;
    offerIds: number[];
}

export interface DocumentTitleVO {
    id: number;
    trigram: string;
    documentTitle: string;
    documentTypeName: string;
    documentTypeId: number;
}

export interface DocumentTypeVO {
    id: number;
    documentTypeName: string;
    ordinal: number;
}

export interface DocumentVO {
    id: number;
    filename: string;
    filesize: string;
    customerNicheIdentifer: string;
    title: string;
    name: string;
    addedDate: Date;
    receiptDate: Date;
    description: string;
    readOnly: boolean;
    category: number;
    targetType: string;
    targetId: number;
    requestType: string;
    customerId: number;
    refPieceJustificative: ReferenceDataVO;
    documentTypeId: number;
    documentTypeName: string;
    documentTitleId: number;
    documentTitleName: string;
    file: any;
    isAnAuthorizedType: boolean;
    isAccessibleFromPortal: boolean;
}

export interface EnvelopeBillsVO {
    name: string;
    customerIdentifier: string;
    billAccountIdentifiers: string[];
    bills: BillLivrableVO[];
}

export interface EventLightVO {
    eventId: number;
    eventSessionId: number;
    photo: string;
    date: Date;
    nbPlacesTotal: number;
    nbPlacesRequested: number;
    nbPlacesAccepted: number;
    nbPlacesRefused: number;
    nbPlacesOnHold: number;
    label: string;
    edito: string;
    status: string;
    targetedEvent: boolean;
    noAutoEmail: boolean;
    isRiviera: boolean;
}

export interface EventSessionVO {
    eventId: number;
    eventSessionId: number;
    infos: string;
    placeOrDate: string;
    startingDate: Date;
    endingDate: Date;
    label: string;
    nbPlacesTotal: number;
    nbPlacesRequested: number;
    nbPlacesAccepted: number;
    nbPlacesRefused: number;
    nbPlacesOnHold: number;
    statut: string;
    accompanistsCom: UserVO[];
    parnasseLineRef: ReferenceDataVO;
    photo: string;
    date: Date;
    isArchive: boolean;
    targetedEvent: boolean;
    noAutoEmail: boolean;
    cost: number;
    participantsByInvitation: number;
    isRiviera: boolean;
}

export interface EventSubscriptionVO {
    id: number;
    eventId: number;
    eventSessionId: number;
    customerId: number;
    eventSessionName: string;
    eventSessionDate: Date;
    status: string;
    answerType: string;
    noShow: boolean;
    invited: boolean;
    requestId: number;
    offerId: number;
    recoveryProfil: string;
    recoveryComment: string;
    messageSent: boolean;
    messageAutomatingType: ReferenceDataVO;
    origin: ReferenceDataVO;
    complaintValue: string;
    customerName: string;
    customerInfo: string;
    listInteractionLibelle: string;
    nbRequestedEvents: string;
    clientAskedDate: Date;
    offerLabel: string;
    feedbackOpinion: ReferenceDataVO;
    feedbackComment: string;
    createdByIhm: ReferenceDataVO;
}

export interface EventVO {
    eventId: number;
    name: string;
    description: string;
    editorial: string;
    refType: ReferenceDataVO;
    photo: string;
    permissions: ReferenceDataVO[];
    interests: ReferenceDataVO[];
    sessions: EventSessionVO[];
    publicationStartDate: Date;
    publicationEndDate: Date;
    isPublished: boolean;
}

export interface FacturationLineVO {
    label: string;
    unitPrice: number;
    tva: number;
    quantity: number;
    remise: number;
}

export interface FamilyVO {
    id: number;
    name: string;
    parent: FamilyVO;
    categoryKey: string;
}

export interface FileUploadVO {
    file: any;
    originalFilename: string;
    documentType: string;
    documentTitle: string;
    customizedName: string;
    title: string;
    documentTypeId: number;
    documentTitleId: number;
    comment: string;
    image: boolean;
    extention: string;
    pdf: boolean;
}

export interface GuiComponentVO {
    id: number;
    label: string;
    description: string;
    type: string;
    isConfigurable: boolean;
}

export interface GuiComponentValuesVO {
    id: number;
    guiComponentId: number;
    guiComponentLabel: string;
    moduleName: string;
    values: string;
}

export interface HistoryItemVO {
    id: number;
    modelTpe: string;
    objectId: number;
    createdAt: Date;
    userId: number;
    userFirstName: string;
    userLastName: string;
    action: string;
    userComment: string;
    systemComment: string;
    previousStatus: string;
    actualStatus: string;
    isDetailOpen: boolean;

}

export interface HobbyVO {
    id: number;
    categoryLabel: string;
    hobbyLabel: string;
}

export interface HomologationItemVO {
    id: number;
    homologationId: number;
    hasThirdPayer: boolean;
    thirdPayerName: string;
    thirdPayerCompanyName: string;
    paymentMethod: string;
    options: string[];
}

export interface HomologationLineVO extends HomologationItemVO {
    lineNumber: string;
    forfait: string;
    isLineTransfer: boolean;
    lineOrigin: string;
    rio: string;
    refLineHolder: string;
    lineUser: string;
}

export interface HomologationParticipantVO {
    id: number;
    title: string;
    lastname: string;
    firstname: string;
    companyName: string;
    addrLine2: string;
    addrLine3: string;
    addrLine4: string;
    addrLine5: string;
    postalCode: string;
    city: string;
    cedex: string;
    country: string;
    phoneNumber: string;
    mail: string;
    mailForBilling: string;
    prehomologationDecision: boolean;
    prehomologationComment: string;
    prehomologationDecisionDate: Date;
    homologationDecision: boolean;
    homologationComment: string;
    homologationDecisionDate: Date;
    commiteeSelectionRequest: boolean;
    commiteeSelectionDate: Date;
    siren: string;
}

export interface HomologationServiceVO extends HomologationItemVO {
    offer: string;
}

export interface HomologationVO {
    id: number;
    nicheIdentifier: string[];
    companyNicheIdentifier: string;
    createdAt: Date;
    modifiedAt: Date;
    refMembershipStatus: string;
    category: string;
    seller: string;
    sellerCuid: string;
    refAcquisitionChannel: string;
    signDate: Date;
    prospectingAbandonDate: Date;
    acceptanceDate: Date;
    prehomologationDeclarisPreventel: boolean;
    prehomologationSolvencyControls: boolean;
    prehomologationComment: string;
    prehomologationCommiteeOfSelectionRequest: boolean;
    prehomologationDecision: boolean;
    prehomologationDecisionDate: Date;
    homologationDeclarisPreventel: boolean;
    homologationSolvencyControls: boolean;
    homologationComment: string;
    homologationCommiteeOfSelectionRequest: boolean;
    homologationDecision: boolean;
    homologationDecisionDate: Date;
    service: HomologationServiceVO;
    lines: HomologationLineVO[];
    approvalDocuments: ApprovalDocumentVO[];
    taskId: number;
    idDesk: number;
    crmName: string;
    customerId: number;
    membershipManager: string;
    storeManager: string;
    prehomologationCommiteeOfSelectionComment: string;
    homologationCommiteeOfSelectionComment: string;
    comment: string;
    isCustomerSaved: boolean;
    feesPaymentMethod: string;
    sellerId: number;
    storeManagerId: number;
    dateOfTechnicalStudy: Date;
    beneficiaires: HomologationParticipantVO[];
    company: HomologationParticipantVO;
    representantLegal: HomologationParticipantVO;
}

export interface InteractionReasonVO {
    id: number;
    label: string;
    ordinal: number;
    active: boolean;
    date: Date;
    parent: InteractionReasonVO;
    availability: string;
    key: string;
    isRendezVous: boolean;
    requestTypes: RequestTypeVO[];
    universes: ReferenceDataVO[];
    childs: InteractionReasonVO[];
}

export interface InterestCategoryVO {
    id: number;
    category: ReferenceDataVO;
}

export interface InterestVO {
    id: number;
    label: string;
    interestCategory: InterestCategoryVO;
}

export interface InterventionDetailVO {
    id: number;
    otherLine: string;
    comment: string;
    shadowNumber: string;
    customerNeeds: string;
    inWarranty: boolean;
    refInterventionTypeLabel: string;
    refInterventionDomainLabel: string;
    modalities: ReferenceDataVO[];
    impactedLineId: number;
    impactedLineLabel: string;
    refInterventionType: ReferenceDataVO;
    refInterventionDomain: ReferenceDataVO;
    interventionReportId: number;
}

export interface InterventionHardwareVO {
    id: number;
    isInstalled: boolean;
    comment: string;
    interventionReportId: number;
    refInterventionHardware: ReferenceDataVO;
    serialNumber: string;
    quantity: number;
}

export interface InterventionReportVO {
    id: number;
    technicians: UserVO[];
    interventionHardware: InterventionHardwareVO[];
    customerParkItem : CustomerParkItemVO;
    interventionDetail: InterventionDetailVO[];
    postalAdress: PostalAddressVO;
    phoneNumber: ContactMethodVO;
    otherActors: string[];
    otherParticipent: UserVO[];
    atCustomerStartTime: Date;
    interventionStartTime: Date;
    interventionEndTime: Date;
    atCustomerEndTime: Date;
    pseStartTime: Date;
    pseEndTime: Date;
    reportOnServiceBill: string;
    isPaymentDone: boolean;
    isBillingAccorderToQuotation: boolean;
    billingComment: string;
    isHno: boolean;
    isOnCallDuty: boolean;
    isPublicHoliday: boolean;
    customerId: number;
    customerLastNameFirstName: string;
    refInitiator: ReferenceDataVO;
    manualInitiatorIntervention: string;
    taskId: number;
    coachName: string;
    offerCustomerLabel: string;
    customerStatus: number;
    accountManagerName: string;
    isRequestClose: boolean;
    document: DocumentVO;
    customer: CustomerVO;
    requestId: number;
    isSatisfied: boolean;
    unsatisfactionComment: string;
    isCoachPresent: boolean;
    additionalDocuments: DocumentVO[];
    isCoachContact : boolean;
    isMembreContact: boolean;
    contactName : string;
    contactFirstName : string;
    contactPhoneNumber : string;
    otherInfoContact : string;
    refInterventionHousingType : ReferenceDataVO;
    precision : string;
    isAreaSup : boolean;
    isWorkInProgress : boolean;
    type : ReferenceDataVO;
}

export interface KeyWordsVO {
    label: string;
    isList: boolean;
    key: string;
}

export interface KnowledgeFieldVO {
    id: number;
    labelTech: string;
    description: string;
    fieldType: string;
    refClasse: ReferenceDataVO;
    ordinal: number;
    isForHolder: number;
    typeData: string;
}

export interface MailVO extends MessageVO {
    style: ObjectContextVO;
    frame: ObjectContextVO;
    subject: string;
    title: string;
    subtitle: string;
    listFile: DocumentVO[];
}

export interface ManufacturerVO {
    id: number;
    name: string;
}

export interface MasterProductVO {
    id: number;
    name: string;
    partnerId: number;
    partnerName: string;
    longDescription: string;
    shortDescription: string;
    stockQuantity: number;
    stockOrder: number;
    isOnStock: boolean;
    manufacturerId: number;
    manufacturerName: string;
    availabilityDate: Date;
    partnerProductReference: string;
    proratedAtBegin: boolean;
    proratedAtEnd: boolean;
    recurrent: boolean;
    subscriptionPeriodicity: string;
    productImageName: string;
    productDescriptionName: string;
    billingCategory: string;
    unitOfWorkId: number;
    unitOfWorkLabel: string;
    interventionDuration: number;
    detail: string;
    prerequisite: string;
    pricingConditions: string;
    quantityBlocked: boolean;
    commentMandatory: boolean;
    serialRequired: boolean;
    needs: NeedVO[];
    features: CriterionValueVO[];
    serialNumberPrefix: ReferenceDataVO;
    warrantyValue: number;
    productsVO: AdminProductVO[];
    acquisitionPrice: number;
    acquisitionPriceReal: number;
    articleClassId: number;
    nomenclature: NomenclatureVO;
    refDataArticleClass: ReferenceDataVO;
    annualReport: string;
    travelIncluded: boolean;
    pricingType: string;
    pricingTypeReal: string;
    marginRate: number;
    marginRateReal: number;
    marginValue: number;
    marginValueReal: number;
    orangeProductReference: string;
    publidispatchStockQuantity: number;
    isOnPublidispatchStock: boolean;
    ismodified: boolean;
    eanCode: string;
}

export interface MessageReceiverVO {
    id: number;
    value: string;
    contactMethodId: number;
    customerParkItemId: number;
    messageId: number;
    copy: boolean;
    hidden: boolean;
}

export interface MessageVO {
    id: number;
    requestId: number;
    createdBy: number;
    messageTemplateId: number;
    interactionReasonId: number;
    createdAt: Date;
    sender: string;
    message: string;
    description: string;
    taskId: number;
    listReceivers: MessageReceiverVO[];
}

export interface MessageTemplateLightVO{
    id: number;
	label: string;
	message: string;
	object: string;
	title: string;
	subtitle: string;
	keyWordsList: KeyWordsVO[];
	language: ReferenceDataVO;
}

export interface ModuleGroupVO {
    id: number;
    label: string;
}

export interface ModuleVO {
    id: number;
    name: string;
    label: string;
    type: string;
    parent: ModuleVO;
    guiComponents: GuiComponentVO[];
}

export interface MyNicheVO {
    id: number;
    name: string;
    description: string;
    logo: string;
    trigram: string;
    styleSheetVO: StylesheetVO;
    logoBy: any;
    logoNiche: any;
}

export interface NeedVO {
    id: number;
    label: string;
    parent: NeedVO;
    childs: NeedVO[];
}

export interface NestedOfferVO {
    id: number;
    customerParkItemId: number;
    name: string;
    status: number;
    startDate: Date;
    endDate: Date;
    value: string;
    children: NestedOfferVO[];
}

export interface NicheEntityVO {
    id: number;
    name: string;
    myNicheId: number;
    active: boolean;
    dateUpdate: Date;
}

export interface NodeAnswerVO {
    id: number;
    value: string;
    label: string;
    inputId: number;
    outputId: number;
    procedures: ProcedureVO[];
}

export interface NodeConfigVO {
    id: number;
    startDateReference: string;
    startDateDelay: number;
    endDateReference: string;
    endDateDelay: number;
    description: string;
    taskTypologyId: number;
    handlerRole: RoleVO;
    trackerRole: RoleVO;
    sopIdentifier: number;
    zappable: boolean;
    notifCloture: string;
    tachePrioritaire: boolean;
}

export interface NodeVO {
    id: number;
    type: string;
    value: string;
    answersInput: NodeAnswerVO[];
    answersOutput: NodeAnswerVO[];
    workflowId: number;
    nodeConfig: NodeConfigVO;
    proceduresAtCreation: ProcedureVO[];
    proceduresOnDemand: ProcedureVO[];
}

export interface NomenclatureVO {
    id: number;
    value: string;
    label: string;
    level: number;
    parent: NomenclatureVO;
    childrenIds: number[];
}

export interface ObjectContextVO {
    id: number;
    label: string;
    active: boolean;
    language: ReferenceDataVO;
}

export interface OfferServiceCounterProductsVO {
    id: number;
    productId: number;
    discountLabel: string;
    offerServiceCounterId: number;
    offerName: string;
}

export interface OfferServiceCounterVO {
    id: number;
    offerName: string;
    initialValue: number;
    renewFrequency: number;
}

export interface OrderHistoryVO {
    id: number;
    modificationDate: Date;
    orderStatus: string;
}

export interface OrderVO {
    id: number;
    cart: CartVO;
    cartId: number;
    status: string;
    scoring: number;
    comment: string;
    isBlocked: boolean;
    customerId: number;
    customerLastNameFirstName: string;
    requestId: number;
    requestDescription: string;
    createdAt: Date;
    requestTypeLabel: string;
    modifiedAt: Date;
    closingDate: Date;
    accountManager: string;
    history: OrderHistoryVO[];
    recoveryProfil: string;
    delieveringMode: string;
    cartSpecifity: string;
    customerOfferLabel: string;
}

export interface ParamVO {
    id: number;
    className: string;
}

export interface PartnerVO {
    id: number;
    name: string;
    contact: string;
    contactMethod: string;
    status: PartnerStatus;
}

export interface PayementVO {
    id: number;
    url: string;
    payementTemplateId: number;
    transactionType: string;
    transactionAmount: number;
    requestId: number;
    taskId: number;
    mediaRefId: number;
    comment: string;
    datePayement: Date;
    customerId: number;
    refBill: string;
    refBillAcount: string;
    universeLabel: string;
}

export interface PenicheBankOfficeVO {
    code: string;
    name: string;
}

export interface PenicheBankVO {
    code: string;
    name: string;
    offices: PenicheBankOfficeVO[];
}

export interface PenicheBillAccountLightVO extends Comparable<PenicheBillAccountLightVO> {
    billAccountUniverse: string;
    billAccountIdentifier: string;
    billAccountStatus: string;
    billAccountBalance: number;
    billAccountName: string;
    billAccountAlias: string;
    billAccountRecurrent: boolean;
    billAccountBillingDay: number;
    billAccountPaymentMode: string;
    billAccountPayerTitle: string;
    billAccountPayerLastName: string;
    billAccountPayerFirstName: string;
    billAccountPayerCompany: string;
    billAccountTitularTitle: string;
    billAccountTitularLastName: string;
    billAccountTitularFirstName: string;
    billAccountTitularCompany: string;
    billAccountTitularAddress: string;
    billAccountPayerAddress: string;
    billAccountTvaExemption: boolean;
    billAccountLines: PenicheBillAccountLineVO[];
    billAccountNicheIdentifiant: string;
}

export interface PenicheBillAccountLineVO {
    lineIdentifier: string;
    lineStatus: string;
    lineDateStatus: string;
    lineAlias: string;
    active: boolean;
}

export interface PenicheBillAccountVO {
    identifier: string;
    customerIdentifier: string;
    universe: string;
    alias: string;
    status: string;
    nicheAdmissionDate: string;
    terminationDate: string;
    paymentMode: string;
    paymentCondition: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    officeCode: string;
    officeName: string;
    bankAccountNumber: string;
    ribKey: string;
    payerTitle: string;
    payerLastName: string;
    payerFirstName: string;
    payerCompany: string;
    payerAddress2: string;
    payerAddress3: string;
    payerAddress4: string;
    payerAddress5: string;
    payerAddress6: string;
    payerCedex: string;
    payerDeliveryInfo: string;
    payerOrasId: number;
    payerInseeId: string;
    payerRivoliId: string;
    payerStreetNumber: number;
    payerStreetExtension: string;
    payerStreetType: string;
    payerStreetName: string;
    payerGeocodeX: number;
    payerGeocodeY: number;
    payerSiren: string;
    payerZipCode: string;
    payerCity: string;
    payerCountry: string;
    titularTitle: string;
    titularLastName: string;
    titularFirstName: string;
    titularCompany: string;
    titularAddress4: string;
    titularAddress2: string;
    titularAddress3: string;
    titularAddress5: string;
    titularAddress6: string;
    titularCedex: string;
    titularDeliveryInfo: string;
    titularOrasId: number;
    titularInseeId: string;
    titularRivoliId: string;
    titularStreetNumber: number;
    titularStreetExtension: string;
    titularStreetType: string;
    titularStreetName: string;
    titularGeocodeX: number;
    titularGeocodeY: number;
    titularZipCode: string;
    titularCity: string;
    titularCountry: string;
    titularSiren: string;
    recurrent: boolean;
    balance: number;
    representedAmount: number;
    billingDay: number;
    timeBeforeBilling: number;
    mailNotification: string;
    idMailNotification: number;
    mailOldNotification: string;
    idMailOldNotification: number;
    billAccountLines: PenicheBillAccountLineVO[];
    controlCF: boolean;
    creationDate: string;
    justificationControle: string;
    tvaExemption: boolean;
    typeEnvoi: PenicheTypeEnvoiLivrable;
    compteRenduAttendu: boolean;
    isPluriel: boolean;
    isPro: boolean;
    active: boolean;
    company: boolean;
    particular: boolean;
    payerFullName: string;
}

export interface PenicheBillElementVO {
    identifier: string;
    category: string;
    price: number;
    billLabel: string;
    discountLabel: string;
    discount: number;
    vat: number;
    quantity: number;
    subscriptionDate: string;
    resiliationDate: string;
    recurrent: boolean;
    prorataDeb: boolean;
    prorataFin: boolean;
    billingCycle: string;
    alreadyInvoiced: boolean;
    alreadyPaidInvoice: boolean;
    serial: string;
    productId: number;
    productCategory: string;
    productFamilyName: string;
    productSubFamilyName: string;
    cartItemId: number;
    ordinal: number;
    cartId: number;
    requestId: number;
    statusModifiedAt: string;
    warrantyLabel: string;
    articleClassLabel: string;
    nomenclature: string;
    cartItemComment: string;
}

export interface PenicheCustomerResponseVO {
    trigramme: string;
    identifier: string;
    typology: string;
    billReport: boolean;
    status: string;
    title: string;
    lastName: string;
    firstName: string;
    society: string;
    siren: string;
    address2: string;
    address3: string;
    address4: string;
    address5: string;
    address6: string;
    cedex: string;
    deliveryInfo: string;
    orasId: number;
    inseeId: string;
    rivoliId: string;
    streetNumber: number;
    streetExtension: string;
    streetType: string;
    streetName: string;
    geocodeX: number;
    geocodeY: number;
    country: string;
    city: string;
    zipCode: string;
    alias: string;
    nicheAdmissionDate: string;
    terminationDate: string;
    billingDay: number;
    billingTime: number;
    timeBeforeBilling: number;
    mailNotification: string;
    idMailNotification: number;
    mailOldNotification: string;
    idMailOldNotification: number;
    typeEnvoi: PenicheTypeEnvoiLivrable;
    billAccounts: PenicheBillAccountLightVO[];
    recoveryData: CustomerRecoveryVO;
}

export interface PenicheMailNotificationVO {
    trigramme: string;
    identifier: string;
    billAccountIdentifier: string;
    mailNotification: string;
}

export interface PenicheNicheVO {
    trigram: string;
    name: string;
    nextSending1: string;
    nextSending2: string;
}

export interface PersonAffiliateRoleVO {
    id: number;
    personId: number;
    affiliateId: number;
    refRole: ReferenceDataVO;
}

export interface PersonCustomerRoleVO {
    id: number;
    customerId: number;
    personId: number;
    refRole: ReferenceDataVO;
    allowedToCall: boolean;
}

export interface PersonVO {
    id: number;
    categoryPerson: ReferenceDataVO;
    refSocialTitle: ReferenceDataVO;
    refFavoriteLanguage: ReferenceDataVO;
    refLocation: ReferenceDataVO;
    refSocioEconomicGroup: ReferenceDataVO;
    title: string;
    firstName: string;
    lastName: string;
    nickname: string;
    birthdate: Date;
    jobTitle: string;
    login: string;
    password: string;
    secondLogin: string;
    secondPassword: string;
    firstEventDate: Date;
    sesame: string;
    isFounderMembership: boolean;
    companyName: string;
    crmName: string;
    isHusbandWife: boolean;
    isAssistant: boolean;
    activityComplement: string;
    refCompanyType: ReferenceDataVO;
    isRetired: boolean;
    refNationality: ReferenceDataVO;
    photo: DocumentVO;
    refFavoriteContactMethod1: ReferenceDataVO;
    refFavoriteContactMethod2: ReferenceDataVO;
    refFavoriteContactMethod3: ReferenceDataVO;
    refFAI: ReferenceDataVO;
    refWifiHome: ReferenceDataVO;
    ref3GHome: ReferenceDataVO;
    expectations: string;
    digitalUses: string;
    portraitByCoach: string;
    refGlobalSatisfaction: ReferenceDataVO;
    isPresentToEvent: boolean;
    refEventAbsenceReason: ReferenceDataVO;
    refProfessionalUse: ReferenceDataVO;
    refPersonalUse: ReferenceDataVO;
    refTravelerProfile: ReferenceDataVO;
    refTechnophile: ReferenceDataVO;
    refConnected: ReferenceDataVO;
    refAssistance: ReferenceDataVO;
    sensitiveMemberComent: string;
    partnerProvideurContributorComent: string;
    stopMemberComent: string;
    behaviorWithParnasseComent: string;
    refSpender: ReferenceDataVO;
    refAccessibility: ReferenceDataVO;
    refInaccessibilityReason: ReferenceDataVO;
    refInfluence: ReferenceDataVO;
    hasConciergeService: string;
    conciergeServiceName: string;
    refNoParnasseConciergeReason: ReferenceDataVO;
    hasHomeStaff: string;
    refMembershipReason2: ReferenceDataVO;
    isHonoraryMember: boolean;
    refTestAccount: ReferenceDataVO;
    refJob: ReferenceDataVO;
    numberOfPersonAtHome: number;
    refPotentialCooptation: ReferenceDataVO;
    refPotentialTurnover: ReferenceDataVO;
    cityResidence: string;
    refCountryPrimaryResidence: ReferenceDataVO;
    refCountrySecondaryResidence1: ReferenceDataVO;
    refCountrySecondaryResidence2: ReferenceDataVO;
    refResidenceCriterion: ReferenceDataVO;
    hasMac: boolean;
    hasComputer: boolean;
    listRefDataPerson: ReferenceDataVO[];
    personTypes: ReferenceDataVO[];
    personCustomerRoles: PersonCustomerRoleVO[];
    solicitationsTarget: SolicitationTargetVO[];
    contactMethods: ContactMethodVO[];
    customerParkItemsAsUser: CustomerParkItemVO[];
    refConjointIsPresent: ReferenceDataVO;
    conjointInformations: string;
    refParnasseKnowledge: ReferenceDataVO;
    additionalInformations: string;
    membershipReasonComment: string;
    obsType: ReferenceDataVO;
    obscomment: string;
    refPersonalNetwork: ReferenceDataVO;
    refPublicNotoriety: ReferenceDataVO;
    refDigitalInfluence: ReferenceDataVO;
    isBusinessProvider: boolean;
    isSupplier: boolean;
    isSensitiveMember: boolean;
    isPartnerProvideurContributor: boolean;
    isStopMember: boolean;
    isBehaviorWithParnasse: boolean;
    refMemberColor: ReferenceDataVO;
    personAffiliateRoles: PersonAffiliateRoleVO[];
    fullName: string;
    coment: string;
    serviceName: string;
}

export interface PostalAddressVO extends ContactMethodVO {
    title: Title;
    firstName: string;
    lastName: string;
    addrLine4: string;
    addrLine3: string;
    addrLine2: string;
    addrLine5: string;
    addrLine6: string;
    logisticInfo: string;
    cedex: string;
    orasId: number;
    postalCode: string;
    city: string;
    country: ReferenceDataVO;
    category: CategoryCustomer;
    companyName: string;
    socialTitle: ReferenceDataVO;
    streetName: string;
    streetExtension: string;
    streetNumber: number;
    streetType: string;
    geoCodeX: number;
    geoCodeY: number;
    inseeCode: string;
    rivoliCode: string;
    hexacleVoie: string;
    hexacleNumero: string;
    active: boolean;
}

export interface ProactifRdvVO {
    id: number;
    status: string;
    request: RequestVO;
    type: string;
    proposedDate: Date;
    coach: UserVO;
    isActive: boolean;
    modifiedAt: Date;
    modifiedBy: UserVO;
    subjectLabel: string;
}

export interface ProcedureExecutionVO {
    procedureName: string;
    procedureType: string;
    nodeAnswerId: number;
}

export interface ProcedureVO {
    id: number;
    name: string;
    repeatable: boolean;
}

export interface ProductVO {
    id: number;
    name: string;
    priceHt: number;
    status: string;
    family: FamilyVO;
    partnerId: number;
    partnerName: string;
    longDescription: string;
    shortDescription: string;
    stockQuantity: number;
    stockOrder: number;
    isOnStock: boolean;
    manufacturerId: number;
    manufacturerName: string;
    availabilityDate: Date;
    partnerProductReference: string;
    prorataBegin: boolean;
    prorataEnd: boolean;
    recurrent: boolean;
    blocked: boolean;
    subscriptionPeriodicity: string;
    productImageName: string;
    productDescriptionName: string;
    tva: string;
    billingCategory: string;
    ecoTaxe: number;
    libelleFacture: string;
    uniteOeuvreId: number;
    uniteOeuvreLabel: string;
    prixSurDemande: boolean;
    dureeIntervention: number;
    detail: string;
    preRequis: string;
    conditionsTarifaires: string;
    showingPortal: boolean;
    quantityBlocked: boolean;
    serialRequired: boolean;
    discountLabel: string;
    discountIncluded: boolean;
    discountFree: boolean;
    included: boolean;
    discountHt: number;
    discountPercent: number;
    needs: NeedVO[];
    features: CriterionValueVO[];
    prefixSerialNumber: ReferenceDataVO;
    warrantyValue: number;
    warrantyLabel: string;
    isWarranty: boolean;
    articleClassLabel: string;
    articleClassId: number;
    nomenclature: NomenclatureVO;
    commentMandatory: boolean;
    masterProductId: number;
    masterProduct: MasterProductVO;
    customerTarget: string;
    acquisitionPrice: number;
    acquisitionPriceReal: number;
    purchasePrice: number;
    purchasePriceReal: number;
    pricingType: string;
    pricingTypeReal: string;
    travelIncluded: boolean;
    fixedMarginRate: number;
    fixedMarginRateReal: number;
    publidispatchStockQuantity: number;
    isOnPublidispatchStock: boolean;
    stockOpera: number;
	stockRiviera: number;
	stockRaspail: number;
	stockProvence: number;
	stockLyonRhone: number;
	stockHauteSavoie: number;
    available: string;
    photo: any;
}

export interface PurchaseRequestVO extends RequestVO {
    refRequestOrigin: ReferenceDataVO;
}

export interface ReferenceDataVO {
    id: number;
    label: string;
    ordinal: number;
    active: boolean;
    dateUpdate: Date;
    parent: ReferenceDataVO;
    list: ReferenceListVO;
    children: ReferenceDataVO[];
    logoName: string;
    key: string;
}

export interface ReferenceListVO {
    id: number;
    name: string;
    typeData: string;
    typeList: string;
    dateUpdate: Date;
    values: string;
    idMyNiche: number;
    depth: number;
}

export interface RendezvousVO {
    id: number;
    requestId: number;
    customerId: number;
    customerLastNameFirstName: string;
    refMedia: ReferenceDataVO;
    interactionReasonId: number;
    interactionReasonLabel: string;
    contactMethod: ContactMethodVO;
    customerParkItem: CustomerParkItemVO;
    moreInformation: string;
    comment: string;
    conclusion: string;
    date: Date;
    duration: number;
    status: string;
    statusUpdateDate: Date;
    creationDate: Date;
    createdByName: string;
    updateDate: Date;
    updatedByName: string;
    participants: UserVO[];
    person: PersonVO;
}

export interface RenewalMobileVO {
    id: number;
    beginDate: Date;
    endDate: Date;
    operationDate: Date;
    renewalDate: Date;
    comment: string;
    customerParkItemId: number;
    modifiedBy: number;
    userName: string;
    customerName: string;
    webServiceIdentifier: string;
    customerId: number;
    classification: number;
    customerParkItem: number;
}

export interface RequestCreationContextVO {
    customerId: number;
    media: ReferenceDataVO;
    universe: ReferenceDataVO;
    title: string;
    businessAccountManager: UserVO;
    origin: ReferenceDataVO;
}

export interface RequestReferentVO {
    id: number;
    requestId: number;
    requestHolderUserId: number;
    userId: number;
    userName: string;
    roleId: number;
    roleName: string;
    roleDisplayName: string;
    roleInputUserId: number;
}

export interface RequestSavVO {
    requestId: number;
    cartId: number;
    createdByName: string;
    generatedAt: Date;
    attachedUserName: string;
    smmUserName: string;
    customerId: number;
    customerName: string;
    customerOfferLabel: string;
    createdAt: Date;
    title: string;
    status: string;
    cartStatus: string;
    conclusionType: string;
    caseNumber: string;
}

export interface RequestTypeVO {
    id: number;
    idFamily: number;
    label: string;
    active: boolean;
    ordinal: number;
    automatic: boolean;
    key: string;
    workflow: WorkflowVO;
    technicalKey: string;
}

export interface RequestVO {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
    createdById: number;
    createdByName: string;
    modifiedAt: Date;
    modifiedById: number;
    modifiedByName: string;
    canonicalLabel: string;
    customerId: number;
    customerName: string;
    customerNicheIdentifier: string;
    customerStatus: number;
    conclusionType: string;
    status: string;
    step: number;
    closureComment: string;
    refusalReason: string;
    refusalText: string;
    refusalDate: Date;
    generatedAt: Date;
    originType: string;
    attachedUserId: number;
    attachedUserName: string;
    realEndDate: Date;
    customerLastNameFirstName: string;
    customerDeskerFullname: string;
    isConnectedOnWf: boolean;
    requestType: RequestTypeVO;
    workflow: WorkflowVO;
    proceduresAtCreation: ProcedureVO[];
    referents: RequestReferentVO[];
    universes: ReferenceDataVO[];
    nodeAnswerList: NodeAnswerVO[];
    customersBenefList: CustomerVO[];
    accountManagerUserId: number;
    accountManagerName: string;
    accountManagerRoleId: number;
    orderScoring: number;
    closingDate: Date;
    customerOfferLabel: string;
    cartStatus: string;
    listTaskAssignedIdByRequest: number[];
    cartId: number;
    cartItems: CartItemVO[];
    cartTotalHt: number;
    cartColor: string;
    countTasksAssigned: number;
    hasLateTasks: boolean;
    customerOfferStatus: string;
    campaignId: number;
    isHolder: boolean;
    dateStatusOrder: string;
    orderStatus: string;
    interlocuteur: PersonVO;
    recepientName: string;
    recepientId: number;
    recipientNicheId: string;
    arrow: string;
    stockToUseCode: string;
    isBlocked: boolean;
}

export interface RequestAnswersVO {
    id: number;
    idRequest: number;
    answer: string; 
  }

export interface RoleVO {
    id: number;
    name: string;
    idMyNiche: number;
    description: string;
    active: boolean;
    dateUpdate: Date;
    configurationModules: ConfigurationModuleVO[];
    inputUser: UserVO;
    hasReferent: boolean;
    displayName: string;
    requestReferentAutoSave: boolean;
    parentId: number;
}

export interface ServiceCounterHistoVO {
    cartId: number;
    customerId: number;
    hardParkItemId: number;
    offerServiceCounterId: number;
    dateModify: Date;
    userId: number;
    comment: string;
    incrementValue: number;
    remainingValue: number;
    requestId: number;
    userLabel: string;
    cartItemListLabel: string;
}

export interface ServiceOrOptionVO {
}

export interface SmsVO extends MessageVO {
}

export interface SolicitationCriterionVO {
    id: number;
    solicitation: number;
    criterionKey: string;
    isNotRecommended: boolean;
    isNotAllowed: boolean;
}

export interface SolicitationTargetVO {
    id: number;
    solicitation: SolicitationVO;
    person: number;
    outputStatus: ReferenceDataVO;
    reason: ReferenceDataVO;
    disableByResponse: boolean;
    disableByCriterion: boolean;
    proactifRdv: number;
    timeLaps: Date;
    isActive: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date;
    modifiedBy: number;
    criterions: SolicitationCriterionVO[];
    groupingComplementValue: number;
    groupingType: string;
    groupingLabel: string;
    groupingTypesAddress: string;
    subjectTitleLabel: string;
    subjectCategory: string;
    customerName: string;
    proposedDate: Date;
    typeRdvGenerated: string;
    noMoreSolicitation: boolean;
    interaction: string;
    comment: string;
    lastModifier: string;
}

export interface SolicitationVO {
    id: number;
    title: string;
    subject: number;
    startDate: Date;
    endDate: Date;
    description: string;
    isAutomatic: boolean;
    isMarketingCampaign: boolean;
    document: number;
    isStartRdv: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date;
    modifiedBy: number;
    criterions: SolicitationCriterionVO[];
    categorySolicitation: string;
    typeRdvGenerated: string[];
}

export interface StatsCustomerBillsUniverseVO {
    universe: string;
    count: number;
}

export interface StatsCustomerBillsVO extends Comparable<StatsCustomerBillsVO> {
    customerIdentifier: string;
    statsUniverse: StatsCustomerBillsUniverseVO[];
    cr: number;
    customerName: string;
    deskName: string;
    customerId: number;
}

export interface StylesheetVO {
    id: number;
    stylesheetFile: string;
}

export interface SubjectRuleVO {
    id: number;
    subject: number;
    outputStatus: ReferenceDataVO;
    action: number;
    isDate: boolean;
    isUser: boolean;
    timeLaps: number;
    reasons: ReferenceDataVO[];
}

export interface SubjectVO {
    id: number;
    label: string;
    description: string;
    category: string;
    isPermanent: boolean;
    isActive: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt: Date;
    modifiedBy: number;
    groupingType: string;
}

export interface TaskVO {
    id: number;
    inChargeOfId: number;
    inChargeOfName: string;
    assignedToId: number;
    assignedToName: string;
    createdById: number;
    createdByName: string;
    closedById: number;
    closedByName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    creationDate: Date;
    refTypology: ReferenceDataVO;
    requestTypeName: string;
    statusChangeDate: Date;
    status: string;
    requestId: number;
    customerFullName: string;
    customerId: number;
    companyCustomerId: number;
    customerNicheIdentifier: string;
    customerLastNameFirstName: string;
    resolutionStatus: string;
    resolutionDuration: number;
    realEndDate: Date;
    resolutionComment: string;
    node: NodeVO;
    userIdToNotify: number;
    userNameToNotify: string;
    nodeAnswerList: NodeAnswerVO[];
    procedureExecutionList: ProcedureExecutionVO[];
    accountManagerUserId: number;
    isBlocked: boolean;
    customerOfferLabel: string;
    interventionReportVO: InterventionReportVO;
    cartId: number;
    cartItems: CartItemVO[];
    cartTotalHt: number;
    cartColor: string;
    userComment: string;
    isPriority: boolean;
    dateStatusOrder: string;
    orderStatus: string;
}

export interface UserProfileVO {
    id: number;
    entry: string;
    value: string;
}

export interface UserRoleHistoVO {
    id: number;
    user: number;
    role: RoleVO;
    modifiedBy: number;
    modificationDate: Date;
    isActive: boolean;
}

export interface UserVO {
    id: number;
    ftUniversalId: string;
    email: string;
    phoneNumber: string;
    parnasseEmail: string;
    parnassePhoneNumber: string;
    active: boolean;
    dateUpdate: Date;
    name: string,
    firstName: string;
    lastName: string;
    roleNamesAsStringList: string[];
    roleNamesAsString: string;
    buildVersion: string;
    environmentName: string;
    roles: RoleVO[];
    entities: NicheEntityVO[];
    roleIds: number[];
    myBackupsId: number[];
    isMobile: boolean;
    isBlocked: boolean;
    isBoMembership: boolean;
    canalType: ReferenceDataVO;
    canal: ReferenceDataVO;
    acquisitionChannelComplement: string;
    useChorniche: boolean;
    phoneLogin: string;
    treatmentGroup: string;
    phoneNum: string;
    lastConnection: Date;
    selectedRole: RoleVO;
}

export interface VueMetierParcVO {
    parkTelcoId: number;
    msisdn: string;
    offreActuelle: string;
    flagEligibiliteRenouvellementMonde: boolean;
    nombreJoursEnOffreExclusifMonde12Mois: number;
    nombreJoursEnOffreExclusifMondeRestant12Mois: number;
    dateHeureCreationVmParc: Date;
}

export interface WelcomeMailVO {
    id: number;
    addressId: number;
    issueDate: Date;
    fullInfosWelcomeMail: string;
    civility: string;
    coach: string;
    fullTitle: string;
    isArchived: boolean;
    isValid: boolean;
    requestId: number;
}

export interface WorkflowVO {
    id: number;
    isSwitchOff: boolean;
}

export interface BillHistoriqueStatus {
    date: string;
    time: string;
    penicheStatus: PenicheBillStatus;
    customerParkItem: CustomerParkItemVO;
    sendStatus: SendStatus;
    sendCancelled: boolean;
    dateSendCancelled: Date;
}

export interface PaginatedList<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    sortField: string;
    sortOrder: SortOrder;
}

export interface AbsenceLight {
    id: number;
    beginDate: Date;
    endDate: Date;
    userId: number;
    userName: string;
    backupId: number;
    backupName: string;
    status: string;
    comment: string;
    backupMail: string;
    beginDateFormatted: string;
    endDateFormatted: string;
}

export interface AcquisitionCanalLight {
    id: number;
    customerId: number;
    canalKey: string;
    canalName: string;
    typeKey: string;
    typeName: string;
    details1: string;
    details2: string;
    details3: string;
    customerOtherId: number;
    customerOtherFullName: string;
    userId: number;
    numberCanal: number;
    otherUserId: number;
}

export interface Comparable<T> {
}

export type BillType = "CR" | "FACTURE";

export type Status = "CREATED" | "CANCELED" | "ORDERED" | "WARNING" | "CONFIRMED" | "SENT" | "PARTIAL_SENT" | "REJECTED" | "ABANDONED" | "ERROR" | "DELIVERED" | "PARTIAL_DELIVERED" | "RETURNED" | "ON_TOUR" | "PARTIAL_ON_TOUR";

export type PartnerStatus = "NOT_REFERENCED" | "REFERENCED" | "PENDING";

export type PenicheTypeEnvoiLivrable = "MAIL" | "MANUEL" | "PAPIER_AUTO" | "ANNULE";

export type Title = "M" | "MME" | "UNKNOWN";

export type CategoryCustomer = "PARTICULIER" | "ENTREPRISE";

export type PenicheBillStatus = "EN_ATTENTE" | "EN_RETARD" | "FOND_A_VALIDER_METIER" | "FOND_INVALIDE_METIER_ATTENTE_CORRECTION" | "FOND_VALIDE_SI" | "FOND_INVALIDE_METIER_CORRIGE" | "FOND_VALIDE_METIER" | "FORME_VALIDE_SI" | "FORME_A_VALIDER_METIER" | "FORME_INVALIDE_METIER_ATTENTE_CORRECTION" | "FORME_INVALIDE_METIER_CORRIGE" | "FORME_VALIDE_METIER" | "ARCHIVE" | "A_ENVOYER" | "ENVOYE";

export type SendStatus = "MAIL" | "PAPIER" | "ANNULE";

export type SortOrder = "ASC" | "DESC";
