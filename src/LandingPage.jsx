import { ArrowRight, Boxes, Calculator, ClipboardList, FileText, Layers3 } from 'lucide-react';
import './landing.css';

const facebookUrl = 'https://web.facebook.com/profile.php?id=61593596356038';

export default function LandingPage({ onTryDemo, onSignIn, loading = false, demoOnly = false }) {
  return <main className="landing-page">
    <header className="landing-header">
      <a className="landing-brand" href="#top" aria-label="iQuote home"><span>◈</span> iQuote</a>
      <nav aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href={facebookUrl} target="_blank" rel="noreferrer">Request an account</a>
        {demoOnly
          ? <a className="landing-sign-in" href={facebookUrl} target="_blank" rel="noreferrer">Request access</a>
          : <button className="landing-sign-in" onClick={onSignIn}>Sign in</button>}
      </nav>
    </header>

    <section className="landing-hero" id="top">
      <div className="landing-hero-copy">
        <p className="landing-kicker"><span/> CABINET QUOTATION WORKSPACE</p>
        <h1>Quote with clarity.<br/><em>Build with confidence.</em></h1>
        <p className="landing-intro">Plan cabinet projects, explore material costs, and organize production details in one practical workspace.</p>
        <div className="landing-actions">
          <button className="landing-primary" onClick={onTryDemo} disabled={loading}>
            {loading ? 'Loading demo…' : 'Try the live demo'} <ArrowRight size={17}/>
          </button>
          <a className="landing-secondary" href={facebookUrl} target="_blank" rel="noreferrer">Request an account</a>
        </div>
        <p className="landing-note">{demoOnly ? 'Demo-only site: account login, quotation generation, and saving are unavailable here.' : 'Explore the calculator without an account. An account is required to generate and save quotations.'}</p>
      </div>

      <div className="landing-preview" aria-label="Illustration of the iQuote quotation workspace">
        <div className="preview-window">
          <div className="preview-top"><span><i/><i/><i/></span><b>PROJECT OVERVIEW</b><small>DEMO</small></div>
          <div className="preview-content">
            <div className="preview-title"><span>Sample kitchen</span><small>PROJECT ESTIMATE</small></div>
            <div className="preview-total">₱ 48,650 <span>sample estimate</span></div>
            <div className="preview-rule"><i/></div>
            <div className="preview-modules">
              <div><span className="preview-cabinet base-cabinet"><i/><i/></span><p>Base cabinet<small>600 × 720 × 560 mm</small></p><b>01</b></div>
              <div><span className="preview-cabinet wall-cabinet"><i/><i/></span><p>Wall cabinet<small>600 × 720 × 350 mm</small></p><b>02</b></div>
              <div><span className="preview-cabinet tall-cabinet"><i/><i/></span><p>Tall cabinet<small>600 × 2100 × 560 mm</small></p><b>03</b></div>
            </div>
            <div className="preview-footer"><span><Layers3 size={14}/> MODULES</span><strong>Adjust dimensions in the demo</strong></div>
          </div>
        </div>
        <div className="preview-sticker"><Calculator size={17}/><span>Live cost<br/>calculator</span></div>
      </div>
    </section>

    <section className="landing-features" id="features">
      <div className="landing-section-heading">
        <p className="landing-kicker">MADE FOR CABINET PROJECTS</p>
        <h2>From dimensions to a clearer plan.</h2>
      </div>
      <div className="landing-feature-grid">
        <article><span className="feature-icon"><Calculator size={19}/></span><h3>Explore project costs</h3><p>Adjust dimensions and pricing inputs to see how the estimate changes.</p></article>
        <article><span className="feature-icon"><Boxes size={19}/></span><h3>Organize materials</h3><p>Keep modules, board materials, and hardware choices together.</p></article>
        <article><span className="feature-icon"><ClipboardList size={19}/></span><h3>Prepare production details</h3><p>Review generated components and cutting-list workflows in the workspace.</p></article>
        <article><span className="feature-icon"><FileText size={19}/></span><h3>Generate quotations with an account</h3><p>Request access to create, save, and export customer quotations.</p></article>
      </div>
    </section>

    <section className="landing-access">
      <div><p className="landing-kicker">READY TO GET STARTED?</p><h2>Try iQuote, then request your own account.</h2><p>The demo is for exploration only. Contact us on Facebook to request account access.</p></div>
      <div className="landing-actions"><button className="landing-primary" onClick={onTryDemo} disabled={loading}>Try the demo <ArrowRight size={17}/></button><a className="landing-secondary" href={facebookUrl} target="_blank" rel="noreferrer">Request access on Facebook</a></div>
    </section>
    <footer className="landing-footer"><a className="landing-brand" href="#top"><span>◈</span> iQuote</a><span>Cabinet quotation workspace</span><a href={facebookUrl} target="_blank" rel="noreferrer">Account requests ↗</a></footer>
  </main>;
}
