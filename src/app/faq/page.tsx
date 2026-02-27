"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How do I order beer?",
    answer:
      "We sell our beer through scheduled sale windows. Check the Beer Sales page for upcoming dates. During a sale window, you can place one order per person. We'll notify registered users when a new sale is coming up.",
  },
  {
    question: "Why do you sell on a calendar basis?",
    answer:
      "As a nano brewery, we produce in very small quantities. Calendar-based sales ensure fair access for everyone and allow us to focus on brewing rather than managing continuous stock. It's inspired by the Trappist monastery tradition.",
  },
  {
    question: "Can I visit the brewery?",
    answer:
      "Yes! We welcome visitors by appointment. Please contact us through our Contact page to arrange a visit. We offer small group tastings and tours of our brewing process.",
  },
  {
    question: "Do you deliver?",
    answer:
      "We offer delivery within Ireland for an additional fee. Orders can also be collected from the brewery during designated pickup times, which will be communicated when you place your order.",
  },
  {
    question: "How much beer can I order?",
    answer:
      "To ensure fair access, each person may place one order per sale window. You can choose from single bottles, 4-packs, full crates (24 bottles), or mixed crates. See the Beer Sales page for current pricing.",
  },
  {
    question: "What does 'Ceardaí' mean?",
    answer:
      "Ceardaí is the Irish (Gaelic) word for a workshop or forge — a place of craftsmanship. It reflects our belief that brewing is an artisan's craft, shaped by skill, patience, and intention.",
  },
  {
    question: "Why are all your beers called 'Canvas'?",
    answer:
      "Each beer is a canvas for a different expression of flavour and style. Bourbon Canvas explores barrel-aged richness, Moonlight Canvas captures Belgian lightness, and Crimson Canvas is our tribute to Irish red ale tradition. The name reminds us that every recipe is a creative act.",
  },
  {
    question: "Are your beers available in shops or pubs?",
    answer:
      "No. We sell exclusively through our own scheduled sale windows. This allows us to maintain a direct relationship with everyone who drinks our beer and ensures the freshest possible product.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-charcoal/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-5 flex justify-between items-center gap-4 hover:text-amber transition-colors"
      >
        <span className="font-serif text-lg">{question}</span>
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 text-charcoal/70 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-px bg-amber mx-auto mb-6"></div>
          <p className="text-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about ordering, visiting, and our beers.
          </p>
        </div>

        {/* FAQ list */}
        <div className="bg-white rounded-lg px-6">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
