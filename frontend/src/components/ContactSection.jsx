import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Car } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Vehicle Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Vehicle Inquiry',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 600);
  };

  return (
    <section id="contact-section" className="mt-20 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0f172a]"></span>
            DriveHub Concierge & Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
            Contact Our Dealership
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-500 leading-relaxed">
            Have questions about our curated inventory, pricing, or want to schedule a private viewing? Connect directly with our automotive specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Details & Showroom Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 font-display">
                Showroom & Headquarters
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Location
                    </h4>
                    <p className="text-sm font-medium text-stone-700 mt-1 leading-snug">
                      100 Prestige Boulevard, Silicon Valley
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">California, CA 94025, United States</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Direct Phone
                    </h4>
                    <p className="text-sm font-semibold text-stone-800 mt-1">
                      +1 (800) 555-DRIVE
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">Toll-free client concierge line</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Email Inquiries
                    </h4>
                    <p className="text-sm font-medium text-stone-800 mt-1">
                      concierge@drivehub.com
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">Guaranteed response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                      Operating Hours
                    </h4>
                    <p className="text-xs text-stone-700 mt-1 font-medium">
                      Monday – Friday: 9:00 AM – 8:00 PM PST
                    </p>
                    <p className="text-xs text-stone-700 font-medium">
                      Saturday: 10:00 AM – 6:00 PM PST
                    </p>
                    <p className="text-xs text-stone-500">Sunday: By appointment only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dealership Guarantee Card */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Verified Inspection & Delivery
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Every vehicle undergoes our 150-point diagnostic inspection prior to delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900 font-display mb-1">
                Send an Inquiry
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Fill out the form below and an automotive specialist will get back to you shortly.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Thank you for reaching out!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">Your inquiry has been received. Our sales team will contact you shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Robert Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 rounded-lg px-3.5 py-2.5 text-sm placeholder-stone-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="robert@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 rounded-lg px-3.5 py-2.5 text-sm placeholder-stone-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 rounded-lg px-3.5 py-2.5 text-sm placeholder-stone-400 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                      Inquiry Type
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors cursor-pointer"
                    >
                      <option value="Vehicle Inquiry">Vehicle Inquiry</option>
                      <option value="Schedule a Test Drive">Schedule a Test Drive</option>
                      <option value="Financing & Leasing">Financing & Leasing</option>
                      <option value="Trade-in Appraisal">Trade-in Appraisal</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows="4"
                    placeholder="Tell us about the vehicle you're interested in or any specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-stone-900 rounded-lg px-3.5 py-2.5 text-sm placeholder-stone-400 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#0f172a] flex items-center justify-center text-white shrink-0">
              <Car className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-stone-800 font-display">DriveHub Dealership</span>
            <span className="hidden sm:inline">·</span>
            <span className="block sm:inline">All rights reserved © 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium">
            <a href="#catalog" className="hover:text-stone-900 transition-colors">Catalog</a>
            <span className="text-stone-300">·</span>
            <a href="#contact-section" className="hover:text-stone-900 transition-colors">Contact</a>
            <span className="text-stone-300">·</span>
            <span className="text-stone-400">Inventory Management System</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
