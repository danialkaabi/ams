import { FormEvent, useState } from 'react';
import Layout from '@/components/Layout';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <Layout
      title="Contact"
      description="Get in touch with Al Annabi Marine Services (AMS) in Doha, Qatar."
    >
      <section className="section maroon" style={{ paddingTop: 'calc(var(--header-h) + 90px)' }}>
        <div className="wrap">
          <div className="contact-grid">
            <div data-reveal="0">
              <span className="mono" style={{ color: 'var(--sand-light)' }}>Get In Touch</span>
              <h2 style={{ marginTop: 14, color: 'var(--white)' }}>Let&rsquo;s talk about your next project</h2>
              <p style={{ marginTop: 18, color: 'rgba(255,255,255,0.78)' }}>
                Explore our comprehensive services and discover how AMS&rsquo;s commitment to
                excellence can elevate your operations.
              </p>
              <div className="contact-details">
                <div>
                  <span className="k">Office</span>
                  <span className="v">Suite 3405, 34th Floor, Palm Tower B, West Bay, Doha, Qatar — PO Box 5967</span>
                </div>
                <div>
                  <span className="k">Phone</span>
                  <span className="v">
                    <a href="tel:+97440392773" style={{ textDecoration: 'none' }}>+974 4039 2773</a>
                  </span>
                </div>
                <div>
                  <span className="k">Email</span>
                  <span className="v">
                    <a href="mailto:info@alannabimarine.com" style={{ textDecoration: 'none' }}>
                      info@alannabimarine.com
                    </a>
                  </span>
                </div>
                <div>
                  <span className="k">Registration</span>
                  <span className="v">CR No. 211513 · State of Qatar</span>
                </div>
              </div>
            </div>

            <div className="form-card" data-reveal="1">
              <h3>Send us a message</h3>
              {sent ? (
                <p style={{ color: 'var(--ink-soft)' }}>
                  Thank you — your message has been noted. Our team will be in touch shortly.
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="fname">Name</label>
                    <input id="fname" name="name" type="text" required />
                  </div>
                  <div className="field">
                    <label htmlFor="femail">Email</label>
                    <input id="femail" name="email" type="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="fmsg">Message</label>
                    <textarea id="fmsg" name="message" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
