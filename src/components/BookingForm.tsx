import React, { useState } from 'react';
import { AlertTriangle, Phone, Mail } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  isEmergency: boolean;
}

const services = [
  { value: 'general', label: 'General Checkup & Cleaning' },
  { value: 'cosmetic', label: 'Cosmetic Dentistry' },
  { value: 'implants', label: 'Dental Implants' },
  { value: 'orthodontics', label: 'Orthodontics/Invisalign' },
  { value: 'root-canal', label: 'Root Canal Therapy' },
  { value: 'extraction', label: 'Tooth Extraction' },
  { value: 'whitening', label: 'Teeth Whitening' },
  { value: 'pediatric', label: 'Pediatric Dentistry' },
  { value: 'emergency', label: 'Emergency Care' },
  { value: 'consultation', label: 'Consultation Only' }
];

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    isEmergency: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[+]?[\d\s]{10,15}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid phone number';
    if (!formData.service) newErrors.service = 'Please select a service';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const generateWhatsAppMessage = (): string => {
    const { name, phone, email, service, preferredDate, preferredTime, message, isEmergency } = formData;
    
    let whatsappMessage = `\u{1F9B7} *DENTAL APPOINTMENT REQUEST* \u{1F9B7}\n\n`;
    
    if (isEmergency) {
      whatsappMessage += `\u{1F6A8} *EMERGENCY APPOINTMENT* \u{1F6A8}\n\n`;
    }
    
    whatsappMessage += `\u{1F464} *Patient Information:*\n`;
    whatsappMessage += `\u2022 Name: ${name}\n`;
    whatsappMessage += `\u2022 Phone: ${phone}\n`;
    whatsappMessage += `\u2022 Email: ${email}\n\n`;
    
    whatsappMessage += `\u{1F527} *Service Requested:*\n`;
    const selectedService = services.find(s => s.value === service);
    whatsappMessage += `\u2022 ${selectedService?.label || service}\n\n`;
    
    if (preferredDate || preferredTime) {
      whatsappMessage += `\u{1F4C5} *Preferred Appointment Time:*\n`;
      if (preferredDate) whatsappMessage += `\u2022 Date: ${preferredDate}\n`;
      if (preferredTime) whatsappMessage += `\u2022 Time: ${preferredTime}\n\n`;
    }
    
    if (message.trim()) {
      whatsappMessage += `\u{1F4AC} *Additional Notes:*\n${message}\n\n`;
    }
    
    whatsappMessage += `--- --- --- ---\n`;
    whatsappMessage += `\u{1F4F1} Sent via Beyond Smile Dental Care Website\n`;
    whatsappMessage += `\u{1F552} ${new Date().toLocaleString()}`;
    
    return encodeURIComponent(whatsappMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);

    const message = generateWhatsAppMessage();
    const whatsappNumber = '+919549213923';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
        isEmergency: false
      });
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <section id="book-appointment" className="py-24 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide mb-4">Book Now</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to get started? Fill out the form below and we'll connect with you via WhatsApp 
              to confirm your appointment and answer any questions.
            </p>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
            {/* Emergency Notice */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-red-700 font-medium">Dental Emergency?</p>
                  <p className="text-red-600 text-sm">Call our emergency line immediately: +919549213923</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Emergency Checkbox */}
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isEmergency"
                  name="isEmergency"
                  checked={formData.isEmergency}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isEmergency" className="ml-3 text-red-800 font-medium">
                  This is an emergency appointment request
                </label>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200"
                    placeholder="your.email@example.com"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Needed *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200 ${errors.service ? 'border-red-500' : 'border-gray-200'}`}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="mt-1 text-sm text-red-600">{errors.service}</p>}
              </div>

              {/* Appointment Preferences */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200"
                  >
                    <option value="">Select preferred time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow duration-200"
                  placeholder="Tell us about your dental concerns, insurance information, or any special requests..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 ${
                    isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to WhatsApp...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Book via WhatsApp
                    </>
                  )}
                </button>
                
                <p className="text-gray-600 text-sm mt-4">
                  You'll be redirected to WhatsApp to confirm your appointment
                </p>
              </div>
            </form>
          </div>

          {/* Alternative Contact Methods */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 text-sm mb-3">Speak directly with our team</p>
              <a href="tel:+919549213923" className="text-primary-600 hover:text-primary-700 font-medium transition-colors break-all">
                +91 95492 13923
              </a>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 text-sm mb-3">Send us your questions</p>
              <a href="mailto:beyondsmiledentalcare@gmail.com" className="text-green-600 hover:text-green-700 font-medium transition-colors break-all text-sm">
                beyondsmiledentalcare@gmail.com
              </a>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 card-hover">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Emergency</h3>
              <p className="text-gray-600 text-sm mb-3">24/7 urgent dental care</p>
              <a href="tel:+919549213923" className="text-red-600 hover:text-red-700 font-medium transition-colors break-all">
                +91 95492 13923
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
