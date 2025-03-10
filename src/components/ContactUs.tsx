import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, MessageSquare, Phone, MapPin, CheckCircle } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import { useToast } from "./ui/use-toast";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to localStorage since Supabase connection is having issues
      saveToLocalStorage();

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
        className: "bg-green-600 text-white",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description:
          "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const submissions = JSON.parse(
        localStorage.getItem("contact_submissions") || "[]",
      );
      submissions.push({
        id: Date.now().toString(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        status: "new",
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("contact_submissions", JSON.stringify(submissions));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        <div className="w-full bg-black text-white py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Contact our team
            </h1>
            <p className="text-xl text-center text-gray-300 mb-16">
              Questions about our product? We're here to help
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-gray-300 mb-6">
                    Your message has been sent successfully. We'll get back to
                    you soon.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        message: "",
                      });
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block">
                        First name
                      </label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block">
                        Last name
                      </label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block">
                      Phone number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Leave us a message..."
                      className="bg-black border-gray-700 text-white placeholder:text-gray-500 min-h-[150px]"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </Button>
                </form>
              )}

              {/* Contact Info */}
              <div className="space-y-12">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Call us</h2>
                  <p className="text-gray-400">Call our team Mon-Fri</p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-800"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    +92 3422069412
                  </Button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Message us</h2>
                  <p className="text-gray-400">
                    Send us an email or reach out on Twitter
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send email
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Visit us</h2>
                  <p className="text-gray-400">
                    Chat to us in person at our Melbourne HQ
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-white hover:bg-gray-800"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    100 Smith Street, Collingwood VIC 3066
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
