import React from 'react';
import { Container, Typography, Box, Paper, Link } from '@mui/material';

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated: {new Date().toLocaleDateString()}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing or using the SoundWorks Music Company website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our services.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            2. Services Description
          </Typography>
          <Typography paragraph>
            SoundWorks Music Company provides music lessons, recording services, and related educational content. We reserve the right to modify or discontinue any service at any time without notice.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            3. User Accounts
          </Typography>
          <Typography paragraph>
            When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            4. Payments and Refunds
          </Typography>
          <Typography paragraph>
            All fees are non-refundable except as required by law. We may change our fees at any time by posting the changes on our website.
          </Typography>
          <Typography paragraph>
            Cancellation Policy: Lessons must be canceled at least 24 hours in advance to be eligible for rescheduling. No-shows will be charged the full lesson fee.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            5. Intellectual Property
          </Typography>
          <Typography paragraph>
            All content, including text, graphics, logos, and software, is the property of SoundWorks Music Company or its content suppliers and is protected by copyright and other intellectual property laws.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            6. Limitation of Liability
          </Typography>
          <Typography paragraph>
            To the maximum extent permitted by law, SoundWorks Music Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            7. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms shall be governed by the laws of the State of California, without regard to its conflict of law provisions.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            8. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right to modify these terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            9. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms, please contact us at:
          </Typography>
          <address>
            SoundWorks Music Company<br />
            Email: info@soundworksmusic.com<br />
            Phone: (555) 123-4567
          </address>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsOfService;
