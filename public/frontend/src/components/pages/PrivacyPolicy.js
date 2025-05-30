import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information that you provide directly to us, such as when
            you create an account, book a service, or contact us. This may
            include:
          </Typography>
          <ul>
            <li>Contact information (name, email, phone number)</li>
            <li>
              Payment information (processed securely by our payment processor)
            </li>
            <li>Calendar and scheduling information</li>
            <li>Any other information you choose to provide</li>
          </ul>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use the information we collect to:
          </Typography>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
          </ul>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. Information Sharing
          </Typography>
          <Typography paragraph>
            We do not share your personal information with third parties except
            as described in this policy. We may share information with:
          </Typography>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>
              Law enforcement or other government officials, in response to a
              verified request
            </li>
            <li>Other parties in connection with a company transaction</li>
          </ul>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Your Choices
          </Typography>
          <Typography paragraph>
            You may update, correct, or delete your account information at any
            time by logging into your account. You can also contact us to
            request access to, correct, or delete any personal information.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Changes to This Policy
          </Typography>
          <Typography paragraph>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page
            and updating the "Last Updated" date.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </Typography>
          <address>
            Intono by Jarred Music Company
            <br />
            Email: jarred.cianciulli@gmail.com
            <br />
            Phone: (610) 340-8827
          </address>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;
