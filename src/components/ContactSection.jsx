import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, User, MessageSquare, Brain } from 'lucide-react';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call (replace with actual Supabase function or other backend)
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Form data submitted:', formData);
    // Example: await supabase.functions.invoke('send-contact-email', { body: formData })
    
    toast({
      title: "Message Sent! 🚀",
      description: "Thanks for reaching out. I'll get back to you as soon as possible.",
      variant: "default",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const inputFields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name', icon: User },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', icon: Mail },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Regarding your project...', icon: MessageSquare },
  ];

  return (
    <motion.section 
      id="contact" 
      className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12 md:mb-16"
        >
          <Brain className="mx-auto h-16 w-16 text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">Get in Touch</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question, project idea, or just want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <field.icon className="h-4 w-4 mr-2 text-primary" />
                  {field.label}
                </Label>
                <Input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                />
              </div>
            ))}
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Message
              </Label>
              <Textarea
                name="message"
                id="message"
                placeholder="Your detailed message..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-base py-3 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactSection;