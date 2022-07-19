import { AcquisitionCanalLight } from './acquisition-canal-light';
import { ChildVO } from './child-vo';
import { CustomerHardwareParkItemVO } from './customer-hardware-park-item-vo';
import { CustomerParkItemVO } from './customer-park-item-vo';
import { CustomerReferentVO } from './customer-referent-vo';
import { PersonCustomerRoleVO } from './person-customer-role-vo';
import { PersonVO } from './person-vo';
import { ReferenceDataVO } from './reference-data-vo';

export interface CustomerVO {
    id: number;
    companyCustomerId: number;
    customerAffiliates: CustomerVO[];
    personCustomerRolesLight : any[];
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
    customerCrmName: string;
    customerFullName: string;
    counter: number;
    offerLabel: string;
    offresService: CustomerHardwareParkItemVO[];
    prestations: CustomerHardwareParkItemVO[];
    materiels: CustomerHardwareParkItemVO[];
    idsActualBeneficiaries: number[];
    companyCustomerCrmName: string;
    offerIds: number[];
    firstNameCreated: string;
	lastNameCreated: string;
}
