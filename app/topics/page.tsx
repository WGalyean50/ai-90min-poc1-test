"use client";

import { useEffect, useState } from "react";
import { addTopic, deleteTopic, getTopics } from "@/lib/storage";
import type { Frequency, Topic } from "@/lib/types";

const FREQUENCIES: Frequency[] = ["Daily", "Weekly", "On Demand"];

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Daily");

  useEffect(() => {
    setTopics(getTopics());
  }, []);

  function refresh() {
    setTopics(getTopics());
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addTopic({ name: trimmed, description: description.trim(), frequency });
    setName("");
    setDescription("");
    setFrequency("Daily");
    refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Topics</h1>
      <p className="mt-1 text-sm text-stone-500">
        Tell the feed what you want to track. Add a short description so it understands the angle.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 rounded-lg border border-stone-200 bg-white p-5"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-stone-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LLM Infrastructure"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-stone-600">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add topic
            </button>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-stone-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What do you care about within this topic?"
            rows={2}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {topics.length === 0 && (
          <li className="rounded-lg border border-dashed border-stone-300 p-6 text-sm text-stone-500">
            No topics yet. Add your first above.
          </li>
        )}
        {topics.map((t) => (
          <li
            key={t.id}
            className="flex items-start justify-between rounded-lg border border-stone-200 bg-white p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-stone-900">{t.name}</h2>
                <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                  {t.frequency}
                </span>
              </div>
              {t.description && (
                <p className="mt-1 text-sm text-stone-600">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => {
                if (confirm(`Delete "${t.name}"?`)) {
                  deleteTopic(t.id);
                  refresh();
                }
              }}
              className="rounded px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
