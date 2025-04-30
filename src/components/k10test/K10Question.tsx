
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface K10QuestionProps {
  question: string;
  questionNumber: number;
  value: number;
  onChange: (value: number) => void;
}

export default function K10Question({
  question,
  questionNumber,
  value,
  onChange,
}: K10QuestionProps) {
  const options = [
    { value: 1, label: "None of the time" },
    { value: 2, label: "A little of the time" },
    { value: 4, label: "Most of the time" },
    { value: 5, label: "All of the time" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">
        {questionNumber}. {question}
      </h3>
      <RadioGroup
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={`flex items-center space-x-2 p-3 rounded-lg border ${
              value === option.value
                ? "border-zenPink bg-zenLightPink"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <RadioGroupItem
              value={option.value.toString()}
              id={`q${questionNumber}-${option.value}`}
              className="text-zenPink"
            />
            <Label
              htmlFor={`q${questionNumber}-${option.value}`}
              className="flex-grow cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
