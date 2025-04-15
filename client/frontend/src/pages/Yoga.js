import React from "react";
import { InlineWidget } from "react-calendly";

function YogaPage() {
  return (
    <div>
      <div>Yoga</div>
      <section>
        <h1>Private Sessions</h1>
      </section>
      <section>
        <h1>Group Events</h1>
      </section>
      <section>
        <h1>Corporate Classes</h1>
      </section>
      <section>
        <h1>Pricing</h1>
      </section>
      <div>
        <InlineWidget url="https://calendly.com/jcianci1/30min" />
      </div>
    </div>
  );
}

export default YogaPage;
