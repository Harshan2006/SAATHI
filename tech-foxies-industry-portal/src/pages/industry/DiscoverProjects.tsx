import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building, Sparkles, BookOpen, ClipboardList } from "lucide-react";
import { cn } from "../../lib/utils";
import { industryProjects, availableChallenges } from "../../data/industryMockData";
import { getIndustryProfile, calculateProjectMatch } from "../../store/industryStore";

export default function DiscoverProjects() {
  const profile = getIndustryProfile();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "challenges">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");

  const categories = ["All", "Water Management", "Roads & Infrastructure", "Electricity", "Sanitation", "Healthcare", "Environment"];
  const districts = ["All", "Ranchi", "Palamu", "Dhanbad", "Hazaribagh", "East Singhbhum"];
  const stages = ["All", "Research", "Prototype", "Testing", "Pilot", "Deployment"];

  // Combine projects and challenges into unified cards representing discoverable items
  const combinedItems = useMemo(() => {
    const list: any[] = [];
    
    // Process active projects
    if (activeTab === "all" || activeTab === "active") {
      industryProjects.forEach(p => {
        const match = calculateProjectMatch(profile, p);
        list.push({
          type: "project",
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
          district: p.location.district,
          universityName: p.universityName,
          projectStage: p.projectStage,
          matchScore: match.matchScore,
          requiredSupport: p.requiredSupport,
          expectedBeneficiaries: p.affectedPopulation,
          status: p.status,
          date: p.createdAt
        });
      });
    }

    // Process available challenges
    if (activeTab === "all" || activeTab === "challenges") {
      availableChallenges.forEach(c => {
        const match = calculateProjectMatch(profile, c);
        list.push({
          type: "challenge",
          id: c.id,
          title: c.title,
          description: c.problemSummary,
          category: c.category,
          district: c.district,
          universityName: null, // not accepted yet
          projectStage: "Available Challenge",
          matchScore: match.matchScore,
          requiredSupport: c.requiredExpertise,
          expectedBeneficiaries: c.affectedPopulation,
          status: "Available",
          date: c.dateValidated
        });
      });
    }

    return list;
  }, [activeTab, profile]);

  // Apply search query and filters
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      const matchesQuery =
        query.trim() === "" ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.universityName && item.universityName.toLowerCase().includes(query.toLowerCase())) ||
        item.id.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesDistrict = selectedDistrict === "All" || item.district === selectedDistrict;
      const matchesStage = selectedStage === "All" || item.projectStage === selectedStage;

      return matchesQuery && matchesCategory && matchesDistrict && matchesStage;
    });
  }, [combinedItems, query, selectedCategory, selectedDistrict, selectedStage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-ink-900 lg:text-2xl">Discover Projects</h2>
        <p className="text-sm text-ink-500 mt-1">
          Search and browse validated challenges and active university research projects.
        </p>
      </div>

      {/* Tabs / Filters Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-ink-100 pb-2">
        <div className="flex gap-2 rounded bg-surface-sunken p-1 w-fit border border-ink-150">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "all" ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"
            )}
          >
            All Items ({industryProjects.length + availableChallenges.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "active" ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"
            )}
          >
            Accepted Projects ({industryProjects.length})
          </button>
          <button
            onClick={() => setActiveTab("challenges")}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-semibold transition cursor-pointer",
              activeTab === "challenges" ? "bg-surface text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-700"
            )}
          >
            Available Challenges ({availableChallenges.length})
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keyword, ID..."
            className="w-full rounded border border-ink-200 bg-surface py-1.5 pl-8 pr-3 text-xs text-ink-800 focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 bg-surface p-4 rounded-card border border-ink-100 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-ink-500 uppercase mb-1">Sector / Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-2.5 py-1.5 text-xs text-ink-700 focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink-500 uppercase mb-1">District</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-2.5 py-1.5 text-xs text-ink-700 focus:border-teal-500 focus:outline-none cursor-pointer"
          >
            {districts.map((dist) => (
              <option key={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-ink-500 uppercase mb-1">Development Stage</label>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full rounded border border-ink-200 bg-surface px-2.5 py-1.5 text-xs text-ink-700 focus:border-teal-500 focus:outline-none cursor-pointer"
            disabled={activeTab === "challenges"}
          >
            {stages.map((stg) => (
              <option key={stg} disabled={activeTab === "challenges" && stg !== "All"}>{stg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-card border bg-surface p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4",
                item.type === "project" ? "border-ink-100" : "border-ink-150 border-dashed"
              )}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase font-bold text-ink-400">
                      <span>{item.id}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                    <h3 className="font-semibold text-ink-900 text-base line-clamp-1">{item.title}</h3>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold shrink-0",
                      item.matchScore >= 90
                        ? "bg-teal-50 text-teal-700 border border-teal-100"
                        : "bg-ink-100 text-ink-600 border border-ink-200"
                    )}
                  >
                    <Sparkles className="h-3 w-3 mr-0.5" /> {item.matchScore}% Match
                  </span>
                </div>

                <p className="text-xs text-ink-500 line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-ink-100 pt-3">
                  <div className="flex items-center gap-1 text-ink-600">
                    <MapPin className="h-3.5 w-3.5 text-ink-400" />
                    <span>{item.district} District</span>
                  </div>
                  {item.type === "project" ? (
                    <div className="flex items-center gap-1 text-ink-600">
                      <Building className="h-3.5 w-3.5 text-ink-400" />
                      <span className="truncate">{item.universityName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600 font-medium">
                      <ClipboardList className="h-3.5 w-3.5 text-amber-500" />
                      <span>Unaccepted challenge</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-ink-100 pt-3 flex items-center justify-between gap-2">
                <div className="text-[11px] text-ink-500">
                  Required: <span className="font-semibold text-ink-700">{item.requiredSupport.slice(0, 2).join(", ")}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={item.type === "project" ? `/projects/${item.id}` : "/challenges"}
                    className="rounded bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-card border border-ink-100 bg-surface p-12 text-center shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-ink-300" strokeWidth={1.5} />
          <h3 className="mt-4 font-semibold text-ink-900 text-sm">No items match your criteria</h3>
          <p className="mt-1 text-xs text-ink-500">Try tweaking your search term or adjusting filters.</p>
        </div>
      )}
    </div>
  );
}
