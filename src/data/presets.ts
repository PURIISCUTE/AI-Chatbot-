import { BusinessPreset, TestScenario } from '../types';

export const BUSINESS_PRESETS: BusinessPreset[] = [
  {
    id: 'resort-spa',
    name: 'Aura Luxe Resort & Spa',
    category: 'Hospitality & Wellness',
    badge: 'Luxury Resort',
    tagline: '5-Star Oceanfront Retreat & Holistic Wellness Sanctuary',
    description: 'A serene luxury coastal sanctuary offering private seaside villas, organic spa therapies, and culinary experiences.',
    operatingHours: '24/7 Front Desk & Concierge • Spa: 8:00 AM - 9:00 PM Daily',
    phone: '+1 (800) 555-AURA',
    email: 'concierge@auraluxeresort.com',
    address: '1000 Ocean Vista Drive, Carmel-by-the-Sea, CA',
    avatar: '🏖️',
    themeColor: 'emerald',
    accentBg: 'from-emerald-600 to-teal-700',
    services: [
      { id: 'spa-massage', name: 'Aura Signature Deep Tissue Massage (60 min)', durationMinutes: 60, price: '$180', description: 'Therapeutic full-body release utilizing warm basalt stones and botanical oils.', category: 'Spa' },
      { id: 'spa-facial', name: 'Hydra-Glow Marine Botanical Facial (45 min)', durationMinutes: 45, price: '$145', description: 'Deep exfoliation, marine collagen infusion, and lymphatic drainage.', category: 'Spa' },
      { id: 'suite-deluxe', name: 'Seaside Pavilion Suite Reservation', durationMinutes: 1440, price: '$450/night', description: 'Panoramic ocean balcony, king canopy bed, and private outdoor soaking tub.', category: 'Lodging' },
      { id: 'cabana-day', name: 'Infinity Pool Private Cabana (Full Day)', durationMinutes: 480, price: '$220', description: 'Dedicated butler, chilled fruit platter, artisanal beverages, and sun loungers.', category: 'Experience' }
    ],
    faqs: [
      {
        question: 'What are the check-in and check-out times?',
        answer: 'Check-in begins at 3:00 PM and check-out is by 11:00 AM. Early arrivals and late check-outs can be accommodated upon request based on availability.',
        category: 'Hours & Location'
      },
      {
        question: 'What is your cancellation policy for spa treatments?',
        answer: 'Spa cancellations or reschedules require at least 24 hours advance notice without fee. Cancellations within 24 hours incur a 50% charge.',
        category: 'Pricing & Policy'
      },
      {
        question: 'Are pets allowed at the resort?',
        answer: 'Yes! We are proud to be pet-friendly. Up to two canine companions under 50 lbs are welcome in designated villas with our VIP Pet Amenity kit ($75 one-time fee).',
        category: 'Services'
      },
      {
        question: 'Is valet parking and airport transfer available?',
        answer: 'Complimentary valet parking is included for all overnight guests. Private luxury chauffeured airport transfers from SFO/SJC can be booked via concierge.',
        category: 'Support'
      }
    ],
    policies: [
      { title: 'Quiet Hours', description: '10:00 PM – 7:00 AM to preserve serene natural acoustic comfort.' },
      { title: 'Spa Health Form', description: 'Brief digital wellness questionnaire required 15 minutes before your treatment.' }
    ],
    quickPrompts: [
      'Book a 60-min Signature Massage',
      'What are your check-in & check-out times?',
      'Can I bring my dog with me?',
      'I want to leave feedback about my stay'
    ]
  },
  {
    id: 'novacloud-saas',
    name: 'NovaCloud Platform',
    category: 'Enterprise Cloud & AI',
    badge: 'B2B SaaS',
    tagline: 'Ultra-fast Serverless Cloud Compute & AI Inference Engine',
    description: 'High-availability global infrastructure powering next-gen web applications, vector databases, and real-time inference.',
    operatingHours: '24/7/365 Global Operations Center • Enterprise Support SLA: < 15 mins',
    phone: '+1 (888) 420-NOVA',
    email: 'support@novacloud.io',
    address: '450 Mission Street, Suite 1200, San Francisco, CA',
    avatar: '⚡',
    themeColor: 'indigo',
    accentBg: 'from-indigo-600 to-blue-700',
    services: [
      { id: 'demo-enterprise', name: 'Enterprise Architecture & Migration Consult (45 min)', durationMinutes: 45, price: 'Free', description: '1-on-1 strategy session with our Principal Cloud Solutions Architect.', category: 'Consultation' },
      { id: 'poc-review', name: 'AI Model Deployment Proof-of-Concept Call (30 min)', durationMinutes: 30, price: 'Free', description: 'Review compute needs, throughput benchmarks, and latency targets.', category: 'Technical' },
      { id: 'dedicated-support', name: 'Dedicated Technical Account Manager Setup', durationMinutes: 60, price: '$499/mo', description: 'Direct Slack connect, priority escalations, and monthly architecture audits.', category: 'Support' }
    ],
    faqs: [
      {
        question: 'What is your uptime guarantee and SLA?',
        answer: 'We provide a financially backed 99.99% uptime SLA across all Enterprise clusters, with multi-region automatic failover.',
        category: 'Pricing & Policy'
      },
      {
        question: 'How does NovaCloud billing work?',
        answer: 'You only pay for compute seconds consumed with per-millisecond billing. There are zero egress fees between our internal availability zones.',
        category: 'Pricing & Policy'
      },
      {
        question: 'Are you SOC 2 Type II and HIPAA compliant?',
        answer: 'Yes! NovaCloud is fully SOC 2 Type II, ISO 27001, GDPR, and HIPAA compliant with signed BAAs available for Enterprise contracts.',
        category: 'Support'
      },
      {
        question: 'Can I integrate with GitHub Actions and Terraform?',
        answer: 'Absolutely. We provide official Terraform providers, GitHub Actions CI/CD pipelines, and an open-source CLI for automated previews.',
        category: 'Services'
      }
    ],
    policies: [
      { title: 'Data Sovereignty', description: 'Customer workloads never leave the selected geographic deployment zones.' },
      { title: 'Zero Data Retention for AI', description: 'API requests are never used to train foundational AI models.' }
    ],
    quickPrompts: [
      'Schedule an Enterprise Architecture Demo',
      'What are your pricing & uptime SLAs?',
      'How does HIPAA compliance work?',
      'Submit feedback on API documentation'
    ]
  },
  {
    id: 'apex-dental',
    name: 'Apex Dental & Aesthetics',
    category: 'Healthcare & Dentistry',
    badge: 'Medical & Dental',
    tagline: 'Gentle, Advanced Aesthetic & Preventive Dental Care',
    description: 'Modern dental studio equipped with 3D digital imaging, pain-free laser treatments, and cosmetic smile designs.',
    operatingHours: 'Mon - Fri: 7:30 AM - 6:00 PM • Sat: 8:00 AM - 3:00 PM • 24/7 Emergency Line',
    phone: '+1 (555) 321-SMILE',
    email: 'care@apexdentalstudio.com',
    address: '742 Evergreen Terrace, Suite 300, Chicago, IL',
    avatar: '🦷',
    themeColor: 'sky',
    accentBg: 'from-sky-600 to-cyan-700',
    services: [
      { id: 'routine-clean', name: 'Comprehensive Exam & Dental Cleaning (50 min)', durationMinutes: 50, price: '$120', description: 'Gentle ultrasonic cleaning, digital low-radiation X-rays, and oral cancer screening.', category: 'Preventive' },
      { id: 'teeth-whitening', name: 'Philips Zoom! In-Office Teeth Whitening (60 min)', durationMinutes: 60, price: '$350', description: 'Up to 8 shades brighter in a single comfortable session with enamel protection.', category: 'Cosmetic' },
      { id: 'invisalign-consult', name: 'Invisalign Clear Aligners 3D Scan & Consult (30 min)', durationMinutes: 30, price: 'Free', description: 'Interactive iTero 3D simulation of your new smile and custom treatment plan.', category: 'Orthodontics' },
      { id: 'emergency-eval', name: 'Emergency Tooth Pain & Fracture Triage (40 min)', durationMinutes: 40, price: '$95', description: 'Same-day urgent relief, diagnostic scan, and palliative care.', category: 'Emergency' }
    ],
    faqs: [
      {
        question: 'Do you accept major dental insurance plans?',
        answer: 'We accept Delta Dental, MetLife, Cigna, Aetna, Guardian, and Blue Cross Blue Shield. Our billing coordinators handle all claim submissions for you.',
        category: 'Pricing & Policy'
      },
      {
        question: 'What options do you have for patients with dental anxiety?',
        answer: 'We provide nitrous oxide (laughing gas), noise-canceling headphones with streaming entertainment, warm scented towels, and gentle numbing techniques.',
        category: 'Services'
      },
      {
        question: 'How quickly can I be seen for a dental emergency?',
        answer: 'We reserve emergency time slots daily. For acute pain, swelling, or knocked-out teeth, we guarantee same-day evaluation if you contact us.',
        category: 'Hours & Location'
      }
    ],
    policies: [
      { title: 'Cancellation Policy', description: 'Please provide at least 48 hours notice for cancellations to allow other patients in need to be scheduled.' }
    ],
    quickPrompts: [
      'Book a Dental Cleaning & Exam',
      'Do you accept Delta Dental insurance?',
      'How much does Zoom! Teeth Whitening cost?',
      'Share feedback about my recent visit'
    ]
  },
  {
    id: 'ambroisie-dining',
    name: "L'Ambroisie Gourmet Bistro",
    category: 'Fine Dining & Culinary',
    badge: 'Michelin Starred',
    tagline: 'Contemporary French Culinary Artistry & Rare Vintage Cellar',
    description: 'An intimate dining room celebrating seasonal organic ingredients, heritage French techniques, and bespoke wine pairings.',
    operatingHours: 'Dinner: Tue - Sun 5:00 PM - 11:00 PM • Closed Mondays',
    phone: '+1 (212) 555-8392',
    email: 'reservations@lambroisiebistro.com',
    address: '88 Mercer Street, SoHo, New York, NY',
    avatar: '🍷',
    themeColor: 'amber',
    accentBg: 'from-amber-600 to-rose-700',
    services: [
      { id: 'tasting-menu', name: "Chef's 7-Course Seasonal Tasting Menu", durationMinutes: 120, price: '$195/person', description: 'Exquisite multi-course journey curated by Chef Jean-Luc, featuring seasonal truffles and wagyu.', category: 'Tasting' },
      { id: 'chefs-table', name: "Exclusive Chef's Kitchen Table (Private 4-6 Guests)", durationMinutes: 150, price: '$260/person', description: 'Front-row seat overlooking the pass with custom off-menu dishes and master sommelier pairings.', category: 'VIP' },
      { id: 'standard-table', name: 'Main Dining Room Table Reservation', durationMinutes: 90, price: '$50 deposit', description: 'Romantic candle-lit table with full à la carte menu access.', category: 'Dining' }
    ],
    faqs: [
      {
        question: 'Is there a dress code?',
        answer: 'Our dress code is smart casual to elegant. We kindly ask guests to refrain from athletic wear, beachwear, and baseball caps in the dining room.',
        category: 'Services'
      },
      {
        question: 'Can dietary restrictions and allergies be accommodated?',
        answer: 'Yes! We gladly accommodate vegetarian, pescatarian, gluten-free, and nut allergies with advance notice when placing your reservation.',
        category: 'Services'
      },
      {
        question: 'What is your reservation deposit policy?',
        answer: 'A $50/guest deposit is held upon booking, fully credited towards your final bill. Cancellations made at least 24 hours prior are 100% refunded.',
        category: 'Pricing & Policy'
      }
    ],
    policies: [
      { title: 'Grace Period', description: 'Tables are held for 15 minutes past reservation time before being released to waitlist guests.' }
    ],
    quickPrompts: [
      'Reserve a table for 2 this Friday at 7:30 PM',
      'What is your dress code policy?',
      'Do you have vegetarian or gluten-free options?',
      'Leave feedback about our dining experience'
    ]
  }
];

export const TEST_SCENARIOS: TestScenario[] = [
  {
    id: 'sc-1',
    title: '🏨 Resort Inquiry: Pets & Check-In',
    description: 'Ask about check-in times and whether pets can stay.',
    category: 'inquiry',
    targetBusinessId: 'resort-spa',
    userMessage: 'Hi! What time is check-in, and can I bring my golden retriever with me?'
  },
  {
    id: 'sc-2',
    title: '📅 Book a Spa Massage',
    description: 'Conversational booking request for a massage tomorrow.',
    category: 'booking',
    targetBusinessId: 'resort-spa',
    userMessage: 'I would like to book a 60-minute Deep Tissue Massage for tomorrow afternoon around 3:00 PM for 1 person. My name is Sarah Jenkins.'
  },
  {
    id: 'sc-3',
    title: '⭐ Positive Service Feedback',
    description: 'Customer praising the speed and warmth of response.',
    category: 'feedback',
    targetBusinessId: 'resort-spa',
    userMessage: 'I want to submit feedback: The concierge chatbot was unbelievably fast and helped me organize everything in seconds! 5 stars!'
  },
  {
    id: 'sc-4',
    title: '⚠️ Critical Feedback / Escalation',
    description: 'Frustrated customer experiencing an issue to test empathetic resolution.',
    category: 'feedback',
    targetBusinessId: 'novacloud-saas',
    userMessage: 'I was waiting for my Enterprise demo invitation email and never received the calendar invite. I need this escalated to a human supervisor immediately.'
  },
  {
    id: 'sc-5',
    title: '🍽️ Table Reservation for 4',
    description: 'Reserve a table with special dietary requests at the restaurant.',
    category: 'booking',
    targetBusinessId: 'ambroisie-dining',
    userMessage: "Good evening, I'd like to reserve a table for 4 guests this Saturday at 8:00 PM for the Chef's Tasting Menu. Two of us are pescatarian."
  }
];
