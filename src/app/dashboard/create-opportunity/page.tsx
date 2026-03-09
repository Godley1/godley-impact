"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import PageHeader from "@/components/dashboard/page-header";
import DashboardCard from "@/components/dashboard/dashboard-card";

export default function CreateOpportunityPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const { error } = await supabase.from("opportunities").insert({
      title,
      description,
      location,
      opportunity_date: date,
      volunteers_needed: volunteersNeeded,
    });

    if (error) {
      setMessage("There was a problem creating the opportunity.");
      setIsSubmitting(false);
      return;
    }

    setMessage("Opportunity created successfully.");

    setTitle("");
    setDescription("");
    setLocation("");
    setDate("");
    setVolunteersNeeded(0);
    setIsSubmitting(false);

    router.push("/dashboard/opportunities");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Opportunity"
        description="Post a new volunteer opportunity for your community."
        action={
          <Link
            href="/dashboard/opportunities"
            className="inline-flex rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Opportunities
          </Link>
        }
      />

      <DashboardCard title="Opportunity Details">
        <form onSubmit={handleSubmit} className="grid max-w-2xl gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-900"
            >
              Opportunity Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Community Food Drive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border px-4 py-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              required
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Describe the volunteer activity and what help is needed."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32 rounded-xl border px-4 py-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-900"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Huntsville Community Center"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border px-4 py-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="date"
                className="text-sm font-medium text-gray-900"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border px-4 py-3 text-sm outline-none ring-0 focus:border-gray-900"
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="volunteersNeeded"
                className="text-sm font-medium text-gray-900"
              >
                Volunteers Needed
              </label>
              <input
                id="volunteersNeeded"
                type="number"
                min="0"
                value={volunteersNeeded}
                onChange={(e) => setVolunteersNeeded(Number(e.target.value))}
                className="rounded-xl border px-4 py-3 text-sm outline-none ring-0 focus:border-gray-900"
              />
            </div>
          </div>

          {message && (
            <p className="text-sm text-gray-600">{message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Opportunity"}
            </button>

            <Link
              href="/dashboard/opportunities"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Link>
          </div>
        </form>
      </DashboardCard>
    </div>
  );
}