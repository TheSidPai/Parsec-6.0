import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is PARSEC 6.0?",
      answer:
        "PARSEC 6.0 is the annual techno-cultural festival of IIT Dharwad, featuring technical competitions, cultural events, workshops, and entertainment spanning multiple days.",
    },
    {
      question: "Who can participate?",
      answer:
        "PARSEC is open to all college students across India. Some events may have specific eligibility criteria mentioned in their individual guidelines.",
    },
    {
      question: "How do I register?",
      answer:
        "Visit the Events page, select your desired events, and complete the registration process. You'll need to create an account and pay the registration fees where applicable.",
    },
    {
      question: "Is accommodation provided?",
      answer:
        "Yes, accommodation is available for outstation participants on a first-come-first-serve basis. Registration for accommodation opens separately on the website. It will begin on 4-7th January 2026, till then please keep checking the website, we also will notify you about the same.",
    },
    {
      question: "What are the dates for PARSEC 6.0?",
      answer:
        "PARSEC 6.0 will be held from 23-27th January 2026 at IIT Dharwad Permanent Campus. Stay tuned to our website and social media for detailed schedule updates.",
    },
    {
      question: "How can I contact the organizing team?",
      answer: (
        <>
          You can reach us via email at outreach.parsec@iitdh.ac.in. Join our
          Discord community for more details:{" "}
          <a
            href="https://discord.gg/WcGQbUXf8A"
            target="_blank"
            rel="noopener noreferrer"
            className="link-hai"
          >
            Discord Server Link
          </a>
        </>
      ),
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "active" : ""}`}
          >
            <button className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-icon">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            <div className={`faq-answer ${openIndex === index ? "open" : ""}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
