"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAdminApplicantDetails,
  type AdminApplicantDetailsResponse,
  type AdminApplicantListItem,
  type AdminApplicantsByStatusResponse,
  type AdminApplicantStatus,
} from "@/lib/api";

function formatValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "Not provided";
  if (typeof value === "string" && value.trim() === "") return "Not provided";
  return String(value);
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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-brand-slate">{title}</h3>
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

type Props = {
  title: string;
  description: string;
  emptyMessage: string;
  loadApplicants: () => Promise<AdminApplicantsByStatusResponse>;
};

export default function ApplicantStatusPage({
  title,
  description,
  emptyMessage,
  loadApplicants,
}: Props) {
  const [data, setData] = useState<AdminApplicantsByStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminApplicantDetailsResponse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await loadApplicants();
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [loadApplicants]);

  const openApplicant = async (userId: string) => {
    setSelectedApplicantId(userId);
    setDetailsLoading(true);
    setDetailsError("");

    try {
      const response = await getAdminApplicantDetails(userId);
      setDetails(response);
    } catch (err) {
      setDetails(null);
      setDetailsError(err instanceof Error ? err.message : "Failed to load applicant details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeApplicant = () => {
    setSelectedApplicantId(null);
    setDetails(null);
    setDetailsError("");
  };

  const applicants = data?.applicants ?? [];
  const personal = details?.application.personalDetails;
  const academics = details?.application.academicDetails;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-brand-slate tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm font-medium">{description}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-brand-slate">{title}</h2>
            <p className="mt-1 text-xs text-slate-400">{data ? `${data.count} applicants` : "Loading..."}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1">
            <ShieldCheck size={12} className="text-brand-blue" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Backend Synced</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Programme</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-5">
                      <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : applicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                applicants.map((applicant: AdminApplicantListItem) => (
                  <tr key={applicant.userId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-brand-slate">
                        {applicant.firstName} {applicant.lastName}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {applicant.registrationNumber || applicant.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {applicant.program}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {applicant.reviewComments?.trim() || "No comment recorded."}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest", statusBadgeClass(applicant.status))}>
                        {formatApplicantStatus(applicant.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void openApplicant(applicant.userId)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:border-brand-blue hover:text-brand-blue"
                      >
                        View More
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
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Applicant Details</p>
                  <h2 className="mt-1 text-xl font-black text-brand-slate">
                    {details?.applicant.firstName} {details?.applicant.lastName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{details?.applicant.email ?? selectedApplicantId}</p>
                </div>
                <button
                  type="button"
                  onClick={closeApplicant}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:text-slate-700"
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
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {detailsError}
                </div>
              ) : details ? (
                <>
                  <SectionCard title="Applicant Summary">
                    <DetailGrid
                      fields={[
                        { label: "Registration Number", value: formatValue(details.applicant.registrationNumber) },
                        { label: "Email", value: formatValue(details.applicant.email) },
                        { label: "Status", value: formatApplicantStatus(details.applicant.status) },
                        { label: "Review Comment", value: formatValue(details.applicant.reviewComments) },
                      ]}
                    />
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
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
