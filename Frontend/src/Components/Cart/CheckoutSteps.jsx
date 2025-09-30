import React, { Fragment } from "react";
import {
  Typography,
  Stepper,
  StepLabel,
  Step,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./CheckoutSteps.css";

const CheckoutSteps = ({ activeStep }) => {
  const steps = [
    {
      label: <Typography variant="body1">Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography variant="body1">Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: <Typography variant="body1">Payment</Typography>,
      icon: <AccountBalanceIcon />,
    },
  ];

  return (
    <Fragment>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        sx={{
          boxSizing: "border-box",
        }}
      >
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index}
            completed={activeStep >= index}
          >
            <StepLabel
              icon={item.icon}
              sx={{
                "& .MuiStepLabel-label": {
                  color: activeStep >= index ? "tomato" : "rgba(0,0,0,0.65)",
                  fontWeight: activeStep === index ? 600 : 400,
                
                },
              }}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Fragment>
  );
};

export default CheckoutSteps;
