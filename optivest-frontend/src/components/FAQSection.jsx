import React, { useState } from 'react';
import './FAQSection.css';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: 'O que é a Optivest?',
    answer: 'Uma plataforma para simular investimentos em tempo real com dados do mercado português.',
  },
  {
    question: 'Preciso pagar para usar?',
    answer: 'Não. A plataforma é gratuita durante o período beta e focada em educação financeira.',
  },
  {
    question: 'Como começo a usar o simulador?',
    answer: 'Basta fazer o registro gratuitamente e aceder à área de simulação após fazer login.',
  },
  {
    question: 'Que tecnologias são utilizadas na Optivest?',
    answer: 'É utilizado React para o frontend, Django para o backend e integração com a API Yahoo Finance para dados financeiros em tempo real.',
  },
  {
    question: 'De onde vêm os dados das ações?',
    answer: 'Os dados são obtidos através de uma API externa em tempo real que fornece informações do mercado português.',
  },
];

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? 'open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{question}</span>
        <FaChevronDown className={`chevron-icon ${open ? 'rotate' : ''}`} />
      </div>
      {open && (
        <div className="faq-answer-wrapper">
          <hr className="faq-divider" />
          <div className="faq-answer">{answer}</div>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => (
  <section className="faq-section">
    <div className="faq-wrapper">
      <h3>FAQ</h3>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <FAQItem key={index} {...faq} />
        ))}
      </div>
    </div>
  </section>
);

export default FAQSection;


