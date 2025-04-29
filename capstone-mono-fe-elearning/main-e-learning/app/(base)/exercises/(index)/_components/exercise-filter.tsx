'use client';

import { useExercise } from '@/providers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ExerciseFilterTime } from '@/lib/actions/exercise';

const DIFFICULTY_LEVELS = ["Easy", "Medium Easy", "Medium", "Medium Hard", "Hard", "Super Hard"];
const AVAILABLE_TAGS = ["Python", "Algorithm", "Programming", "8 Sync Dev"];

const DIFFICULTY_BADGES = {
    'Easy': 'bg-green-100 text-green-800 hover:bg-green-200',
    'Medium Easy': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'Medium': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'Medium Hard': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'Hard': 'bg-red-100 text-red-800 hover:bg-red-200',
    'Super Hard': 'bg-purple-100 text-purple-800 hover:bg-purple-200'
};

const TIME_FILTER_OPTIONS: { value: ExerciseFilterTime; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' }
];

export function ExerciseFilter() {
    const { setFilter, resetToInitial, currentFilter } = useExercise();
    const [searchInput, setSearchInput] = useState(currentFilter.title);
    const [selectedTags, setSelectedTags] = useState<string[]>(currentFilter.tags);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>(currentFilter.difficulty);
    const [selectedTime, setSelectedTime] = useState<ExerciseFilterTime>(currentFilter.filterTime);

    const handleSearch = () => {
        setFilter({
            title: searchInput.trim(),
            tags: selectedTags,
            difficulty: selectedDifficulty,
            filterTime: selectedTime
        });
    };

    const handleTagSelect = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newTags);
        setFilter({
            title: searchInput.trim(),
            tags: newTags,
            difficulty: selectedDifficulty,
            filterTime: selectedTime
        });
    };

    const handleDifficultyChange = (level: string) => {
        const newDifficulty = selectedDifficulty === level ? '' : level;
        setSelectedDifficulty(newDifficulty);
        setFilter({
            title: searchInput.trim(),
            tags: selectedTags,
            difficulty: newDifficulty,
            filterTime: selectedTime
        });
    };

    const handleTimeFilterChange = (value: ExerciseFilterTime) => {
        setSelectedTime(value);
        setFilter({
            title: searchInput.trim(),
            tags: selectedTags,
            difficulty: selectedDifficulty,
            filterTime: value
        });
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setFilter({
            title: '',
            tags: selectedTags,
            difficulty: selectedDifficulty,
            filterTime: selectedTime
        });
    };

    const handleClearTags = () => {
        setSelectedTags([]);
        setFilter({
            title: searchInput.trim(),
            tags: [],
            difficulty: selectedDifficulty,
            filterTime: selectedTime
        });
    };

    const handleClearDifficulty = () => {
        setSelectedDifficulty('');
        setFilter({
            title: searchInput.trim(),
            tags: selectedTags,
            difficulty: '',
            filterTime: selectedTime
        });
    };

    const handleClearTime = () => {
        setSelectedTime('all');
        setFilter({
            title: searchInput.trim(),
            tags: selectedTags,
            difficulty: selectedDifficulty,
            filterTime: 'all'
        });
    };

    const handleClearAll = () => {
        setSearchInput('');
        setSelectedTags([]);
        setSelectedDifficulty('');
        setSelectedTime('all');
        resetToInitial();
    };


    return (
        <div className="space-y-6 p-4 sm:p-6 bg-background rounded-lg shadow-sm border border-border transition-colors">
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Tìm kiếm bài tập</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Tìm kiếm theo tiêu đề..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-9 w-full bg-background border-border"
                        />
                        {searchInput && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent"
                                onClick={handleClearSearch}
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="w-full sm:w-auto"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Tìm kiếm
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Sắp xếp theo thời gian</h3>
                <Select
                    value={selectedTime}
                    onValueChange={handleTimeFilterChange}
                >
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        {TIME_FILTER_OPTIONS.map(option => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Chọn độ khó</h3>
                    {selectedDifficulty && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearDifficulty}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Bỏ chọn
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {DIFFICULTY_LEVELS.map(level => (
                        <Badge
                            key={level}
                            variant="secondary"
                            className={`cursor-pointer transition-all hover:scale-105 group ${selectedDifficulty === level
                                ? DIFFICULTY_BADGES[level as keyof typeof DIFFICULTY_BADGES]
                                : 'hover:bg-accent'
                                }`}
                            onClick={() => handleDifficultyChange(level)}
                        >
                            {level}
                            {selectedDifficulty === level && (
                                <X className="w-3 h-3 ml-1 group-hover:text-foreground" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Chọn chủ đề</h3>
                    {selectedTags.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearTags}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Bỏ chọn tất cả
                        </Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => (
                        <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer transition-all hover:scale-105 hover:bg-accent/50 group"
                            onClick={() => handleTagSelect(tag)}
                        >
                            {tag}
                            {selectedTags.includes(tag) && (
                                <X className="w-3 h-3 ml-1 group-hover:text-foreground" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="gap-2 hover:bg-accent"
                >
                    <RefreshCw className="h-4 w-4" />
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    );
} 