import { useState, createContext } from "react";
import classes from "./Pricing.module.css";

function PricingPage() {
  <div className={classes.card_container}>
    <div className={classes.card}>
      <div className={classes.card__header}>
        <div className={classes.card__picture}>
          <div className={classes.card__picture_overlay}>&nbsp;</div>
          <img className={classes.card__picture_img}></img>
        </div>
        <div
          className={`${classes.heading_tertirary} ${classes.card__header_name}`}
        >
          <span>Private Violin Lessons</span>
        </div>
      </div>
      <div className={classes.card__specifications}>
        <div className={classes.card__details}>
          <div className={classes.card__sub_heading}></div>
          <div className={classes.card__description}></div>
          <div className={classes.card__text}></div>
        </div>
        <div className={classes.card__specifications}>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use className={classes.card__icon}></use>
              <span></span>
            </svg>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use className={classes.card__icon}></use>
              <span></span>
            </svg>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use className={classes.card__icon}></use>
              <span></span>
            </svg>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use className={classes.card__icon}></use>
              <span></span>
            </svg>
          </div>
        </div>
        <div className={classes.card__footer}>
          <div>
            <span className={classes.card__footer_value}></span>
            <span className={classes.card__footer_text}></span>
          </div>
          <div className={classes.card__ratings}>
            <span className={classes.card__footer_value}></span>
            <span className={classes.card__footer_text}></span>
          </div>
          <a className={`${classes.btn} ${classes.btn__blue}`}>Details</a>
        </div>
      </div>
    </div>
  </div>;
}
export default PricingPage;
