import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import events from '../assets/data/events.json';
import './EventDetail.css';

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="event-detail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function EventDetail() {
  const { id } = useParams();
  const ev = events.find((e) => e.id === id);

  if (!ev) {
    return (
      <div>
        <Navbar />
        <main className="event-not-found">
          <h1>Event not found</h1>
          <p>The event you're looking for doesn't exist. It may have been renamed or removed.</p>
          <Link to="/events">Back to Events</Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="event-detail-container">
        <p className="event-detail-meta">{ev.category} • {ev.mode?.toUpperCase?.() || ev.mode}</p>
        <h1 className="event-detail-title">{ev.title}</h1>
        <p className="event-detail-info">{ev.date}{ev.venue ? ` • ${ev.venue}` : ''}</p>

        <Section title="About">
          <p>{ev.description}</p>
        </Section>

        {ev.registrationLink && (
          <div className="event-detail-registration">
            <button 
              onClick={() => {
                localStorage.setItem('pendingEventRegistration', ev.id);
                window.location.href = '/login';
              }}
              className="event-registration-button"
            >
              Login to Register →
            </button>
          </div>
        )}

        {(ev.rules?.important?.length || ev.rules?.others?.length) && (
          <Section title="Rules & Guidelines">
            {ev.rules?.important?.length ? (
              <div>
                <h3>Important</h3>
                <ul>
                  {ev.rules.important.map((r, i) => <li key={`imp-${i}`}>{r}</li>)}
                </ul>
              </div>
            ) : null}
            {ev.rules?.others?.length ? (
              <div>
                <h3>Others</h3>
                <ul>
                  {ev.rules.others.map((r, i) => <li key={`oth-${i}`}>{r}</li>)}
                </ul>
              </div>
            ) : null}
          </Section>
        )}

        {ev.format?.length ? (
          <Section title="Competition Format">
            <ul>
              {ev.format.map((f, i) => <li key={`fmt-${i}`}>{f}</li>)}
            </ul>
          </Section>
        ) : null}

        {ev.rounds?.length ? (
          <Section title="Rounds">
            <ul>
              {ev.rounds.map((r, i) => (
                <li key={`rnd-${i}`}>
                  <strong>{r.name}</strong>{r.mode ? ` • ${r.mode}` : ''}{r.duration ? ` • ${r.duration}` : ''}{r.weight ? ` • ${r.weight}%` : ''}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {ev.timeline?.length ? (
          <Section title="Timeline">
            <div className="event-detail-table-wrapper">
              <table className="event-detail-table">
                <thead>
                  <tr>
                    <th>Phase</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ev.timeline.map((t, i) => (
                    <tr key={`tl-${i}`}>
                      <td>{t.title}</td>
                      <td>{t.dateText || t.date || ''}{t.endDate ? ` – ${t.endDate}` : ''}</td>
                      <td>{t.time || ''}</td>
                      <td>{t.description || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ) : null}

        {(ev.deliverables?.length) ? (
          <Section title="Deliverables">
            <ul>
              {ev.deliverables.map((d, i) => <li key={`del-${i}`}>{d}</li>)}
            </ul>
          </Section>
        ) : null}

        {ev.prizes ? (
          <Section title="Prizes">
            {typeof ev.prizes.prizePool !== 'undefined' ? (
              <p>Prize Pool: ₹{ev.prizes.prizePool.toLocaleString?.() || ev.prizes.prizePool}</p>
            ) : null}
            {ev.prizes.breakdown?.length ? (
              <ul>
                {ev.prizes.breakdown.map((p, i) => (
                  <li key={`pr-${i}`}>{p.place}: {p.amount ? `₹${p.amount.toLocaleString?.() || p.amount}` : ''}</li>
                ))}
              </ul>
            ) : null}
            {ev.prizes.inKind?.length ? (
              <p><strong>In-kind:</strong> {ev.prizes.inKind.join(', ')}</p>
            ) : null}
            {ev.prizes.notes?.length ? (
              <ul>
                {ev.prizes.notes.map((n, i) => <li key={`pn-${i}`}>{n}</li>)}
              </ul>
            ) : null}
          </Section>
        ) : null}

        {ev.organizers?.length ? (
          <Section title="Organizers">
            <ul>
              {ev.organizers.map((o, i) => (
                <li key={`org-${i}`}>
                  {o.role ? `${o.role} – ` : ''}{o.name}
                  {o.email ? ` | ${o.email}` : ''}
                  {o.discord ? ` | ${o.discord}` : ''}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {ev.registrationForm ? (
          <Section title="Registration Form">
            {ev.registrationForm.required?.length ? (
              <p><strong>Compulsory:</strong> {ev.registrationForm.required.join(', ')}</p>
            ) : null}
            {ev.registrationForm.optional?.length ? (
              <p><strong>Optional:</strong> {ev.registrationForm.optional.join(', ')}</p>
            ) : null}
            {ev.registrationForm.additional?.length ? (
              <ul>
                {ev.registrationForm.additional.map((a, i) => <li key={`add-${i}`}>{a}</li>)}
              </ul>
            ) : null}
          </Section>
        ) : null}

        {ev.comments?.length ? (
          <Section title="Notes">
            <ul>
              {ev.comments.map((c, i) => <li key={`cm-${i}`}>{c}</li>)}
            </ul>
          </Section>
        ) : null}

        <div>
          <Link to="/events" className="event-detail-back">← Back to Events</Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default EventDetail;