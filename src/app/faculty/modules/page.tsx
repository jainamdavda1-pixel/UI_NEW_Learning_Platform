"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Trash2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface SubtopicForm {
  title: string;
  description: string;
  learningOutcome: string;
  referenceUrl: string;
  videoUrl: string;
  notesUrl: string;
}

export default function ManageModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Form states
  const [moduleNo, setModuleNo] = useState("");
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [co, setCo] = useState("");
  const [description, setDescription] = useState("");
  const [subtopics, setSubtopics] = useState<SubtopicForm[]>([
    { title: "", description: "", learningOutcome: "", referenceUrl: "", videoUrl: "", notesUrl: "" }
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const res = await fetch("/api/student/modules");
      if (res.ok) {
        const data = await res.json();
        setModules(data);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const handleAddSubtopicField = () => {
    setSubtopics([...subtopics, { title: "", description: "", learningOutcome: "", referenceUrl: "", videoUrl: "", notesUrl: "" }]);
  };

  const handleRemoveSubtopicField = (index: number) => {
    if (subtopics.length > 1) {
      setSubtopics(subtopics.filter((_, i) => i !== index));
    }
  };

  const handleSubtopicChange = (index: number, field: keyof SubtopicForm, value: string) => {
    const updated = [...subtopics];
    updated[index][field] = value;
    setSubtopics(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate subtopics are filled
    const validSubtopics = subtopics.filter(st => st.title.trim() !== "");
    if (validSubtopics.length === 0) {
      setMessage({ type: "error", text: "At least one subtopic with a title is required." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/faculty/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleNo,
          title,
          hours,
          co,
          description,
          subtopics: validSubtopics
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Module and subtopics created successfully!" });
        // Reset form
        setModuleNo("");
        setTitle("");
        setHours("");
        setCo("");
        setDescription("");
        setSubtopics([{ title: "", description: "", learningOutcome: "", referenceUrl: "", videoUrl: "", notesUrl: "" }]);
        fetchModules();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create module" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" />
          Manage Modules & Subtopics
        </h1>
        <p className="text-zinc-500 mt-1">Add curriculum modules and define subtopic learning materials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Columns: Creator Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-xl text-zinc-900">Create New Module</CardTitle>
              <CardDescription>Enter course module details and subtopics.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg text-sm font-semibold ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-primary border border-red-200"}`}>
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Module Number *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1"
                      value={moduleNo}
                      onChange={(e) => setModuleNo(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Module Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. User Interface Fundamentals"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1">Course Outcome (CO)</label>
                    <input
                      type="text"
                      placeholder="e.g. CO1"
                      value={co}
                      onChange={(e) => setCo(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief description of the module content..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-zinc-900">Subtopics</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubtopicField}
                      className="border-primary text-primary hover:bg-primary/5 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" /> <span>Add Subtopic</span>
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {subtopics.map((st, index) => (
                      <div key={index} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative space-y-4">
                        {subtopics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtopicField(index)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-primary transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        <h4 className="font-bold text-zinc-800 text-sm">Subtopic #{index + 1}</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Subtopic Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Cognitive Constraints"
                              value={st.title}
                              onChange={(e) => handleSubtopicChange(index, "title", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Learning Outcome</label>
                            <input
                              type="text"
                              placeholder="e.g. Explain memory limitations in UI design"
                              value={st.learningOutcome}
                              onChange={(e) => handleSubtopicChange(index, "learningOutcome", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Subtopic Description</label>
                          <textarea
                            rows={2}
                            placeholder="Description of the subtopic..."
                            value={st.description}
                            onChange={(e) => handleSubtopicChange(index, "description", e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Video URL (YouTube)</label>
                            <input
                              type="text"
                              placeholder="https://youtube.com/..."
                              value={st.videoUrl}
                              onChange={(e) => handleSubtopicChange(index, "videoUrl", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Notes URL (Google Drive)</label>
                            <input
                              type="text"
                              placeholder="https://drive.google.com/..."
                              value={st.notesUrl}
                              onChange={(e) => handleSubtopicChange(index, "notesUrl", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">Reference Link (Optional)</label>
                            <input
                              type="text"
                              placeholder="https://nngroup.com/..."
                              value={st.referenceUrl}
                              onChange={(e) => handleSubtopicChange(index, "referenceUrl", e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 text-sm focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11 shadow-md transition-colors"
                >
                  {loading ? "Creating Module..." : "Create Module & Subtopics"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Existing Modules List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Current Course Syllabus</h3>
          <div className="space-y-3">
            {modules.map((mod) => (
              <Card key={mod.id} className="border-zinc-200 shadow-sm overflow-hidden">
                <div
                  onClick={() => setExpandedModuleId(expandedModuleId === mod.id ? null : mod.id)}
                  className="p-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between cursor-pointer hover:bg-zinc-100/70 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary font-bold rounded-lg flex items-center justify-center text-sm">
                      M{mod.moduleNo}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-800 text-sm">{mod.title}</h4>
                      <p className="text-xs text-zinc-500">{mod.subtopics?.length || 0} subtopics • {mod.hours || 0} hrs</p>
                    </div>
                  </div>
                  {expandedModuleId === mod.id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>

                {expandedModuleId === mod.id && (
                  <CardContent className="p-4 bg-white space-y-3">
                    <p className="text-xs text-zinc-600 leading-relaxed italic">{mod.description}</p>
                    <div className="space-y-2 border-t border-zinc-100 pt-3">
                      <h5 className="text-xs font-bold text-zinc-700">Subtopics:</h5>
                      {mod.subtopics && mod.subtopics.length > 0 ? (
                        mod.subtopics.map((st: any) => (
                          <div key={st.id} className="text-xs flex items-start space-x-2 text-zinc-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-zinc-800">{st.subtopicNo} - {st.title}</span>
                              {st.learningOutcome && (
                                <p className="text-[10px] text-zinc-400 italic">LO: {st.learningOutcome}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No subtopics defined.</p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
