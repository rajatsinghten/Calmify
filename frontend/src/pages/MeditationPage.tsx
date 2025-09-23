import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MediaCard } from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";

interface MeditationResource {
  title: string;
  description: string;
  duration?: string;
  type: string;
  content: string;
  tags: string[];
}

interface SelfHelpResource {
  title: string;
  description: string;
  type: string;
  content: string;
  tags: string[];
}

interface ResourcesData {
  meditation: MeditationResource[];
  selfHelp: SelfHelpResource[];
}

export default function MeditationPage() {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState("EN");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [resources, setResources] = useState<ResourcesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const languages = ["EN", "ES", "HI"];
  const categories = ["all", "meditation", "selfHelp"];
  const moods = ["all", "anxiety", "stress", "depression", "relaxation"];

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // Create a simple GET request to the chatbot resources endpoint
        const response = await fetch('http://localhost:5000/api/chatbot/resources', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...apiService.isAuthenticated() ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        
        const data = await response.json();
        setResources(data);
      } catch (err: any) {
        console.error('Failed to fetch resources:', err);
        setError('Failed to load meditation resources');
        // Fallback to static data if API fails
        setResources({
          meditation: [
            {
              title: "5-Minute Breathing Exercise",
              description: "Simple breathing technique to reduce stress and anxiety",
              duration: "5 min",
              type: "audio",
              content: "Focus on your breath. Inhale for 4 counts, hold for 4, exhale for 6. Repeat 10 times.",
              tags: ["anxiety", "stress", "breathing"]
            },
            {
              title: "Body Scan Relaxation",
              description: "Progressive muscle relaxation to release tension",
              duration: "10 min",
              type: "guided",
              content: "Start at your toes and slowly work up your body, tensing and releasing each muscle group.",
              tags: ["relaxation", "sleep", "tension"]
            }
          ],
          selfHelp: [
            {
              title: "Cognitive Behavioral Techniques",
              description: "Strategies to challenge negative thinking patterns",
              type: "worksheet",
              content: "Identify the thought → Examine the evidence → Consider alternatives → Balanced thinking",
              tags: ["CBT", "thinking", "depression"]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [selectedCategory, selectedMood]);

  const filteredResources = resources ? [
    ...resources.meditation.map(r => ({ ...r, category: 'meditation' })),
    ...resources.selfHelp.map(r => ({ ...r, category: 'selfHelp', duration: undefined }))
  ].filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesMood = selectedMood === "all" || item.tags.includes(selectedMood);
    return matchesSearch && matchesCategory && matchesMood;
  }) : [];

  const handleResourceAction = async (resource: any) => {
    console.log(`Starting resource: ${resource.title}`);
    // Here you could implement actual resource playback, download, or navigation
    // For now, we'll just log the action
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Meditation & Self-Help
              </h1>
              <p className="text-gray-600 mt-1">Access guided meditations and self-help resources</p>
            </div>
            
            {/* Language Selector */}
            <div className="flex gap-1">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                  className={selectedLanguage === lang ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Categories</option>
              <option value="meditation">Meditation</option>
              <option value="selfHelp">Self-Help</option>
            </select>
            <select 
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Moods</option>
              <option value="anxiety">Anxiety</option>
              <option value="stress">Stress</option>
              <option value="depression">Depression</option>
              <option value="relaxation">Relaxation</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-gray-600">Loading resources...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-700">Total Resources</h3>
                  <p className="text-2xl font-semibold text-primary">
                    {resources ? resources.meditation.length + resources.selfHelp.length : 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-700">Meditation Exercises</h3>
                  <p className="text-2xl font-semibold text-green-600">
                    {resources?.meditation.length || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-700">Self-Help Tools</h3>
                  <p className="text-2xl font-semibold text-blue-600">
                    {resources?.selfHelp.length || 0}
                  </p>
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map((resource, index) => (
                  <div key={index} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={resource.category === 'meditation' ? 'default' : 'secondary'}>
                        {resource.category === 'meditation' ? 'Meditation' : 'Self-Help'}
                      </Badge>
                      {resource.duration && (
                        <span className="text-sm text-gray-500">{resource.duration}</span>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleResourceAction(resource)}
                      className="w-full"
                      variant={resource.category === 'meditation' ? 'default' : 'outline'}
                    >
                      {resource.type === 'audio' ? 'Play' : 
                       resource.type === 'video' ? 'Watch' : 
                       resource.type === 'worksheet' ? 'Download' : 'Start'}
                    </Button>
                  </div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No resources found matching your criteria.</p>
                  <Button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedMood("all");
                    }}
                    variant="outline" 
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}