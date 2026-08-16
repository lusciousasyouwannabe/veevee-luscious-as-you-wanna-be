import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateEditor from "@/components/TemplateEditor";
import InventoryManager from "@/components/InventoryManager";

interface Signup {
  id: string;
  email: string;
  created_at: string;
}

interface EditableField {
  key: string;
  label: string;
  type: "text" | "textarea";
}

interface TemplatePreview {
  templateName: string;
  displayName: string;
  subject: string;
  html: string;
  status: "ready" | "preview_data_required" | "render_failed";
  errorMessage?: string;
  editableFields?: EditableField[];
  defaults?: Record<string, any>;
  savedSettings?: Record<string, any>;
}

const AdminDashboard = () => {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<TemplatePreview[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin");
      } else {
        fetchSignups();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchSignups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load signups");
    } else {
      setSignups(data || []);
    }
    setLoading(false);
  };

  const fetchTemplates = async (force = false) => {
    if (!force && templates.length > 0) return;
    setTemplatesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("preview-transactional-email", {
        method: "POST",
      });

      if (error) throw error;

      const list = data?.templates || [];
      setTemplates(list);
      if (list.length > 0 && !selectedTemplate) setSelectedTemplate(list[0].templateName);
    } catch (err) {
      console.error("Failed to fetch templates", err);
      toast.error("Failed to load email templates");
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const active = templates.find((t) => t.templateName === selectedTemplate);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground">VeeVee Luscious</p>
        </div>
        <button
          onClick={handleLogout}
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="container max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="subscribers" onValueChange={(v) => v === "templates" && fetchTemplates()}>
          <TabsList className="mb-6">
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
          </TabsList>

          {/* ── Subscribers Tab ── */}
          <TabsContent value="subscribers">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-body text-sm text-muted-foreground">
                {signups.length} subscriber{signups.length !== 1 ? "s" : ""}
              </p>
              <button onClick={fetchSignups} className="font-body text-sm text-primary hover:underline">
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="font-body text-muted-foreground text-center py-10">Loading...</p>
            ) : signups.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-10">No signups yet.</p>
            ) : (
              <div className="border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Email</th>
                      <th className="text-left font-body font-semibold text-xs uppercase tracking-wider text-muted-foreground px-5 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((s) => (
                      <tr key={s.id} className="border-t border-border">
                        <td className="font-body text-sm text-foreground px-5 py-3">{s.email}</td>
                        <td className="font-body text-sm text-muted-foreground px-5 py-3">
                          {new Date(s.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* ── Email Templates Tab ── */}
          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="templates">
            {templatesLoading ? (
              <p className="font-body text-muted-foreground text-center py-10">Loading templates...</p>
            ) : templates.length === 0 ? (
              <p className="font-body text-muted-foreground text-center py-10">No templates found.</p>
            ) : (
              <div className="flex gap-6">
                {/* Template list */}
                <div className="w-48 shrink-0 space-y-1">
                  {templates.map((t) => (
                    <button
                      key={t.templateName}
                      onClick={() => {
                        setSelectedTemplate(t.templateName);
                        setShowEditor(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-md text-sm font-body transition-colors ${
                        selectedTemplate === t.templateName
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {t.displayName || t.templateName}
                    </button>
                  ))}
                </div>

                {/* Preview + Edit pane */}
                <div className="flex-1 flex gap-4">
                  {/* Preview */}
                  <div className={`border border-border rounded-md overflow-hidden ${showEditor ? "flex-1" : "w-full"}`}>
                    {active?.status === "ready" ? (
                      <>
                        <div className="bg-secondary px-4 py-2 border-b border-border flex items-center justify-between">
                          <p className="font-body text-xs text-muted-foreground">
                            Subject: <span className="text-foreground font-medium">{active.subject}</span>
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (active?.html) {
                                  navigator.clipboard.writeText(active.html);
                                  toast.success("HTML copied to clipboard");
                                }
                              }}
                              className="font-body text-xs px-3 py-1 rounded border border-border text-foreground hover:bg-secondary transition-colors"
                            >
                              📋 Copy HTML
                            </button>
                            {active.editableFields && active.editableFields.length > 0 && (
                              <button
                                onClick={() => setShowEditor(!showEditor)}
                                className="font-body text-xs px-3 py-1 rounded border border-border text-foreground hover:bg-secondary transition-colors"
                              >
                                {showEditor ? "Hide Editor" : "✏️ Edit Content"}
                              </button>
                            )}
                          </div>
                        </div>
                        <iframe
                          srcDoc={active.html}
                          title="Email preview"
                          className="w-full bg-white"
                          style={{ height: "700px", border: "none" }}
                          sandbox=""
                        />
                      </>
                    ) : active?.status === "render_failed" ? (
                      <p className="font-body text-destructive text-center py-10 px-4">
                        Render failed: {active.errorMessage}
                      </p>
                    ) : (
                      <p className="font-body text-muted-foreground text-center py-10">
                        Select a template to preview
                      </p>
                    )}
                  </div>

                  {/* Editor panel */}
                  {showEditor && active?.editableFields && active.defaults && (
                    <div className="w-[380px] shrink-0 border border-border rounded-md overflow-hidden">
                      <TemplateEditor
                        templateName={active.templateName}
                        editableFields={active.editableFields}
                        defaults={active.defaults}
                        savedSettings={active.savedSettings || {}}
                        onSaved={() => fetchTemplates(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
