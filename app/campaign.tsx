"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const decisions = [
  {
    id: "goal",
    stage: "Define the goal",
    question: "What does a good lead actually look like?",
    reasoning: (
      <>Before setting up the campaign, I’ll get clear on what the business actually wants from it, beyond just getting more form submissions.</>
    ),
    signals: (
      <>Who we want to attract, what we want them to do, and which leads the sales team would follow up.</>
    ),
    move: (
      <>Agree on <strong className="campaign-key">what counts as a good lead</strong>, then build the campaign to attract more people like that.</>
    ),
    watchLabel: "If things change…",
    reconsider: (
      <>If lead volume goes up but <strong>quality drops</strong>, I’ll check the targeting, message and offer before increasing spend</>
    ),
  },
  {
    id: "audience",
    stage: "Understand the audience",
    question: "Who are we trying to reach?",
    reasoning: (
      <>I’ll look at who we’re trying to reach, what problem they’re trying to solve, and whether different groups need different messages.</>
    ),
    signals: (
      <>Search terms, common customer questions, competitor offers, and the reasons people hesitate.</>
    ),
    move: (
      <>Group audiences or search intent into clear themes, then use <strong className="campaign-key">separate ad groups or audience targeting</strong> where it helps keep the message relevant.</>
    ),
    reconsider: (
      <>If leads are coming in from <strong>the wrong people</strong>, I’ll review the targeting, search terms and message before increasing spend</>
    ),
  },
  {
    id: "creative",
    stage: "Choose the creative",
    question: "What will make people stop and take action?",
    reasoning: (
      <>I’ll use what I’ve learned about the audience to shape the message, then decide how the visual, headline and offer should work together.</>
    ),
    signals: (
      <>The audience’s pain point, the hook, the offer, the proof we can show, and whether the ad matches the landing page.</>
    ),
    move: (
      <>Keep the offer the same, then <strong className="campaign-key">A/B test one creative angle, hook or format at a time</strong>. Compare lead quality as well as CTR.</>
    ),
    reconsider: (
      <>A high CTR doesn’t make a creative a winner if <strong>the leads are poor</strong>. I’ll check whether the message is attracting the wrong people</>
    ),
  },
  {
    id: "signals",
    stage: "Read the signals",
    question: "Where is the campaign losing performance?",
    reasoning: (
      <>If clicks are coming in but leads are low, or CPL is rising, I’ll check that the form and tracking work, then go through the funnel step by step.</>
    ),
    signals: (
      <ul className="campaign-metrics">
        <li><strong>Ad:</strong> CTR, CPC and search terms.</li>
        <li><strong>Page:</strong> GA4 engagement / bounce rate, landing-page conversion rate and form-completion rate.</li>
        <li><strong>Leads:</strong> CPL and qualified-lead rate.</li>
        <li><strong>Tracking:</strong> Whether GTM / GA4 events are firing correctly.</li>
      </ul>
    ),
    move: (
      <>Use the numbers to decide <strong className="campaign-key">where to check first</strong>. If CTR is low, I’ll start with the ad or targeting. If CTR looks fine but landing-page conversion is weak, I’ll check the page, offer and traffic quality.</>
    ),
    reconsider: (
      <>If people reach the page but <strong>don’t go any further</strong>, I’ll check page speed, message match, the mobile experience, CTA visibility and form friction before changing the campaign setup</>
    ),
  },
  {
    id: "test",
    stage: "Decide the next move",
    question: "What should I check next?",
    reasoning: (
      <>The cause isn’t always obvious. I’ll narrow it down step by step instead of changing several things at once.</>
    ),
    signals: (
      <>I’ll list the possible causes and rank them <strong>from most likely to least likely</strong>, using the campaign data and where the biggest drop-off appears.</>
    ),
    move: (
      <>Work through the likely causes one by one. <strong className="campaign-key">Change one thing at a time</strong>, then check the result once there’s enough data to judge it. Otherwise, I won’t know which change made the difference.</>
    ),
    reconsider: (
      <>If an area looks healthy, I’ll move to the next check rather than changing it anyway. I want to narrow down the problem <strong>before spending more budget</strong></>
    ),
  },
];

export default function CampaignThinking() {
  return (
    <section
      className="campaign-section section-pad"
      id="campaign-thinking"
      aria-labelledby="campaign-title"
    >
      <div className="section-index">03 / HOW I CREATE A CAMPAIGN</div>
      <div className="campaign-layout">
        <div className="campaign-copy">
          <h2 id="campaign-title" className="campaign-title">
            How I Think<br />
            Through a<br />
            <em>Campaign</em>
          </h2>
          <p className="campaign-intro">
            One campaign I handle from start to finish, showing what I’d ask,
            what I’d check, and why.
          </p>
          <div className="campaign-situation">
            <span>A QUESTION TO WORK THROUGH</span>
            <p>“Clicks are coming in.<br />Leads aren’t.”</p>
            <small>One example. Five decisions behind it.</small>
          </div>
        </div>
        <div className="campaign-notebook">
          <div className="campaign-notebook-header">
            <span>INSIDE MY THINKING</span>
          </div>
          <Accordion
            type="single"
            collapsible
            defaultValue="goal"
            className="campaign-decisions"
          >
            {decisions.map((decision, index) => (
              <AccordionItem
                value={decision.id}
                key={decision.id}
                className="campaign-decision"
              >
                <AccordionTrigger className="campaign-trigger">
                  <span className="campaign-number">0{index + 1}</span>
                  <span className="campaign-trigger-copy">
                    <small>{decision.stage}</small>
                    <strong>{decision.question}</strong>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="campaign-detail">
                  <p className="campaign-reasoning">{decision.reasoning}</p>
                  <dl className="campaign-notes">
                    <div><dt>I’ll look at</dt><dd>{decision.signals}</dd></div>
                    <div><dt>Next move</dt><dd>{decision.move}</dd></div>
                    <div className="campaign-reconsider">
                      <dt>{decision.watchLabel ?? "What I’ll watch for"}</dt><dd>{decision.reconsider}</dd>
                    </div>
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
