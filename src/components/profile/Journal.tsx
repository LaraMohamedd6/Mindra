import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Tag, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

const PREDEFINED_TAGS = [
  "meditation",
  "reflection",
  "gratitude",
  "calm",
  "stress",
  "productivity",
  "motivation",
];

export default function Journal() {
  const { toast } = useToast();
  const [journalData, setJournalData] = useState<JournalEntry[]>([]);
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [contentCharCount, setContentCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);

  // Fetch journal entries from API
  useEffect(() => {
    const fetchJournalEntries = async () => {
      try {
        const response = await axios.get("https://localhost:7223/api/journal", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setJournalData(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch journal entries",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalEntries();
  }, []);

  const handleAddJournal = async () => {
    if (!newJournal.title.trim() || !newJournal.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7223/api/journal",
        {
          title: newJournal.title,
          content: newJournal.content,
          tags: selectedTags.join(","), // Convert array to comma-separated string
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setJournalData([response.data, ...journalData]);
      setNewJournal({ title: "", content: "" });
      setSelectedTags([]);
      setCustomTagInput("");
      setContentCharCount(0);
      setIsAddingJournal(false);

      toast({
        title: "Journal entry added",
        description: "Your new journal entry has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add journal entry",
        variant: "destructive",
      });
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    const trimmedTag = customTagInput.trim().toLowerCase();
    if (!trimmedTag || selectedTags.includes(trimmedTag)) {
      toast({
        title: "Invalid Tag",
        description: "Tag is empty or already added",
        variant: "destructive",
      });
      return;
    }
    if (trimmedTag.length > 20) {
      toast({
        title: "Invalid Tag",
        description: "Tag must be 20 characters or less",
        variant: "destructive",
      });
      return;
    }
    setSelectedTags([...selectedTags, trimmedTag]);
    setCustomTagInput("");
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomTag();
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const confirmDeleteJournal = (id: number) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJournal = async () => {
    if (!entryToDelete) return;

    try {
      await axios.delete(`https://localhost:7223/api/journal/${entryToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setJournalData(journalData.filter((entry) => entry.id !== entryToDelete));
      setDeleteDialogOpen(false);
      setEntryToDelete(null);

      toast({
        title: "Journal entry deleted",
        description: "Your journal entry has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <BookOpen className="h-12 w-12 text-zenSage" />
        </motion.div>
        <p className="text-base text-gray-600 dark:text-gray-300">
          Loading your journal entries...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white">
          Your Journal
        </h2>
        <Button
          className="bg-zenSage hover:bg-zenSage/90 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAddingJournal(!isAddingJournal)}
          aria-label={isAddingJournal ? "Cancel new entry" : "Add new journal entry"}
        >
          {isAddingJournal ? "Cancel" : "New Entry"}
        </Button>
      </div>

      {/* New Journal Entry Form */}
      {isAddingJournal && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-zenSage/10 to-zenPink/10 p-6">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                New Journal Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newJournal.title}
                  onChange={(e) =>
                    setNewJournal({ ...newJournal, title: e.target.value })
                  }
                  placeholder="Enter a title for your entry"
                  className="mt-2 rounded-lg border-gray-300 dark:border-gray-600"
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="content" className="text-base font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newJournal.content}
                  onChange={(e) => {
                    setNewJournal({ ...newJournal, content: e.target.value });
                    setContentCharCount(e.target.value.length);
                  }}
                  placeholder="Write your thoughts..."
                  className="mt-2 h-40 rounded-lg border-gray-300 dark:border-gray-600"
                  maxLength={1000}
                  aria-required="true"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {contentCharCount}/1000 characters
                </p>
              </div>
              <div>
                <Label className="text-base font-medium">Tags</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TAGS.map((tag) => (
                      <motion.div
                        key={tag}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge
                          className={`cursor-pointer flex items-center ${
                            selectedTags.includes(tag)
                              ? "bg-zenPink text-white"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          } hover:bg-zenPink/80 hover:text-white`}
                          onClick={() => toggleTag(tag)}
                          aria-label={`Toggle tag: ${tag}`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleTag(tag);
                            }
                          }}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={handleCustomTagKeyDown}
                      placeholder="Add custom tag..."
                      className="rounded-lg border-gray-300 dark:border-gray-600"
                      aria-label="Enter custom tag"
                    />
                    <Button
                      onClick={addCustomTag}
                      className="bg-zenSage hover:bg-zenSage/90 text-white"
                      aria-label="Add custom tag"
                    >
                      Add
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          className="flex items-center bg-zenPink text-white"
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 hover:bg-zenPink/80"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove tag: ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 flex justify-end">
              <Button
                className="bg-zenSage hover:bg-zenSage/90 text-white px-4 py-2 rounded-lg"
                onClick={handleAddJournal}
                aria-label="Save journal entry"
              >
                Save Entry
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* Journal Entries */}
      <div className="space-y-6">
        {journalData.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              No journal entries yet
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              Start writing to capture your thoughts and feelings
            </p>
            <Button
              className="mt-4 bg-zenSage hover:bg-zenSage/90 text-white"
              onClick={() => setIsAddingJournal(true)}
              aria-label="Start writing a new journal entry"
            >
              Write Your First Entry
            </Button>
          </motion.div>
        ) : (
          journalData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {format(new Date(entry.date), "PPP")}
                      </p>
                      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                        {entry.title}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDeleteJournal(entry.id)}
                      aria-label={`Delete journal entry: ${entry.title}`}
                    >
                      <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {entry.content}
                  </p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {entry.tags.map((tag, tagIndex) => (
                        <motion.div
                          key={tagIndex}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Badge
                            variant="secondary"
                            className="flex items-center bg-zenPink/10 text-zenPink hover:bg-zenPink/20 dark:bg-zenPink/20 dark:text-zenPink dark:hover:bg-zenPink/30"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-base text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this journal entry? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter className="p-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteJournal}
              aria-label="Confirm deletion"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}