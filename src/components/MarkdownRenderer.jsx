import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

const MarkdownRenderer = ({ markdown, className }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn(
        "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:mx-auto",
        "prose-code:bg-muted prose-code:text-muted-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono",
        "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground",
        "prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary",
        "prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-primary",
        className
      )}
      components={{
        img: ({node, ...props}) => {
          const src = props.src.startsWith('http') ? props.src : `https://awqnzmyhiohxlqeceqpu.supabase.co/storage/v1/object/public/post-images/${props.src}`;
          return <img  {...props} alt={props.alt || 'Markdown image'} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
        },
        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />,
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;