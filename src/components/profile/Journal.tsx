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
import { BookOpen, Tag, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface JournalEntry {
  id: number;
  date: string;
  title: string;
  content: string;
  tags: string[];
}

interface JournalProps {
  journalData: JournalEntry[];
  setJournalData: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  newJournal: { title: string; content: string; tags: string };
  setNewJournal: React.Dispatch<
    React.SetStateAction<{ title: string; content: string; tags: string }>
  >;
  isAddingJournal: boolean;
  setIsAddingJournal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Journal({
  journalData,
  setJournalData,
  newJournal,
  setNewJournal,
  isAddingJournal,
  setIsAddingJournal,
}: JournalProps) {
  const { toast } = useToast();

  const handleAddJournal = () => {
    if (!newJournal.title || !newJournal.content) return;

    const newEntry = {
      id: journalData.length + 1,
      date: format(new Date(), "yyyy-MM-dd"),
      title: newJournal.title,
      content: newJournal.content,
      tags: newJournal.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
    };

    setJournalData([newEntry, ...journalData]);
    setNewJournal({ title: "", content: "", tags: "" });
    setIsAddingJournal(false);

    toast({
      title: "Journal entry added",
      description: "Your new journal entry has been saved.",
    });
  };

  const handleDeleteJournal = (id: number) => {
    setJournalData(journalData.filter((entry) => entry.id !== id));
    toast({
      title: "Journal entry deleted",
      description: "Your journal entry has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Journal</h2>
        <Button
          className="bg-zenSage hover:bg-zenSage/90"
          onClick={() => setIsAddingJournal(!isAddingJournal)}
        >
          {isAddingJournal ? "Cancel" : "New Entry"}
        </Button>
      </div>

      {isAddingJournal && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newJournal.title}
                  onChange={(e) =>
                    setNewJournal({ ...newJournal, title: e.target.value })
                  }
                  placeholder="Enter a title for your entry"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newJournal.content}
                  onChange={(e) =>
                    setNewJournal({ ...newJournal, content: e.target.value })
                  }
                  placeholder="Write your thoughts..."
                  className="h-32"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newJournal.tags}
                  onChange={(e) =>
                    setNewJournal({ ...newJournal, tags: e.target.value })
                  }
                  placeholder="meditation, reflection, gratitude"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="bg-zenSage hover:bg-zenSage/90"
                onClick={handleAddJournal}
              >
                Save Entry
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {journalData.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-xl font-medium text-gray-600">
              No journal entries yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start writing to track your thoughts and feelings
            </p>
          </div>
        ) : (
          journalData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                      <CardTitle>{entry.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteJournal(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{entry.content}</p>

                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="flex items-center"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}