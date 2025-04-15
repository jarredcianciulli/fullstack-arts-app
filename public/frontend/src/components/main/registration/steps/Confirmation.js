import classes from "../FormStore.module.css";
const Confirmation = ({
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  validateStep,
  validationErrors,
}) => {
  return (
    <>
      <div>Confirmation</div>
      <div className={classes.nav}>
        <button onClick={prevStep} className={classes.btn_nav}>
          Previous
        </button>
      </div>
    </>
  );
};
export default Confirmation;
