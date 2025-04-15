import classes from "./Principles.module.css";
import Avatar1 from "./assets/exercise.svg";
import Avatar2 from "./assets/bed.svg";
import Avatar3 from "./assets/meditations.svg";
import Avatar4 from "./assets/healthy.svg";

function Principles({ title, children }) {
  return (
    <div className={classes.contentBody}>
      <div className={classes.pillarContainer}>
        <div className={classes.pillarLine}></div>
        <div className={classes.header}>Four Pillars to Success</div>
        <div className={classes.pillarLine}></div>
      </div>
      <section className={classes.iconSection}>
        <div className={classes.iconContainer}>
          <img className={classes.icon1} src={Avatar2} />
        </div>
        <p>
          <span className={classes.span1}>Sleep</span> is vital for physical
          recovery, mental clarity, and emotional balance, supporting overall
          health and daily performance.
        </p>
      </section>
      <section className={classes.iconSection}>
        <div className={classes.iconContainer}>
          <img className={classes.icon2} src={Avatar3} />
        </div>
        <p>
          <span className={classes.span1}>Managing stress</span> promotes
          relaxation, focus, and resilience for a healthier, happier life.
        </p>
      </section>
      <section className={classes.iconSection}>
        <div className={classes.iconContainer}>
          <img className={classes.icon3} src={Avatar1} />
        </div>
        <p>
          <span className={classes.span1}>Regular exercise</span> strengthens
          the body, uplifts mood, and enhances overall health and vitality.
        </p>
      </section>
      <section className={classes.iconSection}>
        <div className={classes.iconContainer}>
          <img className={classes.icon4} src={Avatar4} />
        </div>

        <p>
          <span className={classes.span1}>Balanced nutrition</span> fuels the
          body, boosts immunity, and supports long-term well-being.
        </p>
      </section>
    </div>
  );
}

export default Principles;
