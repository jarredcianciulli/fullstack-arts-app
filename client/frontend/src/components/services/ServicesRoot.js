// import classes from "./Services.module.css";

// function ServicesPage() {
//   return (

//     <div className={classes.servicesBody}>
//       <section>
//         <h1 className={classes.servicesHeader}>The OV Way</h1>
//         <ul className={classes.servicesUL}>
//           <div className={classes.servicesULHeader}>
//             Daily recommendations and monitoring so you can stay on track!
//           </div>
//           <li>
//             <span>In-depth, daily meal plan recommendations and feedback</span>
//           </li>
//           <li>
//             <span>Daily habit and goal recommendations and feedback</span>
//           </li>
//           <li>
//             <span>Sleep optimization suggestions and monitoring</span>
//           </li>
//           <li>
//             <span>Stress reduction strategies</span>
//           </li>
//           <li>
//             <span>Daily exercise and resistance training programs</span>
//           </li>
//         </ul>
//         <ul className={classes.servicesUL}>
//           <div className={classes.servicesULHeader}>Free consultation</div>
//           <li>
//             <span>
//               Learn about client needs and discuss possible strategies
//             </span>
//           </li>
//         </ul>
//         <ul className={classes.servicesUL}>
//           <div className={classes.servicesULHeader}>
//             4, 6, and 12 months options
//           </div>
//           <li>
//             <span>Flexible to meet client goals</span>
//           </li>
//         </ul>
//         <ul className={classes.servicesUL}>
//           <div className={classes.servicesULHeader}>
//             Weekly check-in meetings to collaborate, improve, and optimize
//           </div>
//           <li>
//             <span>
//               Supportive strategy to find what works best for each individual
//             </span>
//           </li>
//         </ul>
//       </section>
//     </div>
//   );
// }

// export default ServicesPage;

import { useState, useEffect, useRef } from "react";
import classes from "./Services.module.css";
import { PopupButton } from "react-calendly";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import ServicesStore from "./ServicesStore";
// import Calendar from "../calendar/Calendar";

//JSON
import ServicesJSON from "../data/services.json";

function ServicesRoot(props) {
  //   useEffect(() => {
  const homeCardOptions = ServicesJSON.services.map((e, ind) => {
    // console.log(e);
    if (props.id == e.section) {
      console.log(props.id);
      return (
        <AnimatePresence>
          <ServicesStore key={e.id} id={e.id} e={e} prop={props} ind={ind} />
        </AnimatePresence>
      );
    }
  });
  console.log(homeCardOptions);

  return (
    <div className={classes.subscriptionsMainContainer}>
      <div className={classes.subscriptionsHeaderContainer}>
        <div className={classes.subscriptionsPricingCardsContainer}>
          {homeCardOptions}
        </div>
      </div>
    </div>
  );
}

export default ServicesRoot;
