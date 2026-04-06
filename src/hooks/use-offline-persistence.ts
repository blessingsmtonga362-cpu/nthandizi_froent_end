import { useEffect } from 'react';
import { openDB } from 'idb';
import { useApplicationStore } from '@/lib/store/use-application-store';

const DB_NAME = 'unima_support_db';
const STORE_NAME = 'application_draft';

export function useOfflinePersistence() {
  const { data, updatePersonal, updateFamily, updateEducation, updateAcademics, updatePayment } = useApplicationStore();

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB(DB_NAME, 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
      const saved = await db.get(STORE_NAME, 'current_draft');
      if (saved) {
        if (saved.personal) updatePersonal(saved.personal);
        if (saved.family) updateFamily(saved.family);
        if (saved.education) {
          updateEducation('primary', saved.education.primary);
          updateEducation('secondary', saved.education.secondary);
          updateEducation('tertiary', saved.education.tertiary);
        }
        if (saved.academics) updateAcademics(saved.academics);
        if (saved.payment) updatePayment(saved.payment);
      }
    };
    initDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const syncDB = async () => {
      const db = await openDB(DB_NAME, 2);
      // Don't persist File objects — strip them before saving
      const serializable = {
        personal: { ...data.personal, studentIdFile: null, nationalIdFile: null },
        family: { ...data.family, deathCertificateFile: null, guarantorNationalIdFile: null, guarantorConsentFile: null },
        education: data.education,
        academics: { ...data.academics, transcriptFile: null },
        payment: data.payment,
      };
      await db.put(STORE_NAME, serializable, 'current_draft');
    };
    if (data.lastSaved) syncDB();
  }, [data]);
}
