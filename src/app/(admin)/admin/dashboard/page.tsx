"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  getAdminApplicantDetails,
  getAdminDashboardStats,
  reviewAdminApplicant,
  type AdminApplicantDetailsResponse,
  type AdminApplicantStatus,
  type AdminEducationRecord,
  type AdminFamilyDetails,
  type AdminPersonalDetails,
  type DashboardStats,
} from "@/lib/api";

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "Not provided";
  if (typeof value === "string" && value.trim() === "") return "Not provided";
  return String(value);
}

function formatCurrency(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "Not provided";
  return `MWK ${value}`;
}

function formatApplicantStatus(status: AdminApplicantStatus) {
  switch (status) {
    case "approved":
      return "Approved";
    case "flagged":
      return "Flagged";
    default:
      return "Pending Review";
  }
}

function statusBadgeClass(status: AdminApplicantStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "flagged":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-display font-bold uppercase tracking-widest text-brand-slate">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function DetailGrid({
  fields,
}: {
  fields: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label} className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{field.label}</p>
          <p className="text-sm font-medium text-slate-700 break-words">{field.value}</p>
        </div>
      ))}
    </div>
  );
}

function renderFamilyFields(family: AdminFamilyDetails) {
  const fields = [
    { label: "Parental Status", value: formatValue(family.parentalStatus) },
    { label: "Father First Name", value: formatValue(family.fatherFirstName) },
    { label: "Father Surname", value: formatValue(family.fatherSurname) },
    { label: "Father National ID", value: formatValue(family.fatherNationalId) },
    { label: "Father Phone", value: formatValue(family.fatherPhone) },
    { label: "Father Profession", value: formatValue(family.fatherProfession) },
    { label: "Father Monthly Income", value: formatCurrency(family.fatherMonthlyIncome) },
    { label: "Father T/A", value: formatValue(family.fatherTa) },
    { label: "Father Residential Address", value: formatValue(family.fatherResidentialAddress) },
    { label: "Father Postal Address", value: formatValue(family.fatherPostalAddress) },
    { label: "Mother First Name", value: formatValue(family.motherFirstName) },
    { label: "Mother Surname", value: formatValue(family.motherSurname) },
    { label: "Mother National ID", value: formatValue(family.motherNationalId) },
    { label: "Mother Phone", value: formatValue(family.motherPhone) },
    { label: "Mother Profession", value: formatValue(family.motherProfession) },
    { label: "Mother Monthly Income", value: formatCurrency(family.motherMonthlyIncome) },
    { label: "Mother T/A", value: formatValue(family.motherTa) },
    { label: "Mother Residential Address", value: formatValue(family.motherResidentialAddress) },
    { label: "Mother Postal Address", value: formatValue(family.motherPostalAddress) },
    { label: "Living Parent First Name", value: formatValue(family.parentFirstName) },
    { label: "Living Parent Surname", value: formatValue(family.parentSurname) },
    { label: "Living Parent National ID", value: formatValue(family.parentNationalId) },
    { label: "Living Parent Phone", value: formatValue(family.parentPhone) },
    { label: "Living Parent Income", value: formatCurrency(family.parentMonthlyIncome) },
    { label: "Student Relationship", value: formatValue(family.studentRelationship) },
    { label: "Parent T/A", value: formatValue(family.parentTa) },
    { label: "Parent Residential Address", value: formatValue(family.parentResidentialAddress) },
    { label: "Parent Postal Address", value: formatValue(family.parentPostalAddress) },
    { label: "Deceased Parent ID", value: formatValue(family.deceasedParentId) },
    { label: "Guardian First Name", value: formatValue(family.guardianFirstName) },
    { label: "Guardian Last Name", value: formatValue(family.guardianLastName) },
    { label: "Guardian National ID", value: formatValue(family.guardianNationalId) },
    { label: "Guardian Phone", value: formatValue(family.guardianPhone) },
    { label: "Guardian Income", value: formatCurrency(family.guardianMonthlyIncome) },
    { label: "Relationship To Guardian", value: formatValue(family.relationshipToGuardian) },
    { label: "Guardian T/A", value: formatValue(family.guardianTa) },
    { label: "Guardian Residential Address", value: formatValue(family.guardianResidentialAddress) },
    { label: "Guardian Postal Address", value: formatValue(family.guardianPostalAddress) },
    { label: "Deceased Father ID", value: formatValue(family.deceasedFatherId) },
    { label: "Deceased Mother ID", value: formatValue(family.deceasedMotherId) },
    { label: "Number of Siblings", value: formatValue(family.numberOfSiblings) },
    { label: "Number Still In School", value: formatValue(family.numberStillInSchool) },
    { label: "Siblings In Primary", value: formatValue(family.siblingsInPrimary) },
    { label: "Siblings In Secondary", value: formatValue(family.siblingsInSecondary) },
    { label: "Siblings In Tertiary", value: formatValue(family.siblingsInTertiary) },
  ];

  return <DetailGrid fields={fields} />;
}

function EducationList({
  title,
  records,
}: {
  title: string;
  records: AdminEducationRecord[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</p>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {records.length} {records.length === 1 ? "record" : "records"}
        </span>
      </div>

      {records.length === 0 ? (
        <div className="border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-400">
          No records submitted for this level.
        </div>
      ) : (
        records.map((record) => (
          <div key={record.id} className="border border-slate-200 bg-slate-50/60 p-4">
            <DetailGrid
              fields={[
                { label: "School Name", value: formatValue(record.schoolName) },
                { label: "Tuition Fees", value: formatCurrency(record.tuitionFees) },
                { label: "Year Completed", value: formatValue(record.yearCompleted) },
                { label: "Who Paid Fees", value: formatValue(record.whoPaidFees) },
                { label: "Verified", value: record.isVerified ? "Yes" : "No" },
              ]}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminApplicantDetailsResponse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [reviewStatus, setReviewStatus] = useState<Extract<AdminApplicantStatus, "approved" | "flagged">>("approved");
  const [reviewComments, setReviewComments] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const loadStats = async () => {
    try {
      const response = await getAdminDashboardStats();
      setStats(response);
    } catch {
      setStats({ totalApplications: 0, approvedSupport: 0, flaggedFiles: 0, priorityQueue: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const openApplicant = async (userId: string) => {
    setSelectedApplicantId(userId);
    setDetailsLoading(true);
    setDetailsError("");
    setReviewError("");

    try {
      const response = await getAdminApplicantDetails(userId);
      setDetails(response);
      setReviewStatus(response.applicant.status === "flagged" ? "flagged" : "approved");
      setReviewComments(response.applicant.reviewComments ?? "");
    } catch (error) {
      setDetails(null);
      setDetailsError(error instanceof Error ? error.message : "Failed to load applicant details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeApplicant = () => {
    setSelectedApplicantId(null);
    setDetails(null);
    setDetailsError("");
    setReviewError("");
    setReviewComments("");
    setReviewStatus("approved");
  };

  const handleReviewSubmit = async () => {
    if (!selectedApplicantId) return;

    if (reviewStatus === "flagged" && reviewComments.trim().length === 0) {
      setReviewError("Please leave a comment explaining why this application is being flagged.");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    try {
      const response = await reviewAdminApplicant(selectedApplicantId, {
        status: reviewStatus,
        reviewComments: reviewComments.trim() || undefined,
      });

      setDetails((current) =>
        current
          ? {
              ...current,
              applicant: {
                ...current.applicant,
                status: response.applicant.status,
                reviewComments: response.applicant.reviewComments,
              },
            }
          : current,
      );

      await loadStats();
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "Failed to save review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const tiles = [
    { label: "Total applications", value: stats?.totalApplications ?? "—", icon: Users, color: "text-blue-600", href: "/admin/applicants" },
    { label: "Approved applicants", value: stats?.approvedSupport ?? "—", icon: CheckCircle, color: "text-emerald-600", href: "/admin/approved" },
    { label: "Flagged applicants", value: stats?.flaggedFiles ?? "—", icon: AlertCircle, color: "text-red-600", href: "/admin/flagged" },
  ];

  const personal = details?.application.personalDetails as AdminPersonalDetails | null | undefined;
  const family = details?.application.familyDetails;
  const academics = details?.application.academicDetails;
  const verificationLogs = details?.verificationLogs ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-slate tracking-tight">Applicant Review Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">
            Review submitted student applications, inspect supporting details, and record decisions with comments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiles.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => router.push(stat.href)}
            className="group bg-white p-6 border border-slate-200 relative overflow-hidden cursor-pointer hover:border-brand-blue hover:shadow-[0_16px_48px_-8px_rgba(15,23,42,0.22)] hover:scale-[1.02] transition-all duration-200"
          >
            <div className="origin-top-left transition-transform duration-200 ease-out group-hover:scale-[1.06]">
              <div className="mb-5">
                <stat.icon
                  size={24}
                  className={cn(stat.color, "transition-transform duration-200 group-hover:scale-110")}
                />
              </div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-display font-bold text-brand-slate mt-1">
                {loading ? <span className="inline-block w-14 h-7 bg-slate-100 animate-pulse" /> : stat.value.toLocaleString()}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-brand-slate text-sm">Priority review queue</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200">
            <ShieldCheck size={12} className="text-brand-blue" />
            <span className="text-xs font-medium text-slate-500">Internal access</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4 text-center">Need index</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-5">
                      <div className="h-4 bg-slate-100 rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : stats?.priorityQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    No applications in the queue yet.
                  </td>
                </tr>
              ) : (
                (stats?.priorityQueue ?? []).map((row, i) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-blue text-sm">#{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-slate">{row.name}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {row.registrationNumber || row.id}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {row.program}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex border px-2.5 py-1 text-[11px] font-bold",
                          row.score > 80 ? "bg-red-50 text-red-600 border-red-200" : row.score > 60 ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-emerald-50 text-emerald-600 border-emerald-200",
                        )}
                      >
                        {row.score}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("inline-flex border px-2.5 py-1 text-xs font-medium", statusBadgeClass(row.status))}>
                        {formatApplicantStatus(row.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void openApplicant(row.id)}
                        className="inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-brand-blue hover:text-brand-blue"
                      >
                        View more
                        <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplicantId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-sm">
          <div className="h-full w-full max-w-3xl overflow-y-auto border-l border-slate-200 bg-slate-50 shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
              <div className="flex items-start justify-between gap-4 px-6 py-5">
                <div>
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-slate-400">Applicant Review</p>
                  <h2 className="mt-1 text-xl font-display font-bold text-brand-slate">
                    {details?.applicant.firstName} {details?.applicant.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{details?.applicant.email ?? selectedApplicantId}</p>
                </div>
                <button
                  type="button"
                  onClick={closeApplicant}
                  className="border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {detailsLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
                  <Loader2 size={18} className="animate-spin" />
                  Loading applicant details...
                </div>
              ) : detailsError ? (
                <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {detailsError}
                </div>
              ) : details ? (
                <>
                  <SectionCard title="Applicant Summary">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={cn("inline-flex border px-3 py-1 text-[10px] font-bold uppercase tracking-widest", statusBadgeClass(details.applicant.status))}>
                          {formatApplicantStatus(details.applicant.status)}
                        </span>
                        <span className="inline-flex border border-slate-200 bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                          Completion {details.applicationMeta.completionPercentage}%
                        </span>
                      </div>
                      <DetailGrid
                        fields={[
                          { label: "Registration Number", value: formatValue(details.applicant.registrationNumber) },
                          { label: "Email", value: formatValue(details.applicant.email) },
                          { label: "Completed Sections", value: `${details.applicationMeta.completedSections}/${details.applicationMeta.totalSections}` },
                          { label: "Last Updated", value: formatValue(details.applicationMeta.lastUpdated) },
                        ]}
                      />
                      {details.applicationMeta.missingSections.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          Missing sections: {details.applicationMeta.missingSections.join(", ")}
                        </div>
                      )}
                    </div>
                  </SectionCard>

                  <SectionCard title="Personal Details">
                    <DetailGrid
                      fields={[
                        { label: "First Name", value: formatValue(personal?.firstName) },
                        { label: "Last Name", value: formatValue(personal?.lastName) },
                        { label: "Phone Number", value: formatValue(personal?.phoneNumber) },
                        { label: "National ID", value: formatValue(personal?.nationalIdNumber) },
                        { label: "Home District", value: formatValue(personal?.homeDistrict) },
                        { label: "Traditional Authority", value: formatValue(personal?.traditionalAuthority) },
                        { label: "Physical Address", value: formatValue(personal?.physicalAddress) },
                        { label: "Date of Birth", value: formatValue(personal?.dateOfBirth) },
                        { label: "Registration Number", value: formatValue(personal?.registrationNumber) },
                        { label: "Disability", value: formatValue(personal?.disability) },
                        { label: "Marital Status", value: formatValue(personal?.maritalStatus) },
                        { label: "Gender", value: formatValue(personal?.gender) },
                        { label: "Payment Method", value: formatValue(personal?.paymentMethod) },
                        { label: "Payment Phone Number", value: formatValue(personal?.paymentPhoneNumber) },
                        { label: "Bank Name", value: formatValue(personal?.bankName) },
                        { label: "Bank Account", value: formatValue(personal?.bankAccount) },
                        { label: "Account Name", value: formatValue(personal?.accountName) },
                      ]}
                    />
                  </SectionCard>

                  <SectionCard title="Academic Details">
                    <DetailGrid
                      fields={[
                        { label: "Program of Study", value: formatValue(academics?.programOfStudy) },
                        { label: "Department", value: formatValue(academics?.department) },
                        { label: "Year of Study", value: formatValue(academics?.yearOfStudy) },
                        { label: "Transcript URL", value: formatValue(academics?.transcriptPdfUrl) },
                      ]}
                    />
                  </SectionCard>

                  <SectionCard title="Family Details">
                    {family ? renderFamilyFields(family) : <p className="text-sm text-slate-400">No family details submitted.</p>}
                  </SectionCard>

                  <SectionCard title="Education Records">
                    <div className="space-y-5">
                      <EducationList title="Primary" records={details.application.education.primary} />
                      <EducationList title="Secondary" records={details.application.education.secondary} />
                      <EducationList title="Tertiary" records={details.application.education.tertiary} />
                    </div>
                  </SectionCard>

                  <SectionCard title="Verification Logs">
                    {verificationLogs.length === 0 ? (
                      <p className="text-sm text-slate-400">No verification logs found for this applicant.</p>
                    ) : (
                      <div className="space-y-4">
                        {verificationLogs.map((log) => (
                          <div key={log.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-sm font-bold text-brand-slate">{formatValue(log.documentType)}</p>
                              <span
                                className={cn(
                                  "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                                  log.isVerified ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700",
                                )}
                              >
                                {log.isVerified ? "Verified" : "Flagged"}
                              </span>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted Data</p>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{formatValue(log.userInput)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Extracted Data</p>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{formatValue(log.extractedData)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mismatches</p>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{formatValue(log.mismatches)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Warnings</p>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-600">{formatValue(log.warnings)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </SectionCard>

                  <SectionCard title="Review Decision">
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setReviewStatus("approved")}
                          className={cn(
                            "border px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors",
                            reviewStatus === "approved" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600",
                          )}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewStatus("flagged")}
                          className={cn(
                            "border px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors",
                            reviewStatus === "flagged" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600",
                          )}
                        >
                          Flag
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                          Reviewer Comment {reviewStatus === "flagged" ? "(Required)" : "(Optional)"}
                        </label>
                        <textarea
                          value={reviewComments}
                          onChange={(e) => setReviewComments(e.target.value)}
                          rows={5}
                          className="w-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-brand-blue"
                          placeholder="Record the decision context for this application."
                        />
                      </div>

                      {details.applicant.reviewComments && (
                        <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600">
                          Current saved comment: {details.applicant.reviewComments}
                        </div>
                      )}

                      {reviewError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {reviewError}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void handleReviewSubmit()}
                          disabled={reviewSubmitting}
                          className="inline-flex items-center gap-2 bg-brand-blue px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-blueDark disabled:opacity-60"
                        >
                          {reviewSubmitting && <Loader2 size={14} className="animate-spin" />}
                          Save Review
                        </button>
                        <button
                          type="button"
                          onClick={closeApplicant}
                          className="border border-slate-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
