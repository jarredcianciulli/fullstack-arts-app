import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import classes from "./Main.module.css";
import Sections from "../main/sections/Sections";
import MultiStepForm from "../main/form/MultiStepForm";
import servicesData from "../data/services.json";

const MainPage = ({ showForm }) => {
  const { serviceSlug } = useParams();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (serviceSlug) {
      const service = servicesData.services.find(s => s.slug === serviceSlug);
      if (service) {
        setSelectedService(service);
      } else {
        navigate('/services');
      }
    } else {
      setSelectedService(null);
    }
  }, [serviceSlug, navigate]);

  const handleServiceClick = (service) => {
    navigate(`/services/${service.slug}/register`);
  };

  const handleCloseForm = () => {
    navigate('/services');
  };

  return (
    <>
      <Sections onServiceClick={handleServiceClick} />
      {selectedService && location.pathname.includes('/register') && (
        <MultiStepForm
          service={selectedService}
          isFormOpen={true}
          setIsFormOpen={handleCloseForm}
        />
      )}
    </>
  );
}

export default MainPage;
