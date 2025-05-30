import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="container mx-auto px-4 py-2 flex items-center gap-2 max-w-xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, blurb, or tags..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 pr-10 h-11 text-base bg-background border-border focus:ring-primary focus:border-primary"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" className="h-11 bg-primary hover:bg-primary/90">
        Search
      </Button>
    </motion.form>
  );
};

export default SearchBar;