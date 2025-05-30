import { useState, useEffect, useRef } from "react";
import classes from "./Services.module.css";
import { PopupButton } from "react-calendly";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

import CalendarIcon from "../../../pages/assets/subscriptions/icons/subscription_calendar_icon.svg";
import PolicyIcon from "../../../pages/assets/subscriptions/icons/subscription_policy_icon.svg";
import ScheduleIcon from "../../../pages/assets/subscriptions/icons/subscription_schedule_icon.svg";
import TimeIcon from "../../../pages/assets/subscriptions/icons/subscription_time_icon.svg";
import TimelineIcon from "../../../pages/assets/subscriptions/icons/subscription_timeline_icon.svg";
import GroupIcon from "../../../pages/assets/subscriptions/icons/subscription_group_icon.svg";
import AgeGroupIcon from "../../../pages/assets/subscriptions/icons/subscription_age_group_icon.svg";
import DownloadPDF from "../../../pages/assets/download_pdf.svg";
import PopupIcon from "../../../pages/assets/popup_icon.svg";
import ServicesComponent from "./ServicesComponent";
import Calendar from "../calendar/Calendar";
import MultiStepForm from "../../form/MultiStepForm";

//JSON
import ServicesJSON from "../../../data/services.json";

function Services(props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenForm = (service) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const homeCardOptions = ServicesJSON.services.map((e, ind) => {
    if (props.id == e.section) {
      return (
        <AnimatePresence>
          <ServicesComponent
            key={e.id}
            id={e.id}
            e={e}
            prop={props}
            ind={ind}
            onServiceClick={handleOpenForm}
          />
        </AnimatePresence>
      );
    }
  });

  return (
    <div className={classes.subscriptionsMainContainer}>
      <div className={classes.subscriptionsHeaderContainer}>
        <div className={classes.subscriptionsPricingCardsContainer}>
          {homeCardOptions}
        </div>
      </div>
      {isFormOpen && selectedService && (
        <MultiStepForm
          service={selectedService}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default Services;
