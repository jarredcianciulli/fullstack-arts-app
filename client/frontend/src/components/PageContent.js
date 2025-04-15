import classes from "./PageContent.module.css";

function PageContent({ title, children }) {
  return (
    <div className={classes.contentBody}>
      <section>
        <h1 className={classes.contentHeader}>Contact</h1>
        <p>OptimaVitaLLC@gmail.com</p>
      </section>
    </div>
  );
}

export default PageContent;
