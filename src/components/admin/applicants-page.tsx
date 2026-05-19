"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getAdminApplicantDetails,
  getAdminDashboardStats,
  getAllAdminApplicants,
  type AdminApplicantDetailsResponse,
  type AdminApplicantStatus,
  type PriorityStudent,
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

const selectClass =
  "h-11 border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none transition-colors focus:border-brand-blue";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<PriorityStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [rankFilter, setRankFilter] = useState("all");
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [details, setDetails] = useState<AdminApplicantDetailsResponse | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const response = await getAllAdminApplicants();
        setApplicants(response.applicants);
        setError("");
      } catch {
        try {
          const stats = await getAdminDashboardStats();
          setApplicants(stats.priorityQueue);
          setError("");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load applicants.");
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  const programs = useMemo(() => {
    const unique = new Set(
      applicants.map((a) => a.program).filter((p) => p && p.trim() !== ""),
    );
    return Array.from(unique).sort();
  }, [applicants]);

  const rankedApplicants = useMemo(
    () =>
      [...applicants]
        .sort((a, b) => b.score - a.score)
        .map((row, index) => ({
          ...row,
          rank: index + 1,
        })),
    [applicants],
  );

  const filteredApplicants = useMemo(() => {
    return rankedApplicants.filter((row) => {
      const matchesProgram =
        programFilter === "all" || row.program.toLowerCase() === programFilter.toLowerCase();
      const matchesRank = rankFilter === "all" || String(row.rank) === rankFilter;
      return matchesProgram && matchesRank;
    });
  }, [rankedApplicants, programFilter, rankFilter]);

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

  const personal = details?.application.personalDetails;
  const academics = details?.application.academicDetails;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-bold text-brand-slate tracking-tight">All Applicants</h1>
        <p className="text-slate-500 text-sm font-medium">
          Browse every submitted application, filter by programme or rank, and open full applicant details.
        </p>
      </div>

      <div className="border border-slate-200 bg-white overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-display font-bold text-brand-slate">Applicants</h2>
            <p className="mt-1 text-xs text-slate-400">
              {loading ? "Loading..." : `${filteredApplicants.length} of ${rankedApplicants.length} shown`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by programme"
            >
              <option value="all">All programmes</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>

            <select
              value={rankFilter}
              onChange={(e) => setRankFilter(e.target.value)}
              className={selectClass}
              aria-label="Filter by rank"
            >
              <option value="all">All ranks</option>
              {rankedApplicants.map((row) => (
                <option key={row.id} value={String(row.rank)}>
                  Rank {row.rank}
                </option>
              ))}
            </select>
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
                      <div className="h-4 w-full animate-pulse bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-red-600">
                    {error}
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    No applicants match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-blue text-sm">
                      {row.rank}
                    </td>
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
                          "text-[11px] font-bold",
                          row.score > 80
                            ? "text-emerald-600"
                            : row.score > 60
                              ? "text-amber-600"
                              : "text-red-600",
                        )}
                      >
                        {row.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex border px-2.5 py-1 text-xs font-medium",
                          statusBadgeClass(row.status),
                        )}
                      >
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
                  <p className="text-[10px] font-display font-bold uppercase tracking-[0.25em] text-slate-400">Applicant Details</p>
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
                <div className="flex items-center gap-3 border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
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
