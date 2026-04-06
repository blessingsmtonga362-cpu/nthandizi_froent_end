import { create } from 'zustand';

export interface PersonalData {
  firstName: string;
  surname: string;
  phoneNumber: string;
  nationalId: string;
  homeDistrict: string;
  physicalAddress: string;
  dateOfBirth: string;
  maritalStatus: string;
  disability: string;
  ta: string;
  registrationNumber: string;
  gender: string;
  studentIdFile: File | null;
  nationalIdFile: File | null;
}

export interface FamilyData {
  guardianFirstName: string;
  guardianSurname: string;
  guardianProfession: string;
  guardianDob: string;
  guardianEmail: string;
  guardianResidentialAddress: string;
  guardianPostalAddress: string;
  guardianTa: string;
  guardianEducationLevel: string;
  deathCertificateFile: File | null;
  guarantorNationalIdFile: File | null;
  guarantorConsentFile: File | null;
}

export interface EducationLevel {
  schoolName: string;
  tuitionFee: string;
  yearCompleted: string;
  whoPaidFees: string;
}

export interface EducationData {
  primary: EducationLevel;
  secondary: EducationLevel;
  tertiary: EducationLevel;
}

export interface AcademicsData {
  programOfStudy: string;
  department: string;
  yearOfStudy: string;
  transcriptFile: File | null;
}

export interface PaymentData {
  paymentMethod: string;
  phoneNumber: string;
  accountName: string;
  accountNumber: string;
}

interface ApplicationData {
  personal: PersonalData;
  family: FamilyData;
  education: EducationData;
  academics: AcademicsData;
  payment: PaymentData;
  currentStep: number;
  lastSaved: Date | null;
}

interface ApplicationStore {
  data: ApplicationData;
  updatePersonal: (d: Partial<PersonalData>) => void;
  updateFamily: (d: Partial<FamilyData>) => void;
  updateEducation: (level: keyof EducationData, d: Partial<EducationLevel>) => void;
  updateAcademics: (d: Partial<AcademicsData>) => void;
  updatePayment: (d: Partial<PaymentData>) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const emptyEducationLevel: EducationLevel = {
  schoolName: '', tuitionFee: '', yearCompleted: '', whoPaidFees: '',
};

const initialData: ApplicationData = {
  personal: {
    firstName: '', surname: '', phoneNumber: '', nationalId: '',
    homeDistrict: '', physicalAddress: '', dateOfBirth: '', maritalStatus: '',
    disability: 'None', ta: '', registrationNumber: '', gender: '',
    studentIdFile: null, nationalIdFile: null,
  },
  family: {
    guardianFirstName: '', guardianSurname: '', guardianProfession: '',
    guardianDob: '', guardianEmail: '', guardianResidentialAddress: '',
    guardianPostalAddress: '', guardianTa: '', guardianEducationLevel: '',
    deathCertificateFile: null, guarantorNationalIdFile: null, guarantorConsentFile: null,
  },
  education: {
    primary: { ...emptyEducationLevel },
    secondary: { ...emptyEducationLevel },
    tertiary: { ...emptyEducationLevel },
  },
  academics: {
    programOfStudy: '', department: '', yearOfStudy: '', transcriptFile: null,
  },
  payment: {
    paymentMethod: '', phoneNumber: '', accountName: '', accountNumber: '',
  },
  currentStep: 1,
  lastSaved: null,
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
  data: initialData,
  updatePersonal: (d) => set((s) => ({
    data: { ...s.data, personal: { ...s.data.personal, ...d }, lastSaved: new Date() }
  })),
  updateFamily: (d) => set((s) => ({
    data: { ...s.data, family: { ...s.data.family, ...d }, lastSaved: new Date() }
  })),
  updateEducation: (level, d) => set((s) => ({
    data: {
      ...s.data,
      education: {
        ...s.data.education,
        [level]: { ...s.data.education[level], ...d },
      },
      lastSaved: new Date(),
    }
  })),
  updateAcademics: (d) => set((s) => ({
    data: { ...s.data, academics: { ...s.data.academics, ...d }, lastSaved: new Date() }
  })),
  updatePayment: (d) => set((s) => ({
    data: { ...s.data, payment: { ...s.data.payment, ...d }, lastSaved: new Date() }
  })),
  setStep: (step) => set((s) => ({ data: { ...s.data, currentStep: step } })),
  reset: () => set({ data: initialData }),
}));
